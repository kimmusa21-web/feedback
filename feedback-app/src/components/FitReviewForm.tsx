'use client';

import { FitInput } from '@/lib/types';

interface Props {
  data: FitInput;
  onChange: (data: FitInput) => void;
  onSubmit: () => void;
  loading: boolean;
}

const writingPurposes = ['자기소개형', '평가문구형', '조직적합성 설명형', '리더 코멘트용'] as const;

const purposeDescriptions: Record<string, string> = {
  '자기소개형': '자신의 태도와 가치관을 소개하는 문구',
  '평가문구형': '성과 평가 문서에 넣을 수 있는 정제된 문구',
  '조직적합성 설명형': '조직 문화와의 적합성을 설명하는 문구',
  '리더 코멘트용': '리더가 팀원의 태도를 평가할 때 참고할 문구',
};

export default function FitReviewForm({ data, onChange, onSubmit, loading }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h2 className="text-xl font-bold mb-1 text-gray-900">태도 / 조직 Fit 작성</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        본인의 생각, 사례, 태도 등을 자유롭게 적으면 인재상·핵심가치·행동규범에 맞춰 정리해 드립니다.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold mb-3 text-gray-800">작성 목적</label>
          <div className="grid grid-cols-2 gap-3">
            {writingPurposes.map((p) => (
              <button
                key={p}
                onClick={() => onChange({ ...data, writingPurpose: p })}
                className={`p-4 text-left rounded-md border transition-colors ${
                  data.writingPurpose === p
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-sm font-semibold">{p}</div>
                <div className={`text-xs mt-1 leading-relaxed ${data.writingPurpose === p ? 'text-gray-300' : 'text-gray-500'}`}>
                  {purposeDescriptions[p]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold mb-2 text-gray-800">내용 입력</label>
          <p className="text-sm text-gray-500 mb-2">
            본인의 생각, 실제 사례, 태도에 대한 이야기를 자유롭게 적어주세요.
          </p>
          <textarea
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            placeholder="예: 저는 팀 내 갈등 상황에서 항상 상대방의 입장을 먼저 들으려고 합니다. 핵심가치 중 '존중과 협업'이 가장 중요하다고 생각하며, 실제로 프로젝트에서 의견 충돌이 있을 때 중재 역할을 자주 맡았습니다."
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none leading-relaxed min-h-[280px]"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !data.content.trim()}
        className="w-full mt-8 py-4 bg-black text-white text-base font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI가 문구를 작성하고 있습니다...' : 'AI로 태도/조직 Fit 문구 생성하기'}
      </button>
    </div>
  );
}
