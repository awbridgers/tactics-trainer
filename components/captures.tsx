import React from 'react';
import {View, Text, Image} from 'react-native';
import {Piece} from 'chess.js';
import captureStyle from '../styles/captures';
import {chooseImage} from '../helpers/chooseImage';

interface Props {
  pieces: Piece[];
}
const Captures: React.FC<Props> = ({pieces}) => {
  return (
    <View style={captureStyle.captureContainer}>
      {pieces.map((piece, i) => (
        <View
          key={i}
          style={
            piece.type === 'p'
              ? [captureStyle.capturePiece, captureStyle.pawn]
              : captureStyle.capturePiece
          }
        >
          <Image
            style={captureStyle.image}
            source={chooseImage(piece.type, piece.color)}
          />
        </View>
      ))}
    </View>
  );
};

export default Captures;
