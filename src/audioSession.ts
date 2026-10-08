/**
 * Safari 16.4+ lets a page say what its audio is for. 'playback' plays through
 * the main speaker even when the phone is on silent; 'play-and-record' is
 * needed while the mic is on. Other browsers ignore this.
 */
export function audioSession(type: 'playback' | 'play-and-record') {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session) session.type = type;
}
