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
  giftTag: 'For Rawan. Open before your next meeting.',

  /** One word pops out of each of the 25 balloons, one per year. */
  balloonWords: [
    'brilliant', 'kind', 'reliable', 'hilarious', 'sharp',
    'calm under pressure', 'creative', 'generous', 'gum supplier', 'T# master',
    'positive', 'thoughtful', 'supportive', 'fearless', 'detail-obsessed',
    'Wi-Fi hero', 'inspiring', 'genuine', 'quick-witted', 'team player',
    'problem solver', 'sandwich sharer', 'legendary', 'irreplaceable', 'Rawan',
  ],

  /** Extra lines for specific balloon words, shown under the word when it pops. */
  balloonNotes: {
    'T# master': '(a language only she speaks)',
  } as Record<string, string>,

  /** Hidden under the gold scratch card. */
  scratchSecret: 'Good for one bag of gummy bears,\non Mark.',

  /**
   * The thank-you scene: one polaroid per kind thing she did, then a receipt.
   * `art` picks the drawing. To use a real photo instead, put it in
   * public/evidence/ and set `photo: '/evidence/<file>'`.
   */
  thankYous: [
    { art: 'gum', photo: '/evidence/gum.webp', label: 'Exhibit A', caption: 'The gum. Today. No questions asked.', item: 'Bubblegum, sugar-free', price: 'FREE', stamp: 'VERY KIND' },
    { art: 'internet', photo: '/evidence/internet.webp', label: 'Exhibit B', caption: 'The internet. Last Monday. Shared without a second thought.', item: 'Internet, Monday', price: 'FREE', stamp: 'LIFESAVER' },
    { art: 'sandwich', photo: '/evidence/sandwich.webp', label: 'Exhibit C', caption: 'The tuna sandwich. Offered. Generously.', item: 'Tuna sandwich (offered)', price: 'FREE', stamp: 'GENEROUS' },
    { art: 'mentos', photo: '/evidence/mentos.webp', label: 'Exhibit D', caption: 'Her Mentos. Left in my car. Safe, sealed, waiting for her.', item: 'Mentos, kept safe', price: 'ON HOLD', stamp: 'SAFE & SOUND' },
    // No receipt line for the mug: it's the IOU at the bottom of the receipt.
    { art: 'mug', photo: '/evidence/mug.webp', label: 'Exhibit E', caption: 'Her one-of-a-kind mug. A classic. A worthy successor is coming. One day.', item: '', price: '', stamp: 'UPGRADE PENDING' },
  ],

  /** A promise printed at the bottom of the receipt. */
  iou: { item: 'New mug', when: 'ONE DAY' },

  /** Taped to the bottom of the letter, under the signature. */
  letterPhoto: { src: '/evidence/us.webp', caption: 'Proof that work can be fun.' },

  /** The closing letter, typed out one paragraph at a time. */
  letter: [
    'Happy birthday, Lilo!',
    'Working with you makes the long days shorter and the hard tasks easier. You bring good energy, good ideas and the occasional much-needed laugh.',
    'Thank you for the gum today, for sharing your internet last Monday, and for offering me your tuna sandwich. Small things, but they make work a lot nicer.',
    'And don\'t worry, your Mentos are safe in my car. I haven\'t touched them. Much.',
    'Also, one day I will get you a new mug. One day.',
    'I hope 25 brings you exciting projects, well-earned wins and plenty of time away from your screen.',
    'Enjoy your day. You deserve it.',
  ],
} as const;
