import React, { useState } from 'react';
import { speechService } from '../lib/speech';
import { VolumeIcon } from './Icons';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rate?: number;
  showText?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  className = '',
  rate = 0.95,
  showText = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      await speechService.speak(text, rate);
    } catch {
      // ignore
    } finally {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-xl',
    md: 'text-sm px-3.5 py-2 rounded-xl',
    lg: 'text-sm sm:text-base px-4 py-2.5 rounded-2xl'
  };

  const iconSizes = {
    sm: 15,
    md: 17,
    lg: 20
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title="Nghe phát âm"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-app-border text-app-muted hover:text-app-text hover:border-app-accent notebook-fade font-normal bg-app-surface transition-all ${
        isPlaying ? 'border-app-accent text-app-accent bg-app-accent-subtle' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      <VolumeIcon size={iconSizes[size]} className={isPlaying ? 'text-app-accent' : 'text-app-muted'} />
      {showText && <span>{isPlaying ? 'Đang đọc...' : 'Nghe'}</span>}
    </button>
  );
};
