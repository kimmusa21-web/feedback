import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/lib/types';
import { buildSelfReviewPrompt, buildFeedbackPrompt, buildFitPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  const body: GenerateRequest = await req.json();
  const { onboardingData, mode, selfReviewInput, feedbackInput, fitInput } = body;

  let prompt: string;

  switch (mode) {
    case 'self-review':
      if (!selfReviewInput?.content) {
        return NextResponse.json({ error: '셀프리뷰 내용을 입력해주세요.' }, { status: 400 });
      }
      prompt = buildSelfReviewPrompt(onboardingData, selfReviewInput.content);
      break;
    case 'leader-feedback':
      if (!feedbackInput?.selfReview) {
        return NextResponse.json({ error: '팀원 셀프리뷰를 입력해주세요.' }, { status: 400 });
      }
      prompt = buildFeedbackPrompt(onboardingData, feedbackInput);
      break;
    case 'attitude-fit':
      if (!fitInput?.content) {
        return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
      }
      prompt = buildFitPrompt(onboardingData, fitInput);
      break;
    default:
      return NextResponse.json({ error: '잘못된 모드입니다.' }, { status: 400 });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250416',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Anthropic API error:', errorData);
    return NextResponse.json({ error: 'AI 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  return NextResponse.json({ result: text });
}
