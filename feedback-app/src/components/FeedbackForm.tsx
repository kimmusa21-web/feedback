'use client';

import { FeedbackInput } from '@/lib/types';

interface Props {
  data: FeedbackInput;
  onChange: (data: FeedbackInput) => void;
  onSubmit: () => void;
  loading: boolean;
}

const purposes = ['칭찬', '성장지원', '개선요청', '경고'] as const;
const tones = ['단호', '중립', '코칭형', '성장형'] as const;

const toneDescriptions: Record<string, string> = {
  '단호': '명확한 기대치와 기한을 직접적으로 제시',
  '중립': '객관적 사실 중심으로 담백하게 전달',
  '코칭형': '부드럽지만 구체적인 방향 제시',
  '성장형': '긍정 인정과 다음 도전을 함께 제안',
};

export default function FeedbackForm({ data, onChange, onSubmit, loading }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h2 className="text-xl font-bold mb-1 text-gray-900">리더 피드백 작성</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        팀원의 셀프리뷰를 붙여넣고, 피드백 취지와 톤을 선택하세요.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-800">
            팀원 셀프리뷰
          </label>
          <p className="text-sm text-gray-500 mb-2">팀원이 작성한 셀프리뷰 전문을 붙여넣으세요.</p>
          <textarea
            value={data.selfReview}
            onChange={(e) => onChange({ ...data, selfReview: e.target.value })}
            placeholder="팀원이 작성한 셀프리뷰를 여기에 붙여넣으세요."
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none leading-relaxed min-h-[280px]"
          />
        </div>

        <div>
          <label className="block text-base font-semibold mb-3 text-gray-800">피드백 취지</label>
          <div className="flex flex-wrap gap-3">
            {purposes.map((p) => (
              <button
                key={p}
                onClick={() => onChange({ ...data, purpose: p })}
                className={`px-5 py-2.5 text-sm font-medium rounded-md border transition-colors ${
                  data.purpose === p
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500 text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold mb-3 text-gray-800">톤 선택</label>
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...data, tone: t })}
                className={`p-4 text-left rounded-md border transition-colors ${
                  data.tone === t
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-sm font-semibold">{t}</div>
                <div className={`text-xs mt-1 leading-relaxed ${data.tone === t ? 'text-gray-300' : 'text-gray-500'}`}>
                  {toneDescriptions[t]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !data.selfReview.trim()}
        className="w-full mt-8 py-4 bg-black text-white text-base font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI가 피드백을 작성하고 있습니다...' : 'AI로 피드백 생성하기'}
      </button>
    </div>
  );
}
