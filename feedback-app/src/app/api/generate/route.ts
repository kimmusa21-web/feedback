import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/lib/types';
import { buildSelfReviewPrompt, buildFeedbackPrompt, buildFitPrompt } from '@/lib/prompts';

function ok(result: string) {
  return NextResponse.json({ success: true, result });
}

function fail(error: string, debug?: string, status = 400) {
  if (debug) console.error(`[generate] ${debug}`);
  return NextResponse.json({ success: false, error, debug: debug ?? null }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // 1. API 키 확인
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return fail('API 키가 설정되지 않았습니다.', 'ANTHROPIC_API_KEY 환경변수 미설정', 500);
    }

    // 2. 요청 body 파싱
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch (e) {
      return fail('요청 형식이 올바르지 않습니다.', `body 파싱 실패: ${String(e)}`, 400);
    }

    const { onboardingData, mode, selfReviewInput, feedbackInput, fitInput } = body;

    // 3. 서버 로그 — 민감 정보 제외
    console.log('[generate] 요청 수신', {
      mode,
      has_vision: !!onboardingData?.vision?.trim(),
      has_orgGoals: !!onboardingData?.orgGoals?.trim(),
      has_performanceGoals: !!onboardingData?.performanceGoals?.trim(),
      has_growthGoals: !!onboardingData?.growthGoals?.trim(),
      has_coreValuesOrTalent: !!onboardingData?.coreValuesOrTalent?.trim(),
      has_groundRules: !!onboardingData?.groundRules?.trim(),
    });

    // 4. 필수 입력값 서버 검증
    if (!onboardingData?.performanceGoals?.trim()) {
      return fail('성과목표를 입력해주세요.', 'validation: performanceGoals 비어 있음');
    }
    if (!onboardingData?.growthGoals?.trim()) {
      return fail('성장목표를 입력해주세요.', 'validation: growthGoals 비어 있음');
    }
    if (!onboardingData?.coreValuesOrTalent?.trim()) {
      return fail('핵심가치 또는 인재상을 입력해주세요.', 'validation: coreValuesOrTalent 비어 있음');
    }
    if (!onboardingData?.groundRules?.trim()) {
      return fail('행동규범(Ground Rule) 또는 조직 기준을 입력해주세요.', 'validation: groundRules 비어 있음');
    }

    // 5. 모드별 추가 검증 + 프롬프트 생성
    let prompt: string;
    try {
      switch (mode) {
        case 'self-review':
          if (!selfReviewInput?.content?.trim()) {
            return fail('셀프리뷰 내용을 입력해주세요.', 'validation: selfReviewInput.content 비어 있음');
          }
          prompt = buildSelfReviewPrompt(onboardingData, selfReviewInput.content);
          break;

        case 'leader-feedback':
          if (!feedbackInput?.selfReview?.trim()) {
            return fail('팀원 셀프리뷰를 입력해주세요.', 'validation: feedbackInput.selfReview 비어 있음');
          }
          prompt = buildFeedbackPrompt(onboardingData, feedbackInput);
          break;

        case 'attitude-fit':
          if (!fitInput?.content?.trim()) {
            return fail('태도/조직Fit 내용을 입력해주세요.', 'validation: fitInput.content 비어 있음');
          }
          prompt = buildFitPrompt(onboardingData, fitInput);
          break;

        default:
          return fail('잘못된 모드입니다.', `알 수 없는 mode: ${mode}`);
      }
    } catch (e) {
      console.error('[generate] 프롬프트 생성 실패:', e instanceof Error ? e.stack : e);
      return fail('생성 준비 중 오류가 발생했습니다. 다시 시도해주세요.', `prompt 빌드 실패: ${String(e)}`, 500);
    }

    // 6. Anthropic API 호출
    let apiResponse: Response;
    try {
      apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
    } catch (e) {
      console.error('[generate] Anthropic API 네트워크 오류:', e instanceof Error ? e.stack : e);
      return fail(
        '네트워크 오류로 AI 생성에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.',
        `API fetch 실패: ${String(e)}`,
        502,
      );
    }

    // 7. API 응답 상태 확인
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text().catch(() => '(응답 읽기 실패)');
      console.error('[generate] Anthropic API 오류 — status:', apiResponse.status, '| body:', errorText);
      return fail(
        '생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        `Anthropic status=${apiResponse.status} | ${errorText.slice(0, 300)}`,
        500,
      );
    }

    // 8. 응답 파싱
    let aiData: { content?: Array<{ text?: string }> };
    try {
      aiData = await apiResponse.json();
    } catch (e) {
      console.error('[generate] AI 응답 JSON 파싱 실패:', e instanceof Error ? e.stack : e);
      return fail('AI 응답을 처리하지 못했습니다. 다시 시도해주세요.', `응답 JSON 파싱 실패: ${String(e)}`, 500);
    }

    const text = aiData.content?.[0]?.text?.trim();
    if (!text) {
      console.error('[generate] AI 응답 텍스트 비어 있음:', JSON.stringify(aiData));
      return fail('AI가 결과를 생성하지 못했습니다. 다시 시도해주세요.', 'AI 응답 텍스트 비어 있음', 500);
    }

    console.log('[generate] 생성 완료 — 글자 수:', text.length);
    return ok(text);
  } catch (e) {
    console.error('[generate] 예상치 못한 서버 오류:', e instanceof Error ? e.stack : e);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', debug: String(e) },
      { status: 500 },
    );
  }
}
