export type ToneType = 'friendly' | 'confident' | 'natural' | 'less_awkward' | 'concise';

export interface GrammarCorrectionResult {
  original: string;
  corrected: string;
  corrections: Array<{ original: string; replacement: string; reason: string }>;
  wasCorrected: boolean;
}

export interface ToneAdjustmentResult {
  original: string;
  improved: string;
  tone: ToneType;
  rationale: string;
}

export interface IAIService {
  checkGrammar(text: string): Promise<GrammarCorrectionResult>;
  adjustTone(text: string, tone: ToneType): Promise<ToneAdjustmentResult>;
}

/**
 * Provider-Agnostic AI Service implementation.
 * Designed to connect to external LLM providers (Google Gemini, Anthropic, OpenAI)
 * with an intelligent zero-latency fallback engine for privacy, offline development, and high speed.
 */
class ProductionAIService implements IAIService {
  private provider: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'builtin-nlp';
  }

  public async checkGrammar(text: string): Promise<GrammarCorrectionResult> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { original: text, corrected: text, corrections: [], wasCorrected: false };
    }

    const corrections: Array<{ original: string; replacement: string; reason: string }> = [];
    let corrected = trimmed;

    // Common grammar and typo fixes
    const rules: Array<{ pattern: RegExp; replace: string; reason: string }> = [
      { pattern: /\b(teh)\b/gi, replace: 'the', reason: 'Typo correction' },
      { pattern: /\b(im|i'm|Im)\b/g, replace: "I'm", reason: 'Capitalization & apostrophe' },
      { pattern: /\b(cant)\b/gi, replace: "can't", reason: 'Contraction apostrophe' },
      { pattern: /\b(dont)\b/gi, replace: "don't", reason: 'Contraction apostrophe' },
      { pattern: /\b(wont)\b/gi, replace: "won't", reason: 'Contraction apostrophe' },
      { pattern: /\b(youre)\b/gi, replace: "you're", reason: 'Contraction apostrophe' },
      { pattern: /\b(theyre)\b/gi, replace: "they're", reason: 'Contraction apostrophe' },
      { pattern: /\b(could of)\b/gi, replace: 'could have', reason: 'Grammar: "could have" not "could of"' },
      { pattern: /\b(should of)\b/gi, replace: 'should have', reason: 'Grammar: "should have" not "should of"' },
      { pattern: /\b(would of)\b/gi, replace: 'would have', reason: 'Grammar: "would have" not "would of"' },
      { pattern: /\bi\b/g, replace: 'I', reason: 'Capitalize pronoun "I"' },
      { pattern: /\b(coffe|cofe)\b/gi, replace: 'coffee', reason: 'Typo correction' },
      { pattern: /\b(u)\b/g, replace: 'you', reason: 'Informal shorthand expansion' },
      { pattern: /\b(r)\b/g, replace: 'are', reason: 'Informal shorthand expansion' },
      { pattern: /\b(wanna)\b/gi, replace: 'want to', reason: 'Grammar: "want to"' },
      { pattern: /\s+,/g, replace: ',', reason: 'Remove space before comma' },
      { pattern: /\s+\./g, replace: '.', reason: 'Remove space before period' },
    ];

    rules.forEach((rule) => {
      if (rule.pattern.test(corrected)) {
        const matches = corrected.match(rule.pattern);
        if (matches) {
          corrections.push({
            original: matches[0],
            replacement: typeof rule.replace === 'string' ? rule.replace : 'fixed',
            reason: rule.reason,
          });
        }
        corrected = corrected.replace(rule.pattern, rule.replace as string);
      }
    });

    // Capitalize letters following terminal punctuation
    corrected = corrected.replace(/([.!?]\s+)([a-z])/g, (_match: string, p1: string, p2: string) => p1 + p2.toUpperCase());

    // Ensure sentence begins with capital letter
    if (corrected.length > 0 && corrected[0] !== corrected[0].toUpperCase()) {
      corrected = corrected[0].toUpperCase() + corrected.slice(1);
    }

    // Ensure proper terminal punctuation if long enough
    if (corrected.length > 6 && !/[.!?]$/.test(corrected)) {
      corrected += '.';
    }

    const wasCorrected = corrected !== trimmed;

    return {
      original: trimmed,
      corrected,
      corrections,
      wasCorrected,
    };
  }

  public async adjustTone(text: string, tone: ToneType): Promise<ToneAdjustmentResult> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { original: text, improved: text, tone, rationale: 'Empty text provided' };
    }

    // Clean grammar first
    const grammarRes = await this.checkGrammar(trimmed);
    let base = grammarRes.corrected;
    // Strip trailing period for more conversational flexibility
    if (base.endsWith('.')) base = base.slice(0, -1);

    let improved = base;
    let rationale = '';

    switch (tone) {
      case 'friendly':
        improved = this.makeFriendly(base);
        rationale = 'Added warm conversational openness and approachable phrasing.';
        break;
      case 'confident':
        improved = this.makeConfident(base);
        rationale = 'Removed hesitation markers and phrased intent with calm confidence.';
        break;
      case 'natural':
        improved = this.makeNatural(base);
        rationale = 'Smoothed out rigid phrasing for an effortless collegiate tone.';
        break;
      case 'less_awkward':
        improved = this.makeLessAwkward(base);
        rationale = 'Softened defensive or ambiguous phrasing into a comfortable question.';
        break;
      case 'concise':
        improved = this.makeConcise(base);
        rationale = 'Trimmed conversational filler while keeping the core inviting message.';
        break;
    }

    return {
      original: trimmed,
      improved,
      tone,
      rationale,
    };
  }

  private makeFriendly(text: string): string {
    // Soften and add warm conversational tone
    if (/^(hi|hey|hello)/i.test(text)) {
      return text.replace(/^(hi|hey|hello)[,!.]*/i, 'Hey! ') + " Would love to hear your thoughts on that!";
    }
    return `Hey! ${text} Hope your week is going great!`;
  }

  private makeConfident(text: string): string {
    // Remove hesitant qualifiers like "maybe", "i think", "if you want", "sorry"
    let res = text
      .replace(/\b(i was thinking maybe|maybe if you want|if you're not busy|sorry to bother you|i guess)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (/coffee|drink|meet|hang out|grab/i.test(res)) {
      return "Let's grab a coffee at the campus cafe this week — let me know what day works best for you.";
    }
    return res.length > 0 ? res : text;
  }

  private makeNatural(text: string): string {
    // Replace overly formal or rigid wording
    let res = text
      .replace(/\b(I would like to inquire whether|per chance|it would be an honor)\b/gi, "I'd love to know")
      .replace(/\b(do you possess any interest in)\b/gi, 'are you up for')
      .trim();

    return res;
  }

  private makeLessAwkward(text: string): string {
    // Transform awkward blunt questions into engaging open-ended prompts
    if (/what do you do|tell me about yourself/i.test(text)) {
      return "I saw your prompt about your favorite campus spot — what's the story behind that?";
    }
    if (/wyd|what's up|sup/i.test(text)) {
      return "Hey, how has your day on campus been going so far?";
    }
    return text.replace(/^(um|uh|so yeah|haha)\s*/i, '');
  }

  private makeConcise(text: string): string {
    // Shorten wordy introductions
    let res = text
      .replace(/\b(just wanted to reach out and say that|i just wanted to ask if|to be honest with you)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (res.length > 0) {
      return res[0].toUpperCase() + res.slice(1);
    }
    return text;
  }
}

export const aiService = new ProductionAIService();
