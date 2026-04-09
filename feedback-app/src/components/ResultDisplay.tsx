'use client';

import CopyButton from './CopyButton';

interface Props {
  result: string;
  onRegenerate: () => void;
  loading: boolean;
}

function parseSection(text: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let lastTitle = '';
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (lastTitle) {
      sections.push({
        title: lastTitle,
        content: text.slice(lastIndex, match.index).trim(),
      });
    }
    lastTitle = match[1];
    lastIndex = match.index + match[0].length;
  }

  if (lastTitle) {
    sections.push({
      title: lastTitle,
      content: text.slice(lastIndex).trim(),
    });
  }

  if (sections.length === 0) {
    sections.push({ title: '', content: text });
  }

  return sections;
}

export default function ResultDisplay({ result, onRegenerate, loading }: Props) {
  if (!result) return null;

  const sections = parseSection(result);

  return (
    <div className="border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">생성 결과</h2>
        <div className="flex gap-2">
          <CopyButton text={result} label="전체 복사" />
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="px-3 py-1.5 text-sm border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            다시 생성
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              {section.title && (
                <h3 className="text-sm font-bold">{section.title}</h3>
              )}
              {section.title && (
                <CopyButton
                  text={`[${section.title}]\n${section.content}`}
                  label="복사"
                  className="text-xs px-2 py-1"
                />
              )}
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          이 결과는 AI가 생성한 초안입니다. 반드시 검토/수정 후 활용하세요.
        </p>
      </div>
    </div>
  );
}
