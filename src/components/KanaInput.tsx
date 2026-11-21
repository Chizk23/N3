import React, { useState, useEffect, useRef } from 'react';
import { romajiToKana } from '../lib/kana';

interface KanaInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  hintText?: string;
  expectedKana?: string;
}

export const KanaInput: React.FC<KanaInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Gõ romaji (vi du: eiyou -> えいよう)...',
  autoFocus = true,
  disabled = false,
  hintText,
  expectedKana
}) => {
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');
  const [rawRomaji, setRawRomaji] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && !disabled) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [autoFocus, disabled]);

  useEffect(() => {
    if (!value) {
      setRawRomaji('');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setRawRomaji(raw);
    const converted = romajiToKana(raw, mode, false);
    onChange(converted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const finalVal = romajiToKana(value, mode, true);
      onChange(finalVal);
      if (onSubmit) {
        onSubmit();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setMode(prev => prev === 'hiragana' ? 'katakana' : 'hiragana');
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Centered large input with 2px bottom border */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          style={{ color: 'var(--color-text)' }}
          className="w-full py-4 text-center text-[32px] sm:text-[38px] font-jp font-light bg-transparent border-b-2 border-app-border focus:border-app-accent focus:outline-none notebook-fade text-app-text caret-app-accent placeholder:text-app-muted/60 placeholder:text-base placeholder:font-normal"
        />

        {/* Small romaji indicator underneath input */}
        <div className="h-6 mt-1 flex items-center justify-center text-xs font-mono text-app-muted">
          {value ? (
            <span>Romaji: <span className="text-app-accent font-medium">{rawRomaji || value}</span></span>
          ) : (
            <span className="text-app-muted/80">Ký tự romaji tự động chuyển đổi thành chữ Kana</span>
          )}
        </div>
      </div>

      {/* Mode and hint controls */}
      <div className="flex items-center justify-between text-xs text-app-muted pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(prev => prev === 'hiragana' ? 'katakana' : 'hiragana')}
            className="hover:text-app-text underline underline-offset-4 font-normal"
          >
            Chế độ: <span className="text-app-text font-medium">{mode === 'hiragana' ? 'Hiragana (nhấn Tab để đổi)' : 'Katakana (nhấn Tab để đổi)'}</span>
          </button>

          {(hintText || expectedKana) && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="hover:text-app-text underline underline-offset-4"
            >
              {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
            </button>
          )}
        </div>

        <span className="hidden sm:inline text-[11px] text-app-muted">
          Nhấn phím <kbd className="px-1.5 py-0.5 rounded border border-app-border bg-app text-app-text font-mono text-[10px]">Enter</kbd> để nộp đáp án
        </span>
      </div>

      {/* Hint detail */}
      {showHint && (
        <div className="text-xs text-app-text bg-app p-3.5 rounded-xl border border-app-border notebook-fade shadow-sm">
          Gợi ý: {hintText || ''} {expectedKana ? `(${expectedKana.length} ký tự, bắt đầu bằng "${expectedKana.charAt(0)}")` : ''}
        </div>
      )}
    </div>
  );
};
