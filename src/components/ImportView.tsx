import React, { useState } from 'react';
import { VocabItem, GrammarItem } from '../types';
import { 
  parseGrammarExcel, 
  parseTextData, 
  generateSampleVocabCSV, 
  generateSampleGrammarCSV, 
  ParseResult 
} from '../lib/import';
import { 
  UploadIcon, 
  DownloadIcon, 
  LayersIcon, 
  BookIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ArrowRightIcon 
} from './Icons';

interface ImportViewProps {
  onImportVocab: (items: VocabItem[], replace: boolean) => Promise<void>;
  onImportGrammar: (items: GrammarItem[], replace: boolean) => Promise<void>;
  vocabCount: number;
  grammarCount: number;
}

export const ImportView: React.FC<ImportViewProps> = ({
  onImportVocab,
  onImportGrammar,
  vocabCount,
  grammarCount
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'file' | 'paste'>('excel');
  const [targetDeck, setTargetDeck] = useState<'A911' | 'B349' | 'grammar'>('grammar');
  const [replaceMode, setReplaceMode] = useState<boolean>(false);

  const [pasteContent, setPasteContent] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult<any> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setSuccessMessage(null);
    try {
      const result = await parseGrammarExcel(file);
      setParseResult(result);
    } catch (err: any) {
      alert(`Lỗi khi đọc file Excel: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileTextUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setSuccessMessage(null);
    try {
      const text = await file.text();
      const targetType = targetDeck === 'grammar' ? 'grammar' : 'vocab';
      const deck = targetDeck === 'B349' ? 'B349' : 'A911';
      const result = parseTextData(text, targetType, deck);
      setParseResult(result);
    } catch (err: any) {
      alert(`Lỗi khi đọc file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzePaste = () => {
    if (!pasteContent.trim()) {
      alert('Vui lòng dán nội dung vào ô trước khi phân tích.');
      return;
    }

    const targetType = targetDeck === 'grammar' ? 'grammar' : 'vocab';
    const deck = targetDeck === 'B349' ? 'B349' : 'A911';
    const result = parseTextData(pasteContent, targetType, deck);
    setParseResult(result);
  };

  const handleSaveData = async () => {
    if (!parseResult || parseResult.items.length === 0) return;

    setIsProcessing(true);
    try {
      if (targetDeck === 'grammar') {
        await onImportGrammar(parseResult.items as GrammarItem[], replaceMode);
        setSuccessMessage(`Đã nạp thành công ${parseResult.items.length} mẫu ngữ pháp vào cơ sở dữ liệu.`);
      } else {
        await onImportVocab(parseResult.items as VocabItem[], replaceMode);
        setSuccessMessage(`Đã nạp thành công ${parseResult.items.length} từ vựng vào Bộ ${targetDeck}.`);
      }
      setParseResult(null);
      setPasteContent('');
    } catch (err: any) {
      alert(`Lỗi khi lưu dữ liệu: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSample = (type: 'vocab' | 'grammar') => {
    const content = type === 'vocab' ? generateSampleVocabCSV() : generateSampleGrammarCSV();
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mau_${type}_n3.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-app-text tracking-tight">
          Nhập dữ liệu
        </h2>
        <p className="text-sm text-app-muted mt-1">
          Nạp file Excel, CSV hoặc JSON để học danh sách từ vựng và ngữ pháp của riêng bạn
        </p>
      </div>

      {/* Current DB summary */}
      <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-app-accent-subtle text-app-accent flex items-center justify-center shrink-0">
            <BookIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Từ vựng hiện có</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{vocabCount} từ</div>
          </div>
        </div>

        <div className="border border-app-border rounded-2xl bg-app-surface p-5 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <LayersIcon size={22} />
          </div>
          <div>
            <div className="text-xs text-app-muted font-medium">Ngữ pháp hiện có</div>
            <div className="text-2xl font-medium text-app-text mt-0.5">{grammarCount} mẫu</div>
          </div>
        </div>
      </div>

      {/* Main Import Card */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Method selection tabs */}
        <div className="flex border-b border-app-border gap-6 text-xs sm:text-sm font-medium">
          {[
            { id: 'excel', label: '1. File Excel (.xlsx) Ngữ pháp' },
            { id: 'file', label: '2. File CSV hoặc JSON' },
            { id: 'paste', label: '3. Dán trực tiếp' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id as any); setParseResult(null); }}
              className={`pb-3 notebook-fade flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-app-accent text-app-text font-semibold'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              <UploadIcon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Target Deck & Replace Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-app-muted font-medium">Bộ dữ liệu đích</label>
            <select
              value={targetDeck}
              onChange={e => setTargetDeck(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl border border-app-border bg-app text-app-text text-xs sm:text-sm focus:outline-none focus:border-app-accent"
            >
              <option value="grammar">Bộ C: 230 Ngữ pháp N3</option>
              <option value="A911">Bộ A: 911 Từ vựng N3</option>
              <option value="B349">Bộ B: 351 Từ Kanji N3</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-app-muted font-medium">Cách xử lý dữ liệu</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReplaceMode(false)}
                className={`h-11 rounded-xl border text-xs sm:text-sm notebook-fade font-medium ${
                  !replaceMode
                    ? 'border-app-accent bg-app-accent-subtle text-app-text shadow-sm'
                    : 'border-app-border text-app-muted hover:border-app-text'
                }`}
              >
                Gộp thêm (bỏ trùng)
              </button>
              <button
                type="button"
                onClick={() => setReplaceMode(true)}
                className={`h-11 rounded-xl border text-xs sm:text-sm notebook-fade font-medium ${
                  replaceMode
                    ? 'border-app-error bg-app-surface text-app-error shadow-sm'
                    : 'border-app-border text-app-muted hover:border-app-text'
                }`}
              >
                Thay thế toàn bộ
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: EXCEL */}
        {activeTab === 'excel' && (
          <div className="space-y-4">
            <div className="border border-dashed border-app-border rounded-2xl p-8 text-center space-y-3 bg-app">
              <UploadIcon size={36} className="mx-auto text-app-muted" />
              <div className="text-sm font-medium text-app-text">
                Chọn file Excel (.xlsx) chứa sheet "N3 Ngữ pháp"
              </div>
              <p className="text-xs text-app-muted max-w-md mx-auto leading-relaxed">
                Tự động bỏ dòng banner, nhận diện dòng tiêu đề STT, phân tích 5 nhóm ngữ pháp và tách sạch sẽ câu ví dụ tiếng Nhật và câu dịch tiếng Việt.
              </p>

              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                disabled={isProcessing}
                className="block mx-auto text-xs text-app-muted pt-2 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: CSV / JSON */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div className="border border-dashed border-app-border rounded-2xl p-8 text-center space-y-3 bg-app">
              <UploadIcon size={36} className="mx-auto text-app-muted" />
              <div className="text-sm font-medium text-app-text">
                Chọn file .csv hoặc .json
              </div>
              <p className="text-xs text-app-muted">
                Hỗ trợ tên cột cả tiếng Việt (Từ vựng, Cách đọc, Ý nghĩa, Ví dụ...) hoặc tiếng Anh, hỗ trợ ngoặc kép và xuống dòng an toàn.
              </p>

              <input
                type="file"
                accept=".csv, .json, .txt"
                onChange={handleFileTextUpload}
                disabled={isProcessing}
                className="block mx-auto text-xs text-app-muted pt-2 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm pt-1">
              <button
                type="button"
                onClick={() => downloadSample('vocab')}
                className="flex items-center gap-1.5 text-app-accent hover:underline font-medium"
              >
                <DownloadIcon size={15} />
                <span>Tải file mẫu Từ vựng (CSV)</span>
              </button>
              <span className="text-app-border">·</span>
              <button
                type="button"
                onClick={() => downloadSample('grammar')}
                className="flex items-center gap-1.5 text-app-accent hover:underline font-medium"
              >
                <DownloadIcon size={15} />
                <span>Tải file mẫu Ngữ pháp (CSV)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DIRECT PASTE */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <textarea
              rows={8}
              value={pasteContent}
              onChange={e => setPasteContent(e.target.value)}
              placeholder="Dán dữ liệu TSV copy từ Google Sheets hoặc Excel, hoặc định dạng CSV, hoặc mảng JSON tại đây..."
              style={{ color: 'var(--color-text)' }}
              className="w-full p-4 rounded-xl border border-app-border bg-app font-mono text-xs sm:text-sm text-app-text focus:outline-none focus:border-app-accent"
            />

            <button
              type="button"
              onClick={handleAnalyzePaste}
              className="h-11 px-6 rounded-xl border border-app-border hover:border-app-text text-app-text text-xs sm:text-sm font-medium"
            >
              Phân tích dữ liệu vừa dán
            </button>
          </div>
        )}

        {/* Format Guidance Note */}
        <div className="p-5 rounded-2xl border border-app-border bg-app/50 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium text-app-text">
            <AlertCircleIcon size={16} className="text-app-accent" />
            <span>Quy chuẩn định dạng dữ liệu tiếng Việt (Excel / CSV)</span>
          </div>
          <div className="text-xs text-app-muted space-y-2 leading-relaxed">
            <p>
              • <strong>File Ngữ pháp (Bộ C):</strong> Gồm 8 cột chuẩn: <code className="bg-app-surface px-1.5 py-0.5 rounded border border-app-border font-mono">STT | NGỮ PHÁP | Ý nghĩa | Ví dụ / Dịch nghĩa | Số lần | Ngữ cảnh sử dụng | Cách chia (kiểu V) | Dễ nhầm lẫn với</code>.
            </p>
            <p>
              • <strong>Tự động nhận diện 5 nhóm ngữ pháp:</strong> Các hàng đề mục như <em>1. NGỮ PHÁP N3 TRONG ĐỀ</em>, <em>2. KÍNH NGỮ</em>, <em>3. LIÊN TỪ</em>, <em>4. PHÓ TỪ</em>, <em>5. NGỮ PHÁP N4...</em> được tự động phân loại vào nhóm tương ứng.
            </p>
            <p>
              • <strong>Sắp xếp chuẩn xác (1 → 230):</strong> Hệ thống lưu ID đệm số 0 chuẩn (<code className="bg-app-surface px-1.5 py-0.5 rounded border border-app-border font-mono">GRAMMAR-0001</code> đến <code className="bg-app-surface px-1.5 py-0.5 rounded border border-app-border font-mono">GRAMMAR-0230</code>) và tự động sắp xếp theo STT tăng dần, khắc phục triệt để hiện tượng thứ tự bị xáo trộn.
            </p>
            <p>
              • <strong>Tách câu ví dụ thông minh:</strong> Tự động phát hiện dấu ngắt câu tiếng Nhật <code className="font-mono">。</code> hoặc xuống dòng, không bao giờ để chữ đầu câu tiếng Việt dính sang câu tiếng Nhật.
            </p>
          </div>
        </div>

        {/* Success alert */}
        {successMessage && (
          <div className="p-4 rounded-xl border border-app-border border-l-2 border-l-app-success bg-app-surface text-xs sm:text-sm text-app-success flex items-center gap-2">
            <CheckCircleIcon size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Preview 5 rows */}
        {parseResult && (
          <div className="space-y-4 pt-4 border-t border-app-border">
            <div className="flex items-center justify-between text-xs sm:text-sm text-app-muted">
              <span>
                Phân tích: <strong className="text-app-text font-medium">{parseResult.validCount}</strong> mục hợp lệ
                {parseResult.errorCount > 0 && ` (${parseResult.errorCount} lỗi)`}
              </span>
            </div>

            <div className="border border-app-border rounded-xl overflow-x-auto text-xs sm:text-sm">
              <table className="w-full text-left">
                <thead className="bg-app text-xs uppercase tracking-wider text-app-muted font-medium border-b border-app-border">
                  <tr>
                    <th className="p-3">STT</th>
                    <th className="p-3">{targetDeck === 'grammar' ? 'Mẫu ngữ pháp' : 'Từ vựng'}</th>
                    <th className="p-3">{targetDeck === 'grammar' ? 'Nhóm' : 'Cách đọc'}</th>
                    <th className="p-3">Ý nghĩa</th>
                    <th className="p-3">Số lần</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40">
                  {parseResult.previewRows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-app">
                      <td className="p-3 font-mono text-app-muted">{r.stt}</td>
                      <td className="p-3 font-jp font-light text-app-text text-base">{r.word || r.pattern}</td>
                      <td className="p-3">{r.reading || r.category}</td>
                      <td className="p-3 max-w-xs truncate">{r.meaning}</td>
                      <td className="p-3 font-medium">{r.freq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleSaveData}
              disabled={isProcessing || parseResult.validCount === 0}
              className="w-full h-12 rounded-xl bg-app-accent text-white text-xs sm:text-sm font-medium hover:opacity-90 notebook-fade shadow-sm flex items-center justify-center gap-2"
            >
              <span>Lưu {parseResult.validCount} mục vào cơ sở dữ liệu</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
