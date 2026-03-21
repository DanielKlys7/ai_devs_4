export const calculateAge = ({ birthDate }: { birthDate: string }): number => {
  const birth = new Date(birthDate);
  const age = 2026 - birth.getFullYear();

  return age;
};
