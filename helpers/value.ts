import {Piece} from 'chess.js'
const value = (a:Piece):number => {
  switch(a.type){
    case 'p':
      return 1;
    case 'n': 
      return 3;
    case 'b':
      return 3.5;
    case 'r':
      return 5;
    case 'q':
      return 9;
    default:
      return 0;
  }
}

export default value;