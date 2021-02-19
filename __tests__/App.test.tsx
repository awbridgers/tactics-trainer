import React from 'react';
import {fireEvent, render, within, act} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import App from '../App';
import Chess from 'chess.js/';
import {Alert, AlertButton} from 'react-native';

interface myAlertButton extends AlertButton {
  onPress: () => void;
}

const mockGameOver = jest.fn();
const mockCheckmate = jest.fn();
const mockStalemate = jest.fn();
const mockDraw = jest.fn();
const mockTFR = jest.fn();
const mockIM = jest.fn();
const mockReset = jest.fn();

const darkSquare = {
  backgroundColor: '#918151',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const lightSquare = {
  backgroundColor: '#556B25',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

jest.mock('chess.js', () => ({
  Chess: jest.fn(() => ({
    ...jest.requireActual('chess.js').Chess(),
    in_checkmate: mockCheckmate,
    in_stalemate: mockStalemate,
    in_draw: mockDraw,
    in_threefold_repetition: mockTFR,
    insufficient_material: mockIM,
    game_over: mockGameOver,
    reset: mockReset,
  })),
}));
describe('The App Component', () => {
  afterEach(() => {
    mockGameOver.mockReset();
    mockCheckmate.mockReset();
    mockStalemate.mockReset();
    mockDraw.mockReset();
    mockTFR.mockReset();
    mockIM.mockReset();
  })
  it('renders the App component', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('app')).toBeDefined();
  });
  it('sets sets selected square when a square is pressed', () => {
    const {getByTestId, getAllByTestId} = render(<App />);
    const button1 = getByTestId('a1');
    const button2 = getByTestId('h2');
    const button3 = getByTestId('c5');
    fireEvent.press(button1);
    expect(within(button1).getByTestId('selected')).toBeDefined();
    expect(getAllByTestId('selected')).toHaveLength(1);
    fireEvent.press(button2);
    expect(within(button2).getByTestId('selected')).toBeDefined();
    fireEvent.press(button3);
    expect(within(button3).queryByTestId('selected')).toBeNull();
  });
  it('displays the legal moves when a piece is clicked on', () => {
    const {getByTestId, queryAllByTestId} = render(<App />);
    const button = getByTestId('b1');
    fireEvent.press(button);
    expect(within(getByTestId('c3')).getByTestId('legalMove')).toBeDefined();
    expect(within(getByTestId('a3')).getByTestId('legalMove')).toBeDefined();
    expect(queryAllByTestId('legalMove')).toHaveLength(2);
  });
  it('does not display legal move if the piece has no legal moves', () => {
    const {getByTestId, queryAllByTestId} = render(<App />);
    const button = getByTestId('c1');
    fireEvent.press(button);
    expect(queryAllByTestId('legalMove')).toHaveLength(0);
  });
  it('does not change legal moves if the game is over',()=>{
    mockGameOver.mockReturnValue(false).mockReturnValue(true);
    const {getByTestId, queryAllByTestId} = render(<App />);
    const button = getByTestId('c2');
    fireEvent.press(button);
    expect(queryAllByTestId('legalMove')).toHaveLength(0);
  })
  it('does nothing if the game is over',()=>{
    mockGameOver.mockReturnValue(true);
    const {queryAllByTestId} = render(<App />);
    expect(queryAllByTestId('selected')).toHaveLength(0);
  })
  it('does not show legal moves if the square has no piece', () => {
    const {getByTestId, queryAllByTestId} = render(<App />);
    const button = getByTestId('c4');
    fireEvent.press(button);
    expect(queryAllByTestId('legalMove')).toHaveLength(0);
  });
  it('moves the piece if the second click is a legal move', () => {
    const {getByTestId} = render(<App />);
    const button = getByTestId('a2');
    const button2 = getByTestId('a4');
    fireEvent.press(button);
    fireEvent.press(button2);
    expect(within(button2).getByTestId('pieceImage')).toBeDefined();
    expect(within(button).queryByTestId('pieceImage')).toBeNull();
  });
  it('resets the legalMove squares once a piece is moved',()=>{
    const {queryAllByTestId, getByTestId} = render(<App />);
    const button = getByTestId('a2');
    const button2 = getByTestId('a4');
    fireEvent.press(button);
    fireEvent.press(button2);
    expect(queryAllByTestId('legalMove')).toHaveLength(0);
  })
  it('does not move the piece if the second click is not a legal move', () => {
    const {getByTestId} = render(<App />);
    const button = getByTestId('a2');
    const button2 = getByTestId('a5');
    fireEvent.press(button);
    fireEvent.press(button2);
    expect(within(button2).queryByTestId('pieceImage')).toBeNull();
    expect(within(button).queryByTestId('pieceImage')).toBeDefined();
  });
  it('colors the squares properly', () => {
    const {getByTestId} = render(<App />);
    const a8 = getByTestId('a8');
    const a7 = getByTestId('a7');
    const b8 = getByTestId('b8');
    const b7 = getByTestId('b7');

    expect(within(a8).getByTestId('square')).toHaveStyle(lightSquare);
    expect(within(a7).getByTestId('square')).toHaveStyle(darkSquare);
    expect(within(b8).getByTestId('square')).toHaveStyle(darkSquare);
    expect(within(b7).getByTestId('square')).toHaveStyle(lightSquare);
  });
  describe('game ending scenarios', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, array) => ({}));
    });
    
    it('alerts the user when their is a checkmate', () => {
      mockGameOver.mockReturnValue(true);
      mockCheckmate.mockReturnValue(true);
      const {} = render(<App />);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Checkmate!',
        'black wins!',
        expect.any(Array)
      );
    });
    it('alerts the user when the game is a stalemate', () => {
      mockGameOver.mockReturnValue(true);
      mockStalemate.mockReturnValue(true);
      const {} = render(<App />);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Stalemate!',
        'The game is a draw!',
        expect.any(Array)
      );
    });
    it('alerts the user if the game is three fold rep', () => {
      mockGameOver.mockReturnValue(true);
      mockTFR.mockReturnValue(true);
      const {} = render(<App />);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Threefold Repetition!',
        'The game is a draw!',
        expect.any(Array)
      );
    });
    it('alerts the user if insufficient material', () => {
      mockGameOver.mockReturnValue(true);
      mockIM.mockReturnValue(true);
      const {} = render(<App />);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Insufficient Material!',
        'The game is a draw!',
        expect.any(Array)
      );
    });
    it('alerts the user if the 50 move rule is reached', () => {
      mockGameOver.mockReturnValue(true);
      mockDraw.mockReturnValue(true);
      const {} = render(<App />);
      expect(Alert.alert).toHaveBeenCalledWith(
        '50 Move Limit Reached!',
        'The game is a draw!',
        expect.any(Array)
      );
    });
    it('gives white the win if black is in checkmate', () => {
      mockGameOver
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      mockCheckmate.mockReturnValue(true);
      const {getByTestId} = render(<App />);
      fireEvent.press(getByTestId('a2'));
      fireEvent.press(getByTestId('a4'));
      expect(Alert.alert).toHaveBeenCalledWith(
        'Checkmate!',
        'white wins!',
        expect.any(Array)
      );
    });
    it('it starts a new game', () => {
      mockGameOver.mockReturnValue(true);
      mockDraw.mockReturnValue(true);
      const myAlert = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, button) => button);
      const {} = render(<App />);
      const button = (myAlert.mock
        .calls[0][2] as AlertButton[])[0] as myAlertButton;
      act(() => button.onPress());
      expect(mockReset).toHaveBeenCalled();
    });
  });
});
