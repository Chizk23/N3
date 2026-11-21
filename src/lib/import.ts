import * as XLSX from 'xlsx';
import { VocabItem, GrammarItem, GrammarCategory, VocabPOS } from '../types';

export interface ParseResult<T> {
  success: boolean;
  items: T[];
  totalRows: number;
  validCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
  previewRows: any[];
}

/**
 * Normalizes headers (Vietnamese or English)
 */
function normalizeKey(key: string): string {
  const k = key.trim().toLowerCase();
  if (k === 'stt' || k === 'số thứ tự' || k === 'no') return 'stt';
  if (k === 'từ vựng' || k === 'word' || k === 'kanji') return 'word';
  if (k === 'cách đọc' || k === 'reading' || k === 'hiragana') return 'reading';
  if (k === 'ý nghĩa' || k === 'nghĩa' || k === 'meaning') return 'meaning';
  if (k === 'loại từ' || k === 'pos') return 'pos';
  if (k === 'ví dụ' || k === 'ví dụ / dịch nghĩa' || k === 'example' || k === 'exampleja') return 'example';
  if (k === 'dịch nghĩa' || k === 'dịch' || k === 'examplevi') return 'exampleVi';
  if (k === 'số lần' || k === 'số lần xuất hiện' || k === 'freq' || k === 'frequency') return 'freq';
  if (k === 'ngữ pháp' || k === 'mẫu ngữ pháp' || k === 'pattern') return 'pattern';
  if (k === 'ngữ cảnh sử dụng' || k === 'ngữ cảnh' || k === 'bối cảnh' || k === 'context') return 'context';
  if (k === 'cách chia' || k === 'cách chia (kiểu v)' || k === 'công thức' || k === 'formation') return 'formation';
  if (k === 'dễ nhầm lẫn với' || k === 'dễ nhầm' || k === 'confusables') return 'confusables';
  if (k === 'nhóm' || k === 'loại' || k === 'category') return 'category';
  return k;
}

/**
 * Split example string into Japanese sentence and Vietnamese translation:
 * Rule from prompt:
 * 1. If has newline '\n', line 1 = Japanese, line 2 = Vietnamese
 * 2. If no newline, split at first Vietnamese accented character or '('
 * 3. Strip outer '( )' around Vietnamese sentence
 */
