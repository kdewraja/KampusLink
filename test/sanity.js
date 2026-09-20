// Automated E2E API & State Verification Script
async function runTests() {
  const BASE = 'http://127.0.0.1:5001';
  console.log('🧪 Starting UniPulse System Sanity Tests...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Server Health Check', async () => {
    const res = await fetch(`${BASE}/api/health`).then((r) => r.json());
    if (res.status !== 'ok') throw new Error('Health status not ok');
  });

  // 2. Auth & Current Persona
  await test('Current User Session', async () => {
    const res = await fetch(`${BASE}/api/auth/me`).then((r) => r.json());
    if (!res.success || !res.user || res.user.id !== 'u1') throw new Error('Failed to get current user u1');
  });

  // 3. Switch Persona to Rhea (u2)
  await test('Switch Active Persona to Rhea (u2)', async () => {
    const res = await fetch(`${BASE}/api/auth/switch-persona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u2' }),
    }).then((r) => r.json());
    if (!res.success || res.user.id !== 'u2') throw new Error('Persona switch failed');
  });

  // 4. Check Discovery feed for Rhea
  await test('Discovery Feed for Rhea', async () => {
    const res = await fetch(`${BASE}/api/profiles`).then((r) => r.json());
    if (!res.success || !Array.isArray(res.profiles) || res.profiles.length === 0) {
      throw new Error('Profiles array empty or invalid');
    }
  });

  // 5. Switch back to Aarav (u1)
  await test('Switch back to Aarav (u1)', async () => {
    const res = await fetch(`${BASE}/api/auth/switch-persona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u1' }),
    }).then((r) => r.json());
    if (!res.success || res.user.id !== 'u1') throw new Error('Failed to switch back to u1');
  });

  // 6. Test Filter Query (Major: Mechanical)
  await test('Filter Profiles by Major (Mechanical)', async () => {
    const res = await fetch(`${BASE}/api/profiles?major=Mechanical`).then((r) => r.json());
    if (!res.success) throw new Error('Filter query failed');
    const hasVik = res.profiles.some((p) => p.name.includes('Vik'));
    if (!hasVik) throw new Error('Vikram Rao not found in Mechanical filter');
  });

  // 7. Test Swipe Rewind
  await test('Rewind Swipe', async () => {
    const res = await fetch(`${BASE}/api/swipes/rewind`, { method: 'POST' }).then((r) => r.json());
    if (!res.success) throw new Error('Rewind failed');
  });

  // 8. Event RSVP & Date Beacon
  await test('Event RSVP and Date Beacon', async () => {
    const res = await fetch(`${BASE}/api/events/ev-1/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lookingForDate: true }),
    }).then((r) => r.json());
    if (!res.success || !res.event) throw new Error('Event RSVP failed');
  });

  // 9. Emergency SOS
  await test('Emergency SOS Dispatch', async () => {
    const res = await fetch(`${BASE}/api/safety/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landmark: 'Central Auditorium Hall 1' }),
    }).then((r) => r.json());
    if (!res.success || !res.alertId) throw new Error('SOS alert creation failed');
  });

  // 10. Reset Demo Data
  await test('Reset Database to Fresh Demo State', async () => {
    const res = await fetch(`${BASE}/api/auth/reset-demo`, { method: 'POST' }).then((r) => r.json());
    if (!res.success || res.user.id !== 'u1') throw new Error('Reset demo failed');
  });

  console.log(`\n📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runTests();
