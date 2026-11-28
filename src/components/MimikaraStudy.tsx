import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MimikaraItem,
  StudyModeMimikara,
  Progress,
  QuizQuestion
} from '../types';
import {
  updateProgress,
  getProgressKey,
  createInitialProgress
} from '../lib/srs';
import { shuffle, checkVietnameseAnswer } from '../lib/quiz';
import { checkJapaneseAnswer } from '../lib/kana';
import { AudioButton } from './AudioButton';
import { KanaInput } from './KanaInput';
import {
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  FilterIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
  SparklesIcon,
  VolumeIcon
} from './Icons';

interface MimikaraStudyProps {
  items: MimikaraItem[];
  progressMap: Record<string, Progress>;
  onUpdateProgress: (key: string, updated: Progress, isCorrect: boolean) => void;
  onToggleStar: (item: MimikaraItem) => void;
  onDeleteItem: (item: MimikaraItem) => void;
  onReloadDatabase?: () => Promise<void>;
  cardsPerSession?: number;
  onUpdateCardsPerSession?: (count: number) => void;
  autoPronounce?: boolean;
}

export type ScopeMode = 'unit' | 'range';
type SessionOrder = 'sequential' | 'shuffle';

const createUniqueQuizOptions = (correctAnswer: string, candidates: string[]): string[] => {
  const uniqueDistractors = Array.from(new Set(candidates))
    .filter((candidate) => candidate && candidate !== correctAnswer)
    .slice(0, 3);
  return shuffle([correctAnswer, ...uniqueDistractors]);
};