export function splitExampleSentence(raw: string): { exampleJa: string; exampleVi: string } {
  if (!raw) return { exampleJa: '', exampleVi: '' };
  const str = raw.trim();

  // 1. Newline check
  if (str.includes('\n')) {
    const lines = str.split('\n').map(l => l.trim()).filter(Boolean);
    const ja = lines[0] || '';
    let vi = lines.slice(1).join(' ').trim();
    vi = vi.replace(/^\((.*)\)$/, '$1').trim();
    return { exampleJa: ja, exampleVi: vi };
  }

  // 2. Slash '/' separator: e.g. "バランスの良い食事で栄養をとりましょう。 / (Hãy ăn uống cân bằng...)"
  if (str.includes(' / ') || str.includes(' /(')) {
    const parts = str.split(/\s\/\s|\s\/\(/);
    const ja = parts[0]?.trim() || '';
    let vi = parts.slice(1).join(' ').trim();
    vi = vi.replace(/^\((.*)\)$/, '$1').trim();
    return { exampleJa: ja, exampleVi: vi };
  }

  // 3. Parenthesis check (with Japanese preceding it)
  const parenIdx = str.indexOf('(');
  if (parenIdx > 0 && /[\u3040-\u30ff\u4e00-\u9faf]/.test(str.substring(0, parenIdx))) {
    const ja = str.substring(0, parenIdx).trim();
    let vi = str.substring(parenIdx).trim();
    vi = vi.replace(/^\((.*)\)$/, '$1').trim();
    return { exampleJa: ja, exampleVi: vi };
  }

  // 4. Japanese full stop 。！？ followed by Latin or Vietnamese character
  const dotMatch = str.match(/([。！？])\s*([A-Za-zÀ-ỹ\d])/);
  if (dotMatch && dotMatch.index !== undefined) {
    const splitPoint = dotMatch.index + 1; // Include Japanese full stop
    return {
      exampleJa: str.substring(0, splitPoint).trim(),
      exampleVi: str.substring(splitPoint).replace(/^\((.*)\)$/, '$1').trim()
    };
  }

  // 5. Japanese character immediately followed by Latin / Vietnamese capital letter
  const transitionMatch = str.match(/([\u3040-\u30ff\u4e00-\u9faf])\s*([A-ZÀ-Ỵ])/);
  if (transitionMatch && transitionMatch.index !== undefined) {
    const splitPoint = transitionMatch.index + 1;
    return {
      exampleJa: str.substring(0, splitPoint).trim(),
      exampleVi: str.substring(splitPoint).replace(/^\((.*)\)$/, '$1').trim()
    };
  }

  // 6. Fallback: split at first Vietnamese accented character
  const viMatch = str.search(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i);
  if (viMatch > 2) {
    return {
      exampleJa: str.substring(0, viMatch).trim(),
      exampleVi: str.substring(viMatch).replace(/^\((.*)\)$/, '$1').trim()
    };
  }

  return { exampleJa: str, exampleVi: '' };
}

/**
 * Parse Grammar Excel file (.xlsx) according to Section 3 (Bộ C) specifications:
 * - Single sheet, name 'N3 Ngữ pháp' (or first sheet)
 * - Row 1 is large title (skipped)
 * - Row 2 is table header
 * - Row 3 onwards is data
 * - 5 Group header rows: where Col B is empty, spanning A:H:
 *   1. NGỮ PHÁP N3 TRONG ĐỀ -> N3
 *   2. KÍNH NGỮ -> KINH_NGU
 *   3. LIÊN TỪ -> LIEN_TU
 *   4. PHÓ TỪ -> PHO_TU
 *   5. NGỮ PHÁP N4 XUẤT HIỆN TRONG ĐỀ N3 -> N4_TRONG_DE_N3
 */
export async function parseGrammarExcel(file: File | ArrayBuffer): Promise<ParseResult<GrammarItem>> {
  let workbook: XLSX.WorkBook;

  if (file instanceof File) {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: 'array' });
  } else {
    workbook = XLSX.read(file, { type: 'array' });
  }

  // Look for 'N3 Ngữ pháp' sheet or fallback to sheet[0]
  const sheetName = workbook.SheetNames.find(n => n.includes('Ngữ pháp') || n.includes('N3')) || workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    return {
      success: false,
      items: [],
      totalRows: 0,
      validCount: 0,
      errorCount: 1,
      errors: [{ row: 0, message: 'Không tìm thấy sheet dữ liệu trong file Excel!' }],
      previewRows: []
    };
  }

  // Convert to 2D array of rows
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Locate the header row: colA must be STT and row contains 'ngữ pháp' or 'pattern' or 'ý nghĩa'
  let headerIndex = -1;
  for (let r = 0; r < Math.min(10, rawData.length); r++) {
    const c0 = String(rawData[r]?.[0] || '').trim().toLowerCase();
    const rowStr = rawData[r]?.map((c: any) => String(c).toLowerCase()).join(' ') || '';
    if ((c0 === 'stt' || c0 === 'no' || c0 === 'số thứ tự') && (rowStr.includes('ngữ pháp') || rowStr.includes('pattern') || rowStr.includes('ý nghĩa'))) {
      headerIndex = r;
      break;
    }
  }
  if (headerIndex === -1) {
    headerIndex = 1; // Default to row 2
  }

  let currentCategory: GrammarCategory = 'N3';
  const items: GrammarItem[] = [];
  const errors: { row: number; message: string }[] = [];
  const previewRows: any[] = [];

  for (let r = headerIndex + 1; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0 || row.every((c: any) => !c || String(c).trim() === '')) {
      continue;
    }

    const colA = String(row[0] || '').trim();
    const colB = String(row[1] || '').trim();
    const colC = String(row[2] || '').trim();
    const colD = String(row[3] || '').trim();
    const colE = String(row[4] || '').trim();
    const colF = String(row[5] || '').trim();
    const colG = String(row[6] || '').trim();
    const colH = String(row[7] || '').trim();

    // Check if group header row: colB is empty, colA or combined has category text
    const fullRowText = (colA + ' ' + colB + ' ' + colC).toUpperCase();
    if (colB === '' || fullRowText.includes('NGỮ PHÁP N3') || fullRowText.includes('KÍNH NGỮ') || fullRowText.includes('LIÊN TỪ') || fullRowText.includes('PHÓ TỪ') || fullRowText.includes('NGỮ PHÁP N4')) {
      if (fullRowText.includes('KÍNH NGỮ') || fullRowText.includes('KINH NGU')) {
        currentCategory = 'KINH_NGU';
        continue;
      } else if (fullRowText.includes('LIÊN TỪ') || fullRowText.includes('LIEN TU')) {
        currentCategory = 'LIEN_TU';
        continue;
      } else if (fullRowText.includes('PHÓ TỪ') || fullRowText.includes('PHO TU')) {
        currentCategory = 'PHO_TU';
        continue;
      } else if (fullRowText.includes('N4') || fullRowText.includes('XUẤT HIỆN TRONG ĐỀ N3')) {
        currentCategory = 'N4_TRONG_DE_N3';
        continue;
      } else if (fullRowText.includes('NGỮ PHÁP N3') || fullRowText.includes('TRONG ĐỀ')) {
        currentCategory = 'N3';
        continue;
      }
    }

    // Normal data row
    if (!colB) {
      continue;
    }

    const stt = parseInt(colA, 10) || (items.length + 1);
    const pattern = colB;
    const meaning = colC;
    const { exampleJa, exampleVi } = splitExampleSentence(colD);
    const freq = parseInt(colE, 10) || 1;
    const context = colF || 'Bối cảnh thông thường.';
    const formation = colG || 'Theo mẫu cấu trúc.';
    const confusables = colH ? colH.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [];

    const item: GrammarItem = {
      id: `GRAMMAR-${String(stt).padStart(4, '0')}`,
      stt,
      category: currentCategory,
      pattern,
      meaning,
      exampleJa,
      exampleVi,
      freq,
      context,
      formation,
      confusables
    };

    items.push(item);
    if (previewRows.length < 5) {
      previewRows.push({
        stt: item.stt,
        category: item.category,
        pattern: item.pattern,
        meaning: item.meaning,
        exampleJa: item.exampleJa,
        freq: item.freq
      });
    }
  }

  // Sort items cleanly by STT ascending
  items.sort((a, b) => a.stt - b.stt);

  return {
    success: items.length > 0,
    items,
    totalRows: rawData.length - (headerIndex + 1),
    validCount: items.length,
    errorCount: errors.length,
    errors,
    previewRows
  };
}

