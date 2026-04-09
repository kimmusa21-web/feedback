'use client';

import { SelfReviewInput } from '@/lib/types';

interface Props {
  data: SelfReviewInput;
  onChange: (data: SelfReviewInput) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function SelfReviewForm({ data, onChange, onSubmit, loading }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h2 className="text-xl font-bold mb-1 text-gray-900">셀프리뷰 작성</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        이번 기간에 수행한 업무, 성과, 배운 점, 어려웠던 점, 개선하고 싶은 점을 자유롭게 적어주세요.
        <br />
        정제되지 않은 메모도 괜찮습니다. AI가 구조화된 셀프리뷰로 변환해 드립니다.
      </p>
      <textarea
        value={data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="예: 이번 분기에 신규 캠페인 3건을 런칭했습니다. 전환율은 14% 정도 나왔고, 데이터 분석 역량이 부족하다고 느꼈습니다. GA4를 제대로 배워서 다음에는 직접 분석하고 싶습니다."
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none leading-relaxed min-h-[280px] mb-6"
      />
      <button
        onClick={onSubmit}
        disabled={loading || !data.content.trim()}
        className="w-full py-4 bg-black text-white text-base font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI가 셀프리뷰를 작성하고 있습니다...' : 'AI로 셀프리뷰 생성하기'}
      </button>
    </div>
  );
}
