/**
 * Web Speech API wrapper for Japanese Text-to-Speech
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private jaVoice: SpeechSynthesisVoice | null = null;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const findVoice = () => {
      const voices = this.synth!.getVoices();
      // Look for a ja-JP voice
      const jaVoices = voices.filter(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
      if (jaVoices.length > 0) {
        // Prefer Google or Kyoko / Otoya if available
        this.jaVoice = jaVoices.find(v => v.name.includes('Google') || v.name.includes('Kyoko') || v.name.includes('Otoya')) || jaVoices[0];
      }
      this.initialized = true;
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  public speak(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      // Clean text: remove tildes and punctuation that sounds weird
      const cleanText = text.replace(/[～~_＿]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      if (this.jaVoice) {
        utterance.voice = this.jaVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
