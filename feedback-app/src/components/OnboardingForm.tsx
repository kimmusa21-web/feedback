'use client';

import { OnboardingData } from '@/lib/types';

interface Props {
  data: OnboardingData;
  onChange: (data: OnboardingData) => void;
}

function Field({ label, value, onChange, placeholder, rows = 2 }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
      />
    </div>
  );
}

export default function OnboardingForm({ data, onChange }: Props) {
  const update = (key: keyof OnboardingData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="border border-gray-200 p-6">
      <h2 className="text-lg font-bold mb-1">조직 및 목표 정보</h2>
      <p className="text-sm text-gray-500 mb-6">AI가 리뷰/피드백 생성 시 참조할 정보를 입력하세요.</p>

      <div className="space-y-6">
        {/* 회사/조직 정보 */}
        <div>
          <h3 className="text-sm font-bold mb-3 pb-2 border-b">회사 / 조직 정보</h3>
          <div className="space-y-4">
            <Field
              label="회사 비전"
              value={data.vision}
              onChange={(v) => update('vision', v)}
              placeholder="예: We guide the path to marketing truth"
            />
            <Field
              label="핵심가치"
              value={data.coreValues}
              onChange={(v) => update('coreValues', v)}
              placeholder="예: 의도 탐구에서 시작하자, 존중하고 협조하는 문화를 만들자, 지속 성장과 공유의 문화를 만들자"
              rows={3}
            />
            <Field
              label="조직 목표"
              value={data.orgGoals}
              onChange={(v) => update('orgGoals', v)}
              placeholder="예: Q1 인텐트 기반 캠페인 전환율 15% 달성, 글로벌 시장 진출 준비"
              rows={3}
            />
          </div>
        </div>

        {/* 개인 목표 */}
        <div>
          <h3 className="text-sm font-bold mb-3 pb-2 border-b">개인 목표</h3>
          <div className="space-y-4">
            <Field
              label="성과목표"
              value={data.performanceGoals}
              onChange={(v) => update('performanceGoals', v)}
              placeholder="예: 신규 캠페인 3건 기획·실행, 전환율 15% 달성"
              rows={3}
            />
            <Field
              label="성장목표"
              value={data.growthGoals}
              onChange={(v) => update('growthGoals', v)}
              placeholder="예: GA4 데이터 분석 역량 확보, 팀 내 지식 공유 세션 월 1회 진행"
              rows={3}
            />
          </div>
        </div>

        {/* 태도/조직 Fit 기준 */}
        <div>
          <h3 className="text-sm font-bold mb-3 pb-2 border-b">태도 / 조직 Fit 기준</h3>
          <div className="space-y-4">
            <Field
              label="인재상"
              value={data.idealTalent}
              onChange={(v) => update('idealTalent', v)}
              placeholder="예: 주도적으로 문제를 발견하고 해결하는 사람, 동료와 함께 성장하는 사람"
              rows={2}
            />
            <Field
              label="행동규범 (Ground Rule)"
              value={data.groundRules}
              onChange={(v) => update('groundRules', v)}
              placeholder="예: 투명하게 소통한다, 약속한 기한을 지킨다, 피드백을 두려워하지 않는다"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
