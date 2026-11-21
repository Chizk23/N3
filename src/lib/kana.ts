/**
 * Romaji to Kana (Hiragana / Katakana) IME Engine
 * Designed for English keyboards, converts on-the-fly as user types.
 */

export const HIRAGANA_MAP: Record<string, string> = {
  // Vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  // K
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'kya': 'きゃ', 'kyu': 'きゅ', 'kye': 'きぇ', 'kyo': 'きょ',
  // S
  'sa': 'さ', 'si': 'し', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'sha': 'しゃ', 'shu': 'しゅ', 'she': 'しぇ', 'sho': 'しょ',
  'sya': 'しゃ', 'syu': 'しゅ', 'sye': 'しぇ', 'syo': 'しょ',
  // T
  'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'che': 'ちぇ', 'cho': 'ちょ',
  'tya': 'ちゃ', 'tyu': 'ちゅ', 'tye': 'ちぇ', 'tyo': 'ちょ',
  // N
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nye': 'にぇ', 'nyo': 'にょ',
  // H
  'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hye': 'ひぇ', 'hyo': 'ひょ',
  'fa': 'ふぁ', 'fi': 'ふぃ', 'fe': 'ふぇ', 'fo': 'ふぉ',
  // M
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'mya': 'みゃ', 'myu': 'みゅ', 'mye': 'みぇ', 'myo': 'みょ',
  // Y
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  // R
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'rye': 'りぇ', 'ryo': 'りょ',
  // W
  'wa': 'わ', 'wi': 'うぃ', 'we': 'うぇ', 'wo': 'を',
  // G
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gye': 'ぎぇ', 'gyo': 'ぎょ',
  // Z
  'za': 'ざ', 'zi': 'じ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ja': 'じゃ', 'ju': 'じゅ', 'je': 'じぇ', 'jo': 'じょ',
  'zya': 'じゃ', 'zyu': 'じゅ', 'zye': 'じぇ', 'zyo': 'じょ',
  // D
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'dya': 'ぢゃ', 'dyu': 'ぢゅ', 'dye': 'ぢぇ', 'dyo': 'ぢょ',
  // B
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'bya': 'びゃ', 'byu': 'びゅ', 'bye': 'びぇ', 'byo': 'びょ',
  // P
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pye': 'ぴぇ', 'pyo': 'ぴょ',
  // Small characters
  'xtu': 'っ', 'ltu': 'っ', 'xtsu': 'っ', 'ltsu': 'っ',
  'xa': 'ぁ', 'la': 'ぁ',
  'xi': 'ぃ', 'li': 'ぃ',
  'xu': 'ぅ', 'lu': 'ぅ',
  'xe': 'ぇ', 'le': 'ぇ',
  'xo': 'ぉ', 'lo': 'ぉ',
  'xya': 'ゃ', 'lya': 'ゃ',
  'xyu': 'ゅ', 'lyu': 'ゅ',
  'xyo': 'ょ', 'lyo': 'ょ',
  'xwa': 'ゎ', 'lwa': 'ゎ',
  // Special
  '-': 'ー',
  '~': '〜'
};

// Fix gyo
HIRAGANA_MAP['gyo'] = 'ぎょ';

/**
 * Converts Hiragana string to Katakana
 */
export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

/**
 * Converts Katakana string to Hiragana
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Convert Romaji input string to Hiragana or Katakana on the fly
 * @param input raw romaji string
 * @param mode 'hiragana' or 'katakana'
 * @param convertTrailingN whether a trailing 'n' at end of string should become ん (useful on submit / completed input)
 */
