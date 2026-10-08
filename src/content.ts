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
    'calm under pressure', 'creative', 'generous', 'organized', 'curious',
    'positive', 'thoughtful', 'supportive', 'fearless', 'detail-obsessed',
    'patient', 'inspiring', 'genuine', 'quick-witted', 'team player',
    'problem solver', 'warm', 'legendary', 'irreplaceable', 'Rawan',
  ],

  /** Hidden under the gold scratch card. */
  scratchSecret: 'One meeting that could have been an email:\nofficially cancelled.',

  /** The closing letter, typed out one paragraph at a time. */
  letter: [
    'Happy birthday, Rawan!',
    'Working with you makes the long days shorter and the hard tasks easier. You bring good energy, good ideas and the occasional much-needed laugh.',
    'Thank you for always being so helpful and so easy to work with.',
    'I hope 25 brings you exciting projects, well-earned wins and plenty of time away from your screen.',
    'Enjoy your day. You deserve it.',
  ],
} as const;
