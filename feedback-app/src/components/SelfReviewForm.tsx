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
    <div className="border border-gray-200 p-6">
      <h2 className="text-lg font-bold mb-1">셀프리뷰 작성</h2>
      <p className="text-sm text-gray-500 mb-4">
        이번 기간에 수행한 업무, 성과, 배운 점, 어려웠던 점, 개선하고 싶은 점을 자유롭게 적어주세요.
      </p>
      <textarea
        value={data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="예: 이번 분기에 신규 캠페인 3건을 런칭했습니다. 전환율은 14% 정도 나왔고, 데이터 분석 역량이 부족하다고 느꼈습니다. GA4를 제대로 배워서 다음에는 직접 분석하고 싶습니다."
        rows={8}
        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none mb-4"
      />
      <button
        onClick={onSubmit}
        disabled={loading || !data.content.trim()}
        className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI가 리뷰를 작성하고 있습니다...' : 'AI로 셀프리뷰 생성하기'}
      </button>
    </div>
  );
}
