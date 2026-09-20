import { PrismaClient, Gender, RelationshipIntent, DateType, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // Create test users
  const aarav = await prisma.user.upsert({
    where: { email: 'aarav.sharma@iitd.ac.in' },
    update: {},
    create: {
      email: 'aarav.sharma@iitd.ac.in',
      passwordHash,
      role: Role.USER,
      profile: {
        create: {
          name: 'Aarav Sharma',
          age: 21,
          gender: Gender.MALE,
          campus: 'IIT Delhi',
          major: 'Computer Science & AI',
          batch: "Class of '26 (3rd Year)",
          hostel: 'Nilgiri Hostel, Wing 3',
          bio: 'CS junior who debugs neural networks by daylight and plays rhythm guitar at twilight. Let us trade Spotify playlists or grab a pour-over at the campus cafe.',
          relationshipIntent: RelationshipIntent.DATING_ROMANCE,
          isVerified: true,
          trustScore: 98,
          favoriteCampusSpot: 'Library quadrangle steps when the sun dips',
          twoAmCraving: 'Night canteen double butter bun-maska',
          photos: {
            create: [
              { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
              { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', order: 1 },
              { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', order: 2 },
            ],
          },
          prompts: {
            create: [
              { question: 'My ideal first campus date...', answer: 'Grabbing steaming hot kullad chai outside the library, then taking a slow walk through the central ivy courtyards.', order: 0 },
              { question: 'An unspoken rule of our campus...', answer: 'Never sit on the 3rd floor library beanbags unless you plan to wake up 3 hours later completely disoriented.', order: 1 },
              { question: 'Best late-night fuel...', answer: 'Double butter bun-maska and masala tea from the night canteen right after an exam sprint.', order: 2 },
            ],
          },
          interests: {
            create: [
              { interest: { connectOrCreate: { where: { name: 'Film Scores' }, create: { name: 'Film Scores', category: 'Music' } } } },
              { interest: { connectOrCreate: { where: { name: 'Indie Rock' }, create: { name: 'Indie Rock', category: 'Music' } } } },
              { interest: { connectOrCreate: { where: { name: 'Late Night Chai' }, create: { name: 'Late Night Chai', category: 'Food' } } } },
              { interest: { connectOrCreate: { where: { name: 'Badminton' }, create: { name: 'Badminton', category: 'Sports' } } } },
              { interest: { connectOrCreate: { where: { name: 'AI Ethics' }, create: { name: 'AI Ethics', category: 'Academic' } } } },
            ],
          },
          clubs: {
            create: [
              { club: { connectOrCreate: { where: { name: 'Robotics Society' }, create: { name: 'Robotics Society', campus: 'IIT Delhi' } } } },
              { club: { connectOrCreate: { where: { name: 'Dramatics Guild' }, create: { name: 'Dramatics Guild', campus: 'IIT Delhi' } } } },
              { club: { connectOrCreate: { where: { name: 'Campus Tech Collective' }, create: { name: 'Campus Tech Collective', campus: 'IIT Delhi' } } } },
            ],
          },
          campusAnthem: {
            create: {
              title: 'Baarishein',
              artist: 'Anuv Jain',
              vibe: 'Acoustic golden hour',
            },
          },
          freeTonight: {
            create: {
              isActive: true,
              timeWindow: '8:00 PM - 10:30 PM',
              dateType: DateType.CAFE_COFFEE,
              area: 'Central Library Courtyard',
              note: 'Free after lab demo! Up for a warm latte and conversation.',
            },
          },
        },
      },
    },
  });

  const rhea = await prisma.user.upsert({
    where: { email: 'rhea.sengupta@iitd.ac.in' },
    update: {},
    create: {
      email: 'rhea.sengupta@iitd.ac.in',
      passwordHash,
      role: Role.USER,
      profile: {
        create: {
          name: 'Rhea Sengupta',
          age: 20,
          gender: Gender.FEMALE,
          campus: 'IIT Delhi',
          major: 'Visual Design & HCI',
          batch: "Class of '27 (2nd Year)",
          hostel: 'Kailash Hostel, Block A',
          bio: 'Design student fascinated by tactile typography, 35mm film cameras, and matcha lattes. Show me your secret quiet corner of campus.',
          relationshipIntent: RelationshipIntent.DATING_ROMANCE,
          isVerified: true,
          trustScore: 99,
          favoriteCampusSpot: 'Design Department terrace courtyard with the ivy wall',
          twoAmCraving: 'Iced dark chocolate with sea salt',
          photos: {
            create: [
              { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
              { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', order: 1 },
              { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', order: 2 },
            ],
          },
          prompts: {
            create: [
              { question: 'The best way to ask me out...', answer: 'Suggest an iced cold brew at the design courtyard and ask me about my current film photography project.', order: 0 },
              { question: 'My guilty pleasure on campus...', answer: 'Spending half my monthly food budget on specialty iced coffees between morning lectures.', order: 1 },
              { question: 'Together, we could...', answer: 'Sneak into the printmaking studio after hours and screen-print matching posters for the winter ball.', order: 2 },
            ],
          },
          interests: {
            create: [
              { interest: { connectOrCreate: { where: { name: 'Film Photography' }, create: { name: 'Film Photography', category: 'Arts' } } } },
              { interest: { connectOrCreate: { where: { name: 'Ceramics' }, create: { name: 'Ceramics', category: 'Arts' } } } },
              { interest: { connectOrCreate: { where: { name: 'Indie Pop' }, create: { name: 'Indie Pop', category: 'Music' } } } },
              { interest: { connectOrCreate: { where: { name: 'Figma' }, create: { name: 'Figma', category: 'Tech' } } } },
              { interest: { connectOrCreate: { where: { name: 'Matcha' }, create: { name: 'Matcha', category: 'Food' } } } },
            ],
          },
          clubs: {
            create: [
              { club: { connectOrCreate: { where: { name: 'Design Guild' }, create: { name: 'Design Guild', campus: 'IIT Delhi' } } } },
              { club: { connectOrCreate: { where: { name: 'Fine Arts Society' }, create: { name: 'Fine Arts Society', campus: 'IIT Delhi' } } } },
              { club: { connectOrCreate: { where: { name: 'Literary Magazine' }, create: { name: 'Literary Magazine', campus: 'IIT Delhi' } } } },
            ],
          },
          campusAnthem: {
            create: {
              title: 'Electric Feel',
              artist: 'MGMT (Acoustic)',
              vibe: 'Golden hour aesthetic',
            },
          },
          freeTonight: {
            create: {
              isActive: true,
              timeWindow: '7:30 PM - 9:30 PM',
              dateType: DateType.CAMPUS_WALK,
              area: 'Design Department Courtyard',
              note: 'Need fresh air after a 4-hour Figma marathon!',
            },
          },
        },
      },
    },
  });

  // Create more test users
  const kabir = await prisma.user.upsert({
    where: { email: 'kabir.mehta@bits-pilani.ac.in' },
    update: {},
    create: {
      email: 'kabir.mehta@bits-pilani.ac.in',
      passwordHash,
      role: Role.USER,
      profile: {
        create: {
          name: 'Kabir Mehta',
          age: 22,
          gender: Gender.MALE,
          campus: 'BITS Pilani',
          major: 'Economics & Financial Engineering',
          batch: "Class of '25 (Senior)",
          hostel: 'Shankar Bhawan, Room 214',
          bio: 'Senior year survivor. Model UN chair, vinyl record collector, and believer that unhurried 1 AM conversations beat crowded parties.',
          relationshipIntent: RelationshipIntent.SERIOUS_RELATIONSHIP,
          isVerified: true,
          trustScore: 97,
          favoriteCampusSpot: 'Clock Tower benches when the chimes strike midnight',
          twoAmCraving: 'Nutella waffles from the Student Union counter',
          photos: {
            create: [
              { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
              { url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', order: 1 },
            ],
          },
          prompts: {
            create: [
              { question: 'A boundary I hold firmly...', answer: 'No talking during the crescendo of David Gilmour guitar solos.', order: 0 },
              { question: 'I guarantee that I will...', answer: 'Give you honest, constructive feedback on your pitch deck and brew you pour-over coffee.', order: 1 },
            ],
          },
          interests: {
            create: [
              { interest: { connectOrCreate: { where: { name: 'Geopolitics' }, create: { name: 'Geopolitics', category: 'Academic' } } } },
              { interest: { connectOrCreate: { where: { name: 'Vinyl Records' }, create: { name: 'Vinyl Records', category: 'Music' } } } },
              { interest: { connectOrCreate: { where: { name: 'Espresso' }, create: { name: 'Espresso', category: 'Food' } } } },
              { interest: { connectOrCreate: { where: { name: 'Tennis' }, create: { name: 'Tennis', category: 'Sports' } } } },
              { interest: { connectOrCreate: { where: { name: 'Documentaries' }, create: { name: 'Documentaries', category: 'Entertainment' } } } },
            ],
          },
          clubs: {
            create: [
              { club: { connectOrCreate: { where: { name: 'Model United Nations' }, create: { name: 'Model United Nations', campus: 'BITS Pilani' } } } },
              { club: { connectOrCreate: { where: { name: 'Finance & Investment Club' }, create: { name: 'Finance & Investment Club', campus: 'BITS Pilani' } } } },
              { club: { connectOrCreate: { where: { name: 'Debate Society' }, create: { name: 'Debate Society', campus: 'BITS Pilani' } } } },
            ],
          },
          campusAnthem: {
            create: {
              title: 'Time',
              artist: 'Pink Floyd',
              vibe: 'Late night contemplation',
            },
          },
          freeTonight: {
            create: {
              isActive: false,
              timeWindow: '9:00 PM - 11:00 PM',
              dateType: DateType.CAFE_COFFEE,
              area: 'Student Union Plaza',
            },
          },
        },
      },
    },
  });

  const ananya = await prisma.user.upsert({
    where: { email: 'ananya.roy@du.ac.in' },
    update: {},
    create: {
      email: 'ananya.roy@du.ac.in',
      passwordHash,
      role: Role.USER,
      profile: {
        create: {
          name: 'Ananya Roy',
          age: 21,
          gender: Gender.FEMALE,
          campus: 'Delhi University',
          major: 'English Literature & Journalism',
          batch: "Class of '26 (3rd Year)",
          hostel: "St. Stephen's Residence Block",
          bio: 'Campus gazette editor. You will find me reading Murakami under the library banyan tree or debating cinema nuances over filter coffee.',
          relationshipIntent: RelationshipIntent.STUDY_DATE_BUDDY,
          isVerified: true,
          trustScore: 98,
          favoriteCampusSpot: 'Library Heritage archives wooden reading room',
          twoAmCraving: 'Spicy peri-peri fries and mango shake',
          photos: {
            create: [
              { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
              { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', order: 1 },
            ],
          },
          prompts: {
            create: [
              { question: 'My ideal study date...', answer: 'Silent co-working for 90 minutes, followed by a lively 30-minute debrief over warm samosas and chai.', order: 0 },
              { question: 'You should message me if...', answer: 'You have a book or essay recommendation that genuinely altered your worldview.', order: 1 },
            ],
          },
          interests: {
            create: [
              { interest: { connectOrCreate: { where: { name: 'Creative Writing' }, create: { name: 'Creative Writing', category: 'Academic' } } } },
              { interest: { connectOrCreate: { where: { name: 'Classic Cinema' }, create: { name: 'Classic Cinema', category: 'Entertainment' } } } },
              { interest: { connectOrCreate: { where: { name: 'Thrifting' }, create: { name: 'Thrifting', category: 'Lifestyle' } } } },
              { interest: { connectOrCreate: { where: { name: 'Bookstores' }, create: { name: 'Bookstores', category: 'Lifestyle' } } } },
              { interest: { connectOrCreate: { where: { name: 'Podcasts' }, create: { name: 'Podcasts', category: 'Entertainment' } } } },
            ],
          },
          clubs: {
            create: [
              { club: { connectOrCreate: { where: { name: 'College Gazette' }, create: { name: 'College Gazette', campus: 'Delhi University' } } } },
              { club: { connectOrCreate: { where: { name: 'Shakespeare Society' }, create: { name: 'Shakespeare Society', campus: 'Delhi University' } } } },
              { club: { connectOrCreate: { where: { name: 'Film Appreciation Club' }, create: { name: 'Film Appreciation Club', campus: 'Delhi University' } } } },
            ],
          },
          campusAnthem: {
            create: {
              title: 'Kahaani',
              artist: 'Prateek Kuhad',
              vibe: 'Monsoon nostalgia on red-brick walls',
            },
          },
          freeTonight: {
            create: {
              isActive: true,
              timeWindow: '7:00 PM - 9:00 PM',
              dateType: DateType.STUDY_DATE,
              area: 'Central Library Heritage Wing',
              note: 'Working on a literary feature — silent co-working welcome!',
            },
          },
        },
      },
    },
  });

  // Create mutual likes between Aarav and Rhea (they match)
  await prisma.like.createMany({
    data: [
      { likerId: aarav.id, likeeId: rhea.id, action: 'LIKE' },
      { likerId: rhea.id, likeeId: aarav.id, action: 'LIKE' },
    ],
    skipDuplicates: true,
  });

  // Create match records
  await prisma.match.createMany({
    data: [
      { userId: aarav.id, matchedUserId: rhea.id, compatibilityScore: 94 },
      { userId: rhea.id, matchedUserId: aarav.id, compatibilityScore: 94 },
    ],
    skipDuplicates: true,
  });

  // Create conversation between Aarav and Rhea
  const conversation = await prisma.conversation.create({
    data: {
      compatibilityScore: 94,
      participants: {
        create: [
          { userId: aarav.id },
          { userId: rhea.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: rhea.id,
            text: 'Loved your prompt answer about the 3rd floor beanbags! Nobody ever manages to wake up on time.',
            type: 'PROMPT_COMMENT',
            promptComment: {
              promptQuestion: 'An unspoken rule of our campus...',
              promptAnswer: 'Never sit on the 3rd floor library beanbags unless you plan to wake up 3 hours later completely disoriented.',
              comment: 'Loved your prompt answer about the 3rd floor beanbags!',
            },
          },
          {
            senderId: aarav.id,
            text: 'Haha Rhea! I lost half of my sophomore semester to those beanbags! Also your film portfolio is incredible.',
            type: 'TEXT',
          },
        ],
      },
    },
  });

  // Create a date plan between them
  await prisma.datePlan.create({
    data: {
      initiatorId: aarav.id,
      recipientId: rhea.id,
      venueName: 'Design Courtyard & Library Cafe',
      venueType: 'Quiet Cafe & Ivy Courtyard',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      notes: 'Looking forward to seeing your film photography prints!',
      status: 'ACCEPTED',
      conversationId: conversation.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Test accounts:`);
  console.log(`   - aarav.sharma@iitd.ac.in / password123`);
  console.log(`   - rhea.sengupta@iitd.ac.in / password123`);
  console.log(`   - kabir.mehta@bits-pilani.ac.in / password123`);
  console.log(`   - ananya.roy@du.ac.in / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });