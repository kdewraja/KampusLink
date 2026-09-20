import { describe, it, expect } from 'vitest';
import { aiService } from '../server/services/aiService';

describe('AIService', () => {
  describe('checkGrammar', () => {
    it('should fix common typos', async () => {
      const result = await aiService.checkGrammar('teh quick brown fox');
      expect(result.wasCorrected).toBe(true);
      expect(result.corrected.toLowerCase()).toContain('the');
    });

    it('should capitalize first letter', async () => {
      const result = await aiService.checkGrammar('hello world');
      expect(result.corrected).toBe('Hello world.');
    });

    it('should fix contractions', async () => {
      const result = await aiService.checkGrammar('i cant dont wont');
      expect(result.corrected).toContain("I can't don't won't");
    });

    it('should fix "could of" to "could have"', async () => {
      const result = await aiService.checkGrammar('i could of done it');
      expect(result.corrected).toContain('could have');
    });

    it('should add period to long sentences', async () => {
      const result = await aiService.checkGrammar('this is a long sentence without period');
      expect(result.corrected.endsWith('.')).toBe(true);
    });

    it('should not modify already correct text', async () => {
      const result = await aiService.checkGrammar('Hello world.');
      expect(result.wasCorrected).toBe(false);
    });

    it('should handle empty string', async () => {
      const result = await aiService.checkGrammar('');
      expect(result.wasCorrected).toBe(false);
      expect(result.corrected).toBe('');
    });
  });

  describe('adjustTone', () => {
    it('should make text friendlier', async () => {
      const result = await aiService.adjustTone('Hey', 'friendly');
      expect(result.improved).toContain('Hey!');
      expect(result.improved.length).toBeGreaterThan('Hey'.length);
    });

    it('should make text more confident', async () => {
      const result = await aiService.adjustTone('I was thinking maybe if you want to get coffee', 'confident');
      expect(result.improved).toContain('Let\'s grab a coffee');
    });

    it('should make text more natural', async () => {
      const result = await aiService.adjustTone('I would like to inquire whether you are interested', 'natural');
      expect(result.improved).toContain('I\'d love to know');
    });

    it('should make awkward text less awkward', async () => {
      const result = await aiService.adjustTone('What do you do?', 'less_awkward');
      expect(result.improved).toContain('campus');
    });

    it('should make text more concise', async () => {
      const result = await aiService.adjustTone('Just wanted to reach out and say that I just wanted to ask if you are free', 'concise');
      expect(result.improved.length).toBeLessThan('Just wanted to reach out and say that I just wanted to ask if you are free'.length);
    });

    it('should handle empty string', async () => {
      const result = await aiService.adjustTone('', 'friendly');
      expect(result.improved).toBe('');
    });
  });
});