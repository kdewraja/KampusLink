import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  swipeSchema,
  freeTonightSchema,
  proposeDateSchema,
  sendMessageSchema,
  reportSchema,
  verifyStudentSchema,
  aiToneCheckSchema,
  filterSchema,
} from '../server/lib/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'student@iitd.ac.in',
        password: 'password123',
        name: 'Test User',
        age: 20,
        gender: 'FEMALE',
        campus: 'IIT Delhi',
        major: 'Computer Science',
        batch: "Class of '26",
        relationshipIntent: 'DATING_ROMANCE',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        age: 20,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'Computer Science',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject password too short', () => {
      const data = {
        email: 'student@iitd.ac.in',
        password: 'short',
        name: 'Test User',
        age: 20,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'Computer Science',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject age under 18', () => {
      const data = {
        email: 'student@iitd.ac.in',
        password: 'password123',
        name: 'Test User',
        age: 17,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'Computer Science',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'student@iitd.ac.in',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'student@iitd.ac.in',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('swipeSchema', () => {
    it('should validate like action with comment', () => {
      const result = swipeSchema.safeParse({
        targetUserId: 'clx1234567890abcdef123456',
        action: 'LIKE',
        comment: 'Great profile!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid action', () => {
      const result = swipeSchema.safeParse({
        targetUserId: 'clx1234567890abcdef123456',
        action: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('freeTonightSchema', () => {
    it('should validate free tonight data', () => {
      const result = freeTonightSchema.safeParse({
        isActive: true,
        timeWindow: '8 PM - 10 PM',
        dateType: 'CAFE_COFFEE',
        area: 'Central Library',
        note: 'Free after class!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid dateType', () => {
      const result = freeTonightSchema.safeParse({
        dateType: 'Invalid Type',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('proposeDateSchema', () => {
    it('should validate date proposal', () => {
      const result = proposeDateSchema.safeParse({
        recipientId: 'clx1234567890abcdef123456',
        venueName: 'Library Cafe',
        venueType: 'Quiet Cafe',
        dateTime: '2024-12-25T18:30:00.000Z',
        notes: 'Coffee on me',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid datetime', () => {
      const result = proposeDateSchema.safeParse({
        recipientId: 'clx1234567890abcdef123456',
        venueName: 'Library Cafe',
        venueType: 'Quiet Cafe',
        dateTime: 'invalid-date',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('sendMessageSchema', () => {
    it('should validate message', () => {
      const result = sendMessageSchema.safeParse({
        text: 'Hey there!',
        type: 'TEXT',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
      const result = sendMessageSchema.safeParse({
        text: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyStudentSchema', () => {
    it('should accept .edu email', () => {
      const result = verifyStudentSchema.safeParse({
        collegeEmail: 'student@university.edu',
      });
      expect(result.success).toBe(true);
    });

    it('should accept .ac.in email', () => {
      const result = verifyStudentSchema.safeParse({
        collegeEmail: 'student@iitd.ac.in',
      });
      expect(result.success).toBe(true);
    });

    it('should reject generic email', () => {
      const result = verifyStudentSchema.safeParse({
        collegeEmail: 'student@gmail.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('aiToneCheckSchema', () => {
    it('should validate grammar mode', () => {
      const result = aiToneCheckSchema.safeParse({
        text: 'Hey u wanna get coffe?',
        mode: 'grammar',
      });
      expect(result.success).toBe(true);
    });

    it('should validate tone modes', () => {
      const tones = ['friendly', 'confident', 'natural', 'less_awkward', 'concise'];
      tones.forEach(tone => {
        const result = aiToneCheckSchema.safeParse({
          text: 'Hey there',
          mode: tone,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});