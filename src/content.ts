/**
 * Everything personal lives here. Edit this file to make the gift hers:
 * swap in inside jokes, nicknames and real memories. The rest of the app
 * reads from it and needs no changes.
 */
export const content = {
  name: 'Rawan',
  age: 25,
  from: 'Mark',

  /** Shown on the gift box before she opens it. */
  giftTag: 'For Rawan. Do not shake. (Shake it.)',

  /** One word pops out of each of the 25 balloons, one per year. */
  balloonWords: [
    'brave', 'hilarious', 'kind', 'stubborn (the good way)', 'brilliant',
    'loyal', 'dramatic', 'glowing', 'curious', 'iconic',
    'warm', 'fearless', 'chaotic', 'thoughtful', 'radiant',
    'honest', 'unstoppable', 'sweet', 'wild', 'wise',
    'golden', 'magnetic', 'gentle', 'legendary', 'Rawan',
  ],

  /** Hidden under the gold scratch card. */
  scratchSecret: 'Your birthday wish is officially approved.\nNo refunds. No returns.',

  /** The closing letter, typed out one paragraph at a time. */
  letter: [
    'Rawan,',
    'Twenty-five looks good on you. Then again, every age has.',
    'Thank you for the laughs, the long talks, and for being exactly who you are, loudly and without apology.',
    'I hope this year is soft where you need it, exciting where you want it, and full of people who make you feel the way you make everyone else feel.',
    'Happy birthday. Go be impossible.',
  ],
} as const;
