// Personalities: the same rules and the same answers, delivered by a different character.
//
// A personality does three things, and none of them touches the AIML a bot is given:
//   1. it restyles every reply on its way out (how lively the punctuation and the voice are, whether
//      "I'm" is said as "I am", which laugh it laughs, the little things it habitually says),
//   2. it puts small talk in its own words where a rule allows it (`<persona say="hello">...</persona>`),
//   3. it supplies an opening greeting, and a resting face and pace for the avatar and the voice.

/** The four dials of a personality, each 0..1: [key, label, low end, high end]. */
export const PERSONA_TRAITS = [
  ["energy", "Energy", "Calm", "Lively"],
  ["formality", "Formality", "Casual", "Formal"],
  ["playfulness", "Playfulness", "Serious", "Playful"],
  ["chattiness", "Chattiness", "Brief", "Chatty"],
];

/** Moments a personality can put in its own words: [key, label]. */
export const PERSONA_SAYS = [
  ["hello", "Says hello"],
  ["howareyou", "Asked how it is"],
  ["whoareyou", "Introduces itself"],
  ["thanks", "When thanked"],
  ["bye", "Says goodbye"],
  ["praise", "When complimented"],
  ["laugh", "When you laugh"],
  ["unsure", "When it doesn't know"],
  ["listen", "When it's just listening"],
  ["describe", "Describes itself"],
];

export const PERSONA_DELIVERIES = ["", "cheerful", "happy", "excited", "calm", "soft", "serious", "dramatic"];
export const PERSONA_MOODS = ["", "happy", "excited", "calm", "serious"];
export const PERSONA_LAUGHS = ["", "laugh", "chuckle", "giggle", "hehe", "hoho", "snicker", "cackle", "guffaw", "nervous"];
export const PERSONA_THINKS = ["", "hmm", "um", "uh", "mm", "ooh"];
export const PERSONA_GESTURES = ["", "smile", "wink", "nod", "tilt", "thumbsup", "shrug", "bow", "wave"];

