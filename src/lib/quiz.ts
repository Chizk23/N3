import { VocabItem, GrammarItem, MimikaraItem, QuizQuestion } from '../types';

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function maskVocabInExample(sentence: string, word: string): { masked: string; found: boolean } {
  if (!sentence || !word) return { masked: sentence || '', found: false };

  if (sentence.includes(word)) {
    return {
      masked: sentence.replace(word, ' ＿＿＿ '),
      found: true
    };
  }

  return { masked: sentence, found: false };
}

export function maskGrammarInExample(sentence: string, pattern: string): { masked: string; found: boolean } {
  if (!sentence || !pattern) return { masked: sentence || '', found: false };

  const cleaned = pattern.replace(/[～~]/g, '').trim();
  const variants = cleaned.split(/[・／/、]/).map(v => v.trim()).filter(Boolean);

  for (const v of variants) {
    if (v.length >= 2 && sentence.includes(v)) {
      return {
        masked: sentence.replace(v, ' ＿＿＿ '),
        found: true
      };
    }
  }

  return { masked: sentence, found: false };
}

function pickVocabDistractors(
  target: VocabItem,
  allItems: VocabItem[],
  field: 'reading' | 'meaning' | 'word',
  count: number = 3
): string[] {
  const samePos = allItems.filter(item => item.id !== target.id && item.pos === target.pos);
  const otherPos = allItems.filter(item => item.id !== target.id && item.pos !== target.pos);

  const pool = [...shuffle(samePos), ...shuffle(otherPos)];
  const distractors: string[] = [];
  const targetVal = target[field];

  for (const item of pool) {
    const val = item[field];
    if (val && val !== targetVal && !distractors.includes(val)) {
      distractors.push(val);
      if (distractors.length >= count) break;
    }
  }

  return distractors;
}

function pickGrammarDistractors(
  target: GrammarItem,
  allItems: GrammarItem[],
  field: 'pattern' | 'meaning' | 'context' | 'formation',
  count: number = 3
): string[] {
  const distractors: string[] = [];
  const targetVal = target[field];

  if (target.confusables && target.confusables.length > 0) {
    for (const conf of target.confusables) {
      const baseConf = conf.replace(/\(.*?\)/g, '').trim();
      const matchItem = allItems.find(g => g.id !== target.id && (g.pattern.includes(baseConf) || conf.includes(g.pattern)));
      if (matchItem) {
        const val = matchItem[field];
        if (val && val !== targetVal && !distractors.includes(val)) {
          distractors.push(val);
        }
      } else if (field === 'pattern') {
        const cleanPattern = conf.split(' ')[0];
        if (cleanPattern && cleanPattern !== targetVal && !distractors.includes(cleanPattern)) {
          distractors.push(cleanPattern);
        }
      }
    }
  }

  const sameCat = allItems.filter(g => g.id !== target.id && g.category === target.category);
  for (const item of shuffle(sameCat)) {
    if (distractors.length >= count) break;
    const val = item[field];
    if (val && val !== targetVal && !distractors.includes(val)) {
      distractors.push(val);
    }
  }

  for (const item of shuffle(allItems)) {
    if (distractors.length >= count) break;
    if (item.id === target.id) continue;
    const val = item[field];
    if (val && val !== targetVal && !distractors.includes(val)) {
      distractors.push(val);
    }
  }

  return distractors.slice(0, count);
}

export function generateVocabQuizQuestion(
  target: VocabItem,
  allItems: VocabItem[],
  specificType?: 'kanji_to_reading' | 'reading_to_meaning' | 'meaning_to_kanji' | 'cloze'
): QuizQuestion {
  const types: ('kanji_to_reading' | 'reading_to_meaning' | 'meaning_to_kanji' | 'cloze')[] = [
    'kanji_to_reading',
    'reading_to_meaning',
    'meaning_to_kanji'
  ];

  const clozeTest = maskVocabInExample(target.exampleJa, target.word);
  if (clozeTest.found) {
    types.push('cloze');
  }

  const qType = specificType || types[Math.floor(Math.random() * types.length)];

  if (qType === 'kanji_to_reading') {
    const distractors = pickVocabDistractors(target, allItems, 'reading', 3);
    const options = shuffle([target.reading, ...distractors]);
    return {
      id: `vq_${target.id}_ktr`,
      type: 'kanji_to_reading',
      prompt: target.word,
      subPrompt: 'Chọn cách đọc Hiragana đúng của chữ Kanji này',
      hint: `Loại từ: ${target.pos}`,
      targetItem: target,
      options,
      correctAnswer: target.reading,
      explanation: `Đáp án đúng: ${target.word} 【${target.reading}】 — ${target.meaning}\n\nVí dụ: ${target.exampleJa}\n(${target.exampleVi})`,
      audioText: target.word
    };
  }

  if (qType === 'reading_to_meaning') {
    const distractors = pickVocabDistractors(target, allItems, 'meaning', 3);
    const options = shuffle([target.meaning, ...distractors]);
    return {
      id: `vq_${target.id}_rtm`,
      type: 'reading_to_meaning',
      prompt: `${target.word} 【${target.reading}】`,
      subPrompt: 'Chọn nghĩa tiếng Việt chính xác của từ vựng này',
      hint: `Loại từ: ${target.pos}`,
      targetItem: target,
      options,
      correctAnswer: target.meaning,
      explanation: `Đáp án đúng: ${target.word} 【${target.reading}】 — ${target.meaning}\n\nVí dụ: ${target.exampleJa}\n(${target.exampleVi})`,
      audioText: target.word
    };
  }

  if (qType === 'meaning_to_kanji') {
    const distractors = pickVocabDistractors(target, allItems, 'word', 3);
    const distractorFormatted = distractors.map(w => {
      const found = allItems.find(it => it.word === w);
      return found ? `${found.word} 【${found.reading}】` : w;
    });
    const correct = `${target.word} 【${target.reading}】`;
    const options = shuffle([correct, ...distractorFormatted]);
    return {
      id: `vq_${target.id}_mtk`,
      type: 'meaning_to_kanji',
      prompt: target.meaning,
      subPrompt: `Chọn từ tiếng Nhật tương ứng (${target.pos})`,
      hint: `Số lần xuất hiện trong đề thi: ${target.freq} lần`,
      targetItem: target,
      options,
      correctAnswer: correct,
      explanation: `Đáp án đúng: ${target.word} 【${target.reading}】 — ${target.meaning}\n\nVí dụ: ${target.exampleJa}\n(${target.exampleVi})`,
      audioText: target.word
    };
  }

  const cloze = maskVocabInExample(target.exampleJa, target.word);
  const distractors = pickVocabDistractors(target, allItems, 'word', 3);
  const distractorFormatted = distractors.map(w => {
    const found = allItems.find(it => it.word === w);
    return found ? `${found.word} 【${found.reading}】` : w;
  });
  const correct = `${target.word} 【${target.reading}】`;
  const options = shuffle([correct, ...distractorFormatted]);
  return {
    id: `vq_${target.id}_cloze`,
    type: 'cloze',
    prompt: cloze.masked,
    subPrompt: 'Chọn từ thích hợp điền vào chỗ trống',
    hint: target.exampleVi,
    targetItem: target,
    options,
    correctAnswer: correct,
    explanation: `Đáp án đúng: ${target.word} 【${target.reading}】 — ${target.meaning}\n\nVí dụ: ${target.exampleJa}\n(${target.exampleVi})`,
    audioText: target.exampleJa
  };
}