/**
 * Parses CSV/TSV or JSON text for Vocab or Grammar
 */
export function parseTextData(
  text: string,
  targetType: 'vocab' | 'grammar',
  deck: 'A911' | 'B349' = 'A911'
): ParseResult<any> {
  const trimmed = text.trim();
  const errors: { row: number; message: string }[] = [];
  const previewRows: any[] = [];

  // 1. JSON format
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : [parsed];

      if (targetType === 'vocab') {
        const items: VocabItem[] = list.map((obj, idx) => {
          const stt = obj.stt || idx + 1;
          const word = obj.word || obj.Từ_vựng || obj['Từ vựng'] || '';
          const reading = obj.reading || obj.Cách_đọc || obj['Cách đọc'] || '';
          const meaning = obj.meaning || obj.Ý_nghĩa || obj['Ý nghĩa'] || '';
          const { exampleJa, exampleVi } = splitExampleSentence(obj.example || obj.exampleJa || obj['Ví dụ'] || '');
          return {
            id: obj.id || `${deck}-${stt}-${word}`,
            deck: obj.deck || deck,
            stt,
            word,
            reading,
            meaning,
            pos: (obj.pos || 'noun') as VocabPOS,
            exampleJa: obj.exampleJa || exampleJa,
            exampleVi: obj.exampleVi || exampleVi,
            freq: obj.freq || obj['Số lần xuất hiện'] || 1,
            highlighted: !!obj.highlighted
          };
        }).filter(item => item.word && item.reading);

        return {
          success: items.length > 0,
          items,
          totalRows: list.length,
          validCount: items.length,
          errorCount: list.length - items.length,
          errors,
          previewRows: items.slice(0, 5)
        };
      } else {
        const items: GrammarItem[] = list.map((obj, idx) => {
          const stt = obj.stt || idx + 1;
          const pattern = obj.pattern || obj['NGỮ PHÁP'] || obj['Ngữ pháp'] || '';
          const { exampleJa, exampleVi } = splitExampleSentence(obj.example || obj.exampleJa || obj['Ví dụ / Dịch nghĩa'] || obj['Ví dụ'] || '');
          return {
            id: obj.id || `GRAMMAR-${String(stt).padStart(4, '0')}`,
            stt,
            category: (obj.category || 'N3') as GrammarCategory,
            pattern,
            meaning: obj.meaning || obj['Ý nghĩa'] || '',
            exampleJa: obj.exampleJa || exampleJa,
            exampleVi: obj.exampleVi || exampleVi,
            freq: obj.freq || obj['Số lần'] || 1,
            context: obj.context || obj['Ngữ cảnh sử dụng'] || '',
            formation: obj.formation || obj['Cách chia (kiểu V)'] || '',
            confusables: Array.isArray(obj.confusables) ? obj.confusables : (obj['Dễ nhầm lẫn với'] ? String(obj['Dễ nhầm lẫn với']).split(/[,，、]/) : [])
          };
        }).filter(item => item.pattern);

        items.sort((a, b) => a.stt - b.stt);

        return {
          success: items.length > 0,
          items,
          totalRows: list.length,
          validCount: items.length,
          errorCount: list.length - items.length,
          errors,
          previewRows: items.slice(0, 5)
        };
      }
    } catch (e: any) {
      return {
        success: false,
        items: [],
        totalRows: 0,
        validCount: 0,
        errorCount: 1,
        errors: [{ row: 0, message: `JSON syntax error: ${e.message}` }],
        previewRows: []
      };
    }
  }

  // 2. CSV / TSV format parsed with SheetJS to properly support multiline quotes
  let rawRows: any[][] = [];
  try {
    const wb = XLSX.read(trimmed, { type: 'string' });
    const sheetName = wb.SheetNames[0];
    if (sheetName && wb.Sheets[sheetName]) {
      rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
    }
  } catch (err: any) {
    return {
      success: false,
      items: [],
      totalRows: 0,
      validCount: 0,
      errorCount: 1,
      errors: [{ row: 1, message: `Lỗi đọc CSV: ${err.message}` }],
      previewRows: []
    };
  }

  if (rawRows.length < 2) {
    return {
      success: false,
      items: [],
      totalRows: rawRows.length,
      validCount: 0,
      errorCount: 1,
      errors: [{ row: 1, message: 'Dữ liệu CSV cần ít nhất dòng tiêu đề và 1 dòng dữ liệu' }],
      previewRows: []
    };
  }

  // Find header row: locate row containing 'STT' or 'TỪ VỰNG' or 'NGỮ PHÁP'
  let headerIndex = 0;
  for (let r = 0; r < Math.min(5, rawRows.length); r++) {
    const rowStr = rawRows[r].map(c => String(c).toLowerCase()).join(' ');
    if (rowStr.includes('stt') || rowStr.includes('từ vựng') || rowStr.includes('ngữ pháp')) {
      headerIndex = r;
      break;
    }
  }

  const headerRow = rawRows[headerIndex].map(h => normalizeKey(String(h)));
  const items: any[] = [];
  let currentCategory: GrammarCategory = 'N3';

  for (let i = headerIndex + 1; i < rawRows.length; i++) {
    const rawCols = rawRows[i].map(c => String(c).trim());
    if (rawCols.length === 0 || rawCols.every(c => !c)) continue;

    const colA = rawCols[0] || '';
    const colB = rawCols[1] || '';
    const colC = rawCols[2] || '';

    // Check for section category rows in grammar mode
    if (targetType === 'grammar') {
      const fullRowText = (colA + ' ' + colB + ' ' + colC).toUpperCase();
      if (!colB || fullRowText.includes('NGỮ PHÁP N3') || fullRowText.includes('KÍNH NGỮ') || fullRowText.includes('LIÊN TỪ') || fullRowText.includes('PHÓ TỪ') || fullRowText.includes('NGỮ PHÁP N4')) {
        if (fullRowText.includes('KÍNH NGỮ') || fullRowText.includes('KINH NGU')) {
          currentCategory = 'KINH_NGU';
          continue;
        } else if (fullRowText.includes('LIÊN TỪ') || fullRowText.includes('LIEN TU')) {
          currentCategory = 'LIEN_TU';
          continue;
        } else if (fullRowText.includes('PHÓ TỪ') || fullRowText.includes('PHO TU')) {
          currentCategory = 'PHO_TU';
          continue;
        } else if (fullRowText.includes('N4') || fullRowText.includes('XUẤT HIỆN TRONG ĐỀ N3')) {
          currentCategory = 'N4_TRONG_DE_N3';
          continue;
        } else if (fullRowText.includes('NGỮ PHÁP N3') || fullRowText.includes('TRONG ĐỀ')) {
          currentCategory = 'N3';
          continue;
        }
      }
    }

    const rowObj: Record<string, string> = {};
    headerRow.forEach((h, colIdx) => {
      rowObj[h] = rawCols[colIdx] || '';
    });

    if (targetType === 'vocab') {
      const word = rowObj.word || rawCols[1] || '';
      const reading = rowObj.reading || rawCols[2] || '';
      const meaning = rowObj.meaning || rawCols[3] || '';
      const rawEx = rowObj.example || rawCols[4] || '';
      const { exampleJa, exampleVi } = splitExampleSentence(rawEx);
      const freq = parseInt(rowObj.freq || rawCols[5] || '1', 10) || 1;
      const stt = parseInt(rowObj.stt || rawCols[0] || `${items.length + 1}`, 10) || (items.length + 1);

      if (!word || !reading) {
        errors.push({ row: i + 1, message: 'Thiếu Từ vựng hoặc Cách đọc' });
        continue;
      }

      const item: VocabItem = {
        id: `${deck}-${stt}-${word}`,
        deck,
        stt,
        word,
        reading,
        meaning,
        pos: (rowObj.pos as VocabPOS) || 'noun',
        exampleJa,
        exampleVi: rowObj.examplevi || exampleVi,
        freq,
        highlighted: false
      };
      items.push(item);
    } else {
      const pattern = rowObj.pattern || rawCols[1] || '';
      const meaning = rowObj.meaning || rawCols[2] || '';
      const rawEx = rowObj.example || rawCols[3] || '';
      const { exampleJa, exampleVi } = splitExampleSentence(rawEx);
      const freq = parseInt(rowObj.freq || rawCols[4] || '1', 10) || 1;
      const stt = parseInt(rowObj.stt || rawCols[0] || `${items.length + 1}`, 10) || (items.length + 1);

      if (!pattern) {
        errors.push({ row: i + 1, message: 'Thiếu Mẫu ngữ pháp' });
        continue;
      }

      const item: GrammarItem = {
        id: `GRAMMAR-${String(stt).padStart(4, '0')}`,
        stt,
        category: (rowObj.category as GrammarCategory) || currentCategory,
        pattern,
        meaning,
        exampleJa,
        exampleVi: rowObj.examplevi || exampleVi,
        freq,
        context: rowObj.context || rawCols[5] || 'Bối cảnh thông thường.',
        formation: rowObj.formation || rawCols[6] || 'Theo mẫu cấu trúc.',
        confusables: rowObj.confusables ? rowObj.confusables.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : (rawCols[7] ? rawCols[7].split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [])
      };
      items.push(item);
    }
  }

  // Sort items cleanly by STT
  items.sort((a, b) => a.stt - b.stt);

  return {
    success: items.length > 0,
    items,
    totalRows: rawRows.length - (headerIndex + 1),
    validCount: items.length,
    errorCount: errors.length,
    errors,
    previewRows: items.slice(0, 5)
  };
}

