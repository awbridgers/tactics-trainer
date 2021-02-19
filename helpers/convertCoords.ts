export const convertCoords = (file: number, rank: number): string => {
  const letter = String.fromCharCode(rank + 97);
  const number = 8-file;
  return `${letter}${number}`
}
