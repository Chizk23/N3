import React, { useState, useMemo } from 'react';
import { VocabItem, GrammarItem, MimikaraItem, Progress, VocabPOS, GrammarCategory } from '../types';
import { getProgressKey } from '../lib/srs';
import { AudioButton } from './AudioButton';
import { 
  SearchIcon, 
  StarIcon, 
  TrashIcon, 
  BookIcon, 
  LayersIcon, 
  CloseIcon, 
  FilterIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  AlertCircleIcon,
  SparklesIcon 
} from './Icons';

interface DictionaryViewProps {
  vocabList: VocabItem[];
  grammarList: GrammarItem[];
  mimikaraList?: MimikaraItem[];
  progressMap: Record<string, Progress>;
  onToggleStarVocab: (item: VocabItem) => void;
  onToggleStarGrammar: (item: GrammarItem) => void;
  onToggleStarMimikara?: (item: MimikaraItem) => void;
  onDeleteVocab?: (item: VocabItem) => Promise<void>;
  onDeleteGrammar?: (item: GrammarItem) => Promise<void>;
  onDeleteMimikara?: (item: MimikaraItem) => Promise<void>;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  vocabList,
  grammarList,
  mimikaraList = [],
  progressMap,
  onToggleStarVocab,
  onToggleStarGrammar,
  onToggleStarMimikara,
  onDeleteVocab,
  onDeleteGrammar,
  onDeleteMimikara
}) => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'mimikara'>('mimikara');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Vocab filters
  const [selectedDeck, setSelectedDeck] = useState<'all' | 'A911' | 'B349'>('all');
  const [selectedPOS, setSelectedPOS] = useState<VocabPOS | 'all'>('all');
  
  // Grammar filters
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'all'>('all');

  // Mimikara filters
  const [selectedMimikaraUnit, setSelectedMimikaraUnit] = useState<string>('all');
  const [selectedMimikaraRange, setSelectedMimikaraRange] = useState<string>('all');

  // Shared filters
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlearned' | 'learning' | 'mastered' | 'leech'>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [minFreq, setMinFreq] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'stt_asc' | 'stt_desc' | 'freq_desc' | 'freq_asc' | 'alpha'>('stt_asc');

  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [selectedDetail, setSelectedDetail] = useState<VocabItem | GrammarItem | MimikaraItem | null>(null);

  // Dynamic Mimikara Units
  const mimikaraUnits = useMemo(() => {
    const set = new Set<string>();
    mimikaraList.forEach(item => {
      if (item.unit) set.add(item.unit);
    });
    return Array.from(set);
  }, [mimikaraList]);

  // Filtered Vocabulary
  const filteredVocab = useMemo(() => {
    if (activeTab !== 'vocab') return [];
    const term = searchTerm.toLowerCase().trim();

    const result = vocabList.filter(item => {
      if (selectedDeck !== 'all' && item.deck !== selectedDeck) return false;
      if (selectedPOS !== 'all' && item.pos !== selectedPOS) return false;
      if (minFreq > 0 && item.freq < minFreq) return false;

      const p = progressMap[getProgressKey(item)];
      if (onlyStarred && !p?.starred) return false;

      if (selectedStatus === 'unlearned' && p && p.box > 0) return false;
      if (selectedStatus === 'learning' && (!p || p.box === 0 || p.box >= 5)) return false;
      if (selectedStatus === 'mastered' && (!p || p.box < 5)) return false;
      if (selectedStatus === 'leech' && (!p || !p.leech)) return false;

      if (term) {
        const matchWord = item.word.toLowerCase().includes(term);
        const matchReading = item.reading.toLowerCase().includes(term);
        const matchMeaning = item.meaning.toLowerCase().includes(term);
        const matchExample = (item.exampleJa + ' ' + item.exampleVi).toLowerCase().includes(term);
        if (!matchWord && !matchReading && !matchMeaning && !matchExample) return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'stt_asc') return a.stt - b.stt;
      if (sortBy === 'stt_desc') return b.stt - a.stt;
      if (sortBy === 'freq_desc') return b.freq - a.freq || a.stt - b.stt;
      if (sortBy === 'freq_asc') return a.freq - b.freq || a.stt - b.stt;
      if (sortBy === 'alpha') return a.reading.localeCompare(b.reading, 'ja');
      return a.stt - b.stt;
    });
  }, [vocabList, activeTab, searchTerm, selectedDeck, selectedPOS, minFreq, onlyStarred, selectedStatus, sortBy, progressMap]);

  // Filtered Grammar
  const filteredGrammar = useMemo(() => {
    if (activeTab !== 'grammar') return [];
    const term = searchTerm.toLowerCase().trim();

    const result = grammarList.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (minFreq > 0 && item.freq < minFreq) return false;

      const p = progressMap[getProgressKey(item)];
      if (onlyStarred && !p?.starred) return false;

      if (selectedStatus === 'unlearned' && p && p.box > 0) return false;
      if (selectedStatus === 'learning' && (!p || p.box === 0 || p.box >= 5)) return false;
      if (selectedStatus === 'mastered' && (!p || p.box < 5)) return false;
      if (selectedStatus === 'leech' && (!p || !p.leech)) return false;

      if (term) {
        const matchPattern = item.pattern.toLowerCase().includes(term);
        const matchMeaning = item.meaning.toLowerCase().includes(term);
        const matchContext = item.context.toLowerCase().includes(term);
        const matchExample = (item.exampleJa + ' ' + item.exampleVi).toLowerCase().includes(term);
        if (!matchPattern && !matchMeaning && !matchContext && !matchExample) return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'stt_asc') return a.stt - b.stt;
      if (sortBy === 'stt_desc') return b.stt - a.stt;
      if (sortBy === 'freq_desc') return b.freq - a.freq || a.stt - b.stt;
      if (sortBy === 'freq_asc') return a.freq - b.freq || a.stt - b.stt;
      if (sortBy === 'alpha') return a.pattern.localeCompare(b.pattern, 'ja');
      return a.stt - b.stt;
    });
  }, [grammarList, activeTab, searchTerm, selectedCategory, minFreq, onlyStarred, selectedStatus, sortBy, progressMap]);

  // Filtered Mimikara
  const filteredMimikara = useMemo(() => {
    if (activeTab !== 'mimikara') return [];
    const term = searchTerm.toLowerCase().trim();

    const result = mimikaraList.filter(item => {
      // Unit filter
      if (selectedMimikaraUnit !== 'all' && item.unit !== selectedMimikaraUnit) return false;

      // Range STT filter
      if (selectedMimikaraRange === '1-100' && (item.stt < 1 || item.stt > 100)) return false;
      if (selectedMimikaraRange === '101-200' && (item.stt < 101 || item.stt > 200)) return false;
      if (selectedMimikaraRange === '201-350' && (item.stt < 201 || item.stt > 350)) return false;
      if (selectedMimikaraRange === '351-500' && (item.stt < 351 || item.stt > 500)) return false;
      if (selectedMimikaraRange === '501-650' && (item.stt < 501 || item.stt > 650)) return false;
      if (selectedMimikaraRange === '651-770' && (item.stt < 651 || item.stt > 770)) return false;
      if (selectedMimikaraRange === '771-880' && (item.stt < 771 || item.stt > 880)) return false;

      // Status filter
      const p = progressMap[getProgressKey(item)];
      if (onlyStarred && !p?.starred) return false;

      if (selectedStatus === 'unlearned' && p && p.box > 0) return false;
      if (selectedStatus === 'learning' && (!p || p.box === 0 || p.box >= 5)) return false;
      if (selectedStatus === 'mastered' && (!p || p.box < 5)) return false;
      if (selectedStatus === 'leech' && (!p || !p.leech)) return false;

      // Search term
      if (term) {
        const matchKanji = item.kanji.toLowerCase().includes(term);
        const matchReading = item.reading.toLowerCase().includes(term);
        const matchHanViet = item.hanViet.toLowerCase().includes(term);
        const matchMeaning = item.meaning.toLowerCase().includes(term);
        const matchSTT = item.stt.toString() === term;
        const matchUnit = item.unit?.toLowerCase().includes(term);
        const matchUsage = item.usage?.toLowerCase().includes(term);
        
        // Search in collocations, compounds, related
        const matchColloc = item.collocations?.some(c => c.toLowerCase().includes(term));
        const matchComp = item.compounds?.some(c => c.toLowerCase().includes(term));
        const matchSyn = item.synonyms?.some(c => c.toLowerCase().includes(term));
        const matchAnt = item.antonyms?.some(c => c.toLowerCase().includes(term));
        const matchRel = item.related?.some(c => c.toLowerCase().includes(term));

        // Search in examples
        const matchEx = item.examples?.some(e => 
          e.jp.toLowerCase().includes(term) || 
          (e.vi && e.vi.toLowerCase().includes(term)) ||
          (e.reading && e.reading.toLowerCase().includes(term))
        );

        if (
          !matchKanji && 
          !matchReading && 
          !matchHanViet && 
          !matchMeaning && 
          !matchSTT && 
          !matchUnit && 
          !matchUsage &&
          !matchColloc &&
          !matchComp &&
          !matchSyn &&
          !matchAnt &&
          !matchRel &&
          !matchEx
        ) {
          return false;
        }
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'stt_desc') return b.stt - a.stt;
      if (sortBy === 'alpha') return (a.kanji || a.reading).localeCompare(b.kanji || b.reading, 'ja');
      return a.stt - b.stt;
    });
  }, [
    mimikaraList, 
    activeTab, 
    searchTerm, 
    selectedMimikaraUnit, 
    selectedMimikaraRange, 
    onlyStarred, 
    selectedStatus, 
    sortBy, 
    progressMap
  ]);

  const activeList = activeTab === 'vocab' ? filteredVocab : activeTab === 'grammar' ? filteredGrammar : filteredMimikara;
  const totalPages = Math.ceil(activeList.length / pageSize) || 1;
  const paginatedList = activeList.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (tab: 'vocab' | 'grammar' | 'mimikara') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleDeleteItem = async (e: React.MouseEvent, item: VocabItem | GrammarItem | MimikaraItem) => {
    e.stopPropagation();
    const isVocab = 'word' in item;
    const isMimikara = 'hanViet' in item;
    const name = isVocab 
      ? (item as VocabItem).word 
      : isMimikara 
      ? ((item as MimikaraItem).kanji || (item as MimikaraItem).reading) 
      : (item as GrammarItem).pattern;
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xoá "${name}" khỏi cơ sở dữ liệu học tập?`);
    if (!confirmed) return;

    if (isVocab && onDeleteVocab) {
      await onDeleteVocab(item as VocabItem);
    } else if (isMimikara && onDeleteMimikara) {
      await onDeleteMimikara(item as MimikaraItem);
    } else if (!isVocab && !isMimikara && onDeleteGrammar) {
      await onDeleteGrammar(item as GrammarItem);
    }

    if (selectedDetail?.id === item.id) {
      setSelectedDetail(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-app-text tracking-tight">
            Tra cứu và danh sách
          </h2>
          <p className="text-sm text-app-muted mt-1">
            Tìm kiếm từ vựng Mimikara, Từ vựng cốt lõi & Ngữ pháp theo Kanji, Hiragana, Hán Việt hoặc tiếng Việt
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-app border border-app-border rounded-xl">
          <button
            type="button"
            onClick={() => handleTabChange('mimikara')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium notebook-fade ${
              activeTab === 'mimikara'
                ? 'bg-app-surface text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-indigo-800 font-semibold'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <SparklesIcon size={16} className="text-indigo-500" />
            <span>Mimikara ({mimikaraList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('vocab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium notebook-fade ${
              activeTab === 'vocab'
                ? 'bg-app-surface text-app-text shadow-sm border border-app-border'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <BookIcon size={16} />
            <span>Từ vựng ({vocabList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('grammar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium notebook-fade ${
              activeTab === 'grammar'
                ? 'bg-app-surface text-app-text shadow-sm border border-app-border'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <LayersIcon size={16} />
            <span>Ngữ pháp ({grammarList.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-5 sm:p-6 space-y-4 shadow-sm">
        {/* Search input with icon */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none">
            <SearchIcon size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder={
              activeTab === 'vocab'
                ? 'Tìm kanji, hiragana, romaji (eiyou, えいよう), nghĩa tiếng Việt...'
                : activeTab === 'mimikara'
                ? 'Tìm theo Kanji, Hiragana, Âm Hán Việt (vd: NAM TÍNH), Nghĩa, Cụm từ, Ví dụ, hoặc STT...'
                : 'Tìm mẫu câu (～において, tabini), ý nghĩa, bối cảnh...'
            }
            style={{ color: 'var(--color-text)' }}
            className="w-full h-11 pl-11 pr-11 rounded-xl border border-app-border bg-app text-app-text text-sm focus:outline-none focus:border-app-accent font-normal notebook-fade shadow-sm placeholder:text-app-muted"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text p-1.5 rounded-lg hover:bg-app"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs sm:text-sm">
          {activeTab === 'mimikara' ? (
            <>
              {/* Unit Dropdown */}
              <select
                value={selectedMimikaraUnit}
                onChange={e => { setSelectedMimikaraUnit(e.target.value); setPage(1); }}
                className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm font-jp"
              >
                <option value="all">Tất cả Unit ({mimikaraUnits.length} Unit)</option>
                {mimikaraUnits.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>

              {/* Range STT Dropdown */}
              <select
                value={selectedMimikaraRange}
                onChange={e => { setSelectedMimikaraRange(e.target.value); setPage(1); }}
                className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm"
              >
                <option value="all">Tất cả số STT (1 - 880)</option>
                <option value="1-100">STT 1 - 100</option>
                <option value="101-200">STT 101 - 200</option>
                <option value="201-350">STT 201 - 350</option>
                <option value="351-500">STT 351 - 500</option>
                <option value="501-650">STT 501 - 650</option>
                <option value="651-770">STT 651 - 770</option>
                <option value="771-880">STT 771 - 880</option>
              </select>
            </>
          ) : activeTab === 'vocab' ? (
            <>
              <select
                value={selectedDeck}
                onChange={e => { setSelectedDeck(e.target.value as any); setPage(1); }}
                className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm"
              >
                <option value="all">Tất cả bộ từ ({vocabList.length} từ)</option>
                <option value="A911">Bộ A (911 từ vựng)</option>
                <option value="B349">Bộ B (351 chữ Kanji)</option>
              </select>

              <select
                value={selectedPOS}
                onChange={e => { setSelectedPOS(e.target.value as any); setPage(1); }}
                className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm"
              >
                <option value="all">Tất cả từ loại</option>
                <option value="noun">Danh từ</option>
                <option value="verb">Động từ</option>
                <option value="adjective">Tính từ</option>
                <option value="adverb">Phó từ</option>
                <option value="katakana">Từ Katakana</option>
              </select>
            </>
          ) : (
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value as any); setPage(1); }}
              className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent col-span-1 sm:col-span-2 cursor-pointer shadow-sm"
            >
              <option value="all">Tất cả 5 nhóm ngữ pháp</option>
              <option value="N3">1. Ngữ pháp N3 trong đề thi</option>
              <option value="KINH_NGU">2. Kính ngữ (Tôn kính / Khiêm nhường)</option>
              <option value="LIEN_TU">3. Liên từ nối câu</option>
              <option value="PHO_TU">4. Phó từ ngữ pháp</option>
              <option value="N4_TRONG_DE_N3">5. Ngữ pháp N4 xuất hiện trong đề N3</option>
            </select>
          )}

          {/* Status SRS Filter */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value as any); setPage(1); }}
            className="h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm"
          >
            <option value="all">Tất cả trạng thái SRS</option>
            <option value="unlearned">Chưa học</option>
            <option value="learning">Đang học (Hộp 1–4)</option>
            <option value="mastered">Đã thuộc (Hộp 5)</option>
            <option value="leech">Hay sai (Leech)</option>
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as any); setPage(1); }}
            className={`h-10 px-3 rounded-lg border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent cursor-pointer shadow-sm ${
              activeTab === 'grammar' ? 'col-span-1' : 'col-span-1'
            }`}
          >
            <option value="stt_asc">Sắp xếp: Thứ tự STT tăng dần (#1 → #880)</option>
            <option value="stt_desc">Sắp xếp: Thứ tự STT giảm dần (#880 → #1)</option>
            {activeTab !== 'mimikara' && (
              <>
                <option value="freq_desc">Sắp xếp: Tần suất ra đề (Nhiều → Ít)</option>
                <option value="freq_asc">Sắp xếp: Tần suất ra đề (Ít → Nhiều)</option>
              </>
            )}
            <option value="alpha">Sắp xếp: Bảng chữ cái (A → Z)</option>
          </select>
        </div>

        {/* Filter footer: star filter and count */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted pt-1 border-t border-app-border/40">
          <button
            type="button"
            onClick={() => { setOnlyStarred(!onlyStarred); setPage(1); }}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg border transition-all ${
              onlyStarred
                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-medium'
                : 'border-app-border hover:border-app-muted text-app-muted'
            }`}
          >
            <StarIcon size={15} filled={onlyStarred} className={onlyStarred ? 'text-amber-500 fill-amber-500' : 'text-app-muted'} />
            <span>{onlyStarred ? 'Đang lọc mục đánh dấu' : 'Chỉ xem mục đánh dấu'}</span>
          </button>

          <span className="font-medium">
            {activeList.length} kết quả phù hợp
          </span>
        </div>
      </div>

      {/* Table / List View */}
      <div className="border border-app-border rounded-2xl bg-app-surface overflow-hidden shadow-sm">
        {paginatedList.length === 0 ? (
          <div className="p-16 text-center text-sm text-app-muted space-y-2">
            <SearchIcon size={36} className="mx-auto text-app-muted/50" />
            <div className="font-medium text-app-text">Không tìm thấy mục phù hợp</div>
            <p className="text-xs">Hãy thử thay đổi từ khóa tìm kiếm hoặc mở rộng các bộ lọc.</p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="px-6 py-3 border-b border-app-border bg-app text-xs uppercase tracking-wider text-app-muted font-medium flex items-center justify-between">
              <span>
                {activeTab === 'mimikara' 
                  ? 'TỪ VỰNG MIMIKARA N3 VÀ Ý NGHĨA' 
                  : activeTab === 'vocab' 
                  ? 'TỪ VỰNG VÀ Ý NGHĨA' 
                  : 'MẪU NGỮ PHÁP VÀ Ý NGHĨA'}
              </span>
              <span>THAO TÁC</span>
            </div>

            <div className="divide-y divide-app-border/50">
              {paginatedList.map(item => {
                const key = getProgressKey(item);
                const p = progressMap[key];
                const isStarred = p?.starred || false;
                const isVocab = 'word' in item;
                const isMimikara = 'hanViet' in item;
                const mItem = isMimikara ? (item as MimikaraItem) : null;

                const displayTitle = isVocab 
                  ? (item as VocabItem).word 
                  : isMimikara 
                  ? ((item as MimikaraItem).kanji || (item as MimikaraItem).reading) 
                  : (item as GrammarItem).pattern;

                const readingText = isVocab 
                  ? (item as VocabItem).reading 
                  : isMimikara && (item as MimikaraItem).kanji 
                  ? (item as MimikaraItem).reading 
                  : null;

                const audioText = isVocab 
                  ? (item as VocabItem).word 
                  : isMimikara 
                  ? ((item as MimikaraItem).kanji || (item as MimikaraItem).reading) 
                  : (item as GrammarItem).pattern;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDetail(item)}
                    className="py-3.5 px-4 sm:py-4 sm:px-5 hover:bg-app/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-5"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      {/* Main Japanese Heading */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-medium text-app-muted px-1.5 py-0.5 rounded bg-app border border-app-border/70" title={`Số thứ tự: ${item.stt}`}>
                          #{item.stt}
                        </span>

                        <span className="text-lg sm:text-[21px] font-jp font-normal text-app-text tracking-wide leading-snug">
                          {displayTitle}
                        </span>

                        {readingText && (
                          <span className="text-sm font-jp font-normal text-app-accent">
                            【{readingText}】
                          </span>
                        )}

                        {isMimikara && mItem?.hanViet && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                            {mItem.hanViet}
                          </span>
                        )}

                        {isMimikara && mItem?.unit && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium font-jp">
                            {mItem.unit}
                          </span>
                        )}

                        {isMimikara && mItem?.usage && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium">
                            {mItem.usage}
                          </span>
                        )}

                        {isVocab && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-app-border bg-app text-app-muted font-medium">
                            {(item as VocabItem).pos}
                          </span>
                        )}

                        {!isVocab && !isMimikara && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-app-border bg-app text-app-muted font-medium">
                            {(item as GrammarItem).category}
                          </span>
                        )}

                        {('freq' in item) && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                            Đề thi: {item.freq} lần
                          </span>
                        )}

                        {p && p.box > 0 && (
                          <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium border ${
                            p.box >= 5
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'border-app-border bg-app text-app-text'
                          }`}>
                            {p.box >= 5 ? 'Đã thuộc' : `Hộp ${p.box}`}
                          </span>
                        )}
                      </div>

                      {/* Meaning */}
                      <div className="text-sm sm:text-[15px] text-app-text font-normal leading-normal">
                        {item.meaning}
                      </div>

                      {/* Collocations or Compounds preview for Mimikara */}
                      {isMimikara && (
                        <>
                          {mItem?.collocations && mItem.collocations.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-teal-700 dark:text-teal-400">
                                Cụm từ:
                              </span>
                              {mItem.collocations.slice(0, 3).map((c, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="inline-flex items-center text-[11px] px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 font-jp"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {mItem?.examples && mItem.examples.length > 0 && (
                            <div className="text-xs sm:text-[13px] text-app-muted font-jp font-normal leading-relaxed pt-1 border-t border-app-border/30">
                              <span className="text-app-text/90 mr-2">{mItem.examples[0].jp}</span>
                              {mItem.examples[0].vi && <span className="text-app-muted">/ {mItem.examples[0].vi}</span>}
                            </div>
                          )}
                        </>
                      )}

                      {/* Confusables for Grammar */}
                      {('confusables' in item) && (item as GrammarItem).confusables && (item as GrammarItem).confusables.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                            Cẩn thận nhầm:
                          </span>
                          {(item as GrammarItem).confusables.map((conf, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-flex items-center text-[11px] px-2 py-0.5 rounded border border-amber-300/60 bg-amber-50/70 dark:bg-amber-950/30 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 font-jp"
                            >
                              {conf}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Example for Vocab or Grammar */}
                      {('exampleJa' in item) && item.exampleJa && (() => {
                        let exJa = item.exampleJa || '';
                        let exVi = item.exampleVi || '';
                        if (exJa.endsWith('。T') && exVi.startsWith('ôi')) {
                          exJa = exJa.slice(0, -1);
                          exVi = 'T' + exVi;
                        }
                        return (
                          <div className="text-xs sm:text-[13px] text-app-muted font-jp font-normal leading-relaxed pt-1 border-t border-app-border/30">
                            <span className="text-app-text/90 mr-2">{exJa}</span>
                            {exVi && <span className="text-app-muted">/ {exVi}</span>}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Action buttons on right */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center text-xs">
                      {/* Audio Button */}
                      <AudioButton
                        text={audioText}
                        size="sm"
                        showText={true}
                      />

                      {/* Star Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isVocab) onToggleStarVocab(item as VocabItem);
                          else if (isMimikara && onToggleStarMimikara) onToggleStarMimikara(item as MimikaraItem);
                          else onToggleStarGrammar(item as GrammarItem);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs notebook-fade font-medium ${
                          isStarred
                            ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 shadow-sm'
                            : 'border-app-border bg-app-surface text-app-muted hover:border-app-muted hover:text-app-text'
                        }`}
                        title={isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                      >
                        <StarIcon size={14} filled={isStarred} className={isStarred ? 'text-amber-500 fill-amber-500' : 'text-app-muted'} />
                        <span className="hidden sm:inline">{isStarred ? 'Đã lưu' : 'Đánh dấu'}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-950/60 text-app-error hover:border-app-error hover:bg-rose-50 dark:hover:bg-rose-950/30 notebook-fade text-xs font-medium"
                        title="Xoá khỏi cơ sở dữ liệu"
                      >
                        <TrashIcon size={14} />
                        <span className="hidden sm:inline">Xoá</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-5 border-t border-app-border flex items-center justify-between text-xs sm:text-sm text-app-muted bg-app">
            <span>Trang {page} trên tổng {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-app-border hover:bg-app-surface disabled:opacity-30 notebook-fade"
              >
                <ArrowLeftIcon size={14} />
                <span>Quay lại</span>
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-app-border hover:bg-app-surface disabled:opacity-30 notebook-fade"
              >
                <span>Tiếp tục</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-surface border border-app-border rounded-2xl w-full max-w-xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl notebook-fade">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider text-app-muted font-medium">
                    {'word' in selectedDetail 
                      ? `Bộ ${selectedDetail.deck} · ${selectedDetail.pos} · #${selectedDetail.stt} · Xuất hiện ${selectedDetail.freq} lần` 
                      : 'hanViet' in selectedDetail 
                      ? `Mimikara Oboeru N3 · #${selectedDetail.stt}` 
                      : `${selectedDetail.category} · #${selectedDetail.stt} · Xuất hiện ${selectedDetail.freq} lần`}
                  </span>

                  {'unit' in selectedDetail && (selectedDetail as MimikaraItem).unit && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-jp">
                      {(selectedDetail as MimikaraItem).unit}
                    </span>
                  )}

                  {'usage' in selectedDetail && (selectedDetail as MimikaraItem).usage && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {(selectedDetail as MimikaraItem).usage}
                    </span>
                  )}
                </div>

                <div className="text-2xl sm:text-3xl font-jp font-normal text-app-text mt-2 leading-snug">
                  {'word' in selectedDetail 
                    ? selectedDetail.word 
                    : 'hanViet' in selectedDetail 
                    ? ((selectedDetail as MimikaraItem).kanji || (selectedDetail as MimikaraItem).reading) 
                    : selectedDetail.pattern}
                </div>

                {'reading' in selectedDetail && (
                  <div className="text-base font-jp font-normal text-app-accent mt-0.5">
                    【{(selectedDetail as any).reading}】
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <AudioButton 
                  text={
                    'word' in selectedDetail 
                      ? selectedDetail.word 
                      : 'hanViet' in selectedDetail 
                      ? ((selectedDetail as MimikaraItem).kanji || (selectedDetail as MimikaraItem).reading) 
                      : selectedDetail.pattern
                  } 
                  size="md" 
                  showText={false} 
                />
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 rounded-lg border border-app-border hover:border-app-muted text-app-muted hover:text-app-text"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {/* ÂM HÁN VIỆT */}
            {'hanViet' in selectedDetail && (selectedDetail as MimikaraItem).hanViet && (
              <div className="pt-4 border-t border-app-border space-y-1">
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium">ÂM HÁN VIỆT</div>
                <div className="inline-block px-3 py-1 rounded-lg text-sm font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {(selectedDetail as MimikaraItem).hanViet}
                </div>
              </div>
            )}

            {/* Ý NGHĨA */}
            <div className="pt-4 border-t border-app-border space-y-1">
              <div className="text-xs uppercase tracking-wider text-app-muted font-medium">Ý NGHĨA</div>
              <div className="text-base text-app-text leading-relaxed">{selectedDetail.meaning}</div>
            </div>

            {/* MIMIKARA: Collocations (Cụm từ liên kết / Đi kèm) */}
            {'collocations' in selectedDetail && (selectedDetail as MimikaraItem).collocations && (selectedDetail as MimikaraItem).collocations!.length > 0 && (
              <div className="pt-4 border-t border-app-border space-y-2">
                <div className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
                  CỤM TỪ LIÊN KẾT / ĐI KÈM (COLLOCATIONS)
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedDetail as MimikaraItem).collocations!.map((col, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-jp"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MIMIKARA: Compounds (Từ ghép) */}
            {'compounds' in selectedDetail && (selectedDetail as MimikaraItem).compounds && (selectedDetail as MimikaraItem).compounds!.length > 0 && (
              <div className="pt-4 border-t border-app-border space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                  TỪ GHÉP (COMPOUNDS)
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedDetail as MimikaraItem).compounds!.map((comp, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-jp"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MIMIKARA: Synonyms / Antonyms / Related */}
            {'hanViet' in selectedDetail && (() => {
              const m = selectedDetail as MimikaraItem;
              const hasSyn = m.synonyms && m.synonyms.length > 0;
              const hasAnt = m.antonyms && m.antonyms.length > 0;
              const hasRel = m.related && m.related.length > 0;

              if (!hasSyn && !hasAnt && !hasRel) return null;

              return (
                <div className="pt-4 border-t border-app-border space-y-3">
                  {hasSyn && (
                    <div className="space-y-1.5">
                      <div className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                        TỪ ĐỒNG NGHĨA (SYNONYMS)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.synonyms!.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-xs sm:text-sm px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-jp"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasAnt && (
                    <div className="space-y-1.5">
                      <div className="text-xs uppercase tracking-wider text-rose-700 dark:text-rose-400 font-semibold">
                        TỪ TRÁI NGHĨA (ANTONYMS)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.antonyms!.map((a, idx) => (
                          <span
                            key={idx}
                            className="text-xs sm:text-sm px-2.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-jp"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasRel && (
                    <div className="space-y-1.5">
                      <div className="text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 font-semibold">
                        TỪ LIÊN QUAN (RELATED)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.related!.map((r, idx) => (
                          <span
                            key={idx}
                            className="text-xs sm:text-sm px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-jp"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* GRAMMAR: FORMATION & CONTEXT */}
            {'formation' in selectedDetail && (
              <>
                <div className="pt-4 border-t border-app-border space-y-1.5">
                  <div className="text-xs uppercase tracking-wider text-app-muted font-medium">CÁCH GHÉP (KIỂU V)</div>
                  <div className="font-mono text-sm text-app-text bg-app p-3 rounded-lg border border-app-border">
                    {(selectedDetail as GrammarItem).formation}
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border space-y-1">
                  <div className="text-xs uppercase tracking-wider text-app-muted font-medium">BỐI CẢNH SỬ DỤNG</div>
                  <div className="text-sm text-app-muted leading-relaxed">
                    {(selectedDetail as GrammarItem).context}
                  </div>
                </div>
              </>
            )}

            {/* GRAMMAR: CONFUSABLES */}
            {'confusables' in selectedDetail && (selectedDetail as GrammarItem).confusables && (selectedDetail as GrammarItem).confusables.length > 0 && (
              <div className="pt-4 border-t border-app-border space-y-2">
                <div className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertCircleIcon size={14} />
                  <span>CẨN THẬN DỄ NHẦM LẪN VỚI</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedDetail as GrammarItem).confusables.map((conf, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm px-3 py-1 rounded-lg border border-amber-300/60 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 font-jp"
                    >
                      {conf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MIMIKARA: EXAMPLES */}
            {'examples' in selectedDetail && (selectedDetail as MimikaraItem).examples && (selectedDetail as MimikaraItem).examples!.length > 0 && (
              <div className="pt-4 border-t border-app-border space-y-3">
                <div className="text-xs uppercase tracking-wider text-app-muted font-medium">
                  CÂU VÍ DỤ SONG NGỮ ({(selectedDetail as MimikaraItem).examples!.length} CÂU)
                </div>
                <div className="space-y-3">
                  {(selectedDetail as MimikaraItem).examples!.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-app-border bg-app space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-jp text-base sm:text-lg text-app-text font-normal leading-relaxed">
                          {ex.jp}
                        </div>
                        <AudioButton text={ex.jp} size="sm" showText={false} />
                      </div>
                      {ex.reading && ex.reading !== ex.jp && (
                        <div className="text-xs font-jp text-app-accent">
                          {ex.reading}
                        </div>
                      )}
                      {ex.vi && (
                        <div className="text-xs sm:text-sm text-app-muted leading-relaxed">
                          {ex.vi}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VOCAB / GRAMMAR: SINGLE EXAMPLE */}
            {('exampleJa' in selectedDetail) && (selectedDetail as VocabItem | GrammarItem).exampleJa && (() => {
              let exJa = (selectedDetail as VocabItem | GrammarItem).exampleJa || '';
              let exVi = (selectedDetail as VocabItem | GrammarItem).exampleVi || '';
              if (exJa.endsWith('。T') && exVi.startsWith('ôi')) {
                exJa = exJa.slice(0, -1);
                exVi = 'T' + exVi;
              }
              return (
                <div className="pt-4 border-t border-app-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-app-muted font-medium">VÍ DỤ VÀ DỊCH NGHĨA</span>
                    <AudioButton text={exJa} size="sm" showText={true} />
                  </div>
                  <div className="font-jp font-normal text-lg text-app-text leading-relaxed">
                    {exJa}
                  </div>
                  {exVi && (
                    <div className="text-sm text-app-muted leading-relaxed">
                      {exVi}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-app-border flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleDeleteItem(e, selectedDetail)}
                className="flex items-center gap-1.5 text-xs text-app-error hover:underline font-medium"
              >
                <TrashIcon size={15} />
                <span>Xoá mục này</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="h-11 px-6 rounded-xl bg-app-accent text-white text-xs font-medium hover:opacity-90"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
