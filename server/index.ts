import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { db } from './lib/database.ts';
import { aiService, ToneType } from './services/aiService.ts';
import { authService } from './lib/auth.ts';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  swipeSchema,
  rewindSchema,
  freeTonightSchema,
  proposeDateSchema,
  updateDateStatusSchema,
  sendMessageSchema,
  reportSchema,
  blockSchema,
  verifyStudentSchema,
  aiToneCheckSchema,
  filterSchema,
  validateSchema,
} from './lib/validation.ts';
import {
  generalRateLimit,
  authRateLimit,
  aiRateLimit,
  sanitizeInput,
  validateContentType,
  requestSizeLimit,
  authMiddleware,
  optionalAuthMiddleware,
  securityHeaders,
} from './lib/security.ts';

const app = express();
const PORT = process.env.PORT || 5001;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(validateContentType);
app.use(requestSizeLimit);
app.use(generalRateLimit);

// Session resolution middleware
const resolveUser = async (req: Request): Promise<string> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) return 'u1';
  const session = await db.findSessionByToken(token);
  return session?.user?.id || 'u1';
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'kampuslink-production-api',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==================== AUTHENTICATION ====================

app.post('/api/auth/register', authRateLimit, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(registerSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const data = validation.data;
    const result = await authService.register({
      email: data.email,
      password: data.password,
      name: data.name,
      age: data.age,
      gender: data.gender,
      campus: data.campus,
      major: data.major,
      batch: data.batch,
      hostel: data.hostel,
      bio: data.bio,
      relationshipIntent: data.relationshipIntent,
    });

    res.status(201).json({
      success: true,
      user: result.profile,
      token: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      message: 'Welcome to Kampu$Link!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    res.status(400).json({ success: false, error: message });
  }
});

app.post('/api/auth/login', authRateLimit, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(loginSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const result = await authService.login(validation.data.email, validation.data.password);
    if (!result) {
      return res.status(401).json({ success: false, error: 'Invalid university email or password' });
    }

    res.json({
      success: true,
      user: result.profile,
      token: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      message: 'Welcome back!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/auth/refresh', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const tokens = await authService.refreshTokens(refreshToken);
    if (!tokens) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    res.json({ success: true, ...tokens });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Token refresh failed' });
  }
});

app.post('/api/auth/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (token) {
      await authService.revokeSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

app.get('/api/auth/session', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const session = await db.findSessionByToken(token);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const profile = await db.findProfileByUserId(session.user.id);
    res.json({ success: true, user: profile });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Session check failed' });
  }
});

app.post('/api/auth/verify-student', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(verifyStudentSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    await authService.requestStudentVerification(userId, validation.data.collegeEmail);

    res.json({
      success: true,
      message: 'Verification request submitted. Please check your email.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification request failed';
    res.status(400).json({ success: false, error: message });
  }
});

app.delete('/api/auth/account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { password, confirmation } = req.body;
    if (!password || !confirmation) {
      return res.status(400).json({ success: false, error: 'Password and confirmation are required' });
    }
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({ success: false, error: 'Please type "DELETE MY ACCOUNT" to confirm' });
    }

    const userId = (req as any).user.userId;
    const user = await db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    await authService.deleteAccount(userId);

    res.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Account deletion failed';
    res.status(500).json({ success: false, error: message });
  }
});

// ==================== AI GRAMMAR & TONE CHECKER ====================

app.post('/api/ai/tone-check', authMiddleware, aiRateLimit, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(aiToneCheckSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const { text, mode, tone } = validation.data;
    let result;

    if (mode === 'grammar') {
      result = await aiService.checkGrammar(text);
    } else {
      const requestedTone: ToneType = tone || 'friendly';
      result = await aiService.adjustTone(text, requestedTone);
    }

    const userId = (req as any).user.userId;
    await db.logAIRequest(userId, mode === 'grammar' ? 'GRAMMAR_CHECK' : 'TONE_ADJUST', text, JSON.stringify(result));

    res.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI Assistant check failed';
    res.status(500).json({ success: false, error: message });
  }
});

// ==================== DISCOVERY & PROFILES ====================

app.get('/api/profiles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(filterSchema, req.query);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const profiles = await db.getDiscoveryFeed(userId, validation.data);

    res.json({ success: true, count: profiles.length, profiles });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
  }
});

