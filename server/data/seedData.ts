export interface StudentPrompt {
  question: string;
  answer: string;
}

export interface FreeTonightStatus {
  isActive: boolean;
  timeWindow: string;
  dateType: 'Cafe & Coffee' | 'Campus Walk' | 'Study Date' | 'Casual Food' | 'Event Hangout';
  area: string;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  campus: string;
  major: string;
  batch: string;
  hostel: string;
  isVerified: boolean;
  trustScore: number;
  bio: string;
  relationshipIntent: 'Dating & Romance' | 'Study Date Buddy' | 'Campus Hangouts' | 'Serious Relationship';
  photos: string[];
  interests: string[];
  clubs: string[];
  prompts: StudentPrompt[];
  campusAnthem: {
    title: string;
    artist: string;
    vibe: string;
  };
  favoriteCampusSpot: string;
  twoAmCraving: string;
  freeTonight?: FreeTonightStatus;
}

export interface DatePlan {
  id: string;
  initiatorId: string;
  recipientId: string;
  venueName: string;
  venueType: string;
  dateTime: string;
  notes?: string;
  status: 'suggested' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'date_proposal' | 'prompt_comment';
  promptCommentData?: {
    promptQuestion?: string;
    promptAnswer?: string;
    photoUrl?: string;
    comment: string;
  };
  datePlanId?: string;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  compatibilityScore: number;
  lastMessage: string;
  lastMessageTimestamp: string;
  unread: boolean;
  messages: ChatMessage[];
  datePlans?: DatePlan[];
}

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'u1',
    name: 'Aarav Sharma',
    age: 21,
    gender: 'male',
    campus: 'IIT Delhi',
    major: 'Computer Science & AI',
    batch: "Class of '26 (3rd Year)",
    hostel: 'Nilgiri Hostel, Wing 3',
    isVerified: true,
    trustScore: 98,
    bio: 'CS junior who debugs neural networks by daylight and plays rhythm guitar at twilight. Let us trade Spotify playlists or grab a pour-over at the campus cafe.',
    relationshipIntent: 'Dating & Romance',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Film Scores', 'Indie Rock', 'Late Night Chai', 'Badminton', 'AI Ethics'],
    clubs: ['Robotics Society', 'Dramatics Guild', 'Campus Tech Collective'],
    prompts: [
      {
        question: 'My ideal first campus date...',
        answer: 'Grabbing steaming hot kullad chai outside the library, then taking a slow walk through the central ivy courtyards.',
      },
      {
        question: 'An unspoken rule of our campus...',
        answer: 'Never sit on the 3rd floor library beanbags unless you plan to wake up 3 hours later completely disoriented.',
      },
      {
        question: 'Best late-night fuel...',
        answer: 'Double butter bun-maska and masala tea from the night canteen right after an exam sprint.',
      },
    ],
    campusAnthem: {
      title: 'Baarishein',
      artist: 'Anuv Jain',
      vibe: 'Acoustic golden hour',
    },
    favoriteCampusSpot: 'Library quadrangle steps when the sun dips',
    twoAmCraving: 'Night canteen double butter bun-maska',
    freeTonight: {
      isActive: true,
      timeWindow: '8:00 PM - 10:30 PM',
      dateType: 'Cafe & Coffee',
      area: 'Central Library Courtyard',
      note: 'Free after lab demo! Up for a warm latte and conversation.',
    },
  },
  {
    id: 'u2',
    name: 'Rhea Sengupta',
    age: 20,
    gender: 'female',
    campus: 'IIT Delhi',
    major: 'Visual Design & HCI',
    batch: "Class of '27 (2nd Year)",
    hostel: 'Kailash Hostel, Block A',
    isVerified: true,
    trustScore: 99,
    bio: 'Design student fascinated by tactile typography, 35mm film cameras, and matcha lattes. Show me your secret quiet corner of campus.',
    relationshipIntent: 'Dating & Romance',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Film Photography', 'Ceramics', 'Indie Pop', 'Figma', 'Matcha'],
    clubs: ['Design Guild', 'Fine Arts Society', 'Literary Magazine'],
    prompts: [
      {
        question: 'The best way to ask me out...',
        answer: 'Suggest an iced cold brew at the design courtyard and ask me about my current film photography project.',
      },
      {
        question: 'My guilty pleasure on campus...',
        answer: 'Spending half my monthly food budget on specialty iced coffees between morning lectures.',
      },
      {
        question: 'Together, we could...',
        answer: 'Sneak into the printmaking studio after hours and screen-print matching posters for the winter ball.',
      },
    ],
    campusAnthem: {
      title: 'Electric Feel',
      artist: 'MGMT (Acoustic)',
      vibe: 'Golden hour aesthetic',
    },
    favoriteCampusSpot: 'Design Department terrace courtyard with the ivy wall',
    twoAmCraving: 'Iced dark chocolate with sea salt',
    freeTonight: {
      isActive: true,
      timeWindow: '7:30 PM - 9:30 PM',
      dateType: 'Campus Walk',
      area: 'Design Department Courtyard',
      note: 'Need fresh air after a 4-hour Figma marathon!',
    },
  },
  {
    id: 'u3',
    name: 'Kabir Mehta',
    age: 22,
    gender: 'male',
    campus: 'BITS Pilani',
    major: 'Economics & Financial Engineering',
    batch: "Class of '25 (Senior)",
    hostel: 'Shankar Bhawan, Room 214',
    isVerified: true,
    trustScore: 97,
    bio: 'Senior year survivor. Model UN chair, vinyl record collector, and believer that unhurried 1 AM conversations beat crowded parties.',
    relationshipIntent: 'Serious Relationship',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Geopolitics', 'Vinyl Records', 'Espresso', 'Tennis', 'Documentaries'],
    clubs: ['Model United Nations', 'Finance & Investment Club', 'Debate Society'],
    prompts: [
      {
        question: 'A boundary I hold firmly...',
        answer: 'No talking during the crescendo of David Gilmour guitar solos.',
      },
      {
        question: 'I guarantee that I will...',
        answer: 'Give you honest, constructive feedback on your pitch deck and brew you pour-over coffee.',
      },
    ],
    campusAnthem: {
      title: 'Time',
      artist: 'Pink Floyd',
      vibe: 'Late night contemplation',
    },
    favoriteCampusSpot: 'Clock Tower benches when the chimes strike midnight',
    twoAmCraving: 'Nutella waffles from the Student Union counter',
    freeTonight: {
      isActive: false,
      timeWindow: '9:00 PM - 11:00 PM',
      dateType: 'Cafe & Coffee',
      area: 'Student Union Plaza',
    },
  },
  {
    id: 'u4',
    name: 'Ananya Roy',
    age: 21,
    gender: 'female',
    campus: 'Delhi University',
    major: 'English Literature & Journalism',
    batch: "Class of '26 (3rd Year)",
    hostel: 'St. Stephen’s Residence Block',
    isVerified: true,
    trustScore: 98,
    bio: 'Campus gazette editor. You will find me reading Murakami under the library banyan tree or debating cinema nuances over filter coffee.',
    relationshipIntent: 'Study Date Buddy',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Creative Writing', 'Classic Cinema', 'Thrifting', 'Bookstores', 'Podcasts'],
    clubs: ['College Gazette', 'Shakespeare Society', 'Film Appreciation Club'],
    prompts: [
      {
        question: 'My ideal study date...',
        answer: 'Silent co-working for 90 minutes, followed by a lively 30-minute debrief over warm samosas and chai.',
      },
      {
        question: 'You should message me if...',
        answer: 'You have a book or essay recommendation that genuinely altered your worldview.',
      },
    ],
    campusAnthem: {
      title: 'Kahaani',
      artist: 'Prateek Kuhad',
      vibe: 'Monsoon nostalgia on red-brick walls',
    },
    favoriteCampusSpot: 'Library Heritage archives wooden reading room',
    twoAmCraving: 'Spicy peri-peri fries and mango shake',
    freeTonight: {
      isActive: true,
      timeWindow: '7:00 PM - 9:00 PM',
      dateType: 'Study Date',
      area: 'Central Library Heritage Wing',
      note: 'Working on a literary feature — silent co-working welcome!',
    },
  },
  {
    id: 'u5',
    name: 'Vikramaditya "Vik" Rao',
    age: 22,
    gender: 'male',
    campus: 'IIT Delhi',
    major: 'Mechanical Engineering & EV Team',
    batch: "Class of '25 (Senior)",
    hostel: 'Kumaon Hostel, Ground Floor',
    isVerified: true,
    trustScore: 96,
    bio: 'Formula Student racecar builder by day, intramural basketball center by dusk. Certified golden retriever energy.',
    relationshipIntent: 'Dating & Romance',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Motorsports', 'Basketball', 'Strength Training', 'Camping', 'Electronic Music'],
    clubs: ['Motorsports Club', 'Varsity Basketball', 'Makerspace Mentor'],
    prompts: [
      {
        question: 'First round is on me if...',
        answer: 'You can beat me in a free-throw shootout or tell me how planetary gear sets work without checking your phone.',
      },
    ],
    campusAnthem: {
      title: 'Can’t Stop',
      artist: 'Red Hot Chili Peppers',
      vibe: 'High-energy garage sprint',
    },
    favoriteCampusSpot: 'Floodlit basketball courts under the night lights',
    twoAmCraving: 'Double paneer roll with extra mint chutney',
    freeTonight: {
      isActive: false,
      timeWindow: '8:30 PM - 10:30 PM',
      dateType: 'Casual Food',
      area: 'Main Student Canteen',
    },
  },
  {
    id: 'u6',
    name: 'Maya Chen',
    age: 20,
    gender: 'female',
    campus: 'Stanford University',
    major: 'BioTechnology & Computational Genetics',
    batch: "Class of '27 (2nd Year)",
    hostel: 'Roble Hall, South Wing',
    isVerified: true,
    trustScore: 99,
    bio: 'Bioinformatics student running CRISPR simulations. Outside the wet lab, I love bouldering, board game nights, and acoustic jams.',
    relationshipIntent: 'Campus Hangouts',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Genomics', 'Bouldering', 'Catan', 'Espresso Brewing', 'Sci-Fi Books'],
    clubs: ['BioEngineering Society', 'Outdoor Adventure Club', 'Women in STEM'],
    prompts: [
      {
        question: 'Best way to spend a Friday...',
        answer: 'A bouldering session at the gym, followed by hosting a 4-player Catan match with authentic Thai takeout.',
      },
    ],
    campusAnthem: {
      title: 'Midnight City',
      artist: 'M83',
      vibe: 'Late night lab coding trance',
    },
    favoriteCampusSpot: 'Oval grass lawn under the palm trees',
    twoAmCraving: 'Spicy ramen with soft-boiled egg and seaweed',
    freeTonight: {
      isActive: true,
      timeWindow: '8:00 PM - 10:00 PM',
      dateType: 'Cafe & Coffee',
      area: 'Campus Oval Cafe',
      note: 'Need a break from gene sequence models!',
    },
  },
  {
    id: 'u7',
    name: 'Tanvi Deshmukh',
    age: 21,
    gender: 'female',
    campus: 'Ashoka University',
    major: 'Psychology & Behavioral Economics',
    batch: "Class of '26 (3rd Year)",
    hostel: 'Residence Hall 4',
    isVerified: true,
    trustScore: 97,
    bio: 'Studying cognitive decision quirks. Certified yoga trainer, ceramicist, and campus parliamentary debater.',
    relationshipIntent: 'Dating & Romance',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Cognitive Science', 'Yoga', 'Podcasts', 'Sufi Poetry', 'Cafe Hopping'],
    clubs: ['Psychology Collective', 'Debate Society', 'Mindfulness Club'],
    prompts: [
      {
        question: 'The hallmark of a great conversation is...',
        answer: 'When two hours pass like ten minutes and neither of you even thinks to glance at a screen.',
      },
    ],
    campusAnthem: {
      title: 'Chaudhary',
      artist: 'Amit Trivedi',
      vibe: 'Warm folk fusion',
    },
    favoriteCampusSpot: 'Library amphitheatre steps in the evening',
    twoAmCraving: 'Masala chai and sweet corn chaat',
    freeTonight: {
      isActive: true,
      timeWindow: '7:30 PM - 9:30 PM',
      dateType: 'Campus Walk',
      area: 'Central Amphitheatre Steps',
      note: 'Evening walk before tomorrow’s behavioral economics seminar.',
    },
  },
];

