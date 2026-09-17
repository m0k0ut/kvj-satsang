export type Locale = 'te' | 'en';
export type PageKey = 'programs' | 'about' | 'classes' | 'gallery' | 'resources' | 'join' | 'register';

export const pageCopy = {
  te: {
    programs: {
      eyebrow: 'అధ్యయన కార్యక్రమాలు', title: 'ప్రతి గ్రంథం ఒక క్రమబద్ధమైన యాత్ర', description: 'ప్రత్యక్ష బోధన, పఠనం, పునశ్చరణ, పారాయణం కలిసి సాగే తెలుగు అధ్యయన మార్గాలు.',
    },
    about: {
      eyebrow: 'వ్యవస్థాపకురాలు మరియు గురువు', title: 'విద్య, భక్తి, సేవలతో సార్థకమైన జీవితం', description: 'KVJ సత్సంగం వ్యవస్థాపకురాలు, ప్రధాన గురువు, ఆధ్యాత్మిక మార్గదర్శి రాధ మేడమ్ పరిచయం.',
    },
    classes: {
      eyebrow: 'తరగతుల విధానం', title: 'Telegram లో తరగతి. జీవితంలో సాధన.', description: 'ప్రత్యక్ష వివరణ నుండి వ్యక్తిగత పఠనం, పునశ్చరణ, సామూహిక పారాయణం వరకు ఒక సరళమైన అభ్యాస చక్రం.',
    },
    gallery: {
      eyebrow: 'దృశ్యాలు', title: 'భక్తి, అధ్యయనం, సేవ', description: 'సత్సంగాలు, ఆలయ యాత్రలు, సామూహిక అధ్యయనం, అన్నదానం మరియు సభ్యుల సమావేశాల నుంచి స్మరణీయ దృశ్యాలు.',
    },
    resources: {
      eyebrow: 'అధ్యయన వనరులు', title: 'సాధనకు అవసరమైనది, ఒకే చోట', description: 'సంస్థకు చెందిన లేదా ప్రచురణ అనుమతి పొందిన పాఠ్యాలు, ఆడియోలు మాత్రమే ఇక్కడ అందుబాటులో ఉంటాయి.',
    },
    join: {
      eyebrow: 'సత్సంగంలో పాల్గొనండి', title: 'మీ అధ్యయన యాత్రకు మొదటి అడుగు', description: 'ప్రధాన భాష తెలుగు. తరగతులు Telegram లో ప్రత్యక్షంగా జరుగుతాయి. గ్రూప్ యాక్సెస్‌ను నిర్వాహకులు సమాజంలో నేరుగా సమన్వయం చేస్తారు.',
    },
    register: {
      eyebrow: 'నమోదు', title: 'KVJ సత్సంగంలో నమోదు చేసుకోండి', description: 'మీ ఆసక్తి, ప్రాథమిక వివరాలను గోప్యంగా పంచుకోండి. KVJ నిర్వాహకులు మీ నమోదును పరిశీలించి తదుపరి దశను వ్యక్తిగతంగా సమన్వయం చేస్తారు.',
    },
  },
  en: {
    programs: {
      eyebrow: 'Learning programs', title: 'A structured journey through each text', description: 'Telugu learning tracks that combine live teaching, recitation, revision, and parayanam.',
    },
    about: {
      eyebrow: 'Founder and teacher', title: 'A life devoted to education, Bhakti, and service', description: 'Meet Radha Madam, founder, principal teacher, and spiritual guide of KVJ Satsangam.',
    },
    classes: {
      eyebrow: 'How classes work', title: 'Class on Telegram. Practice in daily life.', description: 'A simple learning loop that moves from live explanation to reading, revision, and group parayanam.',
    },
    gallery: {
      eyebrow: 'Gallery', title: 'Devotion, learning, and service', description: 'Moments from satsangs, temple journeys, group study, annadanam, and community gatherings.',
    },
    resources: {
      eyebrow: 'Study resources', title: 'What you need for practice, in one place', description: 'Only group-owned or publication-cleared texts and audio resources will be made available here.',
    },
    join: {
      eyebrow: 'Participate in the satsangam', title: 'Take the first step in your learning journey', description: 'The primary language is Telugu. Classes are live on Telegram, with group access coordinated privately by organizers.',
    },
    register: {
      eyebrow: 'Registration', title: 'Register your interest in KVJ Satsangam', description: 'Share your interest and basic details privately. KVJ organizers will review your registration and coordinate the next step directly.',
    },
  },
} as const;