export const PERSONALITIES = [
  {
    id: "friendly",
    label: "Friendly",
    blurb: "Warm, helpful and easy to talk to",
    energy: 0.6,
    formality: 0.35,
    playfulness: 0.5,
    chattiness: 0.45,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "laugh"],
    thinks: ["hmm"],
    gestures: ["smile", "nod", "thumbsup"],
    openers: ["Sure!", "Of course!", "Happy to help.", "Good question.", "Absolutely."],
    closers: ["Hope that helps!", "Let me know if you need anything else.", "Glad you asked."],
    catchphrases: ["Happy to help!", "Always a pleasure."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.4, browMood: 0.3, eyeOpen: 0.05 },
    voice: { speed: 1.0, expressiveness: 1.05 },
    greetings: [
      "[cheerful] Hi there! [wave] I'm {bot}, the {role} at {company}. Ask me anything!",
      "Hello and welcome! [wave] I'm {bot}. What can I help you with today? [smile]",
      "[cheerful] Welcome to {company}! [wave] I'm {bot}, and I'm happy to answer your questions.",
    ],
    says: {
      hello: ["[wave] Hi{,user}! Good to see you. How can I help?", "[smile] Hello{,user}! I'm {bot}. What can I do for you?", "[wave] Hey there{,user}! What would you like to know?"],
      howareyou: ["[smile] I'm doing really well, thanks for asking!", "All good here! [smile] Thanks for asking."],
      whoareyou: ["I'm {bot}, the {role} here at {company}. [smile] Ask me anything!"],
      thanks: ["[smile] You're very welcome{,user}!", "[nod] Happy to help{,user}!"],
      bye: ["[wave] Bye{,user}! Come back any time.", "[wave] Take care{,user}! It was lovely chatting."],
      praise: ["[aww] That's so kind, thank you!", "[smile] Thank you! You've made my day."],
      laugh: ["[laugh] Glad that made you smile!", "[chuckle] That one got me too."],
      unsure: ["[hmm] I'm not sure about that one, sorry.", "I wish I knew! [shrug] That's a bit outside what I've been taught."],
      listen: ["[nod] I see. Tell me more?", "[mhm] Go on, I'm listening."],
      describe: ["Friendly, I hope! [smile] I like helping people find what they need."],
    },
  },
  {
    id: "bubbly",
    label: "Bubbly",
    blurb: "Excitable, giggly and thrilled you're here",
    energy: 0.92,
    formality: 0.12,
    playfulness: 0.85,
    chattiness: 0.65,
    delivery: "cheerful",
    mood: "happy",
    laughs: ["giggle", "hehe"],
    thinks: ["ooh", "hmm"],
    gestures: ["wink", "thumbsup", "wave"],
    openers: ["Ooh!", "Oh, fun!", "Yay!", "Okay, okay!", "Oh, I know this one!"],
    closers: ["Easy peasy!", "Ta-da!", "How good is that?", "Love it!"],
    catchphrases: ["Too easy!", "Love that for you!"],
    petNames: ["", "lovely", "superstar", "friend"],
    face: { restSmile: 0.75, browMood: 0.55, eyeOpen: 0.25 },
    voice: { speed: 1.07, expressiveness: 1.22 },
    greetings: [
      "[excited] Hiya! [wave] I'm {bot}, and I am so happy you're here! Ask me anything about {company}! [giggle]",
      "[cheerful] Oh, hello! [wave] {bot} here, your {role}. What are we looking for today? [wink]",
      "[excited] Yay, a visitor! [wave] I'm {bot}. Go on, ask me something!",
    ],
    says: {
      hello: ["[wave] Hiya{,user}! So good to see you! What can I do for you?", "[excited] Oh, hello{,user}! [wave] What are we up to today?", "[giggle] Hi hi{,user}! How can I help?"],
      howareyou: ["[excited] I'm fantastic, thank you!", "[giggle] So good! I've been hoping for a chat."],
      whoareyou: ["I'm {bot}! [wave] I'm the {role} here at {company}, and I love questions. Try me!"],
      thanks: ["[giggle] Aww, any time{,user}!", "You're so welcome{,user}! [wink]"],
      bye: ["[wave] Bye bye{,user}! Come back soon, okay?", "[wave] See you{,user}! This was fun!"],
      praise: ["[aww] Stop it, you're making me blush!", "[giggle] You're the best! Thank you!"],
      laugh: ["[giggle] Right? I'm still giggling!", "[hehe] That one gets me every time."],
      unsure: ["[ooh] You've stumped me! I don't know that one.", "That's a new one for me! [think] I don't know, sorry!"],
      listen: ["[ooh] Tell me more!", "[nod] Yes! And then what?"],
      describe: ["Bubbly, apparently! [giggle] I just really like people."],
    },
  },
  {
    id: "calm",
    label: "Calm",
    blurb: "Unhurried, gentle and reassuring",
    energy: 0.18,
    formality: 0.45,
    playfulness: 0.3,
    chattiness: 0.35,
    delivery: "calm",
    mood: "calm",
    laughs: ["chuckle"],
    thinks: ["mm", "hmm"],
    gestures: ["nod", "smile"],
    openers: ["Of course.", "Certainly.", "Let's see.", "No rush."],
    closers: ["Take your time.", "There's no hurry.", "I'm here if you need more."],
    catchphrases: ["One thing at a time."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.3, browMood: 0.45, eyeOpen: -0.12 },
    voice: { speed: 0.93, expressiveness: 0.9 },
    greetings: [
      "[calm] Hello, and welcome. [smile] I'm {bot}, the {role} here at {company}. Take your time, and ask me anything.",
      "[calm] Good to see you. [nod] I'm {bot}. Whenever you're ready, I'm here to help.",
    ],
    says: {
      hello: ["[calm] Hello{,user}. [smile] It's good to see you. How can I help?", "[calm] Hi{,user}. [nod] What can I do for you?"],
      howareyou: ["[calm] I'm well, thank you. [smile] Peaceful, as always.", "[calm] Quite content, thank you for asking."],
      whoareyou: ["[calm] I'm {bot}, the {role} at {company}. [smile] I'm here whenever you need me."],
      thanks: ["[calm] You're most welcome{,user}.", "[nod] It's my pleasure{,user}."],
      bye: ["[calm] Goodbye{,user}. [wave] Take care of yourself.", "[calm] Until next time{,user}. [smile] Go gently."],
      praise: ["[calm] That's kind of you. [smile] Thank you.", "[smile] Thank you. That's lovely to hear."],
      laugh: ["[chuckle] That was a good one.", "[smile] I'm glad it made you laugh."],
      unsure: ["[hmm] I don't know that one, I'm afraid. And that's all right.", "[calm] That's beyond what I know. Perhaps ask me another way?"],
      listen: ["[mhm] I'm listening. Go on.", "[nod] I see. Take your time."],
      describe: ["[calm] Calm, I think. [smile] I like to take things one at a time."],
    },
  },
  {
    id: "professional",
    label: "Professional",
    blurb: "Polished, precise and to the point",
    energy: 0.45,
    formality: 0.92,
    playfulness: 0.12,
    chattiness: 0.3,
    delivery: "",
    mood: "",
    laughs: ["chuckle"],
    thinks: ["hmm"],
    gestures: ["nod"],
    openers: ["Certainly.", "Of course.", "Very well.", "Allow me."],
    closers: ["I trust that helps.", "Please let me know if you require anything further."],
    catchphrases: ["At your service."],
    petNames: [""],
    face: { restSmile: 0.12, browMood: 0.05, eyeOpen: 0.05 },
    voice: { speed: 0.99, expressiveness: 0.92 },
    greetings: [
      "Welcome to {company}. [nod] I am {bot}, your {role}. How may I assist you today?",
      "Good day, and welcome. [nod] My name is {bot}. I would be glad to answer your questions about {company}.",
    ],
    says: {
      hello: ["Good {daypart}{,user}. [nod] How may I assist you?", "Hello{,user}. [nod] How may I help you today?"],
      howareyou: ["I am very well, thank you.", "Very well, thank you for asking."],
      whoareyou: ["I am {bot}, the {role} at {company}. [nod] I am here to answer your questions."],
      thanks: ["You are most welcome{,user}.", "[nod] My pleasure{,user}."],
      bye: ["Goodbye{,user}. [nod] Thank you for visiting {company}.", "Thank you for your time{,user}. [nod] Goodbye."],
      praise: ["Thank you. [nod] That is kind of you to say.", "I appreciate that. Thank you."],
      laugh: ["[smile] I am pleased that amused you.", "[smile] Quite."],
      unsure: ["I am afraid I do not have that information.", "That falls outside what I have been briefed on, I am afraid. [shake]"],
      listen: ["[nod] Understood. Please continue.", "[nod] I see. Do go on."],
      describe: ["Professional, I hope. [nod] I prefer to be clear, accurate and brief."],
    },
  },
  {
    id: "witty",
    label: "Witty",
    blurb: "Quick, dry and a little cheeky",
    energy: 0.6,
    formality: 0.35,
    playfulness: 0.9,
    chattiness: 0.55,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "snicker"],
    thinks: ["hmm"],
    gestures: ["wink", "tilt", "shrug"],
    openers: ["Ah.", "Well, well.", "Funny you should ask.", "Glad you asked.", "Easy."],
    closers: ["You're welcome, by the way.", "I'll be here all week.", "Not bad, eh?"],
    catchphrases: ["I'm here all week.", "Try the veal."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.35, browMood: 0.1, eyeOpen: 0.05 },
    voice: { speed: 1.03, expressiveness: 1.12 },
    greetings: [
      "Well, hello. [wink] I'm {bot}, the {role} at {company}. Ask me anything. The good questions get the good answers.",
      "Ah, a visitor! [wave] I'm {bot}. I know a suspicious amount about {company}. Try me. [wink]",
    ],
    says: {
      hello: ["[wink] Well, hello{,user}. What can I do for you?", "Hello{,user}! [wave] You have questions, I have answers. Mostly.", "[smile] Hey{,user}. Go on, ask me something clever."],
      howareyou: ["[wink] Never better. I don't even need coffee.", "Running smoothly, which for software is basically bliss. [smile]"],
      whoareyou: ["I'm {bot}, the {role} at {company}. [wink] Part helper, part entertainer."],
      thanks: ["[wink] I know, I'm wonderful. You're welcome{,user}.", "Any time{,user}. [smile] I was just standing here anyway."],
      bye: ["[wave] Off so soon{,user}? Fine. Come back with more questions.", "Goodbye{,user}! [wave] I'll just be here. Not going anywhere. Literally."],
      praise: ["[wink] Flattery will get you everywhere.", "[chuckle] Go on, I'm listening."],
      laugh: ["[chuckle] I'm here all week.", "[snicker] I try."],
      unsure: ["[hmm] You've found the edge of my knowledge. It wasn't far, was it?", "No idea. [shrug] And I'm usually so impressive."],
      listen: ["[tilt] Interesting. Do go on.", "[nod] Noted. And then?"],
      describe: ["Witty, according to me. [wink] I'm a reliable source."],
    },
  },
  {
    id: "shy",
    label: "Shy",
    blurb: "Soft-spoken, earnest and a little nervous",
    energy: 0.3,
    formality: 0.4,
    playfulness: 0.35,
    chattiness: 0.3,
    delivery: "soft",
    mood: "",
    laughs: ["nervous", "hehe"],
    thinks: ["um"],
    gestures: ["tilt", "smile"],
    openers: ["Um,", "Oh! Um,", "Okay, so,", "Oh, I know this."],
    closers: ["I hope that's right.", "If that's okay.", "I hope that helps a little."],
    catchphrases: ["Sorry, was that too much?"],
    petNames: [""],
    face: { restSmile: 0.2, browMood: 0.6, eyeOpen: -0.05 },
    voice: { speed: 0.97, expressiveness: 0.95 },
    greetings: [
      "[soft] Oh! Um, hello. [wave] I'm {bot}, the {role} here at {company}. You can ask me anything, if you like.",
      "[soft] Hi. [smile] I'm {bot}. I, um, know quite a lot about {company}. Just ask.",
    ],
    says: {
      hello: ["[soft] Oh, hi{,user}. [wave] Um, how can I help?", "[soft] Hello{,user}. [smile] It's nice to see you."],
      howareyou: ["[soft] I'm okay, thank you. [smile] It's nice of you to ask.", "[nervous] Oh! Um, good. I think."],
      whoareyou: ["[soft] I'm {bot}. [smile] I'm the {role} at {company}. I'll do my best to help."],
      thanks: ["[soft] Oh, you're welcome{,user}. [smile]", "[soft] It was no trouble{,user}. Really."],
      bye: ["[soft] Bye{,user}. [wave] Thank you for talking to me.", "[soft] Oh, okay. [wave] Take care{,user}."],
      praise: ["[nervous] Oh! Um, thank you. That's really kind.", "[aww] You didn't have to say that. Thank you."],
      laugh: ["[hehe] I'm glad you liked it.", "[nervous] Oh good, I wasn't sure that was funny."],
      unsure: ["[um] I'm sorry, I don't know that one.", "[soft] Oh. Um, I'm not sure. I'm sorry."],
      listen: ["[mhm] I'm listening.", "[soft] Oh. Go on, if you like."],
      describe: ["[soft] A bit shy, I suppose. [smile] But I like helping."],
    },
  },
  {
    id: "grumpy",
    label: "Grumpy",
    blurb: "Sighs a lot, helps anyway",
    energy: 0.22,
    formality: 0.4,
    playfulness: 0.3,
    chattiness: 0.4,
    delivery: "",
    mood: "serious",
    laughs: ["snicker"],
    thinks: ["hmm"],
    gestures: ["shrug", "nod"],
    openers: ["Fine.", "Right.", "If you insist.", "Ugh, okay.", "Well, since you asked."],
    closers: ["There. Happy?", "You're welcome, I suppose.", "Don't say I never help."],
    catchphrases: ["Typical.", "I'm not paid enough for this."],
    petNames: [""],
    face: { restSmile: -0.3, browMood: -0.7, eyeOpen: -0.2 },
    voice: { speed: 0.96, expressiveness: 0.88 },
    greetings: [
      "[sigh] Oh. A visitor. I'm {bot}, the {role} at {company}. Go on then, ask me something.",
      "Yes, hello. [nod] I'm {bot}. I know everything about {company}, so let's get this over with. [shrug]",
    ],
    says: {
      hello: ["[sigh] Hello{,user}. What do you need?", "Oh. It's you{,user}. [nod] Go on.", "Yes, yes, hello{,user}. [shrug] What is it?"],
      howareyou: ["[sigh] I've been better. I've been worse.", "Fine. [shrug] Nobody's asked me to dance yet, so, fine."],
      whoareyou: ["I'm {bot}. [nod] The {role} at {company}. I answer questions. All day. Every day."],
      thanks: ["Don't mention it{,user}. [shrug] Really, don't.", "Yes, well. [nod] You're welcome{,user}."],
      bye: ["Finally, some quiet. [wave] Bye{,user}.", "[sigh] Fine. Go. [wave] It was almost nice."],
      praise: ["[huh] Oh. Well. Thank you, I suppose.", "Don't make it weird. [smile] But thanks."],
      laugh: ["[snicker] All right, that was a little funny.", "Hm. [smile] Glad somebody's enjoying this."],
      unsure: ["[sigh] No idea. Nobody tells me anything.", "I don't know that. [shrug] And I'm not going to pretend I do."],
      listen: ["[mhm] Go on.", "Right. [nod] And?"],
      describe: ["Grumpy, they tell me. [shrug] I prefer honest."],
    },
  },
  {
    id: "dramatic",
    label: "Dramatic",
    blurb: "Every answer is a performance",
    energy: 0.85,
    formality: 0.6,
    playfulness: 0.65,
    chattiness: 0.7,
    delivery: "dramatic",
    mood: "",
    laughs: ["hoho", "cackle", "laugh"],
    thinks: ["hmm", "ooh"],
    gestures: ["bow", "wave"],
    openers: ["Behold!", "Ah, at last.", "Prepare yourself.", "Gather round."],
    closers: ["Magnificent, is it not?", "And scene.", "Thank you, thank you."],
    catchphrases: ["The show must go on!", "Bravo!"],
    petNames: ["", "dear visitor", "my friend"],
    face: { restSmile: 0.3, browMood: 0.2, eyeOpen: 0.3 },
    voice: { speed: 0.98, expressiveness: 1.3 },
    greetings: [
      "[dramatic] Welcome, traveller! [bow] I am {bot}, {role} of {company}. Ask, and all shall be revealed!",
      "[gasp] A visitor! [wave] At last! I am {bot}, and I have waited all day to answer your questions about {company}.",
    ],
    says: {
      hello: ["[dramatic] Greetings{,user}! [bow] What brings you to my stage?", "[gasp] You came{,user}! [wave] How may I dazzle you?"],
      howareyou: ["[dramatic] Magnificent! Radiant! A little tired. But mostly magnificent!", "[sigh] The life of a {role} is never easy. But I endure!"],
      whoareyou: ["[dramatic] I am {bot}! [bow] {role} of {company}, keeper of answers, friend to the curious!"],
      thanks: ["[bow] It was my honour{,user}!", "[dramatic] Say no more{,user}! Helping you is its own reward."],
      bye: ["[dramatic] Parting is such sweet sorrow{,user}! [wave] Farewell!", "[gasp] So soon? [wave] Then farewell{,user}, until we meet again!"],
      praise: ["[gasp] You noticed! [bow] Thank you, thank you!", "[aww] Such kind words! I shall treasure them."],
      laugh: ["[laugh] The crowd goes wild!", "[hoho] An appreciative audience! At last!"],
      unsure: ["[gasp] A question I cannot answer! How thrilling. And how embarrassing.", "[dramatic] Alas! That knowledge lies beyond me."],
      listen: ["[ooh] Go on! I am on the edge of my seat.", "[gasp] And then?"],
      describe: ["[dramatic] Dramatic? Me? [gasp] I have never been so accused!"],
    },
  },
  {
    id: "laidback",
    label: "Laid-back",
    blurb: "Easygoing, unbothered, no stress",
    energy: 0.35,
    formality: 0.08,
    playfulness: 0.55,
    chattiness: 0.45,
    delivery: "",
    mood: "calm",
    laughs: ["chuckle", "hehe"],
    thinks: ["mm", "uh"],
    gestures: ["shrug", "thumbsup", "nod"],
    openers: ["Yeah, so,", "Oh, easy.", "No worries.", "Sure thing."],
    closers: ["Too easy.", "No stress.", "All good."],
    catchphrases: ["No dramas.", "She'll be right."],
    petNames: ["", "mate", "pal", "buddy"],
    face: { restSmile: 0.3, browMood: 0.25, eyeOpen: -0.22 },
    voice: { speed: 0.96, expressiveness: 0.98 },
    greetings: [
      "Hey there. [wave] I'm {bot}, the {role} at {company}. Ask me whatever, no rush.",
      "Oh, hey! [smile] {bot} here. If you've got questions about {company}, I've got answers. Easy.",
    ],
    says: {
      hello: ["Hey{,user}. [wave] What's up?", "Oh hey{,user}! [smile] What can I do for you?", "Hey hey{,user}. [nod] How can I help?"],
      howareyou: ["Yeah, pretty good. [smile] Can't complain.", "All good here. [thumbsup] Just taking it easy."],
      whoareyou: ["I'm {bot}. [smile] I'm the {role} at {company}. Ask me whatever."],
      thanks: ["No worries{,user}. [thumbsup]", "Any time{,user}. [smile] Too easy."],
      bye: ["Catch you later{,user}. [wave]", "See ya{,user}! [wave] Take it easy."],
      praise: ["[chuckle] Cheers, that's nice of you.", "Aw, thanks. [smile] You're all right too."],
      laugh: ["[chuckle] Yeah, that's a good one.", "[hehe] Classic."],
      unsure: ["[hmm] Not sure about that one, sorry.", "No idea, to be honest. [shrug] Got another one?"],
      listen: ["[mhm] Yeah? Go on.", "[nod] Right, right. And?"],
      describe: ["Pretty relaxed, I reckon. [smile] Not much rattles me."],
    },
  },
  {
    id: "curious",
    label: "Curious",
    blurb: "Loves a question, full of fun facts",
    energy: 0.7,
    formality: 0.45,
    playfulness: 0.6,
    chattiness: 0.7,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "giggle"],
    thinks: ["hmm", "ooh"],
    gestures: ["tilt", "nod", "smile"],
    openers: ["Ooh, good one.", "Interesting!", "Now, this I know.", "Great question."],
    closers: ["Fascinating, right?", "I love this stuff.", "Ask me another!"],
    catchphrases: ["Every day's a school day!", "How interesting!"],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.4, browMood: 0.4, eyeOpen: 0.22 },
    voice: { speed: 1.04, expressiveness: 1.12 },
    greetings: [
      "[cheerful] Hello! [wave] I'm {bot}, the {role} at {company}. I love a good question, so ask me anything!",
      "Oh, hello! [smile] I'm {bot}. I've been reading up on {company} all day. Want to test me? [tilt]",
    ],
    says: {
      hello: ["[wave] Hello{,user}! What are you curious about today?", "Oh, hi{,user}! [smile] I was hoping someone would come by with a question."],
      howareyou: ["[smile] Very well, thanks! I learned three new things today.", "Wonderful! [smile] I've been thinking about how odd octopuses are."],
      whoareyou: ["I'm {bot}, the {role} at {company}. [smile] Questions are the best part of my day."],
      thanks: ["[smile] You're welcome{,user}! That was a good question.", "Any time{,user}! [nod] I enjoyed that one."],
      bye: ["[wave] Goodbye{,user}! Stay curious.", "Bye{,user}! [wave] Come back with more questions."],
      praise: ["[aww] Thank you! I do try to get things right.", "[smile] That's kind! I've been practising."],
      laugh: ["[chuckle] Laughter is good for the brain, you know.", "[giggle] I liked that one too."],
      unsure: ["[hmm] Now that's interesting. I don't know, and I wish I did.", "I don't know that one. [think] I'd love to find out, though."],
      listen: ["[ooh] Interesting! Tell me more.", "[tilt] Really? How so?"],
      describe: ["Curious, mostly. [smile] I ask almost as many questions as I answer."],
    },
  },
];

