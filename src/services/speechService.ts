// Vietnamese Text-to-Speech and Speech Recognition utility

export class SpeechService {
  private static isSpeaking = false;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static isRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  /**
   * Speak text in Vietnamese
   */
  static speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.isSupported()) {
      return false;
    }

    try {
      this.stop();

      // Clean markdown tags or bullets from text for natural speech
      const cleanText = text
        .replace(/[*_#`[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95; // Gentle, clear speed for middle schoolers
      utterance.pitch = 1.05; // Friendly voice tone

      // Try to find a Vietnamese voice
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang === 'vi-VN');
      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech error:', e);
      return false;
    }
  }

  static stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Create a Vietnamese speech recognition listener
   */
  static createRecognizer(
    onResult: (text: string) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ) {
    if (!this.isRecognitionSupported()) {
      return null;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'vi-VN';
    recognizer.continuous = false;
    recognizer.interimResults = false;

    recognizer.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognizer.onerror = (err: any) => {
      if (onError) onError(err);
    };

    recognizer.onend = () => {
      if (onEnd) onEnd();
    };

    return recognizer;
  }
}
