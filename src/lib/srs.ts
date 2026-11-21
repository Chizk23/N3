import { Progress, VocabItem, GrammarItem, MimikaraItem } from '../types';

/**
 * Leitner 5-Box Spaced Repetition System (SRS)
 * Box 0: Chưa học
 * Box 1: 8 giờ (hoặc 1 ngày)
 * Box 2: 2 ngày
 * Box 3: 4 ngày
 * Box 4: 7 ngày
 * Box 5: 14 ngày (Đã thuộc / Mastered)
 */
export const BOX_INTERVALS_HOURS = [0, 8, 48, 96, 168, 336];

/**
 * Progress key: shared between Vocab items with same word+reading (so A911 and B349 share progress)
 */
export function getProgressKey(item: VocabItem | GrammarItem | MimikaraItem): string {
  if ('word' in item) {
    return `vocab_${item.word}_${item.reading}`;
  }
  if ('hanViet' in item) {
    return `mimikara_${item.id}`;
  }
  return `grammar_${item.id}`;
}

export function createInitialProgress(): Progress {
  return {
    box: 0,
    dueAt: 0,
    correct: 0,
    wrong: 0,
    lastSeen: 0,
    starred: false,
    leech: false
  };
}

/**
 * Handle a study response (correct or wrong)
 */
export function updateProgress(
  current: Progress = createInitialProgress(),
  isCorrect: boolean
): Progress {
  const now = Date.now();
  const newCorrect = isCorrect ? current.correct + 1 : current.correct;
  const newWrong = isCorrect ? current.wrong : current.wrong + 1;

  let newBox = current.box;

  if (isCorrect) {
    // Advance box up to 5
    newBox = Math.min(5, Math.max(1, current.box + 1));
  } else {
    // Reset back to box 1 on wrong
    newBox = 1;
  }

  // Calculate next due timestamp
  const intervalHours = BOX_INTERVALS_HOURS[newBox] || 8;
  const dueAt = now + intervalHours * 60 * 60 * 1000;

  // Leech detection: 4 or more wrongs, or high failure rate with at least 3 attempts
  const totalAttempts = newCorrect + newWrong;
  const isLeech = newWrong >= 4 || (totalAttempts >= 3 && (newWrong / totalAttempts) > 0.5);

  return {
    box: newBox,
    dueAt,
    correct: newCorrect,
    wrong: newWrong,
    lastSeen: now,
    starred: current.starred,
    leech: isLeech
  };
}

/**
 * Queue cards for a study session:
 * 1. Due review cards (box > 0 and dueAt <= now)
 * 2. New cards (box === 0), prioritized by frequency in exams (freq descending)
 * 3. Learning cards (box 1-4)
 */
export function buildStudyQueue<T extends VocabItem | GrammarItem>(
  items: T[],
  progressMap: Record<string, Progress>,
  limit: number = 20,
  minFreq: number = 0,
  onlyLeechOrStarred: boolean = false
): T[] {
  const now = Date.now();

  const filtered = items.filter(item => {
    if (minFreq > 0 && item.freq < minFreq) return false;
    const p = progressMap[getProgressKey(item)];
    if (onlyLeechOrStarred) {
      return p?.starred || p?.leech;
    }
    return true;
  });

  // Categorize
  const dueCards: T[] = [];
  const newCards: T[] = [];
  const otherCards: T[] = [];

  for (const item of filtered) {
    const p = progressMap[getProgressKey(item)];
    if (!p || p.box === 0) {
      newCards.push(item);
    } else if (p.dueAt <= now) {
      dueCards.push(item);
    } else {
      otherCards.push(item);
    }
  }

  // Sort new cards by exam frequency descending
  newCards.sort((a, b) => (b.freq || 0) - (a.freq || 0));

  // Sort due cards by dueAt ascending (most overdue first)
  dueCards.sort((a, b) => {
    const pa = progressMap[getProgressKey(a)];
    const pb = progressMap[getProgressKey(b)];
    return (pa?.dueAt || 0) - (pb?.dueAt || 0);
  });

  // Combine: prioritize due cards, then new cards, then other cards
  const combined = [...dueCards, ...newCards, ...otherCards];
  return combined.slice(0, limit);
}