export const MimikaraStudy: React.FC<MimikaraStudyProps> = ({
  items,
  progressMap,
  onUpdateProgress,
  onToggleStar,
  onDeleteItem,
  onReloadDatabase,
  cardsPerSession = 20,
  onUpdateCardsPerSession,
  autoPronounce = true
}) => {
  // Scope filter state
  const [scopeMode, setScopeMode] = useState<ScopeMode>('unit');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(100);

  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlearned' | 'learned' | 'starred'>('all');
  const [customCount, setCustomCount] = useState<number>(cardsPerSession);
  const [sessionOrder, setSessionOrder] = useState<SessionOrder>('sequential');
  const [studyMode, setStudyMode] = useState<StudyModeMimikara>('flashcard');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  // Dynamic Unit list
  const mimikaraUnits = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.unit) set.add(it.unit);
    });
    return Array.from(set);
  }, [items]);

  const handleReloadDatabase = async () => {
    if (!onReloadDatabase) return;
    const confirm = window.confirm(
      'Bạn có chắc chắn muốn nạp lại 880 từ vựng Mimikara chuẩn từ file JSON gốc (kèm Unit, Cụm từ, Ví dụ) vào database không?'
    );
    if (!confirm) return;
    setIsReloading(true);
    try {
      await onReloadDatabase();
    } finally {
      setIsReloading(false);
    }
  };

  // Active session queue
  const [sessionQueue, setSessionQueue] = useState<MimikaraItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState<{ correct: number; wrong: number }>({ correct: 0, wrong: 0 });
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [showSessionList, setShowSessionList] = useState<boolean>(false);

  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Typing state
  const [typingInput, setTypingInput] = useState<string>('');
  const [typingFeedback, setTypingFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Tra cứu / Browse state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailItem, setSelectedDetailItem] = useState<MimikaraItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MimikaraItem | null>(null);
  const [browsePage, setBrowsePage] = useState<number>(1);
  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    setCustomCount(cardsPerSession);
  }, [cardsPerSession]);

  // Filter items according to unit/range & status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Scope filter
      if (scopeMode === 'unit') {
        if (selectedUnit !== 'all' && item.unit !== selectedUnit) return false;
      } else {
        const min = Math.min(rangeFrom, rangeTo);
        const max = Math.max(rangeFrom, rangeTo);
        if (item.stt < min || item.stt > max) return false;
      }

      // Status filter
      const p = progressMap[getProgressKey(item)] || createInitialProgress();
      if (selectedStatus === 'starred' && !p.starred) return false;
      if (selectedStatus === 'unlearned' && p.box !== 0) return false;
      if (selectedStatus === 'learned' && p.box === 0) return false;

      return true;
    });
  }, [items, progressMap, scopeMode, selectedUnit, rangeFrom, rangeTo, selectedStatus]);

  // Summary counts for this deck
  const statsOverview = useMemo(() => {
    let unlearned = 0;
    let learned = 0;
    let starred = 0;

    items.forEach((item) => {
      const p = progressMap[getProgressKey(item)] || createInitialProgress();
      if (p.starred) starred++;
      if (p.box === 0) unlearned++;
      else learned++;
    });

    return { total: items.length, unlearned, learned, starred };
  }, [items, progressMap]);

  // Browse search results
  const browseResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredItems;
    return filteredItems.filter((it) => {
      const matchBasic =
        it.kanji.toLowerCase().includes(q) ||
        it.reading.toLowerCase().includes(q) ||
        it.hanViet.toLowerCase().includes(q) ||
        it.meaning.toLowerCase().includes(q) ||
        it.stt.toString() === q ||
        (it.unit && it.unit.toLowerCase().includes(q)) ||
        (it.usage && it.usage.toLowerCase().includes(q));

      if (matchBasic) return true;

      const matchColloc = it.collocations?.some(c => c.toLowerCase().includes(q));
      const matchComp = it.compounds?.some(c => c.toLowerCase().includes(q));
      const matchSyn = it.synonyms?.some(c => c.toLowerCase().includes(q));
      const matchAnt = it.antonyms?.some(c => c.toLowerCase().includes(q));
      const matchEx = it.examples?.some(e => e.jp.toLowerCase().includes(q) || (e.vi && e.vi.toLowerCase().includes(q)));

      return matchColloc || matchComp || matchSyn || matchAnt || matchEx;
    });
  }, [filteredItems, searchQuery]);

  const totalBrowsePages = Math.ceil(browseResults.length / ITEMS_PER_PAGE);
  const pagedBrowseItems = useMemo(() => {
    const start = (browsePage - 1) * ITEMS_PER_PAGE;
    return browseResults.slice(start, start + ITEMS_PER_PAGE);
  }, [browseResults, browsePage]);

  useEffect(() => {
    setBrowsePage((page) => Math.min(page, Math.max(1, totalBrowsePages)));
  }, [totalBrowsePages]);

  // Start study session
  const startSession = () => {
    if (filteredItems.length === 0) return;
    const orderedItems = [...filteredItems].sort((a, b) => a.stt - b.stt);
    let queue: MimikaraItem[];

    if (scopeMode === 'range') {
      // Khi chọn theo khoảng STT: học toàn bộ từ, theo thứ tự hoặc xáo trộn tùy lựa chọn.
      queue = sessionOrder === 'shuffle' ? shuffle(orderedItems) : orderedItems;
    } else {
      const count = Math.min(customCount || 20, filteredItems.length);
      queue = (sessionOrder === 'shuffle' ? shuffle(orderedItems) : orderedItems).slice(0, count);
    }

    setSessionQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setSessionFinished(false);
    setIsSessionActive(true);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTypingInput('');
    setTypingFeedback(null);
  };

  const startSessionFromItem = (targetItem: MimikaraItem) => {
    const remaining = filteredItems.filter(it => it.id !== targetItem.id);
    let queue: MimikaraItem[];

    if (sessionOrder === 'shuffle') {
      queue = [targetItem, ...shuffle(remaining)];
    } else {
      const after = remaining.filter(it => it.stt > targetItem.stt).sort((a, b) => a.stt - b.stt);
      const before = remaining.filter(it => it.stt < targetItem.stt).sort((a, b) => a.stt - b.stt);
      queue = [targetItem, ...after, ...before];
    }

    if (scopeMode !== 'range') {
      const count = Math.min(customCount || 20, filteredItems.length);
      queue = queue.slice(0, count);
    }

    setSessionQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setSessionFinished(false);
    setIsSessionActive(true);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTypingInput('');
    setTypingFeedback(null);
  };

  const currentItem = sessionQueue[currentIndex];

  // Auto-pronounce on item change
  useEffect(() => {
    if (!isSessionActive || !currentItem || !autoPronounce) return;
    const textToSpeak = currentItem.kanji || currentItem.reading;
    if (textToSpeak && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.lang = 'ja-JP';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  }, [currentIndex, isSessionActive, currentItem, autoPronounce]);

  // Generate quiz question when needed
  useEffect(() => {
    if (!isSessionActive || !currentItem) return;
    if (studyMode === 'flashcard' || studyMode === 'typing' || studyMode === 'browse') return;

    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    // Shuffle the full pool first, then remove duplicate answer text.
    const others = shuffle(items.filter((it) => it.id !== currentItem.id));

    if (studyMode === 'hanVietQuiz') {
      const isKanjiToHanViet = Math.random() > 0.35 && Boolean(currentItem.kanji && currentItem.hanViet);

      if (isKanjiToHanViet) {
        const correct = currentItem.hanViet;
        const options = createUniqueQuizOptions(correct, others.map((o) => o.hanViet || o.meaning));
        setCurrentQuiz({
          id: `quiz-hv-${currentItem.id}`,
          type: 'hanviet',
          prompt: currentItem.kanji,
          subPrompt: `Cách đọc: ${currentItem.reading}`,
          hint: 'Chọn Âm Hán Việt đúng cho chữ Kanji này',
          targetItem: currentItem,
          options,
          correctAnswer: correct,
          explanation: `${currentItem.kanji} [${currentItem.hanViet}] : ${currentItem.meaning}`,
          audioText: currentItem.kanji
        });
      } else {
        const correct = `${currentItem.kanji || currentItem.reading} (${currentItem.reading})`;
        const options = createUniqueQuizOptions(
          correct,
          others.map((o) => `${o.kanji || o.reading} (${o.reading})`)
        );
        setCurrentQuiz({
          id: `quiz-hv-rev-${currentItem.id}`,
          type: 'hanviet-rev',
          prompt: currentItem.hanViet || currentItem.meaning,
          subPrompt: `Nghĩa: ${currentItem.meaning}`,
          hint: 'Chọn từ vựng tiếng Nhật (Kanji + Hiragana) có âm Hán Việt này',
          targetItem: currentItem,
          options,
          correctAnswer: correct,
          explanation: `${currentItem.kanji || currentItem.reading} [${currentItem.hanViet}]: ${currentItem.meaning}`,
          audioText: currentItem.kanji || currentItem.reading
        });
      }
    } else if (studyMode === 'meaningQuiz') {
      const correct = currentItem.meaning;
      const options = createUniqueQuizOptions(correct, others.map((o) => o.meaning));
      setCurrentQuiz({
        id: `quiz-mean-${currentItem.id}`,
        type: 'meaning',
        prompt: currentItem.kanji || currentItem.reading,
        subPrompt: currentItem.kanji ? `${currentItem.reading} · [${currentItem.hanViet}]` : currentItem.reading,
        hint: 'Chọn ý nghĩa tiếng Việt chính xác',
        targetItem: currentItem,
        options,
        correctAnswer: correct,
        explanation: `${currentItem.kanji || currentItem.reading} : ${currentItem.meaning}`,
        audioText: currentItem.kanji || currentItem.reading
      });
    } else if (studyMode === 'readingQuiz') {
      const correct = currentItem.reading;
      const options = createUniqueQuizOptions(correct, others.map((o) => o.reading));
      setCurrentQuiz({
        id: `quiz-read-${currentItem.id}`,
        type: 'reading',
        prompt: currentItem.kanji,
        subPrompt: currentItem.hanViet ? `Âm Hán Việt: [${currentItem.hanViet}]` : `Nghĩa: ${currentItem.meaning}`,
        hint: 'Chọn cách đọc Hiragana đúng cho chữ Kanji',
        targetItem: currentItem,
        options,
        correctAnswer: correct,
        explanation: `${currentItem.kanji} đọc là「${currentItem.reading}」[${currentItem.hanViet}]`,
        audioText: currentItem.kanji
      });
    }
  }, [studyMode, currentIndex, isSessionActive, currentItem, items]);

  // Handle flashcard answer
  const handleFlashcardAnswer = (isCorrect: boolean) => {
    if (!currentItem) return;
    const key = getProgressKey(currentItem);
    const curProg = progressMap[key] || createInitialProgress();
    const updated = updateProgress(curProg, isCorrect);
    onUpdateProgress(key, updated, isCorrect);

    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));

    advanceNext();
  };

  // Handle quiz answer
  const handleSelectQuizOption = (opt: string) => {
    if (isAnswerSubmitted || !currentQuiz) return;
    setSelectedAnswer(opt);
    setIsAnswerSubmitted(true);

    const isCorrect = opt === currentQuiz.correctAnswer;
    const key = getProgressKey(currentItem);
    const curProg = progressMap[key] || createInitialProgress();
    const updated = updateProgress(curProg, isCorrect);
    onUpdateProgress(key, updated, isCorrect);

    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));
  };

  // Handle typing submit
  const handleTypingSubmit = () => {
    if (!currentItem || !typingInput.trim() || typingFeedback !== null) return;
    const targetReading = currentItem.reading.toLowerCase().trim();
    const isCorrect = checkJapaneseAnswer(typingInput, targetReading);

    setTypingFeedback(isCorrect ? 'correct' : 'wrong');
    const key = getProgressKey(currentItem);
    const curProg = progressMap[key] || createInitialProgress();
    const updated = updateProgress(curProg, isCorrect);
    onUpdateProgress(key, updated, isCorrect);

    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));
  };

  const goToNext = () => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTypingInput('');
    setTypingFeedback(null);

    if (currentIndex + 1 >= sessionQueue.length) {
      setSessionFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTypingInput('');
      setTypingFeedback(null);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const jumpToIndex = (idx: number) => {
    if (idx >= 0 && idx < sessionQueue.length) {
      setIsFlipped(false);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTypingInput('');
      setTypingFeedback(null);
      setCurrentIndex(idx);
    }
  };

  const advanceNext = goToNext;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'mimikara880.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard shortcuts (Next: ArrowRight, Lùi: ArrowLeft, Lật thẻ: Space)
  useEffect(() => {
    if (!isSessionActive || sessionFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (studyMode === 'typing' && e.key === 'Enter') {
          if (typingFeedback !== null) {
            goToNext();
          } else {
            handleTypingSubmit();
          }
        }
        return;
      }

      if (studyMode === 'flashcard') {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsFlipped((f) => !f);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (e.key === '1') {
          e.preventDefault();
          handleFlashcardAnswer(false);
        } else if (e.key === '2' || e.key === 'Enter') {
          e.preventDefault();
          handleFlashcardAnswer(true);
        }
      } else if (studyMode === 'hanVietQuiz' || studyMode === 'meaningQuiz' || studyMode === 'readingQuiz') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (!isAnswerSubmitted) {
          if (['1', '2', '3', '4'].includes(e.key) && currentQuiz) {
            const idx = parseInt(e.key, 10) - 1;
            if (currentQuiz.options[idx]) {
              handleSelectQuizOption(currentQuiz.options[idx]);
            }
          }
        } else if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          goToNext();
        }
      } else if (studyMode === 'typing') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (typingFeedback !== null) {
            goToNext();
          } else {
            handleTypingSubmit();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, sessionFinished, studyMode, isFlipped, isAnswerSubmitted, currentQuiz, typingFeedback, typingInput, currentIndex, sessionQueue]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-app-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              MIMIKARA N3
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-app-text">
              880 Từ vựng Mimikara Oboeru N3
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-app-muted mt-1">
            Tổng hợp 880 từ vựng cốt lõi kèm Âm Hán Việt, phân loại theo 15 Unit, Cụm từ liên kết và Câu ví dụ song ngữ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onReloadDatabase && (
            <button
              type="button"
              onClick={handleReloadDatabase}
              disabled={isReloading}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-white hover:bg-amber-600 rounded border border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              title="Xóa cache dữ liệu cũ trong IndexedDB và nạp lại 880 từ Mimikara sạch từ JSON chuẩn"
            >
              <RefreshIcon size={14} className={isReloading ? 'animate-spin' : ''} />
              <span>{isReloading ? 'Đang nạp...' : 'Nạp lại Database gốc'}</span>
            </button>
          )}
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-medium text-app-accent hover:text-white hover:bg-app-accent rounded border border-app-accent/30 bg-app-surface transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Tải toàn bộ 880 từ vựng Mimikara N3 định dạng JSON"
          >
            <span>Xuất JSON (880 từ)</span>
          </button>
          {isSessionActive && (
            <button
              onClick={() => setIsSessionActive(false)}
              className="px-3 py-1.5 text-xs font-medium text-app-muted hover:text-app-text rounded border border-app-border bg-app-surface transition-colors cursor-pointer"
            >
              ← Thoát phiên học
            </button>
          )}
        </div>
      </div>

      {/* Mode navigation / Setup if not in session */}
      {!isSessionActive && (
        <div className="space-y-6">
          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block">Tổng số từ</span>
              <span className="text-xl font-semibold text-app-text mt-0.5 block">{statsOverview.total}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block">Chưa học</span>
              <span className="text-xl font-semibold text-amber-600 dark:text-amber-400 mt-0.5 block">{statsOverview.unlearned}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block">Đã học</span>
              <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{statsOverview.learned}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-app-surface border border-app-border">
              <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block">Đã đánh dấu ⭐</span>
              <span className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mt-0.5 block">{statsOverview.starred}</span>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="border-b border-app-border flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            {[
              { id: 'flashcard', label: 'Thẻ Flashcard' },
              { id: 'hanVietQuiz', label: 'Đố Âm Hán Việt' },
              { id: 'meaningQuiz', label: 'Trắc nghiệm Ý nghĩa' },
              { id: 'readingQuiz', label: 'Trắc nghiệm Hiragana' },
              { id: 'typing', label: 'Gõ từ' },
              { id: 'browse', label: 'Tra cứu & Danh sách (880)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStudyMode(tab.id as StudyModeMimikara)}
                className={`pb-2.5 px-2 font-medium transition-all relative ${studyMode === tab.id
                  ? 'text-app-text border-b-2 border-app-accent font-semibold'
                  : 'text-app-muted hover:text-app-text'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Browse mode is rendered directly if selected */}
          {studyMode === 'browse' ? (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-app-surface p-3.5 rounded-lg border border-app-border">
                <div className="relative flex-1">
                  <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setBrowsePage(1);
                    }}
                    placeholder="Tìm theo Kanji, Hiragana, Âm Hán Việt (vd: NAM TÍNH), Nghĩa, Cụm từ, Ví dụ, hoặc STT..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded border border-app-border bg-app-bg text-app-text focus:outline-none focus:border-app-accent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-app-muted hover:text-app-text"
                    >
                      Xoá
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Scope Mode switch */}
                  <div className="flex items-center bg-app rounded border border-app-border p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setScopeMode('unit')}
                      className={`px-2 py-1 rounded ${scopeMode === 'unit' ? 'bg-app-surface text-app-text font-semibold shadow-sm' : 'text-app-muted'}`}
                    >
                      Theo Unit
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeMode('range')}
                      className={`px-2 py-1 rounded ${scopeMode === 'range' ? 'bg-app-surface text-app-text font-semibold shadow-sm' : 'text-app-muted'}`}
                    >
                      Theo STT
                    </button>
                  </div>

                  {scopeMode === 'unit' ? (
                    <select
                      value={selectedUnit}
                      onChange={(e) => {
                        setSelectedUnit(e.target.value);
                        setBrowsePage(1);
                      }}
                      className="text-xs sm:text-sm py-2 px-2.5 rounded border border-app-border bg-app-bg text-app-text focus:outline-none font-jp"
                    >
                      <option value="all">Tất cả Unit ({mimikaraUnits.length} Unit)</option>
                      {mimikaraUnits.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs">
                      <input
                        type="number"
                        min={1}
                        max={880}
                        value={rangeFrom}
                        onChange={(e) => { setRangeFrom(Math.max(1, parseInt(e.target.value) || 1)); setBrowsePage(1); }}
                        className="w-14 px-1.5 py-1.5 rounded border border-app-border bg-app text-center font-mono"
                      />
                      <span>→</span>
                      <input
                        type="number"
                        min={1}
                        max={880}
                        value={rangeTo}
                        onChange={(e) => { setRangeTo(Math.min(880, parseInt(e.target.value) || 880)); setBrowsePage(1); }}
                        className="w-14 px-1.5 py-1.5 rounded border border-app-border bg-app text-center font-mono"
                      />
                    </div>
                  )}

                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value as any);
                      setBrowsePage(1);
                    }}
                    className="text-xs sm:text-sm py-2 px-2.5 rounded border border-app-border bg-app-bg text-app-text focus:outline-none"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="unlearned">Chưa học</option>
                    <option value="learned">Đã học</option>
                    <option value="starred">Đã đánh dấu ⭐</option>
                  </select>
                </div>
              </div>

              {/* Table / List */}
              <div className="rounded-lg border border-app-border bg-app-surface overflow-hidden">
                <div className="px-4 py-2.5 border-b border-app-border bg-app-bg/50 flex items-center justify-between text-xs text-app-muted">
                  <span>Hiển thị {browseResults.length} từ vựng</span>
                  <span>Trang {browsePage} / {totalBrowsePages || 1}</span>
                </div>

                <div className="divide-y divide-app-border">
                  {pagedBrowseItems.map((item) => {
                    const p = progressMap[getProgressKey(item)] || createInitialProgress();
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedDetailItem(item)}
                        className="p-3.5 sm:p-4 hover:bg-app-bg/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-10 text-xs font-mono text-app-muted shrink-0 font-medium">
                            #{item.stt}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base sm:text-lg font-japanese font-normal text-app-text">
                                {item.kanji || item.reading}
                              </span>
                              {item.kanji && (
                                <span className="text-xs text-app-accent font-japanese">
                                  【{item.reading}】
                                </span>
                              )}
                              {item.hanViet && (
                                <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  {item.hanViet}
                                </span>
                              )}
                              {item.unit && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                                  {item.unit}
                                </span>
                              )}
                              {item.usage && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                  {item.usage}
                                </span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-app-text mt-0.5 truncate max-w-xl">
                              {item.meaning}
                            </div>
                            {item.examples && item.examples.length > 0 && (
                              <div className="text-[11px] text-app-muted truncate mt-0.5 font-jp">
                                Ví dụ: {item.examples[0].jp}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {p.box > 0 && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-app-bg border border-app-border text-app-muted">
                              Hộp {p.box}
                            </span>
                          )}
                          <AudioButton text={item.kanji || item.reading} size="sm" showText={false} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStar(item);
                            }}
                            className="p-1 text-app-muted hover:text-amber-500"
                            title={p.starred ? 'Bỏ đánh dấu' : 'Đánh dấu sao'}
                          >
                            <StarIcon size={16} filled={p.starred} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalBrowsePages > 1 && (
                  <div className="p-3 border-t border-app-border flex items-center justify-between text-xs text-app-muted bg-app-bg/30">
                    <button
                      onClick={() => setBrowsePage((p) => Math.max(1, p - 1))}
                      disabled={browsePage === 1}
                      className="px-3 py-1 rounded border border-app-border hover:bg-app-surface disabled:opacity-40"
                    >
                      ← Trang trước
                    </button>
                    <span>
                      {browsePage} / {totalBrowsePages}
                    </span>
                    <button
                      onClick={() => setBrowsePage((p) => Math.min(totalBrowsePages, p + 1))}
                      disabled={browsePage >= totalBrowsePages}
                      className="px-3 py-1 rounded border border-app-border hover:bg-app-surface disabled:opacity-40"
                    >
                      Trang sau →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Setup box for Study modes (Flashcard, Quizzes, Typing) */
            <div className="p-6 rounded-xl border border-app-border bg-app-surface space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold text-app-text">
                  Thiết lập phiên học {studyMode === 'flashcard' ? 'Flashcard' : studyMode === 'typing' ? 'Gõ từ' : 'Trắc nghiệm'}
                </h3>
                <p className="text-xs text-app-muted mt-1">
                  Chọn Unit hoặc khoảng Số thứ tự (STT) để bắt đầu phiên học tập trung.
                </p>
              </div>

              {/* Scope Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-app-muted uppercase tracking-wider block">
                  1. Chọn phạm vi học tập
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScopeMode('unit')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border notebook-fade ${scopeMode === 'unit'
                      ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                      : 'border-app-border bg-app text-app-muted hover:text-app-text'
                      }`}
                  >
                    Học theo Unit (15 Unit)
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeMode('range')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border notebook-fade ${scopeMode === 'range'
                      ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                      : 'border-app-border bg-app text-app-muted hover:text-app-text'
                      }`}
                  >
                    Học theo khoảng STT (1 - 880)
                  </button>
                </div>

                {scopeMode === 'unit' ? (
                  <div className="pt-1">
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-app-border bg-app text-sm text-app-text focus:outline-none focus:border-app-accent font-jp"
                    >
                      <option value="all">-- Tất cả 15 Unit (Toàn bộ 880 từ) --</option>
                      {mimikaraUnits.map((u) => {
                        const count = items.filter(it => it.unit === u).length;
                        return (
                          <option key={u} value={u}>
                            {u} ({count} từ)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-app-border bg-app space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] text-app-muted block mb-1">Từ STT:</label>
                        <input
                          type="number"
                          min={1}
                          max={880}
                          value={rangeFrom}
                          onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text font-mono font-medium focus:outline-none focus:border-app-accent"
                        />
                      </div>
                      <span className="text-app-muted pt-5 font-bold">→</span>
                      <div className="flex-1">
                        <label className="text-[11px] text-app-muted block mb-1">Đến STT:</label>
                        <input
                          type="number"
                          min={1}
                          max={880}
                          value={rangeTo}
                          onChange={(e) => setRangeTo(Math.min(880, parseInt(e.target.value) || 880))}
                          className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text font-mono font-medium focus:outline-none focus:border-app-accent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {[
                        { label: '1 - 50', from: 1, to: 50 },
                        { label: '51 - 100', from: 51, to: 100 },
                        { label: '101 - 200', from: 101, to: 200 },
                        { label: '201 - 350', from: 201, to: 350 },
                        { label: '351 - 500', from: 351, to: 500 },
                        { label: '501 - 700', from: 501, to: 700 },
                        { label: '701 - 880', from: 701, to: 880 }
                      ].map(pill => (
                        <button
                          key={pill.label}
                          type="button"
                          onClick={() => {
                            setRangeFrom(pill.from);
                            setRangeTo(pill.to);
                          }}
                          className="px-2.5 py-1 text-xs rounded-md border border-app-border hover:bg-app-surface text-app-muted hover:text-app-text"
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-app-muted uppercase tracking-wider block">
                  2. Trạng thái học tập
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Tất cả từ' },
                    { id: 'unlearned', label: 'Chưa học' },
                    { id: 'learned', label: 'Đã học' },
                    { id: 'starred', label: 'Đã đánh dấu ⭐' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStatus(st.id as any)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${selectedStatus === st.id
                        ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                        }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count selection (chỉ hiện khi không chọn theo khoảng STT) */}
              {scopeMode !== 'range' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-app-muted uppercase tracking-wider">
                    <span>3. Số lượng từ mỗi phiên</span>
                    <span className="text-app-accent normal-case font-medium">
                      (Có {filteredItems.length} từ phù hợp phạm vi)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 30, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setCustomCount(num);
                          if (onUpdateCardsPerSession) onUpdateCardsPerSession(num);
                        }}
                        className={`py-2 rounded-lg border text-xs font-medium text-center transition-all ${customCount === num
                          ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                          : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                          }`}
                      >
                        {num} từ
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Session order */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-app-muted uppercase tracking-wider">
                  <span>{scopeMode === 'range' ? '3' : '4'}. Thứ tự xuất hiện</span>
                  <span className="text-app-accent normal-case font-medium">
                    {sessionOrder === 'shuffle' ? 'Mỗi phiên là một thứ tự mới' : 'Tăng dần theo STT'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSessionOrder('sequential')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${sessionOrder === 'sequential'
                      ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                      : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                      }`}
                  >
                    Theo thứ tự STT
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionOrder('shuffle')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${sessionOrder === 'shuffle'
                      ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                      : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                      }`}
                  >
                    <RefreshIcon size={14} />
                    Xáo trộn
                  </button>
                </div>
              </div>

              {/* Action Start */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={startSession}
                  disabled={filteredItems.length === 0}
                  className="w-full py-3.5 px-6 rounded-xl bg-app-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {scopeMode === 'range'
                      ? `Bắt đầu học (${filteredItems.length} từ: STT ${Math.min(rangeFrom, rangeTo)} - ${Math.max(rangeFrom, rangeTo)})`
                      : `Bắt đầu học (${Math.min(customCount, filteredItems.length)} từ)`
                    }
                  </span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Danh sách từ vựng Mimikara trong phạm vi đã chọn */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-app-text text-base">
                    Danh sách từ Mimikara
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-app-accent-subtle text-app-accent font-medium">
                    {filteredItems.length} từ phù hợp
                  </span>
                </div>
                <p className="text-xs text-app-muted mt-0.5">
                  Xem nhanh nội dung, âm Hán Việt, cách đọc, hoặc bấm &quot;Học ngay&quot; để bắt đầu từ từ bất kỳ
                </p>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setBrowsePage(1);
                  }}
                  placeholder="Tìm từ vựng, kanji, nghĩa..."
                  aria-label="Tìm trong danh sách Mimikara"
                  className="w-full h-9 px-3 rounded-lg border border-app-border bg-app text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
                />
              </div>
            </div>

            <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1 overscroll-contain">
              {browseResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-app-muted">
                  Không tìm thấy từ vựng nào phù hợp với từ khóa tìm kiếm.
                </div>
              ) : (
                pagedBrowseItems.map((item) => {
                  const progKey = getProgressKey(item);
                  const isStarred = progressMap[progKey]?.starred;
                  const box = progressMap[progKey]?.box || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-app-border/80 bg-app hover:border-app-accent/60 transition-all flex items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <span className="text-[11px] font-mono font-bold text-app-muted">
                            #{item.stt}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleStar(item)}
                            className={`mt-1 p-1 rounded hover:bg-app-surface transition-colors cursor-pointer ${isStarred ? 'text-amber-500' : 'text-app-muted/40 hover:text-amber-500'
                              }`}
                            title={isStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao'}
                            aria-label={isStarred ? `Bỏ đánh dấu ${item.kanji || item.reading}` : `Đánh dấu ${item.kanji || item.reading}`}
                          >
                            <StarIcon size={14} filled={Boolean(isStarred)} />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-jp text-base font-medium text-app-text">
                              {item.kanji || item.reading}
                            </span>
                            {item.kanji && (
                              <span className="text-xs font-jp text-app-accent">
                                【{item.reading}】
                              </span>
                            )}
                            {item.hanViet && (
                              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                [{item.hanViet}]
                              </span>
                            )}
                            {item.unit && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                {item.unit}
                              </span>
                            )}
                            {box > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Hộp {box}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-app-muted line-clamp-2">
                            {item.meaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                        <AudioButton text={item.kanji || item.reading} size="sm" showText={false} />
                        <button
                          type="button"
                          onClick={() => startSessionFromItem(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-app-border bg-app-surface hover:bg-app-accent hover:text-white text-app-text text-xs font-medium notebook-fade flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Bắt đầu học từ mục này"
                        >
                          <span>Học ngay</span>
                          <ArrowRightIcon size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {totalBrowsePages > 1 && (
              <div className="pt-3 border-t border-app-border flex items-center justify-between gap-3 text-xs text-app-muted">
                <button
                  type="button"
                  onClick={() => setBrowsePage((page) => Math.max(1, page - 1))}
                  disabled={browsePage === 1}
                  className="px-3 py-2 rounded-lg border border-app-border bg-app hover:border-app-accent disabled:opacity-40"
                >
                  ← Trang trước
                </button>
                <span aria-live="polite">
                  Trang <strong className="text-app-text">{browsePage}</strong> / {totalBrowsePages}
                </span>
                <button
                  type="button"
                  onClick={() => setBrowsePage((page) => Math.min(totalBrowsePages, page + 1))}
                  disabled={browsePage >= totalBrowsePages}
                  className="px-3 py-2 rounded-lg border border-app-border bg-app hover:border-app-accent disabled:opacity-40"
                >
                  Trang sau →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Session Mode */}
      {isSessionActive && (
        <div>
          {sessionFinished ? (
            /* Finished Session Screen */
            <div className="p-8 sm:p-12 rounded-xl border border-app-border bg-app-surface text-center space-y-4 shadow-sm animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckIcon size={24} />
              </div>
              <h2 className="text-xl font-bold font-serif text-app-text">
                Hoàn thành phiên học Mimikara!
              </h2>
              <p className="text-xs sm:text-sm text-app-muted max-w-md mx-auto">
                Bạn đã hoàn thành phiên ôn tập {sessionQueue.length} từ vựng. Hệ thống đã cập nhật tiến độ Spaced Repetition (SRS) vào cơ sở dữ liệu.
              </p>

              <div className="flex justify-center gap-4 py-3">
                <div className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium block">Thuộc / Đúng</span>
                  <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{sessionStats.correct}</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <span className="text-xs text-red-700 dark:text-red-300 font-medium block">Cần ôn lại</span>
                  <span className="text-lg font-bold text-red-800 dark:text-red-200">{sessionStats.wrong}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={startSession}
                  className="px-4 py-2 rounded-lg bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Học tiếp phiên mới
                </button>
                <button
                  onClick={() => setIsSessionActive(false)}
                  className="px-4 py-2 rounded-lg border border-app-border text-app-text text-xs sm:text-sm hover:bg-app-bg transition-colors"
                >
                  Quay lại menu
                </button>
              </div>
            </div>
          ) : (
            /* During Active Session */
            <div className="space-y-4">
              {/* Progress Bar & Counter */}
              <div className="flex items-center justify-between text-xs text-app-muted">
                <div className="flex items-center gap-2">
                  <span>Thẻ {currentIndex + 1} / {sessionQueue.length}</span>
                  {currentItem?.unit && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                      {currentItem.unit}
                    </span>
                  )}
                </div>
                <span className="font-mono">
                  Đúng: <strong className="text-emerald-600">{sessionStats.correct}</strong> | Sai: <strong className="text-red-500">{sessionStats.wrong}</strong>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-app-border overflow-hidden">
                <div
                  className="h-full bg-app-accent transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / sessionQueue.length) * 100}%` }}
                />
              </div>

              {/* Quick Navigation Control Bar */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2 rounded-xl bg-app border border-app-border text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-app-border bg-app-surface text-app-text hover:border-app-accent disabled:opacity-30 disabled:hover:border-app-border font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Lùi về thẻ trước (Phím ←)"
                >
                  <ArrowLeftIcon size={14} />
                  <span>Lùi (←)</span>
                </button>

                <div className="order-3 sm:order-none w-full sm:w-auto flex items-center justify-center gap-2">
                  <span className="text-xs text-app-muted">
                    Thẻ <strong className="text-app-text font-bold">{currentIndex + 1}</strong> / {sessionQueue.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSessionList(prev => !prev)}
                    className="text-xs px-2.5 py-1 rounded-md border border-app-border bg-app-surface text-app-accent hover:bg-app-accent hover:text-white font-medium transition-all cursor-pointer"
                  >
                    {showSessionList ? 'Ẩn danh sách' : '📋 Xem danh sách từ'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentIndex + 1 >= sessionQueue.length}
                  className="px-3 py-1.5 rounded-lg border border-app-border bg-app-surface text-app-text hover:border-app-accent disabled:opacity-30 disabled:hover:border-app-border font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Chuyển sang thẻ tiếp theo (Phím →)"
                >
                  <span>Next (→)</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>

              {/* 1. Flashcard Mode */}
              {studyMode === 'flashcard' && currentItem && (
                <div className="space-y-4">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer min-h-[300px] sm:min-h-[340px] p-6 sm:p-8 rounded-2xl border border-app-border bg-app-surface text-center flex flex-col items-center justify-center transition-all shadow-sm hover:border-app-accent/60 relative"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <AudioButton text={currentItem.kanji || currentItem.reading} size="sm" showText={false} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(currentItem);
                        }}
                        className="text-app-muted hover:text-amber-500 p-1"
                      >
                        <StarIcon size={18} filled={Boolean(progressMap[getProgressKey(currentItem)]?.starred)} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
                      <span className="text-xs font-mono text-app-muted uppercase tracking-wider">
                        STT #{currentItem.stt}
                      </span>
                      {currentItem.unit && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                          {currentItem.unit}
                        </span>
                      )}
                      {currentItem.usage && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {currentItem.usage}
                        </span>
                      )}
                    </div>

                    {/* Front side */}
                    <div className="text-4xl sm:text-5xl font-japanese font-light tracking-wide text-app-text mb-2">
                      {currentItem.kanji || currentItem.reading}
                    </div>

                    {currentItem.hanViet && (
                      <div className="mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded text-sm font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {currentItem.hanViet}
                        </span>
                      </div>
                    )}

                    {!isFlipped ? (
                      <p className="text-xs text-app-muted mt-4">
                        (Nhấp chuột hoặc bấm phím <kbd className="px-1.5 py-0.5 rounded bg-app-bg border border-app-border font-mono">Space</kbd> để lật thẻ)
                      </p>
                    ) : (
                      /* Back side */
                      <div className="space-y-3.5 pt-4 border-t border-app-border w-full max-w-lg text-left animate-fade-in">
                        {currentItem.kanji && (
                          <div>
                            <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block mb-0.5">Cách đọc</span>
                            <span className="text-lg font-japanese text-app-accent font-normal">
                              【{currentItem.reading}】
                            </span>
                          </div>
                        )}

                        <div>
                          <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block mb-0.5">Ý nghĩa</span>
                          <span className="text-base font-medium text-app-text">
                            {currentItem.meaning}
                          </span>
                        </div>

                        {/* Collocations */}
                        {currentItem.collocations && currentItem.collocations.length > 0 && (
                          <div>
                            <span className="text-[11px] font-medium text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                              Cụm từ liên kết / Đi kèm
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {currentItem.collocations.map((c, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-jp"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Compounds */}
                        {currentItem.compounds && currentItem.compounds.length > 0 && (
                          <div>
                            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wider block mb-1">
                              Từ ghép
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {currentItem.compounds.map((comp, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-jp"
                                >
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Synonyms / Antonyms */}
                        {(currentItem.synonyms?.length || currentItem.antonyms?.length) ? (
                          <div className="flex flex-wrap gap-3">
                            {currentItem.synonyms && currentItem.synonyms.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-semibold text-emerald-600 block">Đồng nghĩa</span>
                                <div className="flex flex-wrap gap-1">
                                  {currentItem.synonyms.map((s, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200 font-jp">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {currentItem.antonyms && currentItem.antonyms.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-semibold text-rose-600 block">Trái nghĩa</span>
                                <div className="flex flex-wrap gap-1">
                                  {currentItem.antonyms.map((a, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200 font-jp">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {/* Examples */}
                        {currentItem.examples && currentItem.examples.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-app-border/40">
                            <span className="text-[11px] font-medium text-app-muted uppercase tracking-wider block">
                              Ví dụ song ngữ:
                            </span>
                            {currentItem.examples.map((ex, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg border border-app-border bg-app space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="text-xs sm:text-sm font-jp text-app-text font-normal leading-relaxed">
                                    {ex.jp}
                                  </div>
                                  <AudioButton text={ex.jp} size="sm" showText={false} />
                                </div>
                                {ex.vi && (
                                  <div className="text-[11px] text-app-muted">
                                    {ex.vi}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {isFlipped && (
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => handleFlashcardAnswer(false)}
                        className="flex-1 py-3 px-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-medium text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CloseIcon size={16} />
                        <span>Chưa thuộc (← / 1)</span>
                      </button>
                      <button
                        onClick={() => handleFlashcardAnswer(true)}
                        className="flex-1 py-3 px-4 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckIcon size={16} />
                        <span>Đã thuộc (→ / 2)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Quiz Mode (Hán Việt / Meaning / Reading) */}
              {(studyMode === 'hanVietQuiz' || studyMode === 'meaningQuiz' || studyMode === 'readingQuiz') && currentQuiz && (
                <div className="p-6 sm:p-8 rounded-xl border border-app-border bg-app-surface space-y-6 shadow-sm">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-mono text-app-muted">STT #{currentItem.stt}</span>
                      {currentItem.unit && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                          {currentItem.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-3xl sm:text-4xl font-japanese font-light text-app-text">
                      {currentQuiz.prompt}
                    </div>
                    {currentQuiz.subPrompt && (
                      <div className="text-xs sm:text-sm text-app-muted font-japanese">
                        {currentQuiz.subPrompt}
                      </div>
                    )}
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                      {currentQuiz.hint}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5 max-w-lg mx-auto pt-2">
                    {currentQuiz.options.map((opt, idx) => {
                      let btnStyle = 'border-app-border bg-app-bg/50 hover:bg-app-bg text-app-text';
                      if (isAnswerSubmitted) {
                        if (opt === currentQuiz.correctAnswer) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium';
                        } else if (opt === selectedAnswer) {
                          btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300';
                        } else {
                          btnStyle = 'opacity-40 border-app-border text-app-muted';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectQuizOption(opt)}
                          className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-app-border flex items-center justify-center text-[10px] text-app-muted font-mono">
                              {idx + 1}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswerSubmitted && opt === currentQuiz.correctAnswer && (
                            <CheckIcon size={16} className="text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && opt === selectedAnswer && opt !== currentQuiz.correctAnswer && (
                            <CloseIcon size={16} className="text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback and next button */}
                  {isAnswerSubmitted && (
                    <div className="pt-4 border-t border-app-border space-y-3 animate-fade-in">
                      <div className="p-3.5 rounded-xl border border-app-border bg-app space-y-1.5 text-left text-xs">
                        <div className="font-semibold text-app-text">
                          Giải thích chi tiết:
                        </div>
                        <div className="text-app-text whitespace-pre-line leading-relaxed">
                          {currentQuiz.explanation}
                        </div>
                        {currentItem.examples && currentItem.examples.length > 0 && (
                          <div className="pt-1 text-app-muted border-t border-app-border/40 font-jp">
                            <span className="text-app-text mr-1.5">{currentItem.examples[0].jp}</span>
                            <span>({currentItem.examples[0].vi})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          onClick={advanceNext}
                          className="px-6 py-2.5 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-semibold hover:opacity-90 flex items-center gap-2 shadow-sm"
                        >
                          <span>Từ tiếp theo (Enter)</span>
                          <ArrowRightIcon size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Typing Mode */}
              {studyMode === 'typing' && currentItem && (
                <div className="p-6 sm:p-8 rounded-xl border border-app-border bg-app-surface text-center space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-mono text-app-muted">STT #{currentItem.stt}</span>
                      {currentItem.unit && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                          {currentItem.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-4xl font-japanese font-light text-app-text">
                      {currentItem.kanji || currentItem.meaning}
                    </div>
                    {currentItem.hanViet && (
                      <div className="text-xs text-app-muted">
                        Âm Hán Việt: <span className="font-semibold text-indigo-600 dark:text-indigo-400">[{currentItem.hanViet}]</span>
                      </div>
                    )}
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                      Hãy gõ cách đọc Hiragana (hỗ trợ gõ Romaji tự chuyển sang Kana):
                    </div>
                  </div>

                  {/* Kana Input field */}
                  <div className="max-w-md mx-auto">
                    <KanaInput
                      value={typingInput}
                      onChange={(val) => setTypingInput(val)}
                      placeholder="Gõ cách đọc hiragana..."
                      autoFocus
                      disabled={typingFeedback !== null}
                    />

                    {/* Feedback */}
                    {typingFeedback !== null && (
                      <div role="status" aria-live="polite" className="mt-3 p-3.5 rounded-xl border text-xs sm:text-sm animate-fade-in text-left space-y-1.5">
                        {typingFeedback === 'correct' ? (
                          <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                            <CheckIcon size={16} /> Chính xác!
                          </span>
                        ) : (
                          <div className="space-y-1 text-red-600">
                            <div className="font-medium flex items-center gap-1.5">
                              <CloseIcon size={16} /> Chưa chính xác.
                            </div>
                            <div className="text-xs text-app-text">
                              Đáp án đúng: <strong className="font-japanese text-sm">{currentItem.reading}</strong>
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-app-muted pt-1 border-t border-app-border/40">
                          <strong>Ý nghĩa:</strong> {currentItem.meaning}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    {typingFeedback === null ? (
                      <button
                        onClick={handleTypingSubmit}
                        disabled={!typingInput.trim()}
                        className="px-6 py-2.5 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shadow-sm"
                      >
                        Kiểm tra (Enter)
                      </button>
                    ) : (
                      <button
                        onClick={advanceNext}
                        className="px-6 py-2.5 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 mx-auto"
                      >
                        <span>Từ tiếp theo (Enter)</span>
                        <ArrowRightIcon size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Session Item List Panel */}
              <div className="mt-8 border border-app-border rounded-xl bg-app-surface overflow-hidden shadow-sm">
                <div className="p-3.5 bg-app border-b border-app-border flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-app-text flex items-center gap-1.5">
                      <span>📋</span> Danh sách từ trong phiên học ({sessionQueue.length} từ)
                    </span>
                    <span className="text-xs text-app-muted">
                      · Nhấp vào từ để nhảy nhanh đến thẻ đó
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSessionList(prev => !prev)}
                    className="text-xs text-app-accent hover:underline font-medium cursor-pointer"
                  >
                    {showSessionList ? 'Thu gọn ▲' : 'Mở rộng ▼'}
                  </button>
                </div>

                {showSessionList && (
                  <div className="max-h-80 overflow-y-auto divide-y divide-app-border/50">
                    {sessionQueue.map((item, idx) => {
                      const isCurrent = idx === currentIndex;
                      const p = progressMap[getProgressKey(item)];
                      return (
                        <div
                          key={item.id || idx}
                          onClick={() => jumpToIndex(idx)}
                          className={`p-3 text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors ${isCurrent
                            ? 'bg-app-accent/10 border-l-4 border-l-app-accent font-medium'
                            : 'hover:bg-app/70 bg-app-surface'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${isCurrent
                              ? 'bg-app-accent text-white font-bold'
                              : 'bg-app border border-app-border text-app-muted'
                              }`}>
                              {idx + 1}
                            </span>
                            <span className="text-xs text-app-muted font-mono shrink-0">
                              #{item.stt}
                            </span>
                            <span className="font-jp text-sm text-app-text font-normal truncate">
                              {item.kanji || item.reading}
                            </span>
                            {item.kanji && (
                              <span className="text-xs text-app-muted font-jp shrink-0">
                                【{item.reading}】
                              </span>
                            )}
                            {item.hanViet && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold shrink-0">
                                {item.hanViet}
                              </span>
                            )}
                            <span className="text-xs text-app-muted truncate hidden sm:inline">
                              - {item.meaning}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isCurrent && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-app-accent text-white font-medium animate-pulse">
                                Đang học ▶
                              </span>
                            )}
                            {p?.starred && (
                              <StarIcon size={14} filled={true} className="text-amber-500 fill-amber-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Word Detail Modal in Browse */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl max-h-[88vh] overflow-y-auto bg-app-surface border border-app-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-app-border pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-app-muted">STT #{selectedDetailItem.stt}</span>
                  {selectedDetailItem.unit && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                      {selectedDetailItem.unit}
                    </span>
                  )}
                  {selectedDetailItem.usage && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {selectedDetailItem.usage}
                    </span>
                  )}
                </div>

                <div className="text-3xl font-japanese font-light text-app-text mt-1.5">
                  {selectedDetailItem.kanji || selectedDetailItem.reading}
                </div>
                {selectedDetailItem.kanji && (
                  <div className="text-sm font-japanese text-app-accent mt-0.5">
                    【{selectedDetailItem.reading}】
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="text-app-muted hover:text-app-text p-1.5 rounded-lg border border-app-border"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {selectedDetailItem.hanViet && (
                <div>
                  <span className="text-xs text-app-muted block font-medium uppercase tracking-wider mb-1">ÂM HÁN VIỆT</span>
                  <span className="inline-block px-2.5 py-0.5 rounded text-sm font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {selectedDetailItem.hanViet}
                  </span>
                </div>
              )}

              <div>
                <span className="text-xs text-app-muted block font-medium uppercase tracking-wider mb-1">Ý NGHĨA TIẾNG VIỆT</span>
                <div className="text-base text-app-text leading-relaxed">
                  {selectedDetailItem.meaning}
                </div>
              </div>

              {/* Collocations */}
              {selectedDetailItem.collocations && selectedDetailItem.collocations.length > 0 && (
                <div className="pt-2 border-t border-app-border/40">
                  <span className="text-xs text-teal-700 dark:text-teal-400 block font-semibold uppercase tracking-wider mb-1.5">
                    CỤM TỪ LIÊN KẾT / ĐI KÈM
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDetailItem.collocations.map((c, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-jp text-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compounds */}
              {selectedDetailItem.compounds && selectedDetailItem.compounds.length > 0 && (
                <div className="pt-2 border-t border-app-border/40">
                  <span className="text-xs text-blue-700 dark:text-blue-400 block font-semibold uppercase tracking-wider mb-1.5">
                    TỪ GHÉP
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDetailItem.compounds.map((comp, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-jp text-xs">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synonyms / Antonyms */}
              {(selectedDetailItem.synonyms?.length || selectedDetailItem.antonyms?.length) ? (
                <div className="pt-2 border-t border-app-border/40 flex flex-wrap gap-4">
                  {selectedDetailItem.synonyms && selectedDetailItem.synonyms.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase font-semibold text-emerald-600 block">Đồng nghĩa</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDetailItem.synonyms.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200 font-jp text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDetailItem.antonyms && selectedDetailItem.antonyms.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase font-semibold text-rose-600 block">Trái nghĩa</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDetailItem.antonyms.map((a, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200 font-jp text-xs">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Examples */}
              {selectedDetailItem.examples && selectedDetailItem.examples.length > 0 && (
                <div className="pt-2 border-t border-app-border/40 space-y-2">
                  <span className="text-xs text-app-muted block font-semibold uppercase tracking-wider">
                    CÂU VÍ DỤ SONG NGỮ ({selectedDetailItem.examples.length} CÂU)
                  </span>
                  <div className="space-y-2">
                    {selectedDetailItem.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-app-border bg-app space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs sm:text-sm font-jp text-app-text font-normal leading-relaxed">
                            {ex.jp}
                          </div>
                          <AudioButton text={ex.jp} size="sm" showText={false} />
                        </div>
                        {ex.vi && (
                          <div className="text-xs text-app-muted">
                            {ex.vi}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SRS status */}
              <div className="pt-2 border-t border-app-border flex items-center justify-between text-xs text-app-muted">
                <span>
                  Hộp SRS: <strong>Hộp {progressMap[getProgressKey(selectedDetailItem)]?.box || 0}</strong>
                </span>
                <span>
                  Đúng: {progressMap[getProgressKey(selectedDetailItem)]?.correct || 0} | Sai: {progressMap[getProgressKey(selectedDetailItem)]?.wrong || 0}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-app-border flex items-center justify-between">
              <AudioButton text={selectedDetailItem.kanji || selectedDetailItem.reading} size="sm" showText={true} />
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="px-5 py-2.5 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-semibold hover:opacity-90 shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-app-surface border border-app-border rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-app-text">
              Xác nhận xoá từ vựng
            </h3>
            <p className="text-xs sm:text-sm text-app-muted">
              Bạn có chắc chắn muốn xoá từ <strong>{deleteConfirmItem.kanji || deleteConfirmItem.reading}</strong> (#{deleteConfirmItem.stt}) khỏi danh sách Mimikara không? Thao tác này cũng sẽ xoá tiến độ học của từ này.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-3 py-1.5 rounded border border-app-border text-xs sm:text-sm text-app-text hover:bg-app-bg"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  onDeleteItem(deleteConfirmItem);
                  setDeleteConfirmItem(null);
                }}
                className="px-4 py-1.5 rounded bg-red-600 text-white text-xs sm:text-sm font-medium hover:bg-red-700"
              >
                Xoá từ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
