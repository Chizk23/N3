import { runKanaTests, checkJapaneseAnswer, romajiToKana } from './src/lib/kana.ts';

console.log('=== RUNNING ROMAJI -> KANA UNIT TESTS ===');
const { success, results } = runKanaTests();

for (const r of results) {
  const status = r.passed ? '[PASS]' : '[FAIL]';
  console.log(`${status}: input="${r.input}" => expected="${r.expected}", got="${r.actual}"`);
}

console.log('Overall Kana tests success:', success);

console.log('\n=== TESTING TOLERANT ANSWER CHECKING ===');
const answerChecks = [
  { user: 'tabini', expected: '～たびに', shouldPass: true },
  { user: 'たびに', expected: '～たびに', shouldPass: true },
  { user: 'eiyou', expected: 'えいよう', shouldPass: true },
  { user: 'えいよう', expected: 'えいよう', shouldPass: true },
  { user: 'rimokon', expected: 'リモコン', shouldPass: true },
  { user: 'でんしれんじ', expected: 'でんしれんじ', shouldPass: true },
  { user: 'denshirenji', expected: 'でんしれんじ', shouldPass: true },
  { user: 'ko sho u', expected: 'こしょう', shouldPass: true },
];

for (const ac of answerChecks) {
  const matched = checkJapaneseAnswer(ac.user, ac.expected);
  const ok = matched === ac.shouldPass;
  console.log(`${ok ? '[OK]' : '[ERR]'} User="${ac.user}" vs Expected="${ac.expected}" -> ${matched ? 'MATCH' : 'NO_MATCH'}`);
}
