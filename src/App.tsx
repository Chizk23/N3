import React, { useState, useEffect, useMemo } from 'react';
import { 
  VocabItem, 
  GrammarItem, 
  MimikaraItem,
  Progress, 
  DailyStat, 
  AppSettings 
} from './types';
import { dbManager } from './lib/db';
import { getProgressKey } from './lib/srs';
import { diffDateKeys, getLocalDateKey, shiftDateKey } from './lib/date';
import { Navbar, TabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { VocabStudy } from './components/VocabStudy';
import { GrammarStudy } from './components/GrammarStudy';
import { MimikaraStudy } from './components/MimikaraStudy';
import { DictionaryView } from './components/DictionaryView';
import { StatisticsView } from './components/StatisticsView';
import { ImportView } from './components/ImportView';
import { SettingsView } from './components/SettingsView';
import { MiniTestModal } from './components/MiniTestModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [grammarList, setGrammarList] = useState<GrammarItem[]>([]);
  const [mimikaraList, setMimikaraList] = useState<MimikaraItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    cardsPerSession: 20,
    vocabCardsPerSession: 20,
    grammarCardsPerSession: 15,
    mimikaraCardsPerSession: 20,
    autoPronounce: true,
    showFurigana: true,
    darkMode: false,
    speechRate: 0.95
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMiniTestOpen, setIsMiniTestOpen] = useState<boolean>(false);
  const [activeVocabDeck, setActiveVocabDeck] = useState<'A911' | 'B349' | 'all'>('all');

  const loadAppData = async () => {
    try {
      const [v, g, m, p, s, cfg] = await Promise.all([
        dbManager.getAllVocab(),
        dbManager.getAllGrammar(),
        dbManager.getAllMimikara(),
        dbManager.getAllProgress(),
        dbManager.getAllStats(),
        dbManager.getSettings()
      ]);

      setVocabList(v);
      setGrammarList(g);
      setMimikaraList(m);
      setProgressMap(p);
      setStats(s);
      setSettings(cfg);

      if (cfg.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to load application data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const streak = useMemo(() => {
    if (stats.length === 0) return 0;
    const sorted = [...stats].sort((a, b) => b.date.localeCompare(a.date));
    const today = getLocalDateKey();
    const yesterday = shiftDateKey(today, -1);

    if (sorted[0].date !== today && sorted[0].date !== yesterday) {
      return 0;
    }

    let count = 1;
    let prevDate = sorted[0].date;

    for (let i = 1; i < sorted.length; i++) {
      const curDate = sorted[i].date;
      const diffDays = diffDateKeys(prevDate, curDate);
      if (diffDays === 1) {
        count++;
        prevDate = curDate;
      } else {
        break;
      }
    }
    return count;
  }, [stats]);

  const dueTodayCount = useMemo(() => {
    const now = Date.now();
    let count = 0;
    for (const v of vocabList) {
      const p = progressMap[getProgressKey(v)];
      if (p && p.box > 0 && p.dueAt <= now) count++;
    }
    for (const g of grammarList) {
      const p = progressMap[getProgressKey(g)];
      if (p && p.box > 0 && p.dueAt <= now) count++;
    }
    for (const m of mimikaraList) {
      const p = progressMap[getProgressKey(m)];
      if (p && p.box > 0 && p.dueAt <= now) count++;
    }
    return count;
  }, [vocabList, grammarList, mimikaraList, progressMap]);

  const handleUpdateProgress = async (key: string, updated: Progress, isCorrect: boolean) => {
    setProgressMap(prev => ({ ...prev, [key]: updated }));
    await dbManager.saveProgress(key, updated);
    await dbManager.recordDailyStudy(isCorrect);
    const updatedStats = await dbManager.getAllStats();
    setStats(updatedStats);
  };

  const handleToggleStar = async (item: VocabItem | GrammarItem | MimikaraItem) => {
    const newStar = await dbManager.toggleStar(item);
    const key = getProgressKey(item);
    setProgressMap(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { box: 0, dueAt: 0, correct: 0, wrong: 0, lastSeen: 0, starred: false, leech: false }),
        starred: newStar
      }
    }));
  };

  const handleDeleteVocab = async (item: VocabItem) => {
    await dbManager.deleteVocab(item);
    const updatedList = await dbManager.getAllVocab();
    setVocabList(updatedList);
    const updatedProg = await dbManager.getAllProgress();
    setProgressMap(updatedProg);
  };

  const handleDeleteGrammar = async (item: GrammarItem) => {
    await dbManager.deleteGrammar(item);
    const updatedList = await dbManager.getAllGrammar();
    setGrammarList(updatedList);
    const updatedProg = await dbManager.getAllProgress();
    setProgressMap(updatedProg);
  };

  const handleDeleteMimikara = async (item: MimikaraItem) => {
    await dbManager.deleteMimikara(item);
    const updatedList = await dbManager.getAllMimikara();
    setMimikaraList(updatedList);
    const updatedProg = await dbManager.getAllProgress();
    setProgressMap(updatedProg);
  };

  const handleResetMimikara = async () => {
    try {
      const refreshed = await dbManager.resetMimikaraDatabase();
      setMimikaraList([...refreshed]);
      alert('Đã xóa database cũ và nạp lại thành công 880 từ vựng Mimikara chuẩn từ JSON!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi làm mới database: ' + String(err));
    }
  };

  const handleResetVocab = async () => {
    try {
      const refreshed = await dbManager.resetVocabDatabase();
      setVocabList([...refreshed]);
      alert('Đã nạp lại thành công toàn bộ 1.262 từ vựng N3 (Bộ A 911 từ + Bộ B 351 từ) vào database!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi làm mới database từ vựng: ' + String(err));
    }
  };

  const handleImportVocab = async (items: VocabItem[], replace: boolean) => {
    await dbManager.saveVocabBatch(items, replace);
    const all = await dbManager.getAllVocab();
    setVocabList(all);
  };

  const handleImportGrammar = async (items: GrammarItem[], replace: boolean) => {
    await dbManager.saveGrammarBatch(items, replace);
    const all = await dbManager.getAllGrammar();
    setGrammarList(all);
  };

  const handleUpdateSettings = async (cfg: AppSettings) => {
    setSettings(cfg);
    await dbManager.saveSettings(cfg);
  };

  const handleToggleDarkMode = () => {
    handleUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const handleStartVocab = (deck: 'A911' | 'B349' | 'all' = 'all') => {
    setActiveVocabDeck(deck);
    setCurrentTab('vocab');
  };

  const handleStartGrammar = () => {
    setCurrentTab('grammar');
  };

  const handleStartMimikara = () => {
    setCurrentTab('mimikara');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app text-app-muted">
        <div className="text-xs">Đang tải dữ liệu học tập...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-app flex flex-col font-sans notebook-fade">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streak={streak}
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenMiniTest={() => setIsMiniTestOpen(true)}
        dueTodayCount={dueTodayCount}
        vocabCount={vocabList.length}
        grammarCount={grammarList.length}
        mimikaraCount={mimikaraList.length}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 pb-24 sm:pb-16">
        {currentTab === 'dashboard' && (
          <Dashboard
            vocabList={vocabList}
            grammarList={grammarList}
            mimikaraList={mimikaraList}
            progressMap={progressMap}
            streak={streak}
            onStartVocab={handleStartVocab}
            onStartGrammar={handleStartGrammar}
            onStartMimikara={handleStartMimikara}
            onOpenMiniTest={() => setIsMiniTestOpen(true)}
            onGoToImport={() => setCurrentTab('import')}
            onGoToDictionary={() => setCurrentTab('dictionary')}
          />
        )}

        {currentTab === 'vocab' && (
          <VocabStudy
            vocabList={vocabList}
            progressMap={progressMap}
            onUpdateProgress={handleUpdateProgress}
            onToggleStar={handleToggleStar}
            onReloadDatabase={handleResetVocab}
            initialDeck={activeVocabDeck}
            cardsPerSession={settings.vocabCardsPerSession || settings.cardsPerSession || 20}
            onUpdateCardsPerSession={(count) => handleUpdateSettings({ ...settings, vocabCardsPerSession: count })}
            autoPronounce={settings.autoPronounce}
          />
        )}

        {currentTab === 'grammar' && (
          <GrammarStudy
            grammarList={grammarList}
            progressMap={progressMap}
            onUpdateProgress={handleUpdateProgress}
            onToggleStar={handleToggleStar}
            cardsPerSession={settings.grammarCardsPerSession || 15}
            onUpdateCardsPerSession={(count) => handleUpdateSettings({ ...settings, grammarCardsPerSession: count })}
            autoPronounce={settings.autoPronounce}
          />
        )}

        {currentTab === 'mimikara' && (
          <MimikaraStudy
            items={mimikaraList}
            progressMap={progressMap}
            onUpdateProgress={handleUpdateProgress}
            onToggleStar={handleToggleStar}
            onDeleteItem={handleDeleteMimikara}
            onReloadDatabase={handleResetMimikara}
            cardsPerSession={settings.mimikaraCardsPerSession || 20}
            onUpdateCardsPerSession={(count) => handleUpdateSettings({ ...settings, mimikaraCardsPerSession: count })}
            autoPronounce={settings.autoPronounce}
          />
        )}

        {currentTab === 'dictionary' && (
          <DictionaryView
            vocabList={vocabList}
            grammarList={grammarList}
            mimikaraList={mimikaraList}
            progressMap={progressMap}
            onToggleStarVocab={handleToggleStar}
            onToggleStarGrammar={handleToggleStar}
            onToggleStarMimikara={handleToggleStar}
            onDeleteVocab={handleDeleteVocab}
            onDeleteGrammar={handleDeleteGrammar}
            onDeleteMimikara={handleDeleteMimikara}
          />
        )}

        {currentTab === 'stats' && (
          <StatisticsView
            vocabList={vocabList}
            grammarList={grammarList}
            progressMap={progressMap}
            stats={stats}
            streak={streak}
          />
        )}

        {currentTab === 'import' && (
          <ImportView
            onImportVocab={handleImportVocab}
            onImportGrammar={handleImportGrammar}
            vocabCount={vocabList.length}
            grammarCount={grammarList.length}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onDataReset={loadAppData}
          />
        )}
      </main>

      <MiniTestModal
        isOpen={isMiniTestOpen}
        onClose={() => setIsMiniTestOpen(false)}
        vocabList={vocabList}
        grammarList={grammarList}
        mimikaraList={mimikaraList}
        onComplete={async (score, total) => {
          const isPass = (score / total) >= 0.7;
          await dbManager.recordDailyStudy(isPass);
          const updatedStats = await dbManager.getAllStats();
          setStats(updatedStats);
        }}
      />
    </div>
  );
};

export default App;