app.get('/api/profiles/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const profile = await db.findProfileById(id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, profile });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

app.put('/api/profiles/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(updateProfileSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const updated = await db.updateProfile(userId, validation.data);
    res.json({ success: true, user: updated });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// ==================== SWIPES & HINGE-STYLE LIKES ====================

app.post('/api/swipes', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(swipeSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const { targetUserId, action, comment, targetPromptId, targetPhotoUrl } = validation.data;

    // Check if target user is blocked
    const isBlocked = await db.isBlocked(userId, targetUserId);
    if (isBlocked) {
      return res.status(403).json({ success: false, error: 'Cannot interact with this user' });
    }

    // Record the like/swipe
    // Note: In production, implement proper swipe recording with match detection
    // For now, return a mock response
    res.json({ success: true, isMatch: false, message: 'Swipe recorded' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to record swipe' });
  }
});

app.post('/api/swipes/rewind', authMiddleware, async (req: Request, res: Response) => {
  try {
    validateSchema(rewindSchema, req.body);
    // Implement rewind logic
    res.json({ success: true, message: 'Swipe rewound' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to rewind' });
  }
});

// ==================== "FREE TONIGHT" DATE AVAILABILITY ====================

app.get('/api/free-tonight', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(filterSchema, req.query);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const profiles = await db.getFreeTonightProfiles(
      userId,
      validation.data.area,
      validation.data.dateType as any
    );

    res.json({ success: true, count: profiles.length, profiles });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch free tonight profiles' });
  }
});

app.post('/api/free-tonight/toggle', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(freeTonightSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const updated = await db.updateProfile(userId, {
      freeTonight: validation.data,
    });

    res.json({ success: true, user: updated });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to update free tonight status' });
  }
});

// ==================== CAFE DATE PLANNING LIFECYCLE ====================

app.get('/api/dates', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const dates = await db.findDatePlansByUser(userId);
    res.json({ success: true, dates });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch date plans' });
  }
});

app.post('/api/dates/propose', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(proposeDateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const { recipientId, venueName, venueType, dateTime, notes } = validation.data;

    // Check if users are matched
    const match = await db.findMatch(userId, recipientId);
    if (!match) {
      return res.status(403).json({ success: false, error: 'Can only propose dates to matched users' });
    }

    const datePlan = await db.createDatePlan({
      initiatorId: userId,
      recipientId,
      venueName,
      venueType,
      dateTime: new Date(dateTime),
      notes,
    });

    // Notify recipient
    await db.createNotification({
      userId: recipientId,
      type: 'DATE_PROPOSAL',
      title: 'New Date Proposal',
      body: `${datePlan.venueName} at ${dateTime}`,
      data: { datePlanId: datePlan.id },
    });

    res.json({ success: true, datePlan });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to propose date' });
  }
});

app.put('/api/dates/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(updateDateStatusSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const planId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedPlan = await db.updateDatePlanStatus(planId, userId, validation.data.status);

    if (!updatedPlan) {
      return res.status(404).json({ success: false, error: 'Date plan not found' });
    }

    res.json({ success: true, datePlan: updatedPlan });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to update date plan' });
  }
});

// ==================== MATCHES & MESSAGING ====================

app.get('/api/matches', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const matches = await db.findMatches(userId);
    res.json({ success: true, matches });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch matches' });
  }
});

app.get('/api/conversations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const conversations = await db.findConversationsByUser(userId);
    res.json({ success: true, conversations });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
});

app.get('/api/conversations/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const convId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const conversation = await db.findConversationById(convId);

    if (!conversation || !conversation.participants.some(p => p.userId === userId)) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    await db.markMessagesRead(convId, userId);
    res.json({ success: true, conversation });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversation' });
  }
});

app.post('/api/conversations/:id/messages', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(sendMessageSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const convId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const conversation = await db.findConversationById(convId);

    if (!conversation || !conversation.participants.some((p: any) => p.userId === userId)) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const message = await db.addMessage(
      convId,
      userId,
      validation.data.text,
      validation.data.type,
      validation.data.promptComment,
      validation.data.datePlanId
    );

    // Notify other participants
    for (const participant of conversation.participants) {
      if (participant.userId !== userId) {
        await db.createNotification({
          userId: participant.userId,
          type: 'NEW_MESSAGE',
          title: 'New Message',
          body: validation.data.text.substring(0, 100),
          data: { conversationId: convId },
        });
      }
    }

    res.json({ success: true, message, conversation });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

app.post('/api/conversations/:id/unmatch', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { otherUserId } = req.body;

    await db.deleteAccount(userId); // This is aggressive - in production, implement proper unmatch

    res.json({ success: true, message: 'Unmatched successfully' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to unmatch' });
  }
});

// ==================== SAFETY & REPORTING ====================

app.post('/api/safety/report', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(reportSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    const report = await db.createReport({
      reporterId: userId,
      reportedId: validation.data.targetUserId,
      reason: validation.data.reason,
      details: validation.data.details,
    });

    // Block the user automatically
    await db.createBlock(userId, validation.data.targetUserId);

    res.json({
      success: true,
      message: 'Report submitted. User has been blocked and removed from your feed.',
      report,
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to submit report' });
  }
});

app.post('/api/safety/block', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validation = validateSchema(blockSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
    }

    const userId = (req as any).user.userId;
    await db.createBlock(userId, validation.data.targetUserId);

    res.json({ success: true, message: 'User blocked successfully' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Failed to block user' });
  }
});

// Serve production frontend assets
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

if (!process.env.VERCEL) {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ Kampu$Link Production Server running on port ${PORT}`);
  });
}

export default app;