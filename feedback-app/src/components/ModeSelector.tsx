'use client';

import { Mode } from '@/lib/types';

interface Props {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
}

const modes: { value: Mode; label: string; desc: string }[] = [
  { value: 'self-review', label: '셀프리뷰 작성', desc: '본인의 업무/성과를 구조화된 리뷰로 변환' },
  { value: 'leader-feedback', label: '리더 피드백 작성', desc: '팀원 셀프리뷰 기반으로 피드백 생성' },
  { value: 'attitude-fit', label: '태도 / 조직 Fit 작성', desc: '인재상·핵심가치 기반 태도 문구 생성' },
];

export default function ModeSelector({ selected, onSelect }: Props) {
  return (
    <div className="border border-gray-200 p-6">
      <h2 className="text-lg font-bold mb-1">작성 모드 선택</h2>
      <p className="text-sm text-gray-500 mb-4">생성할 문서 유형을 선택하세요.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => onSelect(m.value)}
            className={`p-4 border text-left transition-colors ${
              selected === m.value
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-black'
            }`}
          >
            <div className="font-medium text-sm">{m.label}</div>
            <div className={`text-xs mt-1 ${selected === m.value ? 'text-gray-300' : 'text-gray-500'}`}>
              {m.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
