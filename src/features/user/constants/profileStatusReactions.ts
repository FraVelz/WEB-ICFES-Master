export type ProfileStatusReaction = {
  id: string;
  emoji: string;
  label: string;
};

export const PROFILE_STATUS_REACTIONS: ProfileStatusReaction[] = [
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'party', emoji: '🎉', label: 'Fiesta' },
  { id: 'strong', emoji: '🦾', label: 'Fuerte' },
  { id: 'focus', emoji: '👀', label: 'Concentrado' },
  { id: 'popcorn', emoji: '🍿', label: 'Relajado' },
  { id: 'study', emoji: '📚', label: 'Estudiando' },
  { id: 'owl', emoji: '🦉', label: 'Sabio' },
  { id: 'hundred', emoji: '💯', label: 'Perfecto' },
  { id: 'fire', emoji: '🔥', label: 'En racha' },
  { id: 'trophy', emoji: '🏆', label: 'Campeón' },
  { id: 'fruit', emoji: '🍎', label: 'Saludable' },
  { id: 'grumpy', emoji: '😾', label: 'Serio' },
];

export function getProfileStatusReaction(id: string | null | undefined): ProfileStatusReaction | null {
  if (!id) return null;
  return PROFILE_STATUS_REACTIONS.find((r) => r.id === id) ?? null;
}
