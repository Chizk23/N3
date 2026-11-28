import React, { useState, useEffect, useMemo } from 'react';
import { VocabItem, GrammarItem, MimikaraItem, QuizQuestion } from '../types';
import { 
  generateVocabQuizQuestion, 
  generateGrammarQuizQuestion, 
  generateMimikaraQuizQuestion, 
  shuffle 
} from '../lib/quiz';
import { AudioButton } from './AudioButton';
import { 
  TimerIcon, 
  CloseIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ArrowRightIcon, 
  RefreshIcon,
  FilterIcon,
  SparklesIcon,
  BookIcon,
  LayersIcon,
  SettingsIcon
} from './Icons';

export type TestSection = 'all' | 'mimikara' | 'vocab' | 'grammar';
export type TestScope = 'all' | 'unit' | 'range';

interface MiniTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabList: VocabItem[];
  grammarList: GrammarItem[];
  mimikaraList?: MimikaraItem[];
  onComplete?: (score: number, total: number) => void;
}

export const MiniTestModal: React.FC<MiniTestModalProps> = ({
  isOpen,
  onClose,
  vocabList,
  grammarList,
  mimikaraList = [],
  onComplete
}) => {
  // Test configuration
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);
  const [testSection, setTestSection] = useState<TestSection>('all');
  const [testScope, setTestScope] = useState<TestScope>('all');
  
  // Specific scope targets
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(50);
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Active exam state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Dynamic Mimikara Units
  const mimikaraUnits = useMemo(() => {
    const set = new Set<string>();
    mimikaraList.forEach(item => {
      if (item.unit) set.add(item.unit);
    });
    return Array.from(set);
  }, [mimikaraList]);

  // Grammar Categories
  const grammarCategories = [
    { value: 'all', label: 'Tất cả các nhóm ngữ pháp' },
    { value: 'N3', label: 'N3 Cốt lõi (118 mẫu)' },
    { value: 'KINH_NGU', label: 'Kính ngữ' },
    { value: 'LIEN_TU', label: 'Liên từ' },
    { value: 'PHO_TU', label: 'Phó từ' },
    { value: 'N4_TRONG_DE_N3', label: 'N4 xuất hiện trong đề N3' }
  ];

  // Vocab Decks
  const vocabDecks = [
    { value: 'all', label: 'Tất cả từ vựng (A911 & B349)' },
    { value: 'A911', label: 'Từ vựng cốt lõi A911 (911 từ)' },
    { value: 'B349', label: 'Từ vựng nâng cao B349 (351 từ)' }
  ];

  // Maximum STT calculation for range inputs
  const maxSTT = useMemo(() => {
    if (testSection === 'mimikara') return 880;
    if (testSection === 'grammar') return 230;
    if (testSection === 'vocab') return 911;
    return 880;
  }, [testSection]);

  // Available items pool count based on config
  const filteredPoolInfo = useMemo(() => {
    let vPool = [...vocabList];
    let gPool = [...grammarList];
    let mPool = [...mimikaraList];

    // Filter by Scope
    if (testScope === 'range') {
      const min = Math.min(rangeFrom, rangeTo);
      const max = Math.max(rangeFrom, rangeTo);
      vPool = vPool.filter(i => i.stt >= min && i.stt <= max);
      gPool = gPool.filter(i => i.stt >= min && i.stt <= max);
      mPool = mPool.filter(i => i.stt >= min && i.stt <= max);
    } else if (testScope === 'unit') {
      if (testSection === 'mimikara' && selectedUnit !== 'all') {
        mPool = mPool.filter(i => i.unit === selectedUnit);
      } else if (testSection === 'grammar' && selectedUnit !== 'all') {
        gPool = gPool.filter(i => i.category === selectedUnit);
      } else if (testSection === 'vocab' && selectedUnit !== 'all') {
        vPool = vPool.filter(i => i.deck === selectedUnit);
      }
    }

    let total = 0;
    if (testSection === 'all') total = vPool.length + gPool.length + mPool.length;
    else if (testSection === 'mimikara') total = mPool.length;
    else if (testSection === 'vocab') total = vPool.length;
    else if (testSection === 'grammar') total = gPool.length;

    return { total, vPool, gPool, mPool };
  }, [testSection, testScope, selectedUnit, rangeFrom, rangeTo, vocabList, grammarList, mimikaraList]);

  // Adjust default range when section changes
  useEffect(() => {
    if (testSection === 'mimikara') {
      setRangeFrom(1);
      setRangeTo(50);
      setSelectedUnit(mimikaraUnits[0] || 'all');
    } else if (testSection === 'grammar') {
      setRangeFrom(1);
      setRangeTo(30);
      setSelectedUnit('N3');
    } else if (testSection === 'vocab') {
      setRangeFrom(1);
      setRangeTo(50);
      setSelectedUnit('A911');
    } else {
      setSelectedUnit('all');
    }
  }, [testSection, mimikaraUnits]);

  // Generate Questions & Start Exam
  const startExam = () => {
    const { vPool, gPool, mPool } = filteredPoolInfo;
    const qList: QuizQuestion[] = [];

    const targetCount = Math.min(questionCount, Math.max(1, filteredPoolInfo.total));

    if (testSection === 'mimikara') {
      const shuffled = shuffle(mPool).slice(0, targetCount);
      for (const m of shuffled) {
        qList.push(generateMimikaraQuizQuestion(m, mimikaraList));
      }
    } else if (testSection === 'vocab') {
      const shuffled = shuffle(vPool).slice(0, targetCount);
      for (const v of shuffled) {
        qList.push(generateVocabQuizQuestion(v, vocabList));
      }
    } else if (testSection === 'grammar') {
      const shuffled = shuffle(gPool).slice(0, targetCount);
      for (let i = 0; i < shuffled.length; i++) {
        const g = shuffled[i];
        const mode = i % 2 === 0 ? 'cloze' : 'context';
        qList.push(generateGrammarQuizQuestion(g, grammarList, mode));
      }
    } else {
      // Mixed section: divide proportionally
      const countPerPart = Math.ceil(targetCount / 3);
      const shuffledV = shuffle(vPool).slice(0, countPerPart);
      const shuffledG = shuffle(gPool).slice(0, countPerPart);
      const shuffledM = shuffle(mPool).slice(0, targetCount - shuffledV.length - shuffledG.length);

      for (const v of shuffledV) qList.push(generateVocabQuizQuestion(v, vocabList));
      for (let i = 0; i < shuffledG.length; i++) {
        const g = shuffledG[i];
        const mode = i % 2 === 0 ? 'cloze' : 'context';
        qList.push(generateGrammarQuizQuestion(g, grammarList, mode));
      }
      for (const m of shuffledM) qList.push(generateMimikaraQuizQuestion(m, mimikaraList));
    }

    const finalQuestions = shuffle(qList).slice(0, targetCount);
    if (finalQuestions.length === 0) {
      alert('Không có đủ câu hỏi trong phạm vi đã chọn! Vui lòng mở rộng phạm vi hoặc chọn Unit khác.');
      return;
    }

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsFinished(false);
    setIsConfiguring(false);
    // 1 minute per question or 15 mins default
    setTimeLeft(Math.max(5 * 60, finalQuestions.length * 60));
  };

  // Reset to config screen
  const handleOpenConfig = () => {
    setIsConfiguring(true);
    setIsFinished(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isConfiguring || isFinished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isConfiguring, isFinished, timeLeft]);

  // When modal is reopened, show config if not running
  useEffect(() => {
    if (isOpen && questions.length === 0) {
      setIsConfiguring(true);
    }
  }, [isOpen, questions.length]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: opt }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsFinished(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    if (onComplete) {
      onComplete(correct, questions.length);
    }
  };

  const score = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (isConfiguring || isFinished || !currentQ) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;

      if (['1', '2', '3', '4'].includes(event.key)) {
        const option = currentQ.options[Number(event.key) - 1];
        if (option) {
          event.preventDefault();
          handleSelectOption(option);
        }
      } else if (event.key === 'Enter' && userAnswers[currentIndex]) {
        event.preventDefault();
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((index) => index + 1);
        } else {
          finishTest();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfiguring, isFinished, currentQ, currentIndex, questions.length, userAnswers, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-test-title"
        className="bg-app-surface border border-app-border rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col notebook-fade overflow-hidden shadow-2xl"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-app-border bg-app">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app-accent-subtle text-app-accent flex items-center justify-center">
              <TimerIcon size={22} />
            </div>
            <div>
              <div id="mini-test-title" className="text-base font-medium text-app-text">
                {isConfiguring ? 'Thiết lập bài thi thử JLPT N3' : 'Thi thử JLPT N3'}
              </div>
              <div className="text-xs text-app-muted">
                {isConfiguring 
                  ? 'Tùy chọn phạm vi theo Unit hoặc khoảng Số thứ tự (STT)'
                  : `${questions.length} câu hỏi · ${testSection === 'all' ? 'Tổng hợp' : testSection.toUpperCase()}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isConfiguring && !isFinished && (
              <>
                <button
                  type="button"
                  onClick={handleOpenConfig}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border hover:bg-app text-xs text-app-muted hover:text-app-text notebook-fade"
                  title="Cài đặt lại phạm vi thi"
                >
                  <SettingsIcon size={14} />
                  <span>Cài đặt đề</span>
                </button>
                <div aria-live="polite" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border bg-app-surface text-xs font-mono font-medium text-app-text shadow-sm">
                  <TimerIcon size={14} className="text-app-muted" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-app-border hover:bg-app flex items-center justify-center text-app-muted hover:text-app-text transition-colors"
              title="Đóng"
              aria-label="Đóng bài thi thử"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar during test */}
        {!isConfiguring && !isFinished && questions.length > 0 && (
          <div className="w-full h-1.5 bg-app border-b border-app-border">
            <div
              role="progressbar"
              aria-label={`Tiến độ bài thi: câu ${currentIndex + 1} trên ${questions.length}`}
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={currentIndex + 1}
              className="h-full bg-app-accent notebook-fade"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* SCREEN 1: CONFIGURATION */}
          {isConfiguring ? (
            <div className="space-y-6">
              {/* Section selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-app-muted">
                  1. Chọn phần thi / Nguồn câu hỏi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTestSection('all')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium notebook-fade flex flex-col gap-1.5 ${
                      testSection === 'all'
                        ? 'border-app-accent bg-app-accent-subtle text-app-text ring-1 ring-app-accent'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon size={15} className="text-amber-500" />
                      <span className="font-semibold text-app-text">Tổng hợp</span>
                    </div>
                    <span className="text-[11px] text-app-muted">Từ vựng + Ngữ pháp + Mimikara</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestSection('mimikara')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium notebook-fade flex flex-col gap-1.5 ${
                      testSection === 'mimikara'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon size={15} className="text-indigo-500" />
                      <span className="font-semibold text-app-text">Mimikara N3</span>
                    </div>
                    <span className="text-[11px] text-app-muted">880 từ vựng theo Unit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestSection('vocab')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium notebook-fade flex flex-col gap-1.5 ${
                      testSection === 'vocab'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <BookIcon size={15} className="text-emerald-500" />
                      <span className="font-semibold text-app-text">Từ vựng N3</span>
                    </div>
                    <span className="text-[11px] text-app-muted">Bộ A911 & B349</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestSection('grammar')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium notebook-fade flex flex-col gap-1.5 ${
                      testSection === 'grammar'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <LayersIcon size={15} className="text-rose-500" />
                      <span className="font-semibold text-app-text">Ngữ pháp N3</span>
                    </div>
                    <span className="text-[11px] text-app-muted">118 mẫu & phụ trợ</span>
                  </button>
                </div>
              </div>

              {/* Scope selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-app-muted">
                  2. Chọn phạm vi câu hỏi
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTestScope('all')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium notebook-fade ${
                      testScope === 'all'
                        ? 'border-app-accent bg-app-accent-subtle text-app-text ring-1 ring-app-accent font-semibold'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    Toàn bộ danh sách
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestScope('unit')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium notebook-fade ${
                      testScope === 'unit'
                        ? 'border-app-accent bg-app-accent-subtle text-app-text ring-1 ring-app-accent font-semibold'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    Theo Unit / Nhóm
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestScope('range')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium notebook-fade ${
                      testScope === 'range'
                        ? 'border-app-accent bg-app-accent-subtle text-app-text ring-1 ring-app-accent font-semibold'
                        : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                    }`}
                  >
                    Theo khoảng STT
                  </button>
                </div>
              </div>

              {/* Sub-scope Detail: If Unit */}
              {testScope === 'unit' && (
                <div className="p-4 rounded-xl border border-app-border bg-app space-y-2 animate-fade-in">
                  <label className="text-xs font-medium text-app-text block">
                    {testSection === 'mimikara' 
                      ? 'Chọn Unit Mimikara:' 
                      : testSection === 'grammar' 
                      ? 'Chọn Nhóm ngữ pháp:' 
                      : testSection === 'vocab'
                      ? 'Chọn Bộ từ vựng:'
                      : 'Chọn phạm vi Unit:'}
                  </label>
                  
                  {testSection === 'mimikara' ? (
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text focus:outline-none focus:border-app-accent font-jp"
                    >
                      <option value="all">-- Tất cả các Unit Mimikara --</option>
                      {mimikaraUnits.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  ) : testSection === 'grammar' ? (
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text focus:outline-none focus:border-app-accent"
                    >
                      {grammarCategories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  ) : testSection === 'vocab' ? (
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-surface text-sm text-app-text focus:outline-none focus:border-app-accent"
                    >
                      {vocabDecks.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs text-app-muted">
                      (Chế độ tổng hợp sẽ kiểm tra ngẫu nhiên theo tỷ lệ đều giữa các phần)
                    </div>
                  )}
                </div>
              )}

              {/* Sub-scope Detail: If Range STT */}
              {testScope === 'range' && (
                <div className="p-4 rounded-xl border border-app-border bg-app space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-app-muted font-medium">
                    <span>Khoảng số thứ tự (STT) trong cơ sở dữ liệu</span>
                    <span>Tối đa: #{maxSTT}</span>
                  </div>
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
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
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
                          setRangeTo(Math.min(maxSTT, pill.to));
                        }}
                        className="px-2 py-1 text-[11px] rounded-md border border-app-border hover:bg-app-surface text-app-muted hover:text-app-text"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-app-muted">
                  <span>3. Số lượng câu hỏi thi</span>
                  <span className="text-app-accent normal-case font-medium">
                    (Có {filteredPoolInfo.total} câu phù hợp phạm vi)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[10, 20, 30, 40].map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`h-11 rounded-xl border text-center text-xs font-medium notebook-fade flex items-center justify-center gap-1 ${
                        questionCount === count
                          ? 'border-app-accent bg-app-accent-subtle text-app-text ring-1 ring-app-accent font-semibold'
                          : 'border-app-border bg-app hover:border-app-muted text-app-muted hover:text-app-text'
                      }`}
                    >
                      <span>{count} câu</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-4 border-t border-app-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-app-border text-xs text-app-muted hover:text-app-text hover:bg-app"
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={startExam}
                  disabled={filteredPoolInfo.total === 0}
                  className="h-11 px-7 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-semibold hover:opacity-90 notebook-fade shadow-sm flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Bắt đầu làm bài thi ({Math.min(questionCount, filteredPoolInfo.total)} câu)</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          ) : !isFinished ? (
            
            /* SCREEN 2: IN TEST */
            currentQ ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-app-text">Câu {currentIndex + 1} / {questions.length}</span>
                    {currentQ.targetItem && 'unit' in currentQ.targetItem && currentQ.targetItem.unit && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {currentQ.targetItem.unit}
                      </span>
                    )}
                  </div>
                  <span>Đã chọn: {Object.keys(userAnswers).length}/{questions.length}</span>
                </div>

                {/* Question Prompt */}
                <div className="border border-app-border rounded-2xl p-6 sm:p-8 text-center space-y-4 bg-app shadow-sm">
                  <div className="text-xs text-app-muted uppercase tracking-wider font-medium">
                    {currentQ.subPrompt || 'Chọn đáp án chính xác nhất'}
                  </div>

                  <div className="text-2xl sm:text-3xl font-jp font-light text-app-text leading-relaxed">
                    {currentQ.prompt}
                  </div>

                  {currentQ.hint && (
                    <p className="text-xs sm:text-sm text-app-muted">
                      {currentQ.hint}
                    </p>
                  )}

                  {currentQ.audioText && (
                    <div className="pt-1 flex justify-center">
                      <AudioButton text={currentQ.audioText} size="sm" showText={true} />
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentIndex] === opt;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        aria-pressed={isSelected}
                        className={`w-full text-left p-4 sm:p-4.5 rounded-xl border text-sm sm:text-base font-jp font-normal notebook-fade flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-app-accent text-app-text bg-app-accent-subtle font-medium shadow-sm ring-1 ring-app-accent'
                            : 'border-app-border hover:border-app-muted text-app-text bg-app-surface hover:bg-app'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-6 h-6 rounded-full border border-app-border bg-app text-app-muted text-xs font-mono flex items-center justify-center font-medium">
                            {idx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-[11px] text-app-muted">
                  Phím 1–4 để chọn đáp án · Enter để sang câu tiếp theo · Esc để đóng
                </p>
              </div>
            ) : null
          ) : (
            
            /* SCREEN 3: TEST RESULTS */
            <div className="space-y-6">
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 rounded-2xl bg-app-accent-subtle text-app-accent mx-auto flex items-center justify-center">
                  <CheckCircleIcon size={36} />
                </div>
                <div className="text-2xl font-medium text-app-text">Hoàn thành bài thi!</div>
                <p className="text-sm text-app-muted">
                  Kết quả: Trả lời đúng <span className="font-semibold text-app-text">{score}</span> / {questions.length} câu ({Math.round((score / questions.length) * 100)}%)
                </p>
              </div>

              {/* Review wrong answers */}
              <div className="space-y-3 pt-4 border-t border-app-border">
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium">Chi tiết đáp án từng câu</div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = userAns === q.correctAnswer;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                          isCorrect
                            ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-jp font-normal text-app-text text-sm sm:text-base">
                            <span className="font-mono text-app-muted mr-1.5 font-bold">#{idx + 1}</span>
                            {q.prompt}
                          </div>
                          {isCorrect ? (
                            <CheckCircleIcon size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircleIcon size={18} className="text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </div>

                        <div className="text-app-muted text-xs">
                          Bạn chọn: <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>{userAns || 'Chưa trả lời'}</span>
                          {!isCorrect && (
                            <> | Đáp án đúng: <span className="text-emerald-700 dark:text-emerald-400 font-medium">{q.correctAnswer}</span></>
                          )}
                        </div>

                        {q.explanation && (
                          <div className="text-app-muted pt-1.5 whitespace-pre-line border-t border-app-border/40 text-xs">
                            {q.explanation}
                          </div>
                        )}

                        {q.audioText && (
                          <div className="pt-1 flex items-center">
                            <AudioButton text={q.audioText} size="sm" showText={true} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-app-border">
                <button
                  type="button"
                  onClick={handleOpenConfig}
                  className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium flex items-center gap-2 notebook-fade bg-app"
                >
                  <FilterIcon size={15} />
                  <span>Đổi phạm vi đề</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={startExam}
                    className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium flex items-center gap-2 notebook-fade bg-app"
                  >
                    <RefreshIcon size={15} />
                    <span>Làm lại đề khác</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 px-6 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls when actively in exam */}
        {!isConfiguring && !isFinished && (
          <div className="px-6 py-4 border-t border-app-border bg-app flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-lg border border-app-border hover:bg-app-surface text-app-text disabled:opacity-30 notebook-fade"
            >
              Câu trước
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-10 px-5 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade flex items-center gap-2 shadow-sm"
            >
              <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài thi'}</span>
              <ArrowRightIcon size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