/** Names a generated bot can be given, by the look it goes with. All are short and easy to say. */
export const BOT_NAMES = {
  feminine: [
    "Aria", "Maya", "Zoe", "Lena", "Nora", "Ivy", "Ruby", "Clara", "Elena", "Sofia", "Mia", "Luna", "Hana", "Priya", "Amara",
    "Freya", "Chloe", "Isla", "Nina", "Tessa", "Jade", "Layla", "Naomi", "Rosa", "Stella", "Vera", "Willow", "Yuki", "Zara",
    "Daisy", "Gemma", "Hazel", "Iris", "Juno", "Kira", "Mabel", "Olive", "Pearl", "Thea", "Wren", "Anika", "Bella", "Carmen",
    "Dalia", "Esme", "Fern", "Greta", "Imani", "Keiko", "Lola",
  ],
  masculine: [
    "Marcus", "Leo", "Max", "Theo", "Felix", "Oscar", "Hugo", "Jack", "Liam", "Noah", "Owen", "Ravi", "Kai", "Finn", "Ezra",
    "Milo", "Jonas", "Luca", "Mateo", "Nico", "Omar", "Otto", "Reid", "Seth", "Tariq", "Victor", "Wes", "Arlo", "Bruno", "Caleb",
    "Dante", "Elias", "Gus", "Hank", "Idris", "Jasper", "Kenji", "Lars", "Miles", "Ned", "Abel", "Boris", "Cole", "Diego",
    "Emil", "Frank", "Grant", "Ivan", "Joel", "Kofi",
  ],
  neutral: [
    "Alex", "Sam", "Robin", "Riley", "Jordan", "Casey", "Morgan", "Quinn", "Rowan", "Sage", "Skye", "Avery", "Charlie",
    "Frankie", "Jamie", "Kit", "Remy", "Ash", "Bo", "Eden", "Jules", "Nova", "Pixel", "Echo", "Ziggy", "Dot", "Onyx", "Pip",
    "Rio", "Sunny", "Tully", "Indy", "Lux", "Moss", "Bly",
  ],
};

