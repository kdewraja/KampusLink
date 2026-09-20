// Kampu$Link Comprehensive Direct Service & DB Test
import { db } from '../server/db';
import { aiService } from '../server/services/aiService';

async function runTests() {
  console.log('🧪 Starting Kampu$Link Direct Logic & Service Tests...\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Session & Profiles
  await test('Default User Session (Aarav Sharma)', () => {
    const user = db.getProfileById('u1');
    if (!user || user.name !== 'Aarav Sharma') throw new Error('u1 user not found or invalid');
    if (!user.isVerified) throw new Error('u1 should be verified');
  });

  await test('Discovery Feed Generation', () => {
    const feed = db.getProfiles('u1', {});
    if (!feed || feed.length === 0) throw new Error('Feed is empty');
    const hasVikram = feed.some((p) => p.id === 'u3');
    if (!hasVikram) throw new Error('Unswiped profiles like Vikram should be in discovery stack');
  });

  // 2. Free Tonight Availability
  await test('Free Tonight Profile Filtering', () => {
    const freeProfiles = db.getFreeTonightProfiles('u1');
    if (!freeProfiles || freeProfiles.length === 0) throw new Error('No active Free Tonight profiles found');
    const rhea = freeProfiles.find((p) => p.id === 'u2');
    if (!rhea || !rhea.freeTonight?.isActive) throw new Error('Rhea should be active for Free Tonight');
  });

  await test('Toggle Free Tonight Status', () => {
    const updated = db.toggleFreeTonight('u1', {
      isActive: true,
      timeWindow: '8 PM - 11 PM',
      dateType: 'Cafe & Coffee',
      area: 'Central Courtyard',
      note: 'Looking for a study partner!',
    });
    if (!updated?.freeTonight?.isActive) throw new Error('Failed to toggle Free Tonight active');
  });

  // 3. Hinge-Style Prompt & Photo Swiping
  await test('Hinge-Style Specific Prompt Comment & Match', () => {
    const result = db.recordSwipe('u1', 'u2', 'like', {
      comment: 'I also spend Sunday evenings at the night canteen!',
      targetPrompt: 'My typical Sunday on campus looks like...',
      targetPromptAnswer: 'Designing interfaces at the design studio...',
    });
    if (!result.isMatch) throw new Error('Mutual like between u1 and u2 should trigger match');
    if (!result.conversationId) throw new Error('Conversation should be created/updated upon match');
  });

  // 4. Date Planning Lifecycle State Machine
  let createdDatePlanId = '';
  await test('Date Proposal Creation (Pending State)', () => {
    const res = db.createDatePlan(
      'u1',
      'u2',
      'Central Library Cafe & Courtyard',
      'Quiet & Aesthetic',
      'Tomorrow at 4:30 PM',
      'Matcha on me!'
    );
    if (!res.datePlan || res.datePlan.status !== 'pending') {
      throw new Error('DatePlan status should be pending');
    }
    createdDatePlanId = res.datePlan.id;
  });

  await test('Date Plan Status Progression: Pending -> Accepted', () => {
    const updated = db.updateDatePlanStatus(createdDatePlanId, 'u2', 'accepted');
    if (!updated || updated.status !== 'accepted') {
      throw new Error('Date plan status update to accepted failed');
    }
  });

  await test('Date Plan Status Progression: Accepted -> Confirmed', () => {
    const updated = db.updateDatePlanStatus(createdDatePlanId, 'u1', 'confirmed');
    if (!updated || updated.status !== 'confirmed') {
      throw new Error('Date plan status update to confirmed failed');
    }
  });

  // 5. AI Tone & Grammar Checker
  await test('AI Grammar Checker Service', async () => {
    const result = await aiService.checkGrammar('hey u wanna get coffe with me?');
    if (!result.wasCorrected || !result.corrected.includes('coffee')) {
      throw new Error('Grammar service failed to fix spelling/slang');
    }
  });

  await test('AI Tone Adjustment: friendly, confident, less_awkward', async () => {
    const tones: Array<'friendly' | 'confident' | 'less_awkward'> = ['friendly', 'confident', 'less_awkward'];
    for (const t of tones) {
      const res = await aiService.adjustTone('hey saw we matched', t);
      if (!res.improved || res.improved.length === 0) {
        throw new Error(`Tone adjustment failed for ${t}`);
      }
    }
  });

  // 6. User Verification & Safety
  await test('Student Verification Flow', () => {
    const updated = db.updateProfile('u1', { isVerified: true, trustScore: 99 });
    if (!updated?.isVerified || updated.trustScore !== 99) throw new Error('Student verification failed');
  });

  await test('Unmatch & Chat Privacy Removal', () => {
    const convs = db.getConversations('u1');
    if (convs.length > 0) {
      const conv = convs[0];
      const otherId = conv.participants.find((p) => p !== 'u1') || 'u2';
      const unmatchRes = db.unmatch(conv.id, otherId);
      if (!unmatchRes.success) throw new Error('Unmatch failed');
    }
  });

  console.log(`\n🎉 Kampu$Link All ${passed} Sanity Tests Passed! (${failed} Failed)`);
  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