export function generateGrammarQuizQuestion(
  target: GrammarItem,
  allItems: GrammarItem[],
  mode: 'context' | 'meaning' | 'formation' | 'cloze' | 'confusables'
): QuizQuestion {
  if (mode === 'context') {
    const variant = Math.random() > 0.5 ? 'pattern_to_context' : 'context_to_pattern';

    if (variant === 'pattern_to_context') {
      const distractors = pickGrammarDistractors(target, allItems, 'context', 3);
      const options = shuffle([target.context, ...distractors]);
      return {
        id: `gq_${target.id}_p2c`,
        type: 'grammar_context',
        prompt: target.pattern,
        subPrompt: 'Ngữ cảnh sử dụng phù hợp nhất của mẫu ngữ pháp này là gì?',
        hint: `Ý nghĩa: ${target.meaning}`,
        targetItem: target,
        options,
        correctAnswer: target.context,
        explanation: `Mẫu: ${target.pattern}\nBối cảnh: ${target.context}\nCách chia: ${target.formation}\nVí dụ: ${target.exampleJa} (${target.exampleVi})`,
        audioText: target.pattern
      };
    } else {
      const distractors = pickGrammarDistractors(target, allItems, 'pattern', 3);
      const options = shuffle([target.pattern, ...distractors]);
      return {
        id: `gq_${target.id}_c2p`,
        type: 'grammar_context',
        prompt: target.context,
        subPrompt: 'Tình huống hoặc bối cảnh trên phù hợp với mẫu ngữ pháp nào?',
        hint: `Gợi ý câu: ${target.exampleVi}`,
        targetItem: target,
        options,
        correctAnswer: target.pattern,
        explanation: `Bối cảnh: ${target.context}\nĐáp án: ${target.pattern} (${target.meaning})\nVí dụ: ${target.exampleJa}`,
        audioText: target.pattern
      };
    }
  }

  if (mode === 'meaning') {
    const variant = Math.random() > 0.5 ? 'pattern_to_meaning' : 'meaning_to_pattern';
    if (variant === 'pattern_to_meaning') {
      const distractors = pickGrammarDistractors(target, allItems, 'meaning', 3);
      const options = shuffle([target.meaning, ...distractors]);
      return {
        id: `gq_${target.id}_p2m`,
        type: 'grammar_meaning',
        prompt: target.pattern,
        subPrompt: 'Chọn ý nghĩa tiếng Việt đúng của mẫu ngữ pháp',
        hint: `Bối cảnh: ${target.context.slice(0, 45)}...`,
        targetItem: target,
        options,
        correctAnswer: target.meaning,
        explanation: `${target.pattern}: ${target.meaning}\nBối cảnh: ${target.context}\nVí dụ: ${target.exampleJa}`,
        audioText: target.pattern
      };
    } else {
      const distractors = pickGrammarDistractors(target, allItems, 'pattern', 3);
      const options = shuffle([target.pattern, ...distractors]);
      return {
        id: `gq_${target.id}_m2p`,
        type: 'grammar_meaning',
        prompt: target.meaning,
        subPrompt: 'Chọn mẫu ngữ pháp tương ứng với ý nghĩa trên',
        hint: `Ví dụ dịch: ${target.exampleVi}`,
        targetItem: target,
        options,
        correctAnswer: target.pattern,
        explanation: `Nghĩa: ${target.meaning}\nMẫu đúng: ${target.pattern}\nVí dụ: ${target.exampleJa}`,
        audioText: target.pattern
      };
    }
  }

  if (mode === 'formation') {
    const distractors = pickGrammarDistractors(target, allItems, 'formation', 3);
    const options = shuffle([target.formation, ...distractors]);
    return {
      id: `gq_${target.id}_form`,
      type: 'grammar_formation',
      prompt: target.pattern,
      subPrompt: 'Chọn công thức ghép đúng',
      hint: `Ý nghĩa: ${target.meaning}`,
      targetItem: target,
      options,
      correctAnswer: target.formation,
      explanation: `${target.pattern}\nCông thức ghép đúng: ${target.formation}\nVí dụ: ${target.exampleJa}`,
      audioText: target.pattern
    };
  }

  if (mode === 'cloze') {
    const cloze = maskGrammarInExample(target.exampleJa, target.pattern);
    const distractors = pickGrammarDistractors(target, allItems, 'pattern', 3);
    const options = shuffle([target.pattern, ...distractors]);
    return {
      id: `gq_${target.id}_cloze`,
      type: 'grammar_cloze',
      prompt: cloze.masked,
      subPrompt: 'Điền mẫu ngữ pháp thích hợp vào chỗ trống (kiểu đề JLPT)',
      hint: `Dịch nghĩa: ${target.exampleVi}`,
      targetItem: target,
      options,
      correctAnswer: target.pattern,
      explanation: `Câu đầy đủ: ${target.exampleJa}\n(${target.exampleVi})\n\nMẫu đúng: ${target.pattern} (${target.meaning})\nBối cảnh: ${target.context}`,
      audioText: target.exampleJa
    };
  }

  const confusableList = (target.confusables && target.confusables.length > 0)
    ? target.confusables
    : pickGrammarDistractors(target, allItems, 'pattern', 2);

  const optionPool = [target.pattern];
  for (const c of confusableList) {
    const clean = c.split(' ')[0].trim();
    if (clean && !optionPool.includes(clean)) {
      optionPool.push(clean);
    }
  }

  return {
    id: `gq_${target.id}_conf`,
    type: 'grammar_confusables',
    prompt: target.exampleVi,
    subPrompt: `Tình huống trên nên dùng mẫu nào để phân biệt sắc thái chính xác?`,
    hint: `Bối cảnh: ${target.context}`,
    targetItem: target,
    options: shuffle(optionPool),
    correctAnswer: target.pattern,
    explanation: `Mẫu đúng: ${target.pattern}\nBối cảnh: ${target.context}\nLưu ý phân biệt: ${confusableList.join(' | ')}\nVí dụ: ${target.exampleJa}`,
    audioText: target.exampleJa
  };
}