export function romajiToKana(
  input: string,
  mode: 'hiragana' | 'katakana' = 'hiragana',
  convertTrailingN: boolean = true
): string {
  let result = '';
  const s = input.toLowerCase();
  let i = 0;
  const len = s.length;

  while (i < len) {
    // 1. Dash -> Long vowel mark
    if (s[i] === '-') {
      result += 'ー';
      i++;
      continue;
    }

    // 2. Handling 'n':
    if (s[i] === 'n') {
      // 2a. n' -> ん
      if (i + 1 < len && s[i + 1] === "'") {
        result += 'ん';
        i += 2;
        continue;
      }

      // 2b. nn ->
      if (i + 1 < len && s[i + 1] === 'n') {
        // If followed by a vowel or y (e.g. nni, nna, nno, nnya),
        // the first n is 'ん', and the second n begins the next syllable (ni, na, etc.)
        if (i + 2 < len && 'aeiouy'.includes(s[i + 2])) {
          result += 'ん';
          i += 1; // leave the second 'n' for the next syllable!
          continue;
        } else {
          // Double n before consonant or end -> 'ん'
          result += 'ん';
          i += 2;
          continue;
        }
      }

      // 2c. n followed by consonant (except y, n, or vowel) -> ん
      // e.g. kanpai -> k a n p a i => かんぱい
      if (i + 1 < len) {
        const nextChar = s[i + 1];
        const isVowelOrY = 'aeiouy'.includes(nextChar);
        const isLetter = /^[a-z]$/i.test(nextChar);
        if (isLetter && !isVowelOrY) {
          result += 'ん';
          i++;
          continue;
        }
      }

      // 2d. Trailing 'n' at end of string
      if (i === len - 1) {
        if (convertTrailingN) {
          result += 'ん';
          i++;
          continue;
        } else {
          // Keep as 'n' for live typing so user can follow with vowel
          result += 'n';
          i++;
          continue;
        }
      }
    }

    // 3. Double consonants: kk, tt, ss, pp, etc. (excluding nn and vowels/y/w)
    if (i + 1 < len && s[i] === s[i + 1] && /^[bcdfghjklmpqrstvwxyz]$/i.test(s[i]) && s[i] !== 'n') {
      result += 'っ';
      i++;
      continue;
    }

    // 4. Check 4-character matches (e.g., xtsu, ltsu)
    if (i + 4 <= len) {
      const sub4 = s.substring(i, i + 4);
      if (HIRAGANA_MAP[sub4]) {
        result += HIRAGANA_MAP[sub4];
        i += 4;
        continue;
      }
    }

    // 5. Check 3-character matches (e.g. kya, shi, chi, tsu, sha, cha, tya, rya)
    if (i + 3 <= len) {
      const sub3 = s.substring(i, i + 3);
      if (HIRAGANA_MAP[sub3]) {
        result += HIRAGANA_MAP[sub3];
        i += 3;
        continue;
      }
    }

    // 6. Check 2-character matches (e.g. ka, sa, ta, si, ti, tu, hu, ji, etc.)
    if (i + 2 <= len) {
      const sub2 = s.substring(i, i + 2);
      if (HIRAGANA_MAP[sub2]) {
        result += HIRAGANA_MAP[sub2];
        i += 2;
        continue;
      }
    }

    // 7. Check 1-character matches (vowels: a, i, u, e, o)
    const sub1 = s[i];
    if (HIRAGANA_MAP[sub1]) {
      result += HIRAGANA_MAP[sub1];
      i += 1;
      continue;
    }

    // 8. Other characters (pass through unchanged)
    result += s[i];
    i++;
  }

  return mode === 'katakana' ? hiraganaToKatakana(result) : result;
}

/**
 * Normalizes Japanese text for fuzzy, tolerant answer comparison:
 * - Trims whitespace
 * - Full-width to half-width for alphanumeric
 * - Removes tildes ('～', '~')
 * - Converts all katakana to hiragana (so katakana and hiragana are treated as equivalent)
 * - Strips common delimiters and spaces
 */
export function normalizeJapanese(text: string): string {
  if (!text) return '';
  let res = text.trim();
  // Remove tildes
  res = res.replace(/[～~]/g, '');
  // Normalize full-width ASCII to half-width
  res = res.replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  );
  // Full-width space to empty
  res = res.replace(/\u3000/g, ' ');
  // Convert Katakana to Hiragana for comparison
  res = katakanaToHiragana(res);
  // Remove spaces and punctuation
  res = res.replace(/[\s\.,\/#!$%\^&\*;:{}=\-_`~()？?。、]/g, '');
  return res.toLowerCase();
}

/**
 * Checks if user typed answer matches any of the expected readings or forms
 * Accepts multiple readings separated by '／', '、', ',', '/', or '・'
 */
export function checkJapaneseAnswer(userAnswer: string, expectedField: string): boolean {
  if (!userAnswer || !expectedField) return false;

  const normalizedUser = normalizeJapanese(userAnswer);
  if (!normalizedUser) return false;

  // Split expected by common separators
  const variants = expectedField.split(/[／/、,・;\n]/).map(v => normalizeJapanese(v)).filter(Boolean);

  // If directly matches any variant
  if (variants.includes(normalizedUser)) return true;

  // If user typed romaji directly without IME, check if converted romaji matches
  const asHiragana = normalizeJapanese(romajiToKana(userAnswer, 'hiragana', true));
  if (variants.includes(asHiragana)) return true;

  return false;
}

/**
 * Self-test suite verifying all prompt-specified cases:
 * kekka -> けっか
 * zasshi -> ざっし
 * konnichiwa -> こんにちわ
 * kin'en -> きんえん
 * kyouiku -> きょういく
 * rimokon (katakana) -> リモコン
 * tabini -> たびに
 */
export function runKanaTests(): { success: boolean; results: { input: string; expected: string; actual: string; passed: boolean }[] } {
  const tests = [
    { input: 'kekka', expected: 'けっか', mode: 'hiragana' as const },
    { input: 'zasshi', expected: 'ざっし', mode: 'hiragana' as const },
    { input: 'konnichiwa', expected: 'こんにちわ', mode: 'hiragana' as const },
    { input: "kin'en", expected: 'きんえん', mode: 'hiragana' as const },
    { input: 'kyouiku', expected: 'きょういく', mode: 'hiragana' as const },
    { input: 'rimokon', expected: 'リモコン', mode: 'katakana' as const },
    { input: 'tabini', expected: 'たびに', mode: 'hiragana' as const },
  ];

  const results = tests.map(t => {
    const actual = romajiToKana(t.input, t.mode, true);
    return {
      input: t.input,
      expected: t.expected,
      actual,
      passed: actual === t.expected
    };
  });

  const success = results.every(r => r.passed);
  return { success, results };
}