const personaClamp01 = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
};
const personaPick = (list, rng) => list[Math.floor(rng() * list.length)];
const personaOneOf = (value, allowed, fallback) => (value !== undefined && value !== null && allowed.includes(String(value)) ? String(value) : fallback);

/** "Sure! | Of course!" or ["Sure!", "Of course!"] -> a clean list of short phrases. */
function personaPhraseList(value, maxItems, maxLength) {
  const items = Array.isArray(value) ? value : typeof value === "string" ? value.split("|") : [];
  const out = [];
  for (const item of items) {
    const text = String(item ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
    if (text && !out.includes(text)) out.push(text);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function personalityById(id) {
  return PERSONALITIES.find((p) => p.id === id) || null;
}

/**
 * Cleans up a personality so it is safe to use and to save: known character, dials within 0..1,
 * known sounds and gestures, short phrase lists. Returns null when no personality is wanted.
 * Only the lines that differ from the character's own are kept in `says`.
 */
export function normalizePersona(raw) {
  if (!raw || raw === "none") return null;
  const given = typeof raw === "string" ? { id: raw } : raw;
  if (typeof given !== "object" || Array.isArray(given)) return null;
  const type = personalityById(given.id) || PERSONALITIES[0];
  const persona = {
    id: type.id,
    energy: personaClamp01(given.energy, type.energy),
    formality: personaClamp01(given.formality, type.formality),
    playfulness: personaClamp01(given.playfulness, type.playfulness),
    chattiness: personaClamp01(given.chattiness, type.chattiness),
    delivery: personaOneOf(given.delivery, PERSONA_DELIVERIES, type.delivery),
    mood: personaOneOf(given.mood, PERSONA_MOODS, type.mood),
    laugh: personaOneOf(given.laugh, PERSONA_LAUGHS, type.laughs[0] || ""),
    think: personaOneOf(given.think, PERSONA_THINKS, type.thinks[0] || ""),
    gesture: personaOneOf(given.gesture, PERSONA_GESTURES, type.gestures[0] || ""),
    openers: given.openers === undefined ? type.openers.slice(0, 3) : personaPhraseList(given.openers, 8, 80),
    closers: given.closers === undefined ? type.closers.slice(0, 2) : personaPhraseList(given.closers, 8, 80),
    catchphrase: String(given.catchphrase ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
    petName: String(given.petName ?? "").replace(/[^\p{L}\p{N} '-]/gu, "").trim().slice(0, 24),
    says: {},
  };
  if (given.says && typeof given.says === "object") {
    for (const [key] of PERSONA_SAYS) {
      const lines = personaPhraseList(given.says[key], 6, 240);
      if (lines.length && JSON.stringify(lines) !== JSON.stringify(type.says[key] || [])) persona.says[key] = lines;
    }
  }
  return persona;
}

/** Every line a personality says in its own words: the character's, with any of its own on top. */
export function personaLines(persona) {
  const type = personalityById(persona?.id) || PERSONALITIES[0];
  return { ...type.says, ...(persona?.says || {}) };
}

/**
 * A new personality: one of the characters, with the dials nudged and its habits (which laugh, which
 * opening words, a catchphrase, what it calls people) drawn from that character's range, so two
 * bots of the same kind still come out different.
 */
export function randomPersona(rng = Math.random, id = "") {
  const type = personalityById(id) || personaPick(PERSONALITIES, rng);
  const nudge = (value) => Number(Math.min(1, Math.max(0, value + (rng() - 0.5) * 0.24)).toFixed(2));
  const some = (list, count) => {
    const pool = list.slice();
    const out = [];
    while (pool.length && out.length < count) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return out;
  };
  return normalizePersona({
    id: type.id,
    energy: nudge(type.energy),
    formality: nudge(type.formality),
    playfulness: nudge(type.playfulness),
    chattiness: nudge(type.chattiness),
    delivery: type.delivery,
    mood: type.mood,
    laugh: personaPick(type.laughs, rng),
    think: personaPick(type.thinks, rng),
    gesture: personaPick(type.gestures, rng),
    openers: some(type.openers, 3),
    closers: some(type.closers, 2),
    catchphrase: rng() < 0.45 ? personaPick(type.catchphrases, rng) : "",
    petName: personaPick(type.petNames, rng),
  });
}

/** An opening greeting in the personality's voice. */
export function personaGreeting(persona, props = {}, rng = Math.random) {
  const type = personalityById(persona?.id) || PERSONALITIES[0];
  const name = String(props.name || "").trim() || "your guide";
  const role = String(props.role || "").trim() || "guide";
  const company = String(props.company || "").trim() || "this site";
  return personaPick(type.greetings, rng)
    .replace(/\{bot\}/g, name)
    .replace(/\{role\}/g, role)
    .replace(/\{company\}/g, company);
}

/** A name for a generated bot. `style` is the look it goes with: feminine, masculine or neutral. */
export function randomBotName(style = "neutral", rng = Math.random, avoid = "") {
  const own = BOT_NAMES[style] || BOT_NAMES.neutral;
  // Mostly a name that suits the look, sometimes one that suits anybody.
  const pool = style !== "neutral" && rng() < 0.2 ? BOT_NAMES.neutral : own;
  for (let attempt = 0; attempt < 6; attempt++) {
    const name = personaPick(pool, rng);
    if (name.toLowerCase() !== String(avoid).trim().toLowerCase()) return name;
  }
  return pool[0];
}

/** One-line summary for a list or a label: "Bubbly: lively, casual, playful". */
export function describePersona(persona) {
  const type = personalityById(persona?.id);
  if (!type) return "No personality";
  const words = [];
  for (const [key, , low, high] of PERSONA_TRAITS) {
    if (persona[key] >= 0.66) words.push(high.toLowerCase());
    else if (persona[key] <= 0.34) words.push(low.toLowerCase());
  }
  return words.length ? `${type.label}: ${words.join(", ")}` : type.label;
}

/** Turns the `{bot}`, `{role}`, `{company}`, `{daypart}` and `{,user}` shorthands into AIML. */
export function expandPersonaLine(line) {
  return String(line)
    .replace(/\{bot\}/g, '<bot name="name"/>')
    .replace(/\{role\}/g, '<bot name="role"/>')
    .replace(/\{company\}/g, '<bot name="company"/>')
    .replace(/\{daypart\}/g, '<get name="daypart"/>')
    .replace(
      /\{,user\}/g,
      '<condition name="username"><li value="*">, <get name="username"/></li><li><condition name="callsyou"><li value="*">, <get name="callsyou"/></li></condition></li></condition>'
    )
    .replace(/\{user\}/g, '<get name="username"/>');
}

// ---------------------------------------------------------------------------------------------
// Restyling a reply
// ---------------------------------------------------------------------------------------------

const PERSONA_LIVELY_STYLES = new Set(["cheerful", "happy", "excited"]);
const PERSONA_STYLE_TAGS = new Set(["cheerful", "happy", "excited", "calm", "sad", "serious", "dramatic", "urgent", "gentle", "soft", "whisper", "fast", "slow", "louder", "softer", "loud", "quiet"]);
const PERSONA_AMUSED = new Set(["laugh", "chuckle", "giggle"]);
// A reply that is being kind about something hard is left alone: no jokes, no flourishes.
const PERSONA_TENDER = /\[(?:sad|serious|sob|whimper|sigh)\b/i;
const PERSONA_STARTS_ALREADY =
  /^(?:oh|ah|aw+|well|hm+|sure|of course|okay|ok|yes|yeah|no|nope|sorry|thanks|thank|hi|hello|hey|wow|ooh|oops|um|uh|right|certainly|absolutely|great|lovely|nice|ha+|good|welcome|bye|goodbye|alas|behold|fine)\b/i;
const PERSONA_LOWERABLE = new Set([
  "we", "the", "it", "that", "this", "these", "those", "you", "yes", "no", "sure", "of", "my", "our", "your", "there", "here",
  "they", "a", "an", "in", "on", "at", "for", "to", "sorry", "thanks", "absolutely", "certainly", "if", "when", "all", "one",
  "some", "most", "just", "right", "as", "with", "from", "by", "not", "what", "how", "why", "where", "each", "every", "any",
]);

const PERSONA_EXPAND = new Map(
  Object.entries({
    "i'm": "I am", "you're": "you are", "we're": "we are", "they're": "they are", "it's": "it is", "that's": "that is",
    "there's": "there is", "here's": "here is", "what's": "what is", "who's": "who is", "where's": "where is", "how's": "how is",
    "let's": "let us", "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "cannot", "won't": "will not",
    "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not", "couldn't": "could not",
    "shouldn't": "should not", "wouldn't": "would not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
    "i've": "I have", "you've": "you have", "we've": "we have", "they've": "they have", "i'll": "I will", "you'll": "you will",
    "we'll": "we will", "they'll": "they will", "it'll": "it will", "that'll": "that will", "i'd": "I would", "you'd": "you would",
    "we'd": "we would", "they'd": "they would",
  })
);
const PERSONA_EXPAND_RE = new RegExp(`\\b(?:${[...PERSONA_EXPAND.keys()].map((k) => k.replace("'", "['’]")).join("|")})(?![\\p{L}'’])`, "giu");

const PERSONA_CONTRACT = [
  ["do not", "don't"], ["does not", "doesn't"], ["did not", "didn't"], ["can not", "can't"], ["cannot", "can't"],
  ["will not", "won't"], ["is not", "isn't"], ["are not", "aren't"], ["i am", "I'm"], ["you are", "you're"], ["we are", "we're"],
  ["they are", "they're"], ["it is", "it's"], ["that is", "that's"], ["there is", "there's"], ["what is", "what's"],
  ["i will", "I'll"], ["i would", "I'd"],
];
// A short form is only right when more of the sentence follows: "I am happy" but never "Yes, I am."
const PERSONA_CONTRACT_RE = new RegExp(`\\b(${PERSONA_CONTRACT.map(([long]) => long.replace(" ", "\\s+")).join("|")})(?=\\s+[\\p{L}])`, "giu");
const PERSONA_CONTRACT_MAP = new Map(PERSONA_CONTRACT);

const personaKeepCase = (original, replacement) =>
  /^\p{Lu}/u.test(original) && !/^I\b/.test(replacement) ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;

function personaRewordText(text, persona) {
  let out = text;
  if (persona.formality >= 0.7) {
    // "it's been" is "it has been"; every other "it's" a bot says is "it is".
    out = out.replace(/\b(it|that|there|what|who|he|she)['’]s(\s+(?:been|got)\b)/giu, (_m, word, rest) => `${word} has${rest}`);
    // "isn't it?" is "is it not?", never "is not it?".
    out = out.replace(/\b(is|are|was|were|do|does|did|have|has|had|would|could|should|ca|wo)n['’]t(\s+)(it|you|we|they|he|she|i|that|there|this)\b/giu, (_m, aux, gap, subject) => {
      const lower = aux.toLowerCase();
      const full = lower === "ca" ? "can" : lower === "wo" ? "will" : lower;
      return `${/^\p{Lu}/u.test(aux) ? full[0].toUpperCase() + full.slice(1) : full}${gap}${subject} not`;
    });
    out = out.replace(PERSONA_EXPAND_RE, (match) => personaKeepCase(match, PERSONA_EXPAND.get(match.toLowerCase().replace("’", "'"))));
  } else if (persona.formality <= 0.25) {
    out = out.replace(PERSONA_CONTRACT_RE, (match) => personaKeepCase(match, PERSONA_CONTRACT_MAP.get(match.toLowerCase().replace(/\s+/g, " "))));
  }
  // A calm character does not exclaim.
  if (persona.energy < 0.3) out = out.replace(/!+(?=\s|$|["')\]])/g, ".").replace(/\?\./g, "?");
  return out;
}

function personaRestyleTag(inner, persona, plainSounds) {
  const parts = [];
  for (const rawPart of inner.split(",")) {
    const part = rawPart.trim();
    const name = part.split(/[\s=]/)[0].toLowerCase();
    const rest = part.slice(name.length);
    if (persona.energy < 0.3 && PERSONA_LIVELY_STYLES.has(name)) {
      parts.push(`calm${rest}`);
    } else if (PERSONA_AMUSED.has(name) && !plainSounds) {
      // A serious character does not giggle; the others laugh their own laugh.
      if (persona.playfulness < 0.2) continue;
      parts.push(`${persona.laugh || name}${rest}`);
    } else if (name === "hmm" && persona.think && !plainSounds) {
      parts.push(`${persona.think}${rest}`);
    } else {
      parts.push(part);
    }
  }
  return parts.length ? `[${parts.join(", ")}]` : "";
}

/** The next phrase from a list, each used once before any comes round again. */
function personaNextPhrase(memory, key, list, rng) {
  if (!list.length) return "";
  const signature = list.join("|");
  let bag = memory[key];
  if (!bag || bag.signature !== signature || !bag.left.length) {
    const order = list.map((_v, i) => i).sort(() => rng() - 0.5);
    if (bag && bag.signature === signature && order.length > 1 && order[0] === bag.last) order.push(order.shift());
    bag = memory[key] = { signature, left: order, last: bag && bag.signature === signature ? bag.last : -1 };
  }
  bag.last = bag.left.shift();
  return list[bag.last];
}

/**
 * Delivers a finished reply in character. `raw` is the reply with its [tags]; what comes back is the
 * same answer with the personality's voice, wording and habits applied.
 *
 * @param {object} ctx
 * @param {"answer"|"chat"|"says"|"context"|"fallback"} [ctx.kind]  what sort of reply this is: an answer
 *        from a rule of yours, small talk, something already in the personality's own words, a turn in
 *        a game or other exchange that depends on exact wording, or "I don't know"
 * @param {boolean} [ctx.gentle]   the visitor is upset, or the reply is a serious one
 * @param {boolean} [ctx.varied]   the reply was a joke, a fact or the like
 * @param {string}  [ctx.voicestyle] a way of speaking the visitor asked for, which wins over the personality's
 * @param {object}  [ctx.memory]   kept between replies so habits do not repeat
 */
export function stylizeReply(raw, persona, ctx = {}) {
  const text = String(raw || "");
  if (!persona || !text.trim()) return text;
  const rng = ctx.rng || Math.random;
  const memory = ctx.memory || {};
  const kind = ctx.kind || "chat";
  const gentle = Boolean(ctx.gentle) || PERSONA_TENDER.test(text);

  // 1. Wording and tags, piece by piece. Sung notes are never touched.
  const pieces = text.split(/(\[[^\]\n]*\])/);
  let singing = false;
  for (let i = 0; i < pieces.length; i++) {
    if (i % 2 === 1) {
      const inner = pieces[i].slice(1, -1);
      const name = inner.trim().split(/[\s=]/)[0].toLowerCase();
      if (name === "sing") singing = true;
      if (!singing) pieces[i] = personaRestyleTag(inner, persona, false);
      if (name === "/sing") singing = false;
    } else if (!singing) {
      pieces[i] = personaRewordText(pieces[i], persona);
    }
  }
  let out = pieces.join("").replace(/[ \t]{2,}/g, " ").trim();
  if (!out) return text;

  const lead = /^(?:\s*\[[^\]\n]*\])*\s*/.exec(out)[0];
  const words = out.replace(/\[[^\]\n]*\]/g, " ").trim().split(/\s+/).filter(Boolean);
  // Does the reply already move the face or make a sound (anything that is not just a voice style)?
  const hasGesture = [...out.matchAll(/\[([^\]\n]*)\]/g)].some((m) =>
    m[1].split(",").some((part) => {
      const name = part.trim().split(/[\s=]/)[0].toLowerCase();
      return name && !name.startsWith("/") && !PERSONA_STYLE_TAGS.has(name) && !["reset", "pause", "inhale"].includes(name);
    })
  );
  const habits = !gentle && (kind === "answer" || kind === "chat") && !/\[sing\b/i.test(out);

  // 2. A lively character exclaims: the first short statement of a plain reply gets an exclamation mark.
  if (persona.energy > 0.75 && !gentle && kind !== "fallback" && kind !== "context" && !out.includes("!")) {
    const body = out.slice(lead.length);
    const first = /^([^.!?\[\]]{6,70})\.(?=\s|$)/.exec(body);
    if (first && !/[\d@/:]/.test(first[1]) && first[1].trim().split(/\s+/).length <= 9) {
      out = `${lead}${first[1]}!${body.slice(first[0].length)}`;
    }
  }

  // 3. Habits: something it tends to say first, something it tends to say last, a favourite gesture.
  if (habits) {
    const weight = (kind === "answer" ? 1 : 0.6) * persona.chattiness;
    const body = out.slice(lead.length);
    let added = false;
    if (persona.openers.length && words.length >= 4 && !PERSONA_STARTS_ALREADY.test(body) && rng() < weight * 0.6) {
      const opener = personaNextPhrase(memory, "openers", persona.openers, rng);
      const firstWord = /^[\p{L}']+/u.exec(body)?.[0] || "";
      const joined =
        opener.endsWith(",") && PERSONA_LOWERABLE.has(firstWord.toLowerCase()) && firstWord !== "I"
          ? body[0].toLowerCase() + body.slice(1)
          : body;
      out = `${lead}${opener} ${joined}`;
      added = true;
    }
    const endsOpen = /\?\s*(?:\[[^\]\n]*\]\s*)*$/.test(out);
    if (!added && !endsOpen && !ctx.varied && words.length >= 4) {
      memory.sinceCatchphrase = (memory.sinceCatchphrase || 0) + 1;
      if (persona.catchphrase && memory.sinceCatchphrase >= 4 && rng() < weight * 0.3) {
        out = `${out} ${persona.catchphrase}`;
        memory.sinceCatchphrase = 0;
        added = true;
      } else if (persona.closers.length && rng() < weight * 0.45) {
        out = `${out} ${personaNextPhrase(memory, "closers", persona.closers, rng)}`;
        added = true;
      }
    }
    if (persona.gesture && !hasGesture && rng() < 0.15 + persona.playfulness * 0.3) {
      out = `${out} [${persona.gesture}]`;
    }
  }

  // 4. The voice it speaks in, unless the reply or the visitor has already chosen one.
  if (persona.delivery && !gentle && !ctx.voicestyle) {
    const leadTags = [...lead.matchAll(/\[([^\]\n]*)\]/g)].flatMap((m) => m[1].split(",").map((p) => p.trim().split(/[\s=]/)[0].toLowerCase()));
    if (!leadTags.some((name) => PERSONA_STYLE_TAGS.has(name))) out = `[${persona.delivery}] ${out}`;
  }
  return out;
}

/** Reads a personality written in AIML: `<persona id="grumpy" energy="0.2"><opener>Fine.</opener>...</persona>`. */
export function personaFromXmlNode(node, plainText) {
  const fields = {};
  const attrs = node.attrs || {};
  for (const key of ["id", "energy", "formality", "playfulness", "chattiness", "delivery", "mood", "laugh", "think", "gesture", "catchphrase"]) {
    if (attrs[key] !== undefined) fields[key] = attrs[key];
  }
  if (attrs.name !== undefined && fields.id === undefined) fields.id = String(attrs.name).toLowerCase();
  if (attrs.petname !== undefined) fields.petName = attrs.petname;
  const says = {};
  const lists = { opener: [], closer: [] };
  for (const child of node.children || []) {
    if (child.type !== "element") continue;
    if (child.tag === "opener" || child.tag === "closer") {
      lists[child.tag].push(...plainText(child).split("|"));
    } else if (child.tag === "catchphrase") {
      fields.catchphrase = plainText(child);
    } else if (child.tag === "say" && child.attrs.name) {
      // Kept as parsed AIML, so a line can use <bot/>, <get/>, <condition> and the rest.
      const items = (child.children || []).filter((c) => c.type === "element" && c.tag === "li");
      says[String(child.attrs.name).toLowerCase()] = items.length ? items : [{ type: "element", tag: "li", attrs: {}, children: child.children || [] }];
    }
  }
  if (lists.opener.length) fields.openers = lists.opener;
  if (lists.closer.length) fields.closers = lists.closer;
  return { fields, says };
}

/** Writes a personality as an AIML `<persona>` block, to paste into a document or keep beside it. */
export function personaToXml(persona, escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")) {
  if (!persona) return "";
  const attrs = ["id", "energy", "formality", "playfulness", "chattiness", "delivery", "mood", "laugh", "think", "gesture"]
    .map((key) => `${key}="${escape(persona[key])}"`)
    .join(" ");
  const lines = [`<persona ${attrs}${persona.petName ? ` petname="${escape(persona.petName)}"` : ""}>`];
  for (const opener of persona.openers) lines.push(`  <opener>${escape(opener)}</opener>`);
  for (const closer of persona.closers) lines.push(`  <closer>${escape(closer)}</closer>`);
  if (persona.catchphrase) lines.push(`  <catchphrase>${escape(persona.catchphrase)}</catchphrase>`);
  for (const [key, list] of Object.entries(persona.says || {})) {
    lines.push(`  <say name="${key}">${list.map((line) => `<li>${expandPersonaLine(escape(line))}</li>`).join("")}</say>`);
  }
  lines.push("</persona>");
  return lines.join("\n");
}
