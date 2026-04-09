'use client';

import { OnboardingData } from '@/lib/types';

interface Props {
  data: OnboardingData;
  onChange: (data: OnboardingData) => void;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  minHeight = 'min-h-[140px]',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  helperText?: string;
  minHeight?: string;
}) {
  return (
    <div>
      <label className="block text-base font-semibold mb-1 text-gray-800">
        {label}
        {required ? (
          <span className="text-red-500 ml-1.5 text-sm">*</span>
        ) : (
          <span className="text-gray-400 text-sm font-normal ml-2">(선택)</span>
        )}
      </label>
      {helperText && (
        <p className="text-sm text-gray-500 mb-2 leading-relaxed">{helperText}</p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none leading-relaxed ${minHeight}`}
      />
    </div>
  );
}

export default function OnboardingForm({ data, onChange }: Props) {
  const update = (key: keyof OnboardingData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h2 className="text-xl font-bold mb-1 text-gray-900">조직 및 목표 정보</h2>
      <p className="text-sm text-gray-500 mb-8">
        AI가 리뷰/피드백 생성 시 참조할 정보를 입력하세요.
        <span className="text-red-500 ml-1">*</span> 표시 항목은 필수입니다.
      </p>

      <div className="space-y-10">

        {/* 섹션 1: 회사/조직 정보 */}
        <section>
          <h3 className="text-base font-bold mb-4 pb-2 border-b border-gray-200 text-gray-700">
            1. 회사 / 조직 정보
          </h3>
          <div className="space-y-6">
            <Field
              label="회사 미션 or 비전"
              value={data.vision}
              onChange={(v) => update('vision', v)}
              placeholder="회사 미션 또는 비전이 있다면 입력해주세요. 예: We guide the path to marketing truth"
              helperText="회사 또는 팀의 미션·비전을 입력하면 AI가 방향성에 맞는 리뷰를 작성합니다."
              minHeight="min-h-[140px]"
            />
            <Field
              label="조직 목표"
              value={data.orgGoals}
              onChange={(v) => update('orgGoals', v)}
              placeholder="예: Q1 인텐트 기반 캠페인 전환율 15% 달성, 글로벌 시장 진출 준비"
              helperText="팀 또는 조직 단위의 이번 기간 OKR·KPI 목표를 입력하세요."
              minHeight="min-h-[140px]"
            />
          </div>
        </section>

        {/* 섹션 2: 개인 목표 */}
        <section>
          <h3 className="text-base font-bold mb-4 pb-2 border-b border-gray-200 text-gray-700">
            2. 개인 목표
          </h3>
          <div className="space-y-6">
            <Field
              label="성과목표"
              value={data.performanceGoals}
              onChange={(v) => update('performanceGoals', v)}
              placeholder="예: 신규 캠페인 3건 기획·실행, 전환율 15% 달성"
              helperText="이번 기간에 달성해야 할 성과 중심의 목표를 구체적으로 입력하세요."
              required
              minHeight="min-h-[160px]"
            />
            <Field
              label="성장목표"
              value={data.growthGoals}
              onChange={(v) => update('growthGoals', v)}
              placeholder="예: GA4 데이터 분석 역량 확보, 팀 내 지식 공유 세션 월 1회 진행"
              helperText="스킬 향상, 역량 개발, 학습 관련 목표를 입력하세요."
              required
              minHeight="min-h-[160px]"
            />
          </div>
        </section>

        {/* 섹션 3: 태도/조직 Fit 기준 */}
        <section>
          <h3 className="text-base font-bold mb-4 pb-2 border-b border-gray-200 text-gray-700">
            3. 태도 / 조직 Fit 기준
          </h3>
          <div className="space-y-6">
            <Field
              label="핵심가치 또는 인재상"
              value={data.coreValuesOrTalent}
              onChange={(v) => update('coreValuesOrTalent', v)}
              placeholder="예: 주도적으로 문제를 발견하고 해결하는 사람, 의도 탐구에서 시작하자, 존중하고 협조하는 문화를 만들자"
              helperText="회사에서 중요하게 보는 핵심가치, 인재상 중 하나 또는 둘 다 입력하세요."
              required
              minHeight="min-h-[160px]"
            />
            <Field
              label="행동규범(Ground Rule) 또는 조직 기준"
              value={data.groundRules}
              onChange={(v) => update('groundRules', v)}
              placeholder="예: 투명하게 소통한다, 약속한 기한을 지킨다, 피드백을 두려워하지 않는다"
              helperText="팀이 함께 지키는 행동 기준 또는 조직 문화 원칙을 입력하세요."
              required
              minHeight="min-h-[160px]"
            />
          </div>
        </section>

      </div>
    </div>
  );
}
