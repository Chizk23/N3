export type VocabPOS = "noun" | "verb" | "adjective" | "adverb" | "katakana";

export interface VocabItem {
  id: string;            // `${deck}-${stt}` hoặc hash của word+reading
  deck: "A911" | "B349";
  stt: number;
  word: string;          // 栄養 / 電子レンジ
  reading: string;       // えいよう (có thể nhiều cách đọc, ngăn bằng ／ 、 ,)
  meaning: string;       // tiếng Việt, có thể nhiều nghĩa ngăn bằng , hoặc ;
  pos: VocabPOS;         // theo nhóm trong bảng gốc
  exampleJa: string;
  exampleVi: string;
  freq: number;          // Số lần xuất hiện
  highlighted?: boolean; // từ khó / hay nhầm
}

export interface MimikaraExample {
  jp: string;
  reading?: string;
  vi: string;
}

export interface MimikaraItem {
  id: string;            // MIMIKARA-0001
  stt: number;           // 1 to 880
  kanji: string;         // 男性 (hoặc rỗng nếu chỉ có kana)
  hanViet: string;       // NAM TÍNH
  reading: string;       // だんせい
  meaning: string;       // đàn ông, nam giới
  displayWord: string;   // kanji || reading
  unit?: string;
  level?: number;
  usage?: string;
  collocations?: string[];
  compounds?: string[];
  synonyms?: string[];
  antonyms?: string[];
  related?: string[];
  examples?: MimikaraExample[];
}

export type GrammarCategory = "N3" | "KINH_NGU" | "LIEN_TU" | "PHO_TU" | "N4_TRONG_DE_N3";

export interface GrammarItem {
  id: string;
  stt: number;
  category: GrammarCategory;
  pattern: string;        // ～において
  meaning: string;        // cột Ý nghĩa (có thể "1. ... 2. ...")
  exampleJa: string;
  exampleVi: string;
  freq: number;
  context: string;        // cot Ngu canh su dung
  formation: string;      // cot Cach chia
  confusables: string[];  // cot De nham lan voi
}

export interface Progress {
  box: number;       // 0: chua hoc, 1-5: Leitner boxes
  dueAt: number;     // timestamp khi nao can on
  correct: number;   // so lan tra loi dung
  wrong: number;     // so lan tra loi sai
  lastSeen: number;  // timestamp lan cuoi on
  starred: boolean;  // danh dau yeu thich
  leech: boolean;    // hay sai
}

export interface DailyStat {
  date: string;      // YYYY-MM-DD
  studiedCount: number;
  correctCount: number;
  wrongCount: number;
}

export interface AppSettings {
  cardsPerSession: number; // fallback/default chung
  vocabCardsPerSession?: number; // Số thẻ từ vựng mỗi phiên
  grammarCardsPerSession?: number; // Số thẻ ngữ pháp mỗi phiên
  mimikaraCardsPerSession?: number; // Số thẻ Mimikara mỗi phiên
  autoPronounce: boolean;  // tự động phát âm khi lật thẻ / hiện câu
  showFurigana: boolean;   // hiện cách đọc gợi ý
  darkMode: boolean;       // chế độ ban đêm
  speechRate: number;      // 0.8 - 1.2
}

export type StudyModeVocab = "flashcard" | "quiz" | "typing" | "matching" | "quickReview";

export type StudyModeMimikara = 
  | "flashcard"
  | "hanVietQuiz"
  | "meaningQuiz"
  | "readingQuiz"
  | "typing"
  | "browse";

export type StudyModeGrammar = 
  | "card" 
  | "context" 
  | "meaning" 
  | "formation" 
  | "cloze";

export interface QuizQuestion {
  id: string;
  type: string;
  prompt: string;
  subPrompt?: string;
  hint?: string;
  targetItem: VocabItem | GrammarItem | MimikaraItem;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  audioText?: string;
}
