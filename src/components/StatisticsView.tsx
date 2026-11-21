import React from 'react';
import { VocabItem, GrammarItem, Progress, DailyStat } from '../types';
import { getProgressKey } from '../lib/srs';
import { 
  FlameIcon, 
  TimerIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ChartIcon, 
  LayersIcon 
} from './Icons';

interface StatisticsViewProps {
  vocabList: VocabItem[];
  grammarList: GrammarItem[];
  progressMap: Record<string, Progress>;
  stats: DailyStat[];
  streak: number;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  vocabList,
  grammarList,
  progressMap,
  stats,
  streak
}) => {
  const boxCounts = [0, 0, 0, 0, 0, 0];
  const leeches: { item: VocabItem | GrammarItem; p: Progress }[] = [];

  const allItems = [...vocabList, ...grammarList];

  for (const item of allItems) {
    const key = getProgressKey(item);
    const p = progressMap[key];
    const box = p?.box || 0;
    if (box >= 0 && box <= 5) {
      boxCounts[box]++;
    }
    if (p && p.leech) {
      leeches.push({ item, p });
    }
  }

  leeches.sort((a, b) => b.p.wrong - a.p.wrong);
  const top20Leeches = leeches.slice(0, 20);

  let totalCorrect = 0;
  let totalWrong = 0;
  for (const s of stats) {
    totalCorrect += s.correctCount;
    totalWrong += s.wrongCount;
  }
  const totalAnswers = totalCorrect + totalWrong;
  const overallAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-app-text tracking-tight">
          Thống kê học tập
        </h2>
        <p className="text-sm text-app-muted mt-1">
          Theo dõi chuỗi ngày, độ chính xác, phân bố 5 hộp Leitner và 20 mục hay làm sai
        </p>
      </div>

      {/* Summary indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <FlameIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Chuỗi học</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{streak} ngày</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircleIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Độ chính xác</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{overallAccuracy}%</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <ChartIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Đã thuộc (Hộp 5)</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{boxCounts[5]}</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
            <AlertCircleIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Hay sai (Leech)</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{leeches.length}</div>
          </div>
        </div>
      </div>

      {/* Leitner Box Breakdown */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-app-text">
          <LayersIcon size={18} className="text-app-accent" />
          <span>Phân bố hệ thống lặp lại ngắt quãng (Leitner 5 hộp)</span>
        </div>

        <div className="space-y-4 pt-1">
          {[
            { label: 'Chưa học (Hộp 0)', count: boxCounts[0], color: 'bg-app-muted' },
            { label: 'Hộp 1 (8 giờ)', count: boxCounts[1], color: 'bg-app-error' },
            { label: 'Hộp 2 (2 ngày)', count: boxCounts[2], color: 'bg-app-accent' },
            { label: 'Hộp 3 (4 ngày)', count: boxCounts[3], color: 'bg-app-accent' },
            { label: 'Hộp 4 (7 ngày)', count: boxCounts[4], color: 'bg-app-accent' },
            { label: 'Hộp 5 – Đã thuộc (14 ngày)', count: boxCounts[5], color: 'bg-app-success' },
          ].map((box, idx) => {
            const pct = allItems.length > 0 ? (box.count / allItems.length) * 100 : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm text-app-text">
                  <span className="font-medium">{box.label}</span>
                  <span className="text-app-muted">{box.count} mục ({Math.round(pct)}%)</span>
                </div>
                <div className="w-full h-2 bg-app border border-app-border/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${box.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 20 Leeches */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted border-b border-app-border pb-3">
          <span className="uppercase tracking-wider font-semibold text-app-text">Top 20 mục hay làm sai nhất</span>
          <span>Ưu tiên ôn tập kỹ</span>
        </div>

        {top20Leeches.length === 0 ? (
          <div className="py-12 text-center text-xs sm:text-sm text-app-muted">
            Chưa có mục nào bị đánh dấu hay sai. Bạn đang học rất tốt!
          </div>
        ) : (
          <div className="divide-y divide-app-border/40 max-h-96 overflow-y-auto">
            {top20Leeches.map((entry, idx) => {
              const item = entry.item;
              const isVocab = 'word' in item;
              return (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-app-muted text-xs font-mono w-5">{idx + 1}.</span>
                      <span className="font-jp font-light text-base text-app-text">
                        {isVocab ? (item as VocabItem).word : (item as GrammarItem).pattern}
                      </span>
                      {isVocab && (
                        <span className="font-jp text-app-accent text-xs">
                          【{(item as VocabItem).reading}】
                        </span>
                      )}
                    </div>
                    <div className="text-app-muted truncate pl-7">
                      {item.meaning}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-app-error font-medium">
                      {entry.p.wrong} lần sai
                    </span>
                    <div className="text-app-muted text-xs">
                      Đúng {entry.p.correct} lần
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
