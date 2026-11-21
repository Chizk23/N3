import React, { useState, useEffect, useMemo } from 'react';
import { 
  VocabItem, 
  VocabPOS, 
  StudyModeVocab, 
  Progress, 
  QuizQuestion 
} from '../types';
import { 
  buildStudyQueue, 
  updateProgress, 
  getProgressKey 
} from '../lib/srs';
import { 
  generateVocabQuizQuestion, 
  maskVocabInExample, 
  shuffle,
  checkVietnameseAnswer 
} from '../lib/quiz';
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
  RefreshIcon 
} from './Icons';

export type VocabTypingType = 
  | 'meaning_to_kana'   // Hiện Nghĩa tiếng Việt -> Gõ Hiragana (từ vựng)
  | 'kanji_to_reading'  // Hiện Chữ Kanji -> Gõ Hiragana (cách đọc)
  | 'kanji_to_meaning'  // Hiện Chữ Kanji -> Gõ Nghĩa tiếng Việt
  | 'mixed';            // Xáo trộn ngẫu nhiên cả 3 dạng

interface VocabStudyProps {
  vocabList: VocabItem[];
  progressMap: Record<string, Progress>;
  onUpdateProgress: (key: string, updated: Progress, isCorrect: boolean) => void;
  onToggleStar: (item: VocabItem) => void;
  onReloadDatabase?: () => Promise<void>;
  initialDeck?: 'A911' | 'B349' | 'all';
  cardsPerSession?: number;
  onUpdateCardsPerSession?: (count: number) => void;
  autoPronounce?: boolean;
}

export const VocabStudy: React.FC<VocabStudyProps> = ({
  vocabList,
  progressMap,
  onUpdateProgress,
  onToggleStar,
  onReloadDatabase,
  initialDeck = 'all',
  cardsPerSession = 20,
  onUpdateCardsPerSession,
  autoPronounce = true
}) => {
  const [selectedDeck, setSelectedDeck] = useState<'A911' | 'B349' | 'all'>(initialDeck);
  const [selectedPOS, setSelectedPOS] = useState<VocabPOS | 'all'>('all');
  const [minFreq, setMinFreq] = useState<number>(0);
  const [customCount, setCustomCount] = useState<number>(cardsPerSession);
  const [studyMode, setStudyMode] = useState<StudyModeVocab>('flashcard');
  const [typingType, setTypingType] = useState<VocabTypingType>('meaning_to_kana');
  const [currentTypingDirection, setCurrentTypingDirection] = useState<'meaning_to_kana' | 'kanji_to_reading' | 'kanji_to_meaning'>('meaning_to_kana');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  const handleReloadDatabase = async () => {
    if (!onReloadDatabase) return;
    const confirm = window.confirm(
      'Bạn có chắc chắn muốn nạp lại toàn bộ 1.262 từ vựng N3 chuẩn (Bộ A 911 từ + Bộ B 351 từ) vào database không?'
    );
    if (!confirm) return;
    try {
      setIsReloading(true);
      await onReloadDatabase();
    } finally {
      setIsReloading(false);
    }
  };

  // Scope filter: All vs Range STT
  const [scopeType, setScopeType] = useState<'all' | 'range'>('all');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(50);

  const maxSTT = useMemo(() => {
    if (selectedDeck === 'B349') return 351;
    return 911;
  }, [selectedDeck]);

  useEffect(() => {
    setRangeFrom(1);
    setRangeTo(Math.min(50, maxSTT));
  }, [selectedDeck, maxSTT]);

  const quickRangePresets = useMemo(() => {
    if (selectedDeck === 'B349') {
      return [
        { label: '1 - 50', from: 1, to: 50 },
        { label: '51 - 100', from: 51, to: 100 },
        { label: '101 - 200', from: 101, to: 200 },
        { label: '201 - 351', from: 201, to: 351 }
      ];
    }
    return [
      { label: '1 - 50', from: 1, to: 50 },
      { label: '51 - 100', from: 51, to: 100 },
      { label: '101 - 200', from: 101, to: 200 },
      { label: '201 - 350', from: 201, to: 350 },
      { label: '351 - 500', from: 351, to: 500 },
      { label: '501 - 700', from: 501, to: 700 },
      { label: '701 - 911', from: 701, to: 911 }
    ];
  }, [selectedDeck]);

  const filteredVocabList = useMemo(() => {
    let list = vocabList;
    if (selectedDeck !== 'all') list = list.filter(v => v.deck === selectedDeck);
    if (selectedPOS !== 'all') list = list.filter(v => v.pos === selectedPOS);
    if (minFreq > 0) list = list.filter(v => v.freq >= minFreq);
    if (scopeType === 'range') {
      const min = Math.min(rangeFrom, rangeTo);
      const max = Math.max(rangeFrom, rangeTo);
      list = list.filter(v => v.stt >= min && v.stt <= max);
    }
    return list;
  }, [vocabList, selectedDeck, selectedPOS, minFreq, scopeType, rangeFrom, rangeTo]);

  const availableVocabCount = filteredVocabList.length;

  const [setupSearch, setSetupSearch] = useState<string>('');

  const searchedVocabList = useMemo(() => {
    const term = setupSearch.toLowerCase().trim();
    if (!term) return filteredVocabList;
    return filteredVocabList.filter(item => 
      item.word.toLowerCase().includes(term) ||
      item.reading.toLowerCase().includes(term) ||
      item.meaning.toLowerCase().includes(term) ||
      item.stt.toString() === term ||
      item.id.toLowerCase().includes(term)
    );
  }, [filteredVocabList, setupSearch]);

  useEffect(() => {
    setCustomCount(cardsPerSession);
  }, [cardsPerSession]);

  const resolveTypingDirection = (type: VocabTypingType): 'meaning_to_kana' | 'kanji_to_reading' | 'kanji_to_meaning' => {
    if (type === 'mixed') {
      const pool: ('meaning_to_kana' | 'kanji_to_reading' | 'kanji_to_meaning')[] = ['meaning_to_kana', 'kanji_to_reading', 'kanji_to_meaning'];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return type;
  };

  const [sessionQueue, setSessionQueue] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Typing state
  const [typedInput, setTypedInput] = useState<string>('');
  const [typingResult, setTypingResult] = useState<{ isCorrect: boolean; showExplanation: boolean } | null>(null);

  // Matching game
  const [matchingPairs, setMatchingPairs] = useState<{ id: string; text: string; pairId: string; type: 'left' | 'right' }[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [solvedMatchPairs, setSolvedMatchPairs] = useState<string[]>([]);

  // Session summary
  const [sessionResults, setSessionResults] = useState<{ item: VocabItem; isCorrect: boolean }[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState<boolean>(false);
  const [showSessionList, setShowSessionList] = useState<boolean>(true);

  const startSession = (onlyLeechOrStarred = false) => {
    let filtered = vocabList;
    if (selectedDeck !== 'all') {
      filtered = filtered.filter(v => v.deck === selectedDeck);
    }
    if (selectedPOS !== 'all') {
      filtered = filtered.filter(v => v.pos === selectedPOS);
    }
    if (scopeType === 'range') {
      const min = Math.min(rangeFrom, rangeTo);
      const max = Math.max(rangeFrom, rangeTo);
      filtered = filtered.filter(v => v.stt >= min && v.stt <= max);
    }

    const countToUse = customCount > 0 ? customCount : 20;
    const queue = buildStudyQueue(filtered, progressMap, countToUse, minFreq, onlyLeechOrStarred);

    if (queue.length === 0) {
      alert('Không tìm thấy từ vựng phù hợp với bộ lọc.');
      return;
    }

    setSessionQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTypedInput('');
    setTypingResult(null);
    setSessionResults([]);
    setIsSessionEnded(false);
    setIsSessionActive(true);

    if (studyMode === 'quiz') {
      setupQuizQuestion(queue[0], filtered);
    } else if (studyMode === 'matching') {
      setupMatchingGame(queue);
    } else if (studyMode === 'typing') {
      setCurrentTypingDirection(resolveTypingDirection(typingType));
    }
  };

  const startSessionFromItem = (targetItem: VocabItem) => {
    let filtered = filteredVocabList;
    const remaining = filtered.filter(v => v.id !== targetItem.id);
    const countToUse = Math.max(5, customCount);
    const queue = [targetItem, ...remaining].slice(0, countToUse);

    setSessionQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTypedInput('');
    setTypingResult(null);
    setSessionResults([]);
    setIsSessionEnded(false);
    setIsSessionActive(true);

    if (studyMode === 'quiz') {
      setupQuizQuestion(queue[0], filtered);
    } else if (studyMode === 'matching') {
      setupMatchingGame(queue);
    } else if (studyMode === 'typing') {
      setCurrentTypingDirection(resolveTypingDirection(typingType));
    }
  };

  useEffect(() => {
    if (studyMode === 'typing' && isSessionActive) {
      setCurrentTypingDirection(resolveTypingDirection(typingType));
      setTypedInput('');
      setTypingResult(null);
    }
  }, [currentIndex, isSessionActive, studyMode]);

  const setupQuizQuestion = (item: VocabItem, pool: VocabItem[]) => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    const q = generateVocabQuizQuestion(item, pool);
    setCurrentQuestion(q);
  };

  const setupMatchingGame = (items: VocabItem[]) => {
    const subset = items.slice(0, 6);
    const lefts = subset.map(v => ({ id: `l_${v.id}`, text: v.word, pairId: v.id, type: 'left' as const }));
    const rights = subset.map(v => ({ id: `r_${v.id}`, text: v.meaning.split(/[,;]/)[0], pairId: v.id, type: 'right' as const }));
    setMatchingPairs(shuffle([...lefts, ...rights]));
    setSelectedMatch(null);
    setSolvedMatchPairs([]);
  };

  const currentItem = sessionQueue[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentItem) return;
    const key = getProgressKey(currentItem);
    const currentProg = progressMap[key];
    const updated = updateProgress(currentProg, isCorrect);
    onUpdateProgress(key, updated, isCorrect);

    setSessionResults(prev => [...prev, { item: currentItem, isCorrect }]);
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex + 1 < sessionQueue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsFlipped(false);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTypedInput('');
      setTypingResult(null);

      if (studyMode === 'quiz') {
        let pool = vocabList;
        if (selectedDeck !== 'all') pool = pool.filter(v => v.deck === selectedDeck);
        setupQuizQuestion(sessionQueue[nextIdx], pool);
      }
    } else {
      setIsSessionEnded(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setIsFlipped(false);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTypedInput('');
      setTypingResult(null);

      if (studyMode === 'quiz') {
        let pool = vocabList;
        if (selectedDeck !== 'all') pool = pool.filter(v => v.deck === selectedDeck);
        setupQuizQuestion(sessionQueue[prevIdx], pool);
      }
    }
  };

  const jumpToIndex = (idx: number) => {
    if (idx >= 0 && idx < sessionQueue.length) {
      setCurrentIndex(idx);
      setIsFlipped(false);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTypedInput('');
      setTypingResult(null);

      if (studyMode === 'quiz') {
        let pool = vocabList;
        if (selectedDeck !== 'all') pool = pool.filter(v => v.deck === selectedDeck);
        setupQuizQuestion(sessionQueue[idx], pool);
      }
    }
  };

  useEffect(() => {
    if (!isSessionActive || isSessionEnded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Enter' && studyMode === 'typing' && !typingResult) {
          submitTypedAnswer();
        }
        return;
      }

      if (studyMode === 'flashcard') {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (isFlipped) {
          if (e.key === '1') handleAnswer(true);
          if (e.key === '2' || e.key === '3') handleAnswer(false);
        }
      } else if (studyMode === 'quiz') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (!isAnswerSubmitted) {
          if (['1', '2', '3', '4'].includes(e.key) && currentQuestion) {
            const optIdx = parseInt(e.key, 10) - 1;
            if (currentQuestion.options[optIdx]) {
              submitQuizOption(currentQuestion.options[optIdx]);
            }
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleAnswer(selectedOption === currentQuestion?.correctAnswer);
        }
      } else if (studyMode === 'typing') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (typingResult && e.key === 'Enter') {
          e.preventDefault();
          handleAnswer(typingResult.isCorrect);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, isSessionEnded, isFlipped, studyMode, currentQuestion, isAnswerSubmitted, selectedOption, typingResult, currentIndex, sessionQueue]);

  const submitQuizOption = (opt: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;
    setSelectedOption(opt);
    setIsAnswerSubmitted(true);
  };

  const submitTypedAnswer = () => {
    if (!currentItem || typingResult) return;
    let isCorrect = false;

    if (currentTypingDirection === 'kanji_to_meaning') {
      isCorrect = checkVietnameseAnswer(typedInput, currentItem.meaning);
    } else if (currentTypingDirection === 'meaning_to_kana') {
      isCorrect = checkJapaneseAnswer(typedInput, currentItem.reading) || checkJapaneseAnswer(typedInput, currentItem.word);
    } else {
      isCorrect = checkJapaneseAnswer(typedInput, currentItem.reading);
    }

    setTypingResult({ isCorrect, showExplanation: true });
  };

  const handleMatchCardClick = (id: string, pairId: string) => {
    if (solvedMatchPairs.includes(pairId)) return;

    if (!selectedMatch) {
      setSelectedMatch(id);
      return;
    }

    if (selectedMatch === id) {
      setSelectedMatch(null);
      return;
    }

    const firstCard = matchingPairs.find(c => c.id === selectedMatch);
    if (!firstCard) {
      setSelectedMatch(id);
      return;
    }

    if (firstCard.pairId === pairId && firstCard.type !== matchingPairs.find(c => c.id === id)?.type) {
      const newSolved = [...solvedMatchPairs, pairId];
      setSolvedMatchPairs(newSolved);
      setSelectedMatch(null);

      const targetItem = sessionQueue.find(v => v.id === pairId);
      if (targetItem) {
        const key = getProgressKey(targetItem);
        const currentProg = progressMap[key];
        onUpdateProgress(key, updateProgress(currentProg, true), true);
      }

      if (newSolved.length === Math.min(6, sessionQueue.length)) {
        setIsSessionEnded(true);
      }
    } else {
      setSelectedMatch(null);
    }
  };

  // ----------------------------------------------------
  // SETUP SCREEN
  // ----------------------------------------------------
  if (!isSessionActive) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium text-app-text tracking-tight">
              Học từ vựng N3
            </h2>
            <p className="text-sm text-app-muted mt-1">
              Chọn bộ thẻ, loại từ và hình thức học lặp lại ngắt quãng ({vocabList.length} từ có sẵn)
            </p>
          </div>

          {onReloadDatabase && (
            <button
              type="button"
              onClick={handleReloadDatabase}
              disabled={isReloading}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:text-white hover:bg-emerald-600 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 self-start sm:self-auto"
              title="Xóa cache và nạp lại toàn bộ 1.262 từ vựng N3 gốc vào IndexedDB"
            >
              <RefreshIcon size={14} className={isReloading ? 'animate-spin' : ''} />
              <span>{isReloading ? 'Đang nạp...' : 'Nạp lại 1.262 từ gốc'}</span>
            </button>
          )}
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-app-text border-b border-app-border pb-3">
            <FilterIcon size={18} className="text-app-accent" />
            <span>Thiết lập phiên học</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-app-muted font-medium">Bộ từ vựng</label>
              <select
                value={selectedDeck}
                onChange={e => setSelectedDeck(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent"
              >
                <option value="all">Tất cả bộ ({vocabList.length} từ)</option>
                <option value="A911">Bộ A (911 từ vựng)</option>
                <option value="B349">Bộ B (351 từ Kanji)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-app-muted font-medium">Loại từ</label>
              <select
                value={selectedPOS}
                onChange={e => setSelectedPOS(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent"
              >
                <option value="all">Tất cả loại từ</option>
                <option value="noun">Danh từ</option>
                <option value="verb">Động từ</option>
                <option value="adjective">Tính từ</option>
                <option value="adverb">Phó từ</option>
                <option value="katakana">Katakana</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-app-muted font-medium">Số lần xuất hiện trong đề</label>
              <select
                value={minFreq}
                onChange={e => setMinFreq(parseInt(e.target.value, 10))}
                className="w-full h-11 px-3 rounded-xl border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent"
              >
                <option value={0}>Tất cả tần suất</option>
                <option value={2}>Xuất hiện từ 2 lần</option>
                <option value={4}>Xuất hiện từ 4 lần</option>
                <option value={6}>Xuất hiện từ 6 lần</option>
              </select>
            </div>
          </div>

          {/* Scope Selector: Toàn bộ vs Theo khoảng STT */}
          <div className="space-y-3 pt-2 border-t border-app-border/40">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-app-muted font-medium">Phạm vi câu hỏi theo số thứ tự (STT)</span>
              <span className="text-app-accent font-medium">
                (Có {availableVocabCount} từ phù hợp phạm vi)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScopeType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-medium border notebook-fade ${
                  scopeType === 'all'
                    ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                    : 'border-app-border bg-app text-app-muted hover:text-app-text'
                }`}
              >
                Toàn bộ danh sách
              </button>

              <button
                type="button"
                onClick={() => setScopeType('range')}
                className={`px-4 py-2 rounded-xl text-xs font-medium border notebook-fade ${
                  scopeType === 'range'
                    ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold ring-1 ring-app-accent'
                    : 'border-app-border bg-app text-app-muted hover:text-app-text'
                }`}
              >
                Theo khoảng STT (Từ ... đến ...)
              </button>
            </div>

            {scopeType === 'range' && (
              <div className="p-4 rounded-xl border border-app-border bg-app space-y-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-app-muted block mb-1">Từ STT:</label>
                    <input
                      type="number"
                      min={1}
                      max={maxSTT}
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
                      max={maxSTT}
                      value={rangeTo}
                      onChange={(e) => setRangeTo(Math.min(maxSTT, parseInt(e.target.value) || maxSTT))}
                      className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text font-mono font-medium focus:outline-none focus:border-app-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {quickRangePresets.map(pill => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => {
                        setRangeFrom(pill.from);
                        setRangeTo(Math.min(maxSTT, pill.to));
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

          {/* Mode Selector */}
          <div className="space-y-2">
            <div className="text-xs sm:text-sm text-app-muted font-medium">Hình thức học</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
              {[
                { id: 'flashcard', title: 'Flashcard', desc: 'Lật thẻ ghi nhớ SRS' },
                { id: 'quiz', title: 'Trắc nghiệm', desc: 'Chọn 1 trong 4 đáp án' },
                { id: 'typing', title: 'Gõ đáp án', desc: 'Luyện gõ từ / đọc / nghĩa' },
                { id: 'matching', title: 'Ghép cặp', desc: 'Nối từ Kanji và nghĩa' },
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStudyMode(mode.id as StudyModeVocab)}
                  className={`p-4 rounded-xl border text-left notebook-fade ${
                    studyMode === mode.id
                      ? 'border-app-accent bg-app-accent-subtle text-app-text font-medium shadow-sm'
                      : 'border-app-border text-app-muted hover:border-app-muted hover:text-app-text bg-app-surface'
                  }`}
                >
                  <div className="font-medium text-app-text text-sm">{mode.title}</div>
                  <div className="text-xs text-app-muted mt-1">{mode.desc}</div>
                </button>
              ))}
            </div>

            {/* Sub-selector for Typing Mode */}
            {studyMode === 'typing' && (
              <div className="p-4 rounded-xl border border-app-border bg-app space-y-2.5 notebook-fade mt-2">
                <div className="text-xs sm:text-sm font-medium text-app-text">
                  Chọn hướng gõ đáp án bạn muốn luyện tập:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  {[
                    { id: 'meaning_to_kana', title: 'Hiện Nghĩa ➔ Gõ Hiragana', desc: 'Xem nghĩa tiếng Việt, gõ từ vựng tiếng Nhật' },
                    { id: 'kanji_to_reading', title: 'Hiện Kanji ➔ Gõ Hiragana', desc: 'Xem chữ Hán, gõ cách đọc Hiragana' },
                    { id: 'kanji_to_meaning', title: 'Hiện Kanji ➔ Gõ Nghĩa TV', desc: 'Xem chữ Hán, gõ nghĩa tiếng Việt' },
                    { id: 'mixed', title: 'Xáo trộn ngẫu nhiên cả 3', desc: 'Luyện phản xạ tổng hợp kết hợp 3 dạng' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTypingType(opt.id as VocabTypingType)}
                      className={`p-3 rounded-xl border text-left notebook-fade transition-all ${
                        typingType === opt.id
                          ? 'border-app-accent bg-app-surface text-app-text font-medium shadow-sm ring-1 ring-app-accent'
                          : 'border-app-border bg-app-surface/60 text-app-muted hover:text-app-text'
                      }`}
                    >
                      <div className="font-medium text-app-text">{opt.title}</div>
                      <div className="text-[11px] text-app-muted mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Count Selector */}
          <div className="space-y-2 pt-2 border-t border-app-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-app-muted font-medium">Số lượng từ muốn học phiên này</span>
              <span className="text-xs text-app-accent font-medium">Đang chọn: {customCount} từ</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[10, 20, 30, 50].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setCustomCount(cnt);
                    if (onUpdateCardsPerSession) onUpdateCardsPerSession(cnt);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                    customCount === cnt
                      ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                      : 'border-app-border bg-app hover:border-app-text text-app-text'
                  }`}
                >
                  {cnt} từ
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  const allCount = vocabList.length;
                  setCustomCount(allCount);
                  if (onUpdateCardsPerSession) onUpdateCardsPerSession(allCount);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  customCount >= vocabList.length
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                Tất cả ({vocabList.length})
              </button>

              {scopeType === 'range' && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomCount(availableVocabCount);
                    if (onUpdateCardsPerSession) onUpdateCardsPerSession(availableVocabCount);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                    customCount === availableVocabCount
                      ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                      : 'border-app-border bg-app hover:border-app-text text-app-text'
                  }`}
                >
                  Toàn bộ trong khoảng ({availableVocabCount})
                </button>
              )}

              <div className="flex items-center gap-1.5 pl-2">
                <span className="text-xs text-app-muted">Hoặc tự nhập:</span>
                <input
                  type="number"
                  min={1}
                  max={1500}
                  value={customCount}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    const safe = isNaN(val) ? 1 : Math.max(1, Math.min(1500, val));
                    setCustomCount(safe);
                    if (onUpdateCardsPerSession) onUpdateCardsPerSession(safe);
                  }}
                  style={{ color: 'var(--color-text)' }}
                  className="w-20 h-10 px-2 text-center text-sm font-medium rounded-xl border border-app-border bg-app text-app-text focus:outline-none focus:border-app-accent shadow-sm"
                />
                <span className="text-xs text-app-muted">từ</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startSession(false)}
              className="w-full sm:flex-1 h-12 px-6 rounded-xl bg-app-accent text-white text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
            >
              Bắt đầu phiên học ({customCount} từ)
            </button>

            <button
              type="button"
              onClick={() => startSession(true)}
              className="w-full sm:w-auto h-12 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-2 bg-app-surface"
            >
              <StarIcon size={16} className="text-amber-500" />
              <span>Ôn thẻ đánh dấu và hay sai</span>
            </button>
          </div>
        </div>

        {/* Danh sách từ vựng trong phạm vi đã chọn */}
        <div className="border border-app-border rounded-2xl bg-app-surface p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-app-text text-base">
                  Danh sách từ vựng
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-app-accent-subtle text-app-accent font-medium">
                  {filteredVocabList.length} từ phù hợp
                </span>
              </div>
              <p className="text-xs text-app-muted mt-0.5">
                Xem nhanh nội dung, cách đọc, nghĩa tiếng Việt, hoặc bấm &quot;Học ngay&quot; để bắt đầu từ từ bất kỳ
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={setupSearch}
                onChange={e => setSetupSearch(e.target.value)}
                placeholder="Tìm từ vựng, kana, nghĩa..."
                className="w-full h-9 px-3 rounded-lg border border-app-border bg-app text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
              />
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1 overscroll-contain">
            {searchedVocabList.length === 0 ? (
              <div className="py-8 text-center text-xs text-app-muted">
                Không tìm thấy từ vựng nào phù hợp với từ khóa tìm kiếm.
              </div>
            ) : (
              searchedVocabList.map((item) => {
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
                          className={`mt-1 p-1 rounded hover:bg-app-surface transition-colors cursor-pointer ${
                            isStarred ? 'text-amber-500' : 'text-app-muted/40 hover:text-amber-500'
                          }`}
                          title="Đánh dấu sao"
                        >
                          <StarIcon size={14} />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-jp text-base font-medium text-app-text">
                            {item.word}
                          </span>
                          {item.reading && item.reading !== item.word && (
                            <span className="text-xs font-jp text-app-accent">
                              【{item.reading}】
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-app-surface border border-app-border text-app-muted">
                            {item.deck} · {item.pos}
                          </span>
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
                      <AudioButton text={item.word} size="sm" showText={false} />
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
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUMMARY SCREEN
  // ----------------------------------------------------
  if (isSessionEnded) {
    const correctCount = sessionResults.filter(r => r.isCorrect).length;
    const totalCount = sessionResults.length;
    const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const wrongItems = sessionResults.filter(r => !r.isCorrect).map(r => r.item);

    return (
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <div className="text-2xl font-medium text-app-text">
            Hoàn thành phiên học!
          </div>
          <p className="text-sm text-app-muted mt-1">
            Kết quả: trả lời đúng {correctCount} trên {totalCount} thẻ ({percent}%)
          </p>
        </div>

        {wrongItems.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-app-border">
            <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
              Các từ cần ôn lại ({wrongItems.length})
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {wrongItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-app-border border-l-2 border-l-app-error text-xs sm:text-sm flex items-baseline justify-between bg-app">
                  <div className="space-y-0.5">
                    <span className="font-jp font-light text-base text-app-text mr-2">{item.word}</span>
                    <span className="font-jp text-app-accent">【{item.reading}】</span>
                    <div className="text-app-text mt-0.5">{item.meaning}</div>
                  </div>
                  <span className="text-app-muted text-xs">{item.pos}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-app-border">
          {wrongItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSessionQueue(wrongItems);
                setCurrentIndex(0);
                setIsFlipped(false);
                setSessionResults([]);
                setIsSessionEnded(false);
                if (studyMode === 'quiz') setupQuizQuestion(wrongItems[0], vocabList);
              }}
              className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <RefreshIcon size={15} />
              <span>Học lại các từ sai ({wrongItems.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSessionActive(false)}
            className="h-11 px-6 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90"
          >
            Quay lại danh mục
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ACTIVE STUDY SCREEN
  // ----------------------------------------------------
  const currentKey = currentItem ? getProgressKey(currentItem) : '';
  const currentProg = progressMap[currentKey];
  const isStarred = currentProg?.starred || false;

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted">
        <button
          type="button"
          onClick={() => setIsSessionActive(false)}
          className="hover:text-app-text flex items-center gap-1"
        >
          <ArrowLeftIcon size={15} />
          <span>Dừng phiên</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="font-medium">{currentIndex + 1} trên {sessionQueue.length}</span>
          {currentItem && (
            <button
              type="button"
              onClick={() => onToggleStar(currentItem)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border notebook-fade ${
                isStarred
                  ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-medium'
                  : 'border-app-border hover:border-app-muted text-app-muted'
              }`}
            >
              <StarIcon size={15} filled={isStarred} className={isStarred ? 'text-amber-500 fill-amber-500' : 'text-app-muted'} />
              <span>{isStarred ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4px Progress Bar */}
      <div className="w-full h-1.5 bg-app border border-app-border/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-app-accent notebook-fade"
          style={{ width: `${((currentIndex + 1) / sessionQueue.length) * 100}%` }}
        />
      </div>

      {/* Quick Navigation Control Bar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-app border border-app-border text-xs sm:text-sm">
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

        <div className="flex items-center gap-2">
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

      {/* FLASHCARD MODE */}
      {studyMode === 'flashcard' && currentItem && (
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[300px] border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 cursor-pointer select-none notebook-fade flex flex-col justify-between shadow-sm hover:border-app-muted transition-all"
          >
            <div className="flex items-center justify-between text-xs text-app-muted">
              <span className="uppercase tracking-wider px-2.5 py-1 rounded-md bg-app border border-app-border font-medium">
                {currentItem.pos} · #{currentItem.stt} · Đề thi: {currentItem.freq} lần
              </span>
              <AudioButton text={currentItem.word} size="sm" showText={true} />
            </div>

            {/* Front */}
            {!isFlipped ? (
              <div className="my-auto text-center space-y-3">
                <div className="text-[48px] sm:text-[58px] font-jp font-light text-app-text tracking-[0.02em] leading-tight">
                  {currentItem.word}
                </div>
                <p className="text-xs text-app-muted">
                  Bấm chuột hoặc nhấn phím Space để lật thẻ
                </p>
              </div>
            ) : (
              /* Back */
              <div className="my-auto space-y-3.5 text-center notebook-fade">
                <div className="text-[38px] sm:text-[46px] font-jp font-light text-app-text tracking-[0.02em] leading-tight">
                  {currentItem.word}
                </div>
                <div className="text-base sm:text-lg font-jp font-normal text-app-accent">
                  【{currentItem.reading}】
                </div>
                <div className="text-base sm:text-[17px] text-app-text font-normal leading-[1.6]">
                  {currentItem.meaning}
                </div>

                {currentItem.exampleJa && (
                  <div className="pt-4 border-t border-app-border/50 text-left space-y-1 mt-2">
                    <div className="flex items-start justify-between">
                      <div className="font-jp font-normal text-base sm:text-[17px] text-app-text leading-[1.8]">
                        {currentItem.exampleJa}
                      </div>
                      <AudioButton text={currentItem.exampleJa} size="sm" showText={false} />
                    </div>
                    {currentItem.exampleVi && (
                      <div className="text-sm sm:text-[15px] text-app-muted leading-[1.6]">
                        {currentItem.exampleVi}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-app-muted flex items-center justify-between pt-2 border-t border-app-border/30">
              <span>Hộp Leitner: #{currentProg?.box || 0}</span>
              <span>{isFlipped ? 'Chọn đánh giá bên dưới' : 'Thẻ chưa lật'}</span>
            </div>
          </div>

          {/* Action rating buttons */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className="h-12 rounded-xl border border-app-border hover:border-app-error text-app-error text-xs sm:text-sm font-medium notebook-fade bg-app-surface"
              >
                Chưa nhớ (phím 3)
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className="h-12 rounded-xl border border-app-border hover:border-app-muted text-app-muted text-xs sm:text-sm font-medium notebook-fade bg-app-surface"
              >
                Còn mơ hồ (phím 2)
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className="h-12 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
              >
                Nhớ rồi (phím 1)
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="w-full h-12 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium notebook-fade bg-app-surface shadow-sm"
            >
              Lật thẻ xem đáp án (Space)
            </button>
          )}
        </div>
      )}

      {/* QUIZ MODE */}
      {studyMode === 'quiz' && currentQuestion && (
        <div className="space-y-6">
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
              {currentQuestion.subPrompt}
            </div>

            <div className="text-[36px] sm:text-[44px] font-jp font-light text-app-text leading-tight">
              {currentQuestion.prompt}
            </div>

            {currentQuestion.hint && (
              <p className="text-xs sm:text-sm text-app-muted">
                {currentQuestion.hint}
              </p>
            )}

            {currentQuestion.audioText && (
              <div className="pt-1">
                <AudioButton text={currentQuestion.audioText} size="sm" showText={true} />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let borderClass = 'border-app-border text-app-text bg-app-surface hover:border-app-muted';

              if (isAnswerSubmitted) {
                if (opt === currentQuestion.correctAnswer) {
                  borderClass = 'border-app-success bg-app-surface text-app-success font-medium ring-1 ring-app-success';
                } else if (isSelected) {
                  borderClass = 'border-app-error bg-app-surface text-app-error ring-1 ring-app-error';
                } else {
                  borderClass = 'border-app-border text-app-muted opacity-50';
                }
              } else if (isSelected) {
                borderClass = 'border-app-accent border-[1.5px] bg-app-accent-subtle font-medium';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => submitQuizOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base font-jp font-normal notebook-fade flex items-center justify-between shadow-sm ${borderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-app-muted w-5 font-mono">
                      {idx + 1}.
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && opt === currentQuestion.correctAnswer && (
                    <span className="text-xs text-app-success font-medium flex items-center gap-1">
                      <CheckIcon size={14} />
                      <span>Đúng</span>
                    </span>
                  )}
                  {isAnswerSubmitted && isSelected && opt !== currentQuestion.correctAnswer && (
                    <span className="text-xs text-app-error font-medium flex items-center gap-1">
                      <CloseIcon size={14} />
                      <span>Chưa đúng</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after submit */}
          {isAnswerSubmitted && (
            <div className="border border-app-border border-l-4 border-l-app-accent rounded-xl bg-app-surface p-5 space-y-4 notebook-fade shadow-sm">
              <div className="pb-3 border-b border-app-border/50">
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium mb-1">
                  Đáp án chính xác:
                </div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl font-jp font-light text-app-text tracking-wide">
                    {currentItem ? currentItem.word : (currentQuestion.targetItem as VocabItem).word}
                  </span>
                  <span className="text-lg font-jp font-normal text-app-accent">
                    【{currentItem ? currentItem.reading : (currentQuestion.targetItem as VocabItem).reading}】
                  </span>
                  <span className="text-sm font-medium text-app-text">
                    — {currentItem ? currentItem.meaning : currentQuestion.targetItem.meaning}
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-app-text whitespace-pre-line leading-relaxed">
                {currentQuestion.explanation}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleAnswer(selectedOption === currentQuestion.correctAnswer)}
                  className="h-11 px-6 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade flex items-center gap-2"
                >
                  <span>Tiếp tục (Enter)</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TYPING MODE */}
      {studyMode === 'typing' && currentItem && (
        <div className="space-y-6">
          {/* Question Prompt Card */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 text-center space-y-4 shadow-sm">
            {/* Header Direction Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-app-accent-subtle text-app-accent border border-app-accent/20">
              {currentTypingDirection === 'meaning_to_kana' && 'NHÌN NGHĨA TIẾNG VIỆT ➔ GÕ TỪ VỰNG (HIRAGANA)'}
              {currentTypingDirection === 'kanji_to_reading' && 'NHÌN CHỮ KANJI ➔ GÕ CÁCH ĐỌC (HIRAGANA)'}
              {currentTypingDirection === 'kanji_to_meaning' && 'NHÌN CHỮ KANJI ➔ GÕ NGHĨA TIẾNG VIỆT'}
            </div>

            {/* Case 1: meaning_to_kana (Show Meaning, Hide Kanji/Reading) */}
            {currentTypingDirection === 'meaning_to_kana' && (
              <div className="space-y-3 py-2">
                <div className="text-2xl sm:text-3xl font-medium text-app-text leading-snug">
                  {currentItem.meaning}
                </div>
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
                  Loại từ: {currentItem.pos} · Đề thi: {currentItem.freq} lần
                </div>
                {currentItem.exampleJa && (
                  <div className="p-3.5 rounded-xl border border-app-border bg-app text-xs sm:text-sm text-app-muted font-jp font-normal max-w-lg mx-auto leading-relaxed">
                    <div>{maskVocabInExample(currentItem.exampleJa, currentItem.word).masked}</div>
                    {currentItem.exampleVi && <div className="text-xs text-app-muted/80 mt-1 font-sans">{currentItem.exampleVi}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Case 2: kanji_to_reading (Show Kanji, Hide Meaning/Reading) */}
            {currentTypingDirection === 'kanji_to_reading' && (
              <div className="space-y-2 py-2">
                <div className="text-[52px] sm:text-[64px] font-jp font-light text-app-text leading-tight tracking-wide">
                  {currentItem.word}
                </div>
                <div className="text-xs text-app-muted">
                  {currentItem.pos} · Đề thi: {currentItem.freq} lần
                </div>
                {currentItem.exampleJa && (
                  <p className="text-xs sm:text-sm text-app-muted font-jp font-normal pt-1 max-w-lg mx-auto">
                    {maskVocabInExample(currentItem.exampleJa, currentItem.word).masked}
                  </p>
                )}
              </div>
            )}

            {/* Case 3: kanji_to_meaning (Show Kanji, Hide Meaning) */}
            {currentTypingDirection === 'kanji_to_meaning' && (
              <div className="space-y-3 py-2">
                <div className="text-[52px] sm:text-[64px] font-jp font-light text-app-text leading-tight tracking-wide">
                  {currentItem.word}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-app-muted">{currentItem.pos} · Đề thi: {currentItem.freq} lần</span>
                  <AudioButton text={currentItem.word} size="sm" showText={false} />
                </div>
              </div>
            )}
          </div>

          {/* Input & Action Card */}
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-7 space-y-4 shadow-sm">
            {currentTypingDirection === 'kanji_to_meaning' ? (
              // Vietnamese text input
              <div className="space-y-3">
                <input
                  type="text"
                  value={typedInput}
                  onChange={e => setTypedInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!typingResult && typedInput.trim()) submitTypedAnswer();
                    }
                  }}
                  disabled={!!typingResult}
                  placeholder="Gõ nghĩa tiếng Việt của từ này..."
                  style={{ color: 'var(--color-text)' }}
                  className="w-full h-14 px-5 text-center text-lg sm:text-xl font-normal rounded-2xl border-2 border-app-border focus:border-app-accent focus:outline-none notebook-fade text-app-text caret-app-accent placeholder:text-app-muted/60 bg-app shadow-sm"
                  autoFocus
                />
                <div className="text-xs text-app-muted text-center">
                  Gõ bằng bàn phím tiếng Việt bình thường (tự động so khớp linh hoạt)
                </div>
              </div>
            ) : (
              // KanaInput (Romaji -> Kana)
              <KanaInput
                value={typedInput}
                onChange={setTypedInput}
                onSubmit={submitTypedAnswer}
                disabled={!!typingResult}
                placeholder={
                  currentTypingDirection === 'meaning_to_kana'
                    ? 'Gõ từ tiếng Nhật bằng romaji (vi du: eiyou -> えいよう)...'
                    : 'Gõ cách đọc bằng romaji (vi du: eiyou -> えいよう)...'
                }
                hintText={
                  currentTypingDirection === 'meaning_to_kana'
                    ? `Từ gồm ${currentItem.reading.length} chữ kana`
                    : `Cách đọc gồm ${currentItem.reading.length} chữ kana`
                }
                expectedKana={currentItem.reading}
              />
            )}

            {!typingResult ? (
              <button
                type="button"
                onClick={submitTypedAnswer}
                disabled={!typedInput.trim()}
                className="w-full h-12 rounded-xl bg-app-accent disabled:opacity-40 text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
              >
                Kiểm tra đáp án (Enter)
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div className={`p-5 rounded-xl border border-l-4 text-xs sm:text-sm space-y-2 ${
                  typingResult.isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800 border-l-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-rose-300 dark:border-rose-800 border-l-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${typingResult.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'}`}>
                      {typingResult.isCorrect ? 'Đúng!' : 'Chưa chính xác'}
                    </span>
                    {!typingResult.isCorrect && (
                      <button
                        type="button"
                        onClick={() => setTypingResult({ isCorrect: true, showExplanation: true })}
                        className="text-xs text-app-muted hover:text-app-text underline font-medium"
                      >
                        Tôi đã trả lời đúng (ghi điểm)
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-app-border/40 space-y-1.5 text-app-text">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-jp font-light text-app-text">{currentItem.word}</span>
                      <span className="text-base font-jp text-app-accent font-normal">【{currentItem.reading}】</span>
                      <AudioButton text={currentItem.word} size="sm" showText={false} />
                    </div>
                    <div className="text-sm font-medium">{currentItem.meaning}</div>
                    {currentItem.exampleJa && (
                      <div className="text-xs text-app-muted pt-1 font-jp font-normal">
                        <span>{currentItem.exampleJa}</span>
                        {currentItem.exampleVi && <span className="ml-1 text-app-muted/80">({currentItem.exampleVi})</span>}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAnswer(typingResult.isCorrect)}
                  className="w-full h-12 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
                >
                  Từ tiếp theo (Enter)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MATCHING MODE */}
      {studyMode === 'matching' && (
        <div className="space-y-4">
          <div className="text-xs sm:text-sm text-app-muted text-center">
            Chọn một ô từ Kanji và ô nghĩa tương ứng để ghép cặp
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {matchingPairs.map(card => {
              const isSolved = solvedMatchPairs.includes(card.pairId);
              const isSelected = selectedMatch === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={isSolved}
                  onClick={() => handleMatchCardClick(card.id, card.pairId)}
                  className={`p-4 min-h-[84px] rounded-xl border text-center notebook-fade flex items-center justify-center transition-all ${
                    isSolved
                      ? 'border-app-border text-app-muted opacity-30 cursor-default bg-app'
                      : isSelected
                      ? 'border-app-accent bg-app-accent-subtle font-medium text-app-text shadow-sm scale-[1.02]'
                      : 'border-app-border hover:border-app-muted text-app-text bg-app-surface shadow-sm'
                  }`}
                >
                  <span className={card.type === 'left' ? 'text-2xl font-jp font-light' : 'text-xs sm:text-sm'}>
                    {card.text}
                  </span>
                </button>
              );
            })}
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
                  className={`p-3 text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-app-accent/10 border-l-4 border-l-app-accent font-medium'
                      : 'hover:bg-app/70 bg-app-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                      isCurrent
                        ? 'bg-app-accent text-white font-bold'
                        : 'bg-app border border-app-border text-app-muted'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs text-app-muted font-mono shrink-0">
                      #{item.stt}
                    </span>
                    <span className="font-jp text-sm text-app-text font-normal truncate">
                      {item.word}
                    </span>
                    <span className="text-xs text-app-muted font-jp shrink-0">
                      【{item.reading}】
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-app border border-app-border text-app-muted shrink-0 uppercase">
                      {item.pos}
                    </span>
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
  );
};
