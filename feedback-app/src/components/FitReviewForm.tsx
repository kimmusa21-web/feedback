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
    <div className="border border-gray-200 p-6">
      <h2 className="text-lg font-bold mb-1">태도 / 조직 Fit 작성</h2>
      <p className="text-sm text-gray-500 mb-4">
        본인의 생각, 사례, 태도 등을 자유롭게 적으면 인재상·핵심가치·행동규범에 맞춰 정리해 드립니다.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">작성 목적</label>
          <div className="grid grid-cols-2 gap-2">
            {writingPurposes.map((p) => (
              <button
                key={p}
                onClick={() => onChange({ ...data, writingPurpose: p })}
                className={`p-3 text-left border transition-colors ${
                  data.writingPurpose === p
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                <div className="text-sm font-medium">{p}</div>
                <div className={`text-xs mt-0.5 ${data.writingPurpose === p ? 'text-gray-300' : 'text-gray-500'}`}>
                  {purposeDescriptions[p]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">내용 입력</label>
          <textarea
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            placeholder="예: 저는 팀 내 갈등 상황에서 항상 상대방의 입장을 먼저 들으려고 합니다. 핵심가치 중 '존중과 협업'이 가장 중요하다고 생각하며, 실제로 프로젝트에서 의견 충돌이 있을 때 중재 역할을 자주 맡았습니다."
            rows={8}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !data.content.trim()}
        className="w-full mt-4 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI가 문구를 작성하고 있습니다...' : 'AI로 태도/조직 Fit 문구 생성하기'}
      </button>
    </div>
  );
}
