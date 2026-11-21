import React, { useState } from 'react';
import { AppSettings } from '../types';
import { dbManager } from '../lib/db';
import { 
  SettingsIcon, 
  VolumeIcon, 
  MoonIcon, 
  SunIcon, 
  DownloadIcon, 
  UploadIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  AlertCircleIcon 
} from './Icons';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (updated: AppSettings) => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onDataReset
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExportBackup = async () => {
    try {
      const backup = await dbManager.exportBackup();
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `jlpt_n3_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccessMsg('Đã xuất file sao lưu tiến độ thành công (.json).');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Lỗi khi xuất backup: ${err.message}`);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      await dbManager.importBackup(backup);
      setSuccessMsg('Đã khôi phục toàn bộ dữ liệu và tiến độ thành công.');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      alert(`File sao lưu không hợp lệ: ${err.message}`);
    }
  };

  const handleReset = async () => {
    const confirm1 = window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về bộ mẫu ban đầu? Toàn bộ tiến độ học hiện tại sẽ bị xóa.');
    if (!confirm1) return;

    try {
      await dbManager.resetAllData();
      onDataReset();
      setSuccessMsg('Đã đặt lại dữ liệu về trạng thái ban đầu.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Lỗi khi xóa dữ liệu: ${err.message}`);
    }
  };

  const vocabCount = settings.vocabCardsPerSession ?? settings.cardsPerSession ?? 20;
  const grammarCount = settings.grammarCardsPerSession ?? 15;
  const mimikaraCount = settings.mimikaraCardsPerSession ?? 20;

  const handleUpdateVocabCards = (val: number) => {
    const safeVal = Math.max(1, Math.min(1000, isNaN(val) ? 20 : val));
    onUpdateSettings({ ...settings, vocabCardsPerSession: safeVal, cardsPerSession: safeVal });
  };

  const handleUpdateGrammarCards = (val: number) => {
    const safeVal = Math.max(1, Math.min(500, isNaN(val) ? 15 : val));
    onUpdateSettings({ ...settings, grammarCardsPerSession: safeVal });
  };

  const handleUpdateMimikaraCards = (val: number) => {
    const safeVal = Math.max(1, Math.min(880, isNaN(val) ? 20 : val));
    onUpdateSettings({ ...settings, mimikaraCardsPerSession: safeVal });
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-app-accent-subtle text-app-accent flex items-center justify-center">
            <SettingsIcon size={20} />
          </div>
          <h2 className="text-2xl font-medium text-app-text tracking-tight">
            Cài đặt ứng dụng
          </h2>
        </div>
        <p className="text-sm text-app-muted mt-1.5 ml-11">
          Tùy chỉnh số lượng thẻ học riêng cho Từ vựng và Ngữ pháp, phát âm, sao lưu và khôi phục tiến độ
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-sm">
          <CheckCircleIcon size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="border border-app-border rounded-2xl bg-app-surface divide-y divide-app-border/40 shadow-sm overflow-hidden">
        {/* Vocab cards per session */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text flex items-center gap-2">
              <span>Số thẻ TỪ VỰNG mỗi phiên</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-app-accent-subtle text-app-accent font-medium">Bộ A & B</span>
            </div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Số từ vựng xếp vào một lượt học SRS (chọn nhanh hoặc tự nhập số tùy ý)</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[10, 20, 30, 50].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => handleUpdateVocabCards(cnt)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  vocabCount === cnt
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                {cnt}
              </button>
            ))}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-xs text-app-muted">Tự nhập:</span>
              <input
                type="number"
                min={1}
                max={1500}
                value={vocabCount}
                onChange={e => handleUpdateVocabCards(parseInt(e.target.value, 10))}
                style={{ color: 'var(--color-text)' }}
                className="w-18 h-9 px-2 text-center text-sm font-medium rounded-lg border border-app-border bg-app text-app-text focus:outline-none focus:border-app-accent"
              />
              <span className="text-xs text-app-muted">thẻ</span>
            </div>
          </div>
        </div>

        {/* Grammar cards per session */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text flex items-center gap-2">
              <span>Số thẻ NGỮ PHÁP mỗi phiên</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">Bộ C</span>
            </div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Số mẫu ngữ pháp ôn tập mỗi lượt (chọn nhanh hoặc tự nhập số tùy ý)</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 15, 25].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => handleUpdateGrammarCards(cnt)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  grammarCount === cnt
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                {cnt}
              </button>
            ))}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-xs text-app-muted">Tự nhập:</span>
              <input
                type="number"
                min={1}
                max={300}
                value={grammarCount}
                onChange={e => handleUpdateGrammarCards(parseInt(e.target.value, 10))}
                style={{ color: 'var(--color-text)' }}
                className="w-18 h-9 px-2 text-center text-sm font-medium rounded-lg border border-app-border bg-app text-app-text focus:outline-none focus:border-app-accent"
              />
              <span className="text-xs text-app-muted">mẫu</span>
            </div>
          </div>
        </div>

        {/* Mimikara cards per session */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text flex items-center gap-2">
              <span>Số thẻ MIMIKARA N3 mỗi phiên</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">880 Từ</span>
            </div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Số từ vựng Mimikara học mỗi lượt (chọn nhanh hoặc tự nhập số tùy ý)</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[10, 20, 30, 50].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => handleUpdateMimikaraCards(cnt)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  mimikaraCount === cnt
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                {cnt}
              </button>
            ))}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-xs text-app-muted">Tự nhập:</span>
              <input
                type="number"
                min={1}
                max={880}
                value={mimikaraCount}
                onChange={e => handleUpdateMimikaraCards(parseInt(e.target.value, 10))}
                style={{ color: 'var(--color-text)' }}
                className="w-18 h-9 px-2 text-center text-sm font-medium rounded-lg border border-app-border bg-app text-app-text focus:outline-none focus:border-app-accent"
              />
              <span className="text-xs text-app-muted">thẻ</span>
            </div>
          </div>
        </div>

        {/* Auto pronounce */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text flex items-center gap-2">
              <VolumeIcon size={18} className="text-app-muted" />
              <span>Tự động phát âm</span>
            </div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Tự đọc câu tiếng Nhật khi lật flashcard hoặc khi mở câu hỏi trắc nghiệm</div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, autoPronounce: !settings.autoPronounce })}
            className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm notebook-fade font-medium ${
              settings.autoPronounce
                ? 'border-app-accent bg-app-accent-subtle text-app-accent'
                : 'border-app-border bg-app text-app-muted hover:text-app-text'
            }`}
          >
            {settings.autoPronounce ? 'Đang bật tự đọc' : 'Đang tắt'}
          </button>
        </div>

        {/* Speech rate */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text">Tốc độ giọng đọc</div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Tốc độ đọc giọng Nhật Web Speech API (ja-JP)</div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { rate: 0.8, label: 'Chậm (0.8x)' },
              { rate: 0.95, label: 'Chuẩn (1.0x)' },
              { rate: 1.15, label: 'Nhanh (1.2x)' }
            ].map(item => (
              <button
                key={item.rate}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, speechRate: item.rate })}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm border notebook-fade ${
                  settings.speechRate === item.rate
                    ? 'border-app-accent bg-app-accent text-white font-medium shadow-sm'
                    : 'border-app-border bg-app hover:border-app-text text-app-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-app-text flex items-center gap-2">
              {settings.darkMode ? <MoonIcon size={18} className="text-app-accent" /> : <SunIcon size={18} className="text-amber-500" />}
              <span>Chế độ giao diện (Dark Mode)</span>
            </div>
            <div className="text-xs sm:text-sm text-app-muted mt-1">Tông nền sáng dịu mắt #FAFAF8 hoặc tối sâu chống chói #141414</div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, darkMode: !settings.darkMode })}
            className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm notebook-fade font-medium flex items-center gap-2 ${
              settings.darkMode
                ? 'border-app-accent bg-app-accent-subtle text-app-accent'
                : 'border-app-border bg-app text-app-muted hover:text-app-text'
            }`}
          >
            {settings.darkMode ? <MoonIcon size={16} /> : <SunIcon size={16} />}
            <span>{settings.darkMode ? 'Giao diện tối' : 'Giao diện sáng'}</span>
          </button>
        </div>
      </div>

      {/* Backup Card */}
      <div className="border border-app-border rounded-2xl bg-app-surface p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-app border border-app-border flex items-center justify-center text-app-accent">
            <DownloadIcon size={17} />
          </div>
          <div className="text-base font-medium text-app-text">
            Sao lưu và khôi phục tiến độ (IndexedDB)
          </div>
        </div>
        <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
          Toàn bộ từ vựng, ngữ pháp, đánh dấu yêu thích và tiến độ hộp lặp lại Leitner (1–5) được lưu trữ hoàn toàn offline trong trình duyệt. Bạn có thể xuất file JSON để lưu trữ hoặc chuyển sang máy tính, điện thoại khác.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={handleExportBackup}
            className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text font-medium flex items-center gap-2 bg-app notebook-fade"
          >
            <DownloadIcon size={16} />
            <span>Xuất file backup (.json)</span>
          </button>

          <label className="h-11 px-5 rounded-xl border border-app-border hover:border-app-text text-app-text font-medium flex items-center gap-2 bg-app cursor-pointer notebook-fade">
            <UploadIcon size={16} />
            <span>Khôi phục từ file (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-rose-200 dark:border-rose-950/60 rounded-2xl bg-app-surface p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600">
            <AlertCircleIcon size={18} />
          </div>
          <div className="text-base font-medium text-rose-700 dark:text-rose-400">
            Vùng nguy hiểm
          </div>
        </div>
        <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
          Đặt lại cơ sở dữ liệu về bộ dữ liệu mẫu ban đầu (911 từ vựng, 349 kanji, 230 ngữ pháp N3). Toàn bộ tiến độ học và các mục bạn tự nạp thêm sẽ bị xoá vĩnh viễn nếu chưa xuất backup.
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="h-11 px-5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-medium flex items-center gap-2 notebook-fade"
          >
            <TrashIcon size={16} />
            <span>Xoá và đặt lại dữ liệu gốc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