/**
 * Generate Sample Template files for downloading
 */
export function generateSampleVocabCSV(): string {
  return `STT,Từ vựng,Cách đọc,Ý nghĩa,Ví dụ,Số lần xuất hiện,Loại từ
1,栄養,えいよう,Dinh dưỡng,"バランスの良い食事で栄養をとりましょう。 / (Hãy ăn uống cân bằng để bổ sung dinh dưỡng.)",6,noun
2,優勝,ゆうしょう,"Chiến thắng, vô địch","チームが優勝しました。 / (Đội đã giành chức vô địch.)",5,noun
5,発展,はってん,Phát triển,"科学技術が急速に発展しています。 / (Khoa học công nghệ đang phát triển nhanh chóng.)",4,noun`;
}

export function generateSampleGrammarCSV(): string {
  return `STT,NGỮ PHÁP,Ý nghĩa,Ví dụ / Dịch nghĩa,Số lần,Ngữ cảnh sử dụng,Cách chia (kiểu V),Dễ nhầm lẫn với
1,～において,Ở / trong / tại,"会議は東京において行われます。\nCuộc họp được tổ chức tại Tokyo.",7,"Văn viết, trang trọng. Nêu nơi chốn/hoàn cảnh.","N + において","～で (dùng thường ngày), ～に対して"
2,～たびに,Cứ mỗi khi.../Mỗi lần...lại...,"健康診断を受けるたびに、医者から運動不足だと注意される。\nMỗi lần đi khám sức khỏe tôi đều bị nhắc nhở.",6,"Sự việc lặp lại khi gặp tình huống.","Vる / N の + たびに","～ごとに, ～と"`;
}