/**
 * Tolerant checking for Vietnamese typed answers
 * Handles case-insensitivity, accent marks / no-accents, and multiple listed meanings.
 */
export function checkVietnameseAnswer(userAnswer: string, expectedMeaning: string): boolean {
  if (!userAnswer || !expectedMeaning) return false;

  const normalizeVi = (s: string) => {
    return s
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'1234567890]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const removeAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const userNorm = normalizeVi(userAnswer);
  if (!userNorm) return false;

  const userNoAcc = removeAccents(userNorm);
  const rawParts = expectedMeaning.split(/[;,\n/・]/).map(p => p.trim()).filter(Boolean);

  for (const raw of rawParts) {
    const partNorm = normalizeVi(raw);
    if (!partNorm) continue;
    const partNoAcc = removeAccents(partNorm);

    if (userNorm === partNorm || userNoAcc === partNoAcc) return true;
    if (userNorm.length >= 3 && partNorm.includes(userNorm)) return true;
    if (userNoAcc.length >= 3 && partNoAcc.includes(userNoAcc)) return true;
    if (partNorm.length >= 3 && userNorm.includes(partNorm)) return true;
    if (partNoAcc.length >= 3 && userNoAcc.includes(partNoAcc)) return true;
  }

  return false;
}

function pickMimikaraDistractors(
  target: MimikaraItem,
  allItems: MimikaraItem[],
  field: 'reading' | 'meaning' | 'kanji' | 'displayWord' | 'hanViet',
  count: number = 3
): string[] {
  const sameUnit = allItems.filter(item => item.id !== target.id && item.unit === target.unit);
  const otherUnit = allItems.filter(item => item.id !== target.id && item.unit !== target.unit);

  const pool = [...shuffle(sameUnit), ...shuffle(otherUnit)];
  const distractors: string[] = [];
  const targetVal = (target[field] as string) || target.displayWord;

  for (const item of pool) {
    const val = (item[field] as string) || (field === 'kanji' ? item.reading : item.displayWord);
    if (val && val !== targetVal && !distractors.includes(val)) {
      distractors.push(val);
      if (distractors.length >= count) break;
    }
  }

  return distractors;
}

export function generateMimikaraQuizQuestion(
  target: MimikaraItem,
  allItems: MimikaraItem[],
  specificType?: 'kanji_to_reading' | 'reading_to_meaning' | 'meaning_to_kanji' | 'hanviet' | 'cloze'
): QuizQuestion {
  const types: ('kanji_to_reading' | 'reading_to_meaning' | 'meaning_to_kanji' | 'hanviet' | 'cloze')[] = [
    'reading_to_meaning',
    'meaning_to_kanji'
  ];

  if (target.kanji) {
    types.push('kanji_to_reading');
    if (target.hanViet) types.push('hanviet');
  }

  const example = target.examples && target.examples.length > 0 ? target.examples[0] : null;
  let maskedSentence = '';
  if (example && example.jp) {
    const wordToMask = target.kanji || target.reading;
    if (wordToMask && example.jp.includes(wordToMask)) {
      maskedSentence = example.jp.replace(wordToMask, ' ＿＿＿ ');
      types.push('cloze');
    }
  }

  const qType = specificType || types[Math.floor(Math.random() * types.length)];

  if (qType === 'kanji_to_reading') {
    const distractors = pickMimikaraDistractors(target, allItems, 'reading', 3);
    const options = shuffle([target.reading, ...distractors]);
    return {
      id: `mq_${target.id}_ktr`,
      type: 'kanji_to_reading',
      prompt: target.kanji || target.displayWord,
      subPrompt: 'Chọn cách đọc Hiragana đúng của chữ Kanji này',
      hint: target.hanViet ? `Âm Hán Việt: [${target.hanViet}]` : (target.unit || ''),
      targetItem: target,
      options,
      correctAnswer: target.reading,
      explanation: `${target.kanji || target.displayWord} [${target.hanViet || ''}] đọc là:「${target.reading}」\nNghĩa: ${target.meaning}`,
      audioText: target.kanji || target.reading
    };
  }

  if (qType === 'hanviet') {
    const distractors = pickMimikaraDistractors(target, allItems, 'hanViet', 3);
    const options = shuffle([target.hanViet, ...distractors]);
    return {
      id: `mq_${target.id}_hv`,
      type: 'hanviet',
      prompt: target.kanji || target.displayWord,
      subPrompt: 'Chọn Âm Hán Việt đúng cho chữ Kanji này',
      hint: `Cách đọc: ${target.reading}`,
      targetItem: target,
      options,
      correctAnswer: target.hanViet,
      explanation: `${target.kanji} [${target.hanViet}]: ${target.meaning}`,
      audioText: target.kanji
    };
  }

  if (qType === 'meaning_to_kanji') {
    const distractors = pickMimikaraDistractors(target, allItems, 'displayWord', 3);
    const correct = target.kanji || target.reading;
    const options = shuffle([correct, ...distractors]);
    return {
      id: `mq_${target.id}_m2k`,
      type: 'meaning_to_kanji',
      prompt: target.meaning,
      subPrompt: 'Chọn từ vựng tiếng Nhật tương ứng với ý nghĩa trên',
      hint: target.hanViet ? `Hán Việt: [${target.hanViet}]` : (target.unit || ''),
      targetItem: target,
      options,
      correctAnswer: correct,
      explanation: `Nghĩa: ${target.meaning}\nTừ đúng: ${correct} (${target.reading}) [${target.hanViet || ''}]`,
      audioText: correct
    };
  }

  if (qType === 'cloze' && maskedSentence) {
    const distractors = pickMimikaraDistractors(target, allItems, 'displayWord', 3);
    const correct = target.kanji || target.reading;
    const options = shuffle([correct, ...distractors]);
    return {
      id: `mq_${target.id}_cloze`,
      type: 'cloze',
      prompt: maskedSentence,
      subPrompt: 'Điền từ vựng thích hợp vào câu ví dụ',
      hint: example?.vi ? `Dịch câu: ${example.vi}` : (target.meaning || ''),
      targetItem: target,
      options,
      correctAnswer: correct,
      explanation: `Câu hoàn chỉnh: ${example?.jp}\n(${example?.vi || ''})\n\nTừ đúng: ${correct} (${target.reading}) [${target.hanViet || ''}]: ${target.meaning}`,
      audioText: example?.jp
    };
  }

  // Default: reading_to_meaning
  const distractors = pickMimikaraDistractors(target, allItems, 'meaning', 3);
  const options = shuffle([target.meaning, ...distractors]);
  return {
    id: `mq_${target.id}_rtm`,
    type: 'reading_to_meaning',
    prompt: target.kanji ? `${target.kanji} (${target.reading})` : target.reading,
    subPrompt: 'Chọn ý nghĩa tiếng Việt đúng của từ vựng này',
    hint: target.hanViet ? `Âm Hán Việt: [${target.hanViet}]` : (target.unit || ''),
    targetItem: target,
    options,
    correctAnswer: target.meaning,
    explanation: `${target.kanji || target.reading} [${target.hanViet || ''}]: ${target.meaning}`,
    audioText: target.kanji || target.reading
  };
}

