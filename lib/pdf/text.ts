// react-pdf under-measures the final glyph cluster of some Thai runs and clips
// the last consonant (e.g. "ประจำวัน" -> "ประจำวั"). A trailing space makes the
// space the clipped element instead of a real character.
export const pt = (s: string | number): string => `${s} `;
