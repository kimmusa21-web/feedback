'use client';

import { useState, useRef } from 'react';
import { OnboardingData, Mode, SelfReviewInput, FeedbackInput, FitInput, GenerateRequest } from '@/lib/types';
import OnboardingForm from '@/components/OnboardingForm';
import ModeSelector from '@/components/ModeSelector';
import SelfReviewForm from '@/components/SelfReviewForm';
import FeedbackForm from '@/components/FeedbackForm';
import FitReviewForm from '@/components/FitReviewForm';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const [onboarding, setOnboarding] = useState<OnboardingData>({
    vision: '',
    coreValues: '',
    orgGoals: '',
    performanceGoals: '',
    growthGoals: '',
    idealTalent: '',
    groundRules: '',
  });

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '오류가 발생했습니다.');
        return;
      }

      setResult(data.result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">FeedbackFlow</h1>
          <p className="text-sm text-gray-500 mt-1">
            조직 목표와 정렬된 셀프리뷰, 리더 피드백, 태도/조직 Fit 문구를 AI로 생성합니다.
          </p>
        </header>

        <div className="space-y-6">
          {/* 온보딩 (접기/펼치기) */}
          <div>
            <button
              onClick={() => setOnboardingOpen(!onboardingOpen)}
              className="w-full flex items-center justify-between py-3 text-left"
            >
              <span className="text-sm font-bold">
                1. 조직 및 목표 정보 {onboardingOpen ? '' : '(접힘 — 클릭하여 펼치기)'}
              </span>
              <span className="text-gray-400 text-lg">{onboardingOpen ? '−' : '+'}</span>
            </button>
            {onboardingOpen && (
              <OnboardingForm data={onboarding} onChange={setOnboarding} />
            )}
          </div>

          {/* 모드 선택 */}
          <div>
            <p className="text-sm font-bold mb-3">2. 작성 모드 선택</p>
            <ModeSelector selected={mode} onSelect={setMode} />
          </div>

          {/* 모드별 입력 */}
          {mode && (
            <div>
              <p className="text-sm font-bold mb-3">3. 내용 입력</p>
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
            <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div className="border border-gray-200 p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-500">AI가 결과를 생성하고 있습니다...</p>
            </div>
          )}

          {/* 결과 */}
          <div ref={resultRef}>
            <ResultDisplay result={result} onRegenerate={generate} loading={loading} />
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            FeedbackFlow — AI 기반 리뷰/피드백 어시스턴트 프로토타입
          </p>
        </footer>
      </div>
    </main>
  );
}
