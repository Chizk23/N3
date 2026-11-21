import { VocabItem, GrammarItem, MimikaraItem, Progress, DailyStat, AppSettings } from '../types';
import { SAMPLE_VOCAB, SAMPLE_GRAMMAR } from '../data/sampleData';
import { MIMIKARA_880_DATA } from '../data/mimikara880';
import { createInitialProgress, getProgressKey } from './srs';

const DB_NAME = 'JLPT_N3_MASTER_DB';
const DB_VERSION = 2;

export interface AppDataBackup {
  version: number;
  exportedAt: string;
  vocab: VocabItem[];
  grammar: GrammarItem[];
  mimikara?: MimikaraItem[];
  progress: Record<string, Progress>;
  stats: DailyStat[];
  settings: AppSettings;
}

class DatabaseManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('vocab')) {
            db.createObjectStore('vocab', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('grammar')) {
            db.createObjectStore('grammar', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('mimikara')) {
            db.createObjectStore('mimikara', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('progress')) {
            db.createObjectStore('progress'); // key is progressKey
          }
          if (!db.objectStoreNames.contains('stats')) {
            db.createObjectStore('stats', { keyPath: 'date' });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings'); // key is 'app_settings'
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });

    return this.dbPromise;
  }

  private async getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.initDB();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- VOCABULARY ---
  public async getAllVocab(): Promise<VocabItem[]> {
    try {
      const store = await this.getStore('vocab', 'readonly');
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const items: VocabItem[] = req.result || [];
          if (items.length === 0) {
            this.saveVocabBatch(SAMPLE_VOCAB).then(() => resolve(SAMPLE_VOCAB));
          } else {
            items.sort((a, b) => a.stt - b.stt);
            resolve(items);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return SAMPLE_VOCAB;
    }
  }

  public async saveVocabBatch(items: VocabItem[], replace = false): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('vocab', 'readwrite');
      const store = tx.objectStore('vocab');
      if (replace) {
        store.clear();
      }
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async deleteVocab(item: VocabItem): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['vocab', 'progress'], 'readwrite');
      tx.objectStore('vocab').delete(item.id);
      const progKey = getProgressKey(item);
      tx.objectStore('progress').delete(progKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- GRAMMAR ---
  public async getAllGrammar(): Promise<GrammarItem[]> {
    try {
      const store = await this.getStore('grammar', 'readonly');
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          let items: GrammarItem[] = req.result || [];
          const hasCorruptedHeader = items.some(it => 
            it.pattern === 'NGỮ PHÁP' || 
            it.pattern.includes('TỔNG HỢP') || 
            (it.exampleJa && it.exampleJa.endsWith('。T'))
          );
          if (items.length === 0 || (items.length <= 10 && SAMPLE_GRAMMAR.length === 230) || hasCorruptedHeader) {
            this.saveGrammarBatch(SAMPLE_GRAMMAR, true).then(() => resolve(SAMPLE_GRAMMAR));
          } else {
            items.sort((a, b) => a.stt - b.stt);
            resolve(items);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return SAMPLE_GRAMMAR;
    }
  }

  public async saveGrammarBatch(items: GrammarItem[], replace = false): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('grammar', 'readwrite');
      const store = tx.objectStore('grammar');
      if (replace) {
        store.clear();
      }
      for (const item of items) {
        if (!item.id || item.id === `GRAMMAR-${item.stt}` || !item.id.includes('-0')) {
          item.id = `GRAMMAR-${String(item.stt).padStart(4, '0')}`;
        }
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async deleteGrammar(item: GrammarItem): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['grammar', 'progress'], 'readwrite');
      tx.objectStore('grammar').delete(item.id);
      const progKey = getProgressKey(item);
      tx.objectStore('progress').delete(progKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- MIMIKARA N3 (880 TỪ) ---
  public async getAllMimikara(): Promise<MimikaraItem[]> {
    try {
      const store = await this.getStore('mimikara', 'readonly');
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          let items: MimikaraItem[] = req.result || [];
          
          // Kiểm tra xem database hiện tại có chứa dữ liệu phiên bản mới đầy đủ Unit & Ví dụ không
          const versionKey = 'MIMIKARA_DATA_VERSION_KEY';
          let isVersionMatch = false;
          try {
            isVersionMatch = localStorage.getItem(versionKey) === '20261120_rich_units_v5';
          } catch {}

          const hasMissingUnitOrExamples = items.some(it => !it.unit || !it.examples || it.examples.length === 0);
          const isOutdated = items.length !== 880 || !isVersionMatch || hasMissingUnitOrExamples;

          if (isOutdated) {
            console.log('Đang làm mới cơ sở dữ liệu Mimikara 880 từ phiên bản mới giàu thông tin (Unit, Collocations, Examples)...');
            this.saveMimikaraBatch(MIMIKARA_880_DATA, true).then(() => {
              try {
                localStorage.setItem(versionKey, '20261120_rich_units_v5');
              } catch {}
              resolve(MIMIKARA_880_DATA);
            });
          } else {
            items.sort((a, b) => a.stt - b.stt);
            resolve(items);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu Mimikara:', err);
      return MIMIKARA_880_DATA;
    }
  }

  public async resetMimikaraDatabase(): Promise<MimikaraItem[]> {
    await this.saveMimikaraBatch(MIMIKARA_880_DATA, true);
    try {
      localStorage.setItem('MIMIKARA_DATA_VERSION_KEY', '20261120_rich_units_v5');
    } catch {}
    return MIMIKARA_880_DATA;
  }

  public async saveMimikaraBatch(items: MimikaraItem[], clearExisting = false): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('mimikara', 'readwrite');
      const store = tx.objectStore('mimikara');
      if (clearExisting) {
        store.clear();
      }
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async deleteMimikara(item: MimikaraItem): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['mimikara', 'progress'], 'readwrite');
      tx.objectStore('mimikara').delete(item.id);
      const progKey = getProgressKey(item);
      tx.objectStore('progress').delete(progKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async addMimikara(item: MimikaraItem): Promise<void> {
    const store = await this.getStore('mimikara', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- PROGRESS ---
  public async getAllProgress(): Promise<Record<string, Progress>> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('progress', 'readonly');
        const store = tx.objectStore('progress');
        const map: Record<string, Progress> = {};
        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest).result;
          if (cursor) {
            map[cursor.key as string] = cursor.value;
            cursor.continue();
          } else {
            resolve(map);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return {};
    }
  }

  public async saveProgress(key: string, progress: Progress): Promise<void> {
    try {
      const store = await this.getStore('progress', 'readwrite');
      store.put(progress, key);
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  public async toggleStar(item: VocabItem | GrammarItem | MimikaraItem): Promise<boolean> {
    const key = getProgressKey(item);
    const all = await this.getAllProgress();
    const current = all[key] || createInitialProgress();
    const newStarred = !current.starred;
    const updated: Progress = { ...current, starred: newStarred };
    await this.saveProgress(key, updated);
    return newStarred;
  }

  // --- STATS ---
  public async recordDailyStudy(isCorrect: boolean): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const store = await this.getStore('stats', 'readwrite');
      const req = store.get(today);
      req.onsuccess = () => {
        const stat: DailyStat = req.result || {
          date: today,
          studiedCount: 0,
          correctCount: 0,
          wrongCount: 0
        };
        stat.studiedCount += 1;
        if (isCorrect) stat.correctCount += 1;
        else stat.wrongCount += 1;
        store.put(stat);
      };
    } catch (e) {
      console.error('Failed to record stats', e);
    }
  }

  public async getAllStats(): Promise<DailyStat[]> {
    try {
      const store = await this.getStore('stats', 'readonly');
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // --- SETTINGS ---
  public async getSettings(): Promise<AppSettings> {
    const defaultSettings: AppSettings = {
      cardsPerSession: 20,
      vocabCardsPerSession: 20,
      grammarCardsPerSession: 15,
      autoPronounce: true,
      showFurigana: true,
      darkMode: false,
      speechRate: 0.95
    };

    try {
      const store = await this.getStore('settings', 'readonly');
      return new Promise((resolve) => {
        const req = store.get('app_settings');
        req.onsuccess = () => {
          if (!req.result) {
            resolve(defaultSettings);
          } else {
            const res = req.result;
            resolve({
              ...defaultSettings,
              ...res,
              vocabCardsPerSession: res.vocabCardsPerSession ?? res.cardsPerSession ?? 20,
              grammarCardsPerSession: res.grammarCardsPerSession ?? (res.cardsPerSession ? Math.min(res.cardsPerSession, 15) : 15)
            });
          }
        };
        req.onerror = () => resolve(defaultSettings);
      });
    } catch {
      return defaultSettings;
    }
  }

  public async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const store = await this.getStore('settings', 'readwrite');
      store.put(settings, 'app_settings');
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  // --- BACKUP EXPORT & IMPORT ---
  public async exportBackup(): Promise<AppDataBackup> {
    const [vocab, grammar, mimikara, progress, stats, settings] = await Promise.all([
      this.getAllVocab(),
      this.getAllGrammar(),
      this.getAllMimikara(),
      this.getAllProgress(),
      this.getAllStats(),
      this.getSettings()
    ]);

    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      vocab,
      grammar,
      mimikara,
      progress,
      stats,
      settings
    };
  }

  public async importBackup(backup: AppDataBackup): Promise<void> {
    if (!backup || !backup.version) throw new Error('File backup khong dung dinh dang.');

    if (backup.vocab && Array.isArray(backup.vocab)) {
      await this.saveVocabBatch(backup.vocab, true);
    }
    if (backup.grammar && Array.isArray(backup.grammar)) {
      await this.saveGrammarBatch(backup.grammar, true);
    }
    if (backup.mimikara && Array.isArray(backup.mimikara)) {
      await this.saveMimikaraBatch(backup.mimikara, true);
    }

    const db = await this.initDB();
    if (backup.progress) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('progress', 'readwrite');
        const store = tx.objectStore('progress');
        store.clear();
        for (const [k, v] of Object.entries(backup.progress)) {
          store.put(v, k);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    if (backup.stats && Array.isArray(backup.stats)) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('stats', 'readwrite');
        const store = tx.objectStore('stats');
        store.clear();
        for (const s of backup.stats) {
          store.put(s);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    if (backup.settings) {
      await this.saveSettings(backup.settings);
    }
  }

  public async resetAllData(): Promise<void> {
    const db = await this.initDB();
    await new Promise<void>((resolve, reject) => {
      const stores = ['vocab', 'grammar', 'progress', 'stats'];
      if (db.objectStoreNames.contains('mimikara')) {
        stores.push('mimikara');
      }
      const tx = db.transaction(stores, 'readwrite');
      stores.forEach(s => tx.objectStore(s).clear());
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    await this.saveVocabBatch(SAMPLE_VOCAB);
    await this.saveGrammarBatch(SAMPLE_GRAMMAR);
    await this.saveMimikaraBatch(MIMIKARA_880_DATA);
  }
}

export const dbManager = new DatabaseManager();
