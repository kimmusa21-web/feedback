'use client';

import { useState, useRef } from 'react';
import { OnboardingData, Mode, SelfReviewInput, FeedbackInput, FitInput, GenerateRequest, GenerateResponse } from '@/lib/types';
import OnboardingForm from '@/components/OnboardingForm';
import ModeSelector from '@/components/ModeSelector';
import SelfReviewForm from '@/components/SelfReviewForm';
import FeedbackForm from '@/components/FeedbackForm';
import FitReviewForm from '@/components/FitReviewForm';
import ResultDisplay from '@/components/ResultDisplay';

const INITIAL_ONBOARDING: OnboardingData = {
  vision: '',
  orgGoals: '',
  performanceGoals: '',
  growthGoals: '',
  coreValuesOrTalent: '',
  groundRules: '',
};

function validateOnboarding(data: OnboardingData): string | null {
  if (!data.performanceGoals.trim()) return '성과목표를 입력해주세요. (조직 및 목표 정보 → 개인 목표)';
  if (!data.growthGoals.trim()) return '성장목표를 입력해주세요. (조직 및 목표 정보 → 개인 목표)';
  if (!data.coreValuesOrTalent.trim()) return '핵심가치 또는 인재상을 입력해주세요. (조직 및 목표 정보 → 태도/조직 Fit 기준)';
  if (!data.groundRules.trim()) return '행동규범(Ground Rule) 또는 조직 기준을 입력해주세요. (조직 및 목표 정보 → 태도/조직 Fit 기준)';
  return null;
}

export default function Home() {
  const [onboarding, setOnboarding] = useState<OnboardingData>(INITIAL_ONBOARDING);

  const [mode, setMode] = useState<Mode | null>(null);
  const [selfReview, setSelfReview] = useState<SelfReviewInput>({ content: '' });
  const [feedback, setFeedback] = useState<FeedbackInput>({
    selfReview: '',
    purpose: '성장지원',
    tone: '코칭형',
  });
  const [fit, setFit] = useState<FitInput>({
    content: '',
    writingPurpose: '평가문구형',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onboardingOpen, setOnboardingOpen] = useState(true);

  const resultRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!mode) return;

    // 1. 프론트엔드 onboarding 필수값 검증
    const onboardingError = validateOnboarding(onboarding);
    if (onboardingError) {
      setError(onboardingError);
      setOnboardingOpen(true); // 입력 폼 자동 펼치기
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    const body: GenerateRequest = {
      onboardingData: onboarding,
      mode,
      selfReviewInput: mode === 'self-review' ? selfReview : undefined,
      feedbackInput: mode === 'leader-feedback' ? feedback : undefined,
      fitInput: mode === 'attitude-fit' ? fit : undefined,
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: GenerateResponse = await res.json();

      if (!data.success) {
        setError(data.error || '생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      setResult(data.result ?? '');
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      setError('네트워크 오류가 발생했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight">FeedbackFlow</h1>
            <p className="text-sm text-gray-400 hidden sm:block">
              조직 목표와 정렬된 셀프리뷰, 리더 피드백, 태도/조직 Fit 문구를 AI로 생성합니다.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-8">

          {/* STEP 1: 온보딩 */}
          <div>
            <button
              onClick={() => setOnboardingOpen(!onboardingOpen)}
              className="w-full flex items-center justify-between py-3 px-1 text-left group"
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-black transition-colors">
                Step 1. 조직 및 목표 정보 입력
                {!onboardingOpen && (
                  <span className="ml-2 text-sm font-normal text-gray-400">(클릭하여 펼치기)</span>
                )}
              </span>
              <span className="text-gray-400 text-xl font-light">{onboardingOpen ? '−' : '+'}</span>
            </button>
            {onboardingOpen && (
              <OnboardingForm data={onboarding} onChange={setOnboarding} />
            )}
          </div>

          {/* STEP 2: 모드 선택 */}
          <div>
            <p className="text-lg font-bold mb-4 px-1 text-gray-800">Step 2. 작성 모드 선택</p>
            <ModeSelector selected={mode} onSelect={setMode} />
          </div>

          {/* STEP 3: 모드별 입력 */}
          {mode && (
            <div>
              <p className="text-lg font-bold mb-4 px-1 text-gray-800">Step 3. 내용 입력 및 생성</p>
              {mode === 'self-review' && (
                <SelfReviewForm
                  data={selfReview}
                  onChange={setSelfReview}
                  onSubmit={generate}
                  loading={loading}
                />
              )}
              {mode === 'leader-feedback' && (
                <FeedbackForm
                  data={feedback}
                  onChange={setFeedback}
                  onSubmit={generate}
                  loading={loading}
                />
              )}
              {mode === 'attitude-fit' && (
                <FitReviewForm
                  data={fit}
                  onChange={setFit}
                  onSubmit={generate}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-5 text-sm text-red-700 leading-relaxed">
              <span className="font-semibold block mb-1">입력 확인 필요</span>
              {error}
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">AI가 결과를 생성하고 있습니다...</p>
              <p className="text-xs text-gray-400 mt-1">보통 10~30초 정도 소요됩니다.</p>
            </div>
          )}

          {/* 결과 */}
          <div ref={resultRef}>
            <ResultDisplay result={result} onRegenerate={generate} loading={loading} />
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            FeedbackFlow — AI 기반 리뷰/피드백 어시스턴트 프로토타입
          </p>
        </footer>
      </div>
    </main>
  );
}
