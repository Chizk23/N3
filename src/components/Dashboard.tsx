import React from 'react';
import { VocabItem, GrammarItem, MimikaraItem, Progress } from '../types';
import { getProgressKey } from '../lib/srs';
import { 
  BookIcon, 
  LayersIcon, 
  FlameIcon, 
  TimerIcon, 
  CheckCircleIcon, 
  ChartIcon, 
  ArrowRightIcon, 
  UploadIcon,
  SparklesIcon 
} from './Icons';

interface DashboardProps {
  vocabList: VocabItem[];
  grammarList: GrammarItem[];
  mimikaraList: MimikaraItem[];
  progressMap: Record<string, Progress>;
  streak: number;
  onStartVocab: (deck?: 'A911' | 'B349' | 'all') => void;
  onStartGrammar: () => void;
  onStartMimikara: () => void;
  onOpenMiniTest: () => void;
  onGoToImport: () => void;
  onGoToDictionary: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  vocabList,
  grammarList,
  mimikaraList = [],
  progressMap,
  streak,
  onStartVocab,
  onStartGrammar,
  onStartMimikara,
  onOpenMiniTest,
  onGoToImport,
  onGoToDictionary
}) => {
  const now = Date.now();

  const deckA = vocabList.filter(v => v.deck === 'A911' || !v.deck);
  const deckB = vocabList.filter(v => v.deck === 'B349');
  const deckC = grammarList;
  const deckM = mimikaraList;

  const getDeckStats = (items: (VocabItem | GrammarItem | MimikaraItem)[]) => {
    let mastered = 0;
    let learning = 0;
    let unlearned = 0;
    let dueCount = 0;

    for (const item of items) {
      const p = progressMap[getProgressKey(item)];
      if (!p || p.box === 0) {
        unlearned++;
      } else if (p.box >= 5) {
        mastered++;
      } else {
        learning++;
      }

      if (p && p.box > 0 && p.dueAt <= now) {
        dueCount++;
      }
    }

    return { total: items.length, mastered, learning, unlearned, dueCount };
  };

  const statsA = getDeckStats(deckA);
  const statsB = getDeckStats(deckB);
  const statsC = getDeckStats(deckC);
  const statsM = getDeckStats(deckM);

  const totalDue = statsA.dueCount + statsB.dueCount + statsC.dueCount + statsM.dueCount;
  const totalItems = statsA.total + statsB.total + statsC.total + statsM.total;
  const totalMastered = statsA.mastered + statsB.mastered + statsC.mastered + statsM.mastered;
  const overallPercent = totalItems > 0 ? Math.round((totalMastered / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Card */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-app-accent font-semibold px-2.5 py-1 rounded-md bg-app-accent-subtle">
            Lộ trình học JLPT N3 tối ưu
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-app-text tracking-tight">
            Sổ tay lặp lại ngắt quãng (SRS)
          </h1>
          <p className="text-sm sm:text-base text-app-muted leading-relaxed">
            Học thông minh theo chu kỳ giãn cách của não bộ, ưu tiên các từ vựng và ngữ pháp xuất hiện nhiều nhất trong đề thi 2010–2024.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onStartVocab('all')}
            className="h-12 px-6 rounded-xl bg-app-accent text-white text-sm font-medium hover:opacity-90 notebook-fade flex items-center gap-2 shadow-sm"
          >
            <span>Học tiếp ngay</span>
            <ArrowRightIcon size={16} />
          </button>

          <button
            type="button"
            onClick={onOpenMiniTest}
            className="h-12 px-6 rounded-xl border border-app-border hover:border-app-text text-app-text text-sm font-medium notebook-fade flex items-center gap-2 bg-app-surface"
          >
            <TimerIcon size={16} />
            <span>Thi thử 20 câu</span>
          </button>
        </div>
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
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
            <TimerIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Cần ôn hôm nay</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{totalDue} thẻ</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircleIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Đã thuộc vững</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{totalMastered} mục</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <ChartIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Tiến độ chung</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{overallPercent}%</div>
          </div>
        </div>
      </div>

      {/* 4 Decks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted px-1">
          <span className="uppercase tracking-wider font-semibold">Bốn bộ dữ liệu học JLPT N3</span>
          <button
            type="button"
            onClick={onGoToImport}
            className="flex items-center gap-1.5 hover:text-app-text underline font-medium"
          >
            <UploadIcon size={15} />
            <span>Nhập file của bạn</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Deck Mimikara N3 */}
          <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/20 p-6 space-y-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 uppercase">
                  Mới · Mimikara N3
                </span>
                <span className="text-xs text-app-muted">{statsM.total} từ</span>
              </div>
              <h3 className="text-lg font-medium text-app-text flex items-center gap-2">
                <SparklesIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span>880 Từ vựng Mimikara</span>
              </h3>
              <p className="text-xs text-app-muted leading-relaxed">
                Giáo trình Mimikara Oboeru N3 kèm Âm Hán Việt, phân chia 7 Unit và 5 chế độ học chuyên biệt (Flashcard, Đố Hán Việt, Trắc nghiệm, Gõ từ).
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-full h-1.5 bg-app border border-app-border/40 rounded-full overflow-hidden flex">
                <div 
                  className="bg-app-success h-full"
                  style={{ width: `${statsM.total > 0 ? (statsM.mastered / statsM.total) * 100 : 0}%` }}
                />
                <div 
                  className="bg-indigo-500 h-full"
                  style={{ width: `${statsM.total > 0 ? (statsM.learning / statsM.total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-app-muted">
                <span>Thuộc: {statsM.mastered}</span>
                <span>Học: {statsM.learning}</span>
                <span>Chưa: {statsM.unlearned}</span>
              </div>

              <button
                type="button"
                onClick={onStartMimikara}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-1.5 mt-2 shadow-sm"
              >
                <span>Học Mimikara 880 từ</span>
                <ArrowRightIcon size={15} />
              </button>
            </div>
          </div>

          {/* Deck A */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-app-accent font-semibold px-2 py-0.5 rounded bg-app-accent-subtle uppercase">
                  Bộ A (PDF)
                </span>
                <span className="text-xs text-app-muted">{statsA.total} từ</span>
              </div>
              <h3 className="text-lg font-medium text-app-text flex items-center gap-2">
                <BookIcon size={18} className="text-app-accent" />
                <span>911 Từ vựng N3</span>
              </h3>
              <p className="text-xs text-app-muted leading-relaxed">
                Danh từ (381), Động từ (238), Tính từ (99), Phó từ (89), Katakana (104).
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-full h-1.5 bg-app border border-app-border/40 rounded-full overflow-hidden flex">
                <div 
                  className="bg-app-success h-full"
                  style={{ width: `${statsA.total > 0 ? (statsA.mastered / statsA.total) * 100 : 0}%` }}
                />
                <div 
                  className="bg-app-accent h-full"
                  style={{ width: `${statsA.total > 0 ? (statsA.learning / statsA.total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-app-muted">
                <span>Thuộc: {statsA.mastered}</span>
                <span>Học: {statsA.learning}</span>
                <span>Chưa: {statsA.unlearned}</span>
              </div>

              <button
                type="button"
                onClick={() => onStartVocab('A911')}
                className="w-full h-11 rounded-xl bg-app hover:bg-app-accent-subtle border border-app-border hover:border-app-accent text-app-text text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Học Bộ 911 từ</span>
                <ArrowRightIcon size={15} />
              </button>
            </div>
          </div>

          {/* Deck B */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-app-accent font-semibold px-2 py-0.5 rounded bg-app-accent-subtle uppercase">
                  Bộ B (PDF)
                </span>
                <span className="text-xs text-app-muted">{statsB.total} từ</span>
              </div>
              <h3 className="text-lg font-medium text-app-text flex items-center gap-2">
                <BookIcon size={18} className="text-purple-500" />
                <span>349 Từ Kanji N3</span>
              </h3>
              <p className="text-xs text-app-muted leading-relaxed">
                Tập trung nhận diện mặt chữ Kanji. Đồng bộ tiến độ với Bộ A theo từ và cách đọc.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-full h-1.5 bg-app border border-app-border/40 rounded-full overflow-hidden flex">
                <div 
                  className="bg-app-success h-full"
                  style={{ width: `${statsB.total > 0 ? (statsB.mastered / statsB.total) * 100 : 0}%` }}
                />
                <div 
                  className="bg-app-accent h-full"
                  style={{ width: `${statsB.total > 0 ? (statsB.learning / statsB.total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-app-muted">
                <span>Thuộc: {statsB.mastered}</span>
                <span>Học: {statsB.learning}</span>
                <span>Chưa: {statsB.unlearned}</span>
              </div>

              <button
                type="button"
                onClick={() => onStartVocab('B349')}
                className="w-full h-11 rounded-xl bg-app hover:bg-app-accent-subtle border border-app-border hover:border-app-accent text-app-text text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Học Bộ 349 Kanji</span>
                <ArrowRightIcon size={15} />
              </button>
            </div>
          </div>

          {/* Deck C */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-app-accent font-semibold px-2 py-0.5 rounded bg-app-accent-subtle uppercase">
                  Bộ C (Excel)
                </span>
                <span className="text-xs text-app-muted">{statsC.total} mẫu</span>
              </div>
              <h3 className="text-lg font-medium text-app-text flex items-center gap-2">
                <LayersIcon size={18} className="text-indigo-500" />
                <span>230 Ngữ pháp N3</span>
              </h3>
              <p className="text-xs text-app-muted leading-relaxed">
                5 nhóm: Ngữ pháp trong đề, Kính ngữ, Liên từ, Phó từ, N4 trong đề N3.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-full h-1.5 bg-app border border-app-border/40 rounded-full overflow-hidden flex">
                <div 
                  className="bg-app-success h-full"
                  style={{ width: `${statsC.total > 0 ? (statsC.mastered / statsC.total) * 100 : 0}%` }}
                />
                <div 
                  className="bg-app-accent h-full"
                  style={{ width: `${statsC.total > 0 ? (statsC.learning / statsC.total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-app-muted">
                <span>Thuộc: {statsC.mastered}</span>
                <span>Học: {statsC.learning}</span>
                <span>Chưa: {statsC.unlearned}</span>
              </div>

              <button
                type="button"
                onClick={onStartGrammar}
                className="w-full h-11 rounded-xl bg-app hover:bg-app-accent-subtle border border-app-border hover:border-app-accent text-app-text text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Học Ngữ pháp</span>
                <ArrowRightIcon size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
