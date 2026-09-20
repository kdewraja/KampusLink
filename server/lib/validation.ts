import { z } from 'zod';
import { Gender, RelationshipIntent, DateType, LikeAction, MessageType, DatePlanStatus, ReportReason, NotificationType, AIRequestType } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.number().int().min(18, 'Must be 18 or older').max(99),
  gender: z.nativeEnum(Gender),
  campus: z.string().min(2, 'Campus is required').max(200),
  major: z.string().min(2, 'Major is required').max(200),
  batch: z.string().min(2, 'Batch is required').max(100),
  hostel: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
  relationshipIntent: z.nativeEnum(RelationshipIntent),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  relationshipIntent: z.nativeEnum(RelationshipIntent).optional(),
  favoriteCampusSpot: z.string().max(200).optional(),
  twoAmCraving: z.string().max(200).optional(),
  campusAnthem: z.object({
    title: z.string().max(200),
    artist: z.string().max(200),
    vibe: z.string().max(200).optional(),
  }).optional(),
  prompts: z.array(z.object({
    question: z.string().min(5).max(300),
    answer: z.string().min(5).max(500),
  })).max(5).optional(),
  interests: z.array(z.string().max(50)).max(20).optional(),
  clubs: z.array(z.string().max(100)).max(10).optional(),
});

export const swipeSchema = z.object({
  targetUserId: z.string().cuid('Invalid user ID'),
  action: z.nativeEnum(LikeAction),
  comment: z.string().max(500).optional(),
  targetPromptId: z.string().cuid().optional(),
  targetPhotoUrl: z.string().url().optional(),
});

export const rewindSchema = z.object({});

export const freeTonightSchema = z.object({
  isActive: z.boolean().optional(),
  timeWindow: z.string().max(100).optional(),
  dateType: z.nativeEnum(DateType).optional(),
  area: z.string().max(200).optional(),
  note: z.string().max(300).optional(),
});

export const proposeDateSchema = z.object({
  recipientId: z.string().cuid('Invalid user ID'),
  venueName: z.string().min(2).max(200),
  venueType: z.string().min(2).max(100),
  dateTime: z.string().datetime({ offset: true }),
  notes: z.string().max(500).optional(),
});

export const updateDateStatusSchema = z.object({
  status: z.nativeEnum(DatePlanStatus),
});

export const sendMessageSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.nativeEnum(MessageType).default('TEXT'),
  datePlanId: z.string().cuid().optional(),
  promptComment: z.object({
    promptQuestion: z.string().optional(),
    promptAnswer: z.string().optional(),
    photoUrl: z.string().url().optional(),
    comment: z.string(),
  }).optional(),
});

export const reportSchema = z.object({
  targetUserId: z.string().cuid('Invalid user ID'),
  reason: z.nativeEnum(ReportReason),
  details: z.string().max(1000).optional(),
});

export const blockSchema = z.object({
  targetUserId: z.string().cuid('Invalid user ID'),
});

export const verifyStudentSchema = z.object({
  collegeEmail: z.string().email('Invalid email address').toLowerCase().refine(
    (email) => email.endsWith('.edu') || email.endsWith('.ac.in') || email.includes('campus'),
    'Please provide an accredited university domain email (.edu or .ac.in)'
  ),
});

export const aiToneCheckSchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(['grammar', 'friendly', 'confident', 'natural', 'less_awkward', 'concise']),
  tone: z.enum(['friendly', 'confident', 'natural', 'less_awkward', 'concise']).optional(),
});

export const filterSchema = z.object({
  campus: z.string().optional(),
  major: z.string().optional(),
  batch: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  intent: z.nativeEnum(RelationshipIntent).optional(),
  verifiedOnly: z.boolean().optional(),
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
  area: z.string().optional(),
  dateType: z.nativeEnum(DateType).optional(),
});

export const notificationSchema = z.object({
  userId: z.string().cuid(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  data: z.record(z.string(), z.any()).optional(),
});

export const idParamSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`) };
}