export const INITIAL_DATE_PLANS: DatePlan[] = [
  {
    id: 'dp-1',
    initiatorId: 'u1',
    recipientId: 'u2',
    venueName: 'Design Courtyard & Library Cafe',
    venueType: 'Quiet Cafe & Ivy Courtyard',
    dateTime: 'Tomorrow at 4:30 PM',
    notes: 'Looking forward to seeing your film photography prints!',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['u1', 'u2'],
    compatibilityScore: 94,
    lastMessage: 'Looking forward to that iced cold brew tomorrow!',
    lastMessageTimestamp: '10:45 AM',
    unread: false,
    datePlans: [INITIAL_DATE_PLANS[0]],
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        text: 'Loved your prompt answer about the 3rd floor beanbags! Nobody ever manages to wake up on time.',
        timestamp: 'Yesterday 8:15 PM',
        isRead: true,
        type: 'prompt_comment',
        promptCommentData: {
          promptQuestion: 'An unspoken rule of our campus...',
          promptAnswer: 'Never sit on the 3rd floor library beanbags unless you plan to wake up 3 hours later...',
          comment: 'Loved your prompt answer about the 3rd floor beanbags!',
        },
      },
      {
        id: 'm2',
        senderId: 'u1',
        text: 'Haha Rhea! I lost half of my sophomore semester to those beanbags! Also your film portfolio is incredible.',
        timestamp: 'Yesterday 8:22 PM',
        isRead: true,
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'u2',
        text: 'Thank you! Shot that whole roll on an old Olympus OM-1 right outside the SAC lawn during golden hour.',
        timestamp: 'Yesterday 8:30 PM',
        isRead: true,
        type: 'text',
      },
      {
        id: 'm4',
        senderId: 'u1',
        text: 'Campus Date Invitation: Design Courtyard & Library Cafe on Tomorrow at 4:30 PM',
        timestamp: 'Today 10:15 AM',
        isRead: true,
        type: 'date_proposal',
        datePlanId: 'dp-1',
      },
      {
        id: 'm5',
        senderId: 'u2',
        text: 'Accepted! Looking forward to that iced cold brew tomorrow!',
        timestamp: 'Today 10:45 AM',
        isRead: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-2',
    participants: ['u1', 'u4'],
    compatibilityScore: 88,
    lastMessage: 'Have you read Haruki Murakami’s Norwegian Wood?',
    lastMessageTimestamp: 'Yesterday',
    unread: true,
    messages: [
      {
        id: 'm6',
        senderId: 'u4',
        text: 'Fellow acoustic music enthusiast spotted on the campus radar!',
        timestamp: 'Yesterday 4:10 PM',
        isRead: false,
        type: 'text',
      },
      {
        id: 'm7',
        senderId: 'u4',
        text: 'Have you read Haruki Murakami’s Norwegian Wood?',
        timestamp: 'Yesterday 4:12 PM',
        isRead: false,
        type: 'text',
      },
    ],
  },
];
