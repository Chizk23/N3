import React, { useState, useEffect, useMemo } from 'react';
import { 
  GrammarItem, 
  GrammarCategory, 
  StudyModeGrammar, 
  Progress, 
  QuizQuestion 
} from '../types';
import { 
  buildStudyQueue, 
  updateProgress, 
  getProgressKey 
} from '../lib/srs';
import { 
  generateGrammarQuizQuestion, 
  maskGrammarInExample 
} from '../lib/quiz';
import { AudioButton } from './AudioButton';
import { 
  StarIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  CloseIcon, 
  FilterIcon, 
  RefreshIcon,
  AlertCircleIcon 
} from './Icons';

interface GrammarStudyProps {
  grammarList: GrammarItem[];
  progressMap: Record<string, Progress>;
  onUpdateProgress: (key: string, updated: Progress, isCorrect: boolean) => void;
  onToggleStar: (item: GrammarItem) => void;
  cardsPerSession?: number;
  onUpdateCardsPerSession?: (count: number) => void;
  autoPronounce?: boolean;
}

export const GrammarStudy: React.FC<GrammarStudyProps> = ({
  grammarList,
  progressMap,
  onUpdateProgress,
  onToggleStar,
  cardsPerSession = 15,
  onUpdateCardsPerSession,
  autoPronounce = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'all'>('all');
  const [minFreq, setMinFreq] = useState<number>(0);
  const [customCount, setCustomCount] = useState<number>(cardsPerSession);
  const [studyMode, setStudyMode] = useState<StudyModeGrammar>('card');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  // Scope filter: All vs Range STT
  const [scopeType, setScopeType] = useState<'all' | 'range'>('all');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(30);

  const maxSTT = useMemo(() => {
    return grammarList.length || 230;
  }, [grammarList]);

  const quickRangePresets = useMemo(() => [
    { label: '1 - 30', from: 1, to: 30 },
    { label: '31 - 60', from: 31, to: 60 },
    { label: '61 - 100', from: 61, to: 100 },
    { label: '101 - 150', from: 101, to: 150 },
    { label: '151 - 200', from: 151, to: 200 },
    { label: '201 - 230', from: 201, to: 230 }
  ], []);

  const availableGrammarCount = useMemo(() => {
    let filtered = grammarList;
    if (selectedCategory !== 'all') filtered = filtered.filter(g => g.category === selectedCategory);
    if (scopeType === 'range') {
      const min = Math.min(rangeFrom, rangeTo);
      const max = Math.max(rangeFrom, rangeTo);
      filtered = filtered.filter(g => g.stt >= min && g.stt <= max);
    }
    return filtered.length;
  }, [grammarList, selectedCategory, scopeType, rangeFrom, rangeTo]);

  useEffect(() => {
    setCustomCount(cardsPerSession);
  }, [cardsPerSession]);

  const [sessionQueue, setSessionQueue] = useState<GrammarItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const [inspectedGrammar, setInspectedGrammar] = useState<GrammarItem | null>(null);

  const [sessionResults, setSessionResults] = useState<{ item: GrammarItem; isCorrect: boolean }[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState<boolean>(false);
  const [showSessionList, setShowSessionList] = useState<boolean>(true);

  const startSession = (onlyLeechOrStarred = false) => {
    let filtered = grammarList;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(g => g.category === selectedCategory);
    }
    if (scopeType === 'range') {
      const min = Math.min(rangeFrom, rangeTo);
      const max = Math.max(rangeFrom, rangeTo);
      filtered = filtered.filter(g => g.stt >= min && g.stt <= max);
    }

    const countToUse = customCount > 0 ? customCount : 15;
    const queue = buildStudyQueue(filtered, progressMap, countToUse, minFreq, onlyLeechOrStarred);

    if (queue.length === 0) {
      alert('Không tìm thấy mẫu ngữ pháp phù hợp với bộ lọc.');
      return;
    }

    setSessionQueue(queue);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setSessionResults([]);
    setIsSessionEnded(false);
    setIsSessionActive(true);

    if (studyMode !== 'card') {
      setupQuizQuestion(queue[0], filtered, studyMode);
    }
  };

  const setupQuizQuestion = (item: GrammarItem, pool: GrammarItem[], mode: StudyModeGrammar) => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    const quizMode = (mode === 'context' || mode === 'meaning' || mode === 'formation' || mode === 'cloze')
      ? mode
      : 'context';
    const q = generateGrammarQuizQuestion(item, pool, quizMode);
    setCurrentQuestion(q);
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
      setSelectedOption(null);
      setIsAnswerSubmitted(false);

      if (studyMode !== 'card') {
        let pool = grammarList;
        if (selectedCategory !== 'all') pool = pool.filter(g => g.category === selectedCategory);
        setupQuizQuestion(sessionQueue[nextIdx], pool, studyMode);
      }
    } else {
      setIsSessionEnded(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);

      if (studyMode !== 'card') {
        let pool = grammarList;
        if (selectedCategory !== 'all') pool = pool.filter(g => g.category === selectedCategory);
        setupQuizQuestion(sessionQueue[prevIdx], pool, studyMode);
      }
    }
  };

  const jumpToIndex = (idx: number) => {
    if (idx >= 0 && idx < sessionQueue.length) {
      setCurrentIndex(idx);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);

      if (studyMode !== 'card') {
        let pool = grammarList;
        if (selectedCategory !== 'all') pool = pool.filter(g => g.category === selectedCategory);
        setupQuizQuestion(sessionQueue[idx], pool, studyMode);
      }
    }
  };

  useEffect(() => {
    if (!isSessionActive || isSessionEnded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (studyMode === 'card') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (e.key === '1') {
          handleAnswer(false);
        } else if (e.key === '2' || e.key === 'Enter') {
          handleAnswer(true);
        }
      } else {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, isSessionEnded, studyMode, currentQuestion, isAnswerSubmitted, selectedOption, currentIndex, sessionQueue]);

  const submitQuizOption = (opt: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;
    setSelectedOption(opt);
    setIsAnswerSubmitted(true);
  };

  const handleJumpToConfusable = (confusableText: string) => {
    const cleanPattern = confusableText.replace(/\(.*?\)/g, '').trim().replace(/[～~]/g, '');
    const found = grammarList.find(g => g.pattern.replace(/[～~]/g, '').includes(cleanPattern));
    if (found) {
      setInspectedGrammar(found);
    } else {
      alert(`Mẫu "${confusableText}" chưa có trong danh sách hiện tại.`);
    }
  };

  // ----------------------------------------------------
  // SETUP SCREEN
  // ----------------------------------------------------
  if (!isSessionActive) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium text-app-text tracking-tight">
            Học ngữ pháp N3
          </h2>
          <p className="text-sm text-app-muted mt-1">
            Luyện tập bối cảnh sử dụng, cách chia ghép và phân biệt các mẫu dễ nhầm
          </p>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-app-text border-b border-app-border pb-3">
            <FilterIcon size={18} className="text-app-accent" />
            <span>Bộ lọc và chế độ học</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-app-muted font-medium">Nhóm ngữ pháp</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent"
              >
                <option value="all">Tất cả 5 nhóm ({grammarList.length} mẫu)</option>
                <option value="N3">1. Ngữ pháp N3 trong đề</option>
                <option value="KINH_NGU">2. Kính ngữ</option>
                <option value="LIEN_TU">3. Liên từ</option>
                <option value="PHO_TU">4. Phó từ</option>
                <option value="N4_TRONG_DE_N3">5. Ngữ pháp N4 xuất hiện trong đề N3</option>
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
                (Có {availableGrammarCount} mẫu phù hợp phạm vi)
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
            <div className="text-xs sm:text-sm text-app-muted font-medium">Chọn dạng bài tập ngữ pháp</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
              {[
                { id: 'card', title: 'Thẻ học ngữ pháp', desc: 'Mẫu, nghĩa, cách ghép, bối cảnh' },
                { id: 'context', title: 'Chọn bối cảnh', desc: 'Mẫu và tình huống sử dụng' },
                { id: 'meaning', title: 'Chọn nghĩa', desc: 'Mẫu và nghĩa tiếng Việt' },
                { id: 'formation', title: 'Chọn cách ghép', desc: 'Công thức biến đổi V/A/N' },
                { id: 'cloze', title: 'Điền chỗ trống', desc: 'Dạng bài câu khuyết trong đề JLPT' },
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStudyMode(mode.id as StudyModeGrammar)}
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
          </div>

          {/* Card Count Selector */}
          <div className="space-y-2 pt-2 border-t border-app-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-app-muted font-medium">Số lượng mẫu muốn học phiên này</span>
              <span className="text-xs text-app-accent font-medium">Đang chọn: {customCount} mẫu</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[5, 10, 15, 25].map(cnt => (
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
                  {cnt} mẫu
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  const allCount = grammarList.length;
                  setCustomCount(allCount);
                  if (onUpdateCardsPerSession) onUpdateCardsPerSession(allCount);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  customCount >= grammarList.length
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                Tất cả ({grammarList.length})
              </button>

              {scopeType === 'range' && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomCount(availableGrammarCount);
                    if (onUpdateCardsPerSession) onUpdateCardsPerSession(availableGrammarCount);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                    customCount === availableGrammarCount
                      ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                      : 'border-app-border bg-app hover:border-app-text text-app-text'
                  }`}
                >
                  Toàn bộ trong khoảng ({availableGrammarCount})
                </button>
              )}

              <div className="flex items-center gap-1.5 pl-2">
                <span className="text-xs text-app-muted">Hoặc tự nhập:</span>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={customCount}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    const safe = isNaN(val) ? 1 : Math.max(1, Math.min(300, val));
                    setCustomCount(safe);
                    if (onUpdateCardsPerSession) onUpdateCardsPerSession(safe);
                  }}
                  style={{ color: 'var(--color-text)' }}
                  className="w-20 h-10 px-2 text-center text-sm font-medium rounded-xl border border-app-border bg-app text-app-text focus:outline-none focus:border-app-accent shadow-sm"
                />
                <span className="text-xs text-app-muted">mẫu</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startSession(false)}
              className="w-full sm:flex-1 h-12 px-6 rounded-xl bg-app-accent text-white text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
            >
              Bắt đầu học ({customCount} mẫu)
            </button>

            <button
              type="button"
              onClick={() => startSession(true)}
              className="w-full sm:w-auto h-12 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium notebook-fade flex items-center justify-center gap-2 bg-app-surface"
            >
              <StarIcon size={16} className="text-amber-500" />
              <span>Ôn mẫu đánh dấu và hay sai</span>
            </button>
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
            Hoàn thành bài học ngữ pháp!
          </div>
          <p className="text-sm text-app-muted mt-1">
            Kết quả: trả lời đúng {correctCount} trên {totalCount} mẫu ({percent}%)
          </p>
        </div>

        {wrongItems.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-app-border">
            <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
              Các mẫu cần ôn lại ({wrongItems.length})
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {wrongItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-app-border border-l-2 border-l-app-error text-xs sm:text-sm flex items-baseline justify-between bg-app">
                  <div className="space-y-0.5">
                    <span className="font-jp font-light text-base text-app-text mr-2">{item.pattern}</span>
                    <span className="text-app-text">{item.meaning}</span>
                    <div className="text-app-muted mt-0.5">{item.context}</div>
                  </div>
                  <span className="text-app-muted text-xs">{item.category}</span>
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
                setSessionResults([]);
                setIsSessionEnded(false);
                if (studyMode !== 'card') {
                  setupQuizQuestion(wrongItems[0], grammarList, studyMode);
                }
              }}
              className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <RefreshIcon size={15} />
              <span>Học lại các mẫu sai ({wrongItems.length})</span>
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
            Mẫu <strong className="text-app-text font-bold">{currentIndex + 1}</strong> / {sessionQueue.length}
          </span>
          <button
            type="button"
            onClick={() => setShowSessionList(prev => !prev)}
            className="text-xs px-2.5 py-1 rounded-md border border-app-border bg-app-surface text-app-accent hover:bg-app-accent hover:text-white font-medium transition-all cursor-pointer"
          >
            {showSessionList ? 'Ẩn danh sách' : '📋 Xem danh sách mẫu'}
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

      {/* 5.1 THẺ HỌC NGỮ PHÁP (STUDY CARD) */}
      {studyMode === 'card' && currentItem && (
        <div className="space-y-5">
          <div className="border border-app-border rounded-2xl bg-app-surface p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-sm">
            {/* MẪU CÂU */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-app-accent font-semibold px-2.5 py-0.5 rounded bg-app-accent-subtle">
                  {currentItem.category} · #{currentItem.stt} · ĐỀ THI {currentItem.freq} LẦN
                </span>
                <AudioButton text={currentItem.pattern} size="sm" showText={true} />
              </div>
              <div className="text-[26px] sm:text-[32px] font-jp font-normal text-app-text leading-tight mt-1">
                {currentItem.pattern}
              </div>
            </div>

            {/* Ý NGHĨA */}
            <div className="pt-3.5 border-t border-app-border/60 space-y-1">
              <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
                Ý NGHĨA
              </div>
              <p className="text-base sm:text-[17px] text-app-text leading-[1.6]">
                {currentItem.meaning}
              </p>
            </div>

            {/* CÁCH GHÉP */}
            <div className="pt-3.5 border-t border-app-border/60 space-y-1.5">
              <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
                CÁCH GHÉP (KIỂU V)
              </div>
              <div className="font-mono text-sm text-app-text bg-app p-3 rounded-lg border border-app-border">
                {currentItem.formation}
              </div>
            </div>

            {/* BỐI CẢNH */}
            <div className="pt-3.5 border-t border-app-border/60 space-y-1">
              <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
                BỐI CẢNH SỬ DỤNG
              </div>
              <p className="text-sm sm:text-base text-app-muted leading-relaxed">
                {currentItem.context}
              </p>
            </div>

            {/* VÍ DỤ */}
            {currentItem.exampleJa && (
              <div className="pt-3.5 border-t border-app-border/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-app-muted font-medium">
                    VÍ DỤ VÀ BẢN DỊCH
                  </span>
                  <AudioButton text={currentItem.exampleJa} size="sm" showText={false} />
                </div>
                <div className="font-jp font-normal text-base sm:text-[17px] text-app-text leading-[1.8]">
                  {currentItem.exampleJa}
                </div>
                {currentItem.exampleVi && (
                  <div className="text-sm sm:text-[15px] text-app-muted leading-[1.6]">
                    {currentItem.exampleVi}
                  </div>
                )}
              </div>
            )}

            {/* DỄ NHẦM VỚI */}
            {currentItem.confusables && currentItem.confusables.length > 0 && (
              <div className="pt-3.5 border-t border-app-border/60 space-y-2">
                <div className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertCircleIcon size={14} />
                  <span>CẨN THẬN DỄ NHẦM LẪN VỚI (BẤM ĐỂ SO SÁNH)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentItem.confusables.map((conf, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpToConfusable(conf)}
                      className="px-3 py-1 text-xs sm:text-sm rounded-lg border border-amber-300/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:border-app-accent hover:text-app-accent notebook-fade font-jp"
                    >
                      {conf}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action rating buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="h-12 rounded-xl border border-app-border hover:border-app-error text-app-error text-xs sm:text-sm font-medium notebook-fade bg-app-surface"
            >
              Chưa nhớ (Ôn lại)
            </button>

            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="h-12 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
            >
              Đã hiểu và nhớ vững
            </button>
          </div>
        </div>
      )}

      {/* QUIZ MODES: Context, Meaning, Formation, Cloze */}
      {studyMode !== 'card' && currentQuestion && (
        <div className="space-y-6">
          <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
              {currentQuestion.subPrompt}
            </div>

            <div className="text-2xl sm:text-3xl font-jp font-light text-app-text leading-tight">
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

          {isAnswerSubmitted && (
            <div className="border border-app-border border-l-4 border-l-app-accent rounded-xl bg-app-surface p-5 space-y-4 notebook-fade shadow-sm">
              <div className="pb-3 border-b border-app-border/50">
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium mb-1">
                  Đáp án chính xác:
                </div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl font-jp font-light text-app-text tracking-wide">
                    {currentItem ? currentItem.pattern : (currentQuestion.targetItem as GrammarItem).pattern}
                  </span>
                  <span className="text-sm font-medium text-app-text">
                    — {currentItem ? currentItem.meaning : currentQuestion.targetItem.meaning}
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-app-text whitespace-pre-line leading-relaxed">
                {currentQuestion.explanation}
              </div>

              {currentItem?.confusables && currentItem.confusables.length > 0 && (
                <div className="pt-2 border-t border-app-border/40 text-xs">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">Cẩn thận dễ nhầm với: </span>
                  <span className="text-app-text font-jp">{currentItem.confusables.join(' · ')}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleAnswer(selectedOption === currentQuestion.correctAnswer)}
                  className="h-11 px-6 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade flex items-center gap-2"
                >
                  <span>Mẫu tiếp theo (Enter)</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Item List Panel */}
      <div className="mt-8 border border-app-border rounded-xl bg-app-surface overflow-hidden shadow-sm">
        <div className="p-3.5 bg-app border-b border-app-border flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-xs sm:text-sm text-app-text flex items-center gap-1.5">
              <span>📋</span> Danh sách ngữ pháp trong phiên học ({sessionQueue.length} mẫu)
            </span>
            <span className="text-xs text-app-muted">
              · Nhấp vào mẫu câu để nhảy nhanh đến thẻ đó
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
                      {item.pattern}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-app border border-app-border text-app-muted shrink-0">
                      {item.category}
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

      {/* Confusable Item Inspection Modal */}
      {inspectedGrammar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-surface border border-app-border rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-4 notebook-fade shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-jp font-light text-app-text">
                {inspectedGrammar.pattern}
              </div>
              <button
                type="button"
                onClick={() => setInspectedGrammar(null)}
                className="p-1 text-app-muted hover:text-app-text"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-app-muted">
              <div><strong className="text-app-text">Ý nghĩa:</strong> {inspectedGrammar.meaning}</div>
              <div><strong className="text-app-text">Cách ghép:</strong> <span className="font-mono bg-app px-2 py-0.5 rounded border border-app-border text-app-text">{inspectedGrammar.formation}</span></div>
              <div><strong className="text-app-text">Bối cảnh:</strong> {inspectedGrammar.context}</div>
              {inspectedGrammar.exampleJa && (
                <div className="p-3 bg-app border border-app-border rounded-lg space-y-1 mt-2">
                  <div className="font-jp text-app-text">{inspectedGrammar.exampleJa}</div>
                  <div className="text-xs">{inspectedGrammar.exampleVi}</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setInspectedGrammar(null)}
              className="w-full h-11 rounded-xl bg-app-accent text-white text-xs font-medium hover:opacity-90"
            >
              Đã hiểu, quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
