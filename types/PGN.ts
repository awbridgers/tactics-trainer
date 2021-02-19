import { PGNMove } from 'pgn-parser';

export interface PGN {
  event: string;
  site: string;
  date: string;
  round: string;
  white: string;
  black: string;
  result: string;
  fen: string;
  pgn: PGNMove[];
}