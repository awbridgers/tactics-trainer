import React from 'react';
import {
  fireEvent,
  render,
  within,
  act,
  waitFor,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Game from '../game';
import * as Chess from 'chess.js';
import {FirebaseContext} from '../helpers/firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import * as Linking from 'expo-linking';
import {PGNFormat} from '../types/PGN';


const fakeTactic: PGNFormat = {
  fen: '6k1/5p1p/6p1/8/2pPRqP1/P1P1RBNP/5P1K/r5r1 b - - 0 1',
  pgn: [
    {
      move: 'Rh1+',
      move_number: 1,
    },
    {
      move: 'Bxh1',
      move_number: 2,
    },
    {
      move: 'Qxf2+',
    },
    {
      move: 'Bg2',
      move_number: 3,
    },
    {
      move: 'Qg1#',
    },
  ],
};
const fakeShortTactic: PGNFormat = {
  fen: '6k1/5p1p/6p1/8/2pPRqP1/P1P1RBNP/5P1K/r5r1 b - - 0 1',
  pgn: [
    {
      move: 'Rh1+',
      move_number: 1,
    },
  ],
};
const PGN = 'Rh1+ Bxh1 Qxf2+ Bg2 Qg1#';
const moveValue = {
  color: 'b',
  from: '',
  to: '',
  flags: 'n',
  piece: 'n',
  san: 'Ra2',
}
const mockMove = jest.fn().mockReturnValue(moveValue);

const mockLoad = jest.fn();

//mock chess but load in the test fen
jest.mock('chess.js', () => ({
  Chess: jest.fn(() => ({
    ...jest
      .requireActual('chess.js')
      .Chess('6k1/5p1p/6p1/8/2pPRqP1/P1P1RBNP/5P1K/r5r1 b - - 0 1'),
    move: mockMove,
    load: mockLoad,
  })),
}));

const lightSquare = {
  backgroundColor: '#918151',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const darkSquare = {
  backgroundColor: '#556B25',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

const mockOnce = jest.fn();
const mockFirebase = {
  ...jest.requireActual('firebase/app'),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      once: jest.fn(() => ({
        val: mockOnce,
      })),
    })),
  })),
};

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <FirebaseContext.Provider value={mockFirebase}>
      {component}
    </FirebaseContext.Provider>
  );
};

describe('The Game Component', () => {
  beforeEach(() => {
    mockOnce.mockReturnValue(Promise.resolve(fakeShortTactic));
    mockMove.mockReturnValue(moveValue);
  });
  afterEach(() => {
    jest.clearAllMocks();
    mockMove.mockReset();
    mockOnce.mockReset()
  });
  it('renders the App component', async () => {
    const {findByTestId} = renderWithContext(<Game />);
    const app = findByTestId('app');
    expect(app).toBeDefined();
  });
  it('sets selected square when a square is pressed', async () => {
    const {findByTestId, getAllByTestId} = renderWithContext(<Game />);
    const button1 = await findByTestId('a1');
    fireEvent.press(button1);
    await waitFor(() => {
      expect(within(button1).getByTestId('selected')).toBeDefined();
      expect(getAllByTestId('selected')).toHaveLength(1);
    });
  });
  it('displays the legal moves when a piece is clicked on', async () => {
    const {findByTestId, queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    fireEvent.press(button);
    const b1 = await findByTestId('b1');
    const c1 = await findByTestId('c1');
    await waitFor(() => {
      expect(within(b1).getByTestId('legalMove')).toBeDefined();
      expect(within(c1).getByTestId('legalMove')).toBeDefined();
      expect(queryAllByTestId('legalMove')).toHaveLength(7);
    });
  });
  it('does not display legal moves if the square has no piece', async()=>{
    const {findByTestId, queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('b1');
    fireEvent.press(button);
    await waitFor(() => {
      expect(within(button).queryByTestId('selected')).toBeNull();
      expect(queryAllByTestId('legalMove')).toHaveLength(0);
    });
  });
  it('does not display legal move if the piece has no legal moves', async () => {
    const {findByTestId, queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('c4');
    fireEvent.press(button);
    await waitFor(()=>{
      expect(queryAllByTestId('legalMove')).toHaveLength(0);
    })
  });
  it('does not show legal moves if the square has no piece', async () => {
    const {findByTestId, queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('c4');
    fireEvent.press(button);
    await waitFor(()=>{
      expect(queryAllByTestId('legalMove')).toHaveLength(0);
    })
  });
  it('does not click if tactic is finished', async()=>{
    const {findByTestId, queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const solve = await findByTestId('showSolution')
    fireEvent.press(solve);
    await waitFor(()=>{
      expect(mockMove).toHaveBeenCalled();
    })
    fireEvent.press(button);
    await waitFor(()=>{
      expect(queryAllByTestId('selected')).toHaveLength(0)
    })
  })
  it('unselects if reclick on same square',async()=>{
    const {findByTestId,queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    fireEvent.press(button);
    await waitFor(()=>{
      expect(within(button).getByTestId('selected')).toBeDefined();
    })
    fireEvent.press(button);
    await waitFor(()=>{
      expect(queryAllByTestId('selected')).toHaveLength(0);
      expect(mockMove).not.toHaveBeenCalled();
    })
  })
  it('switches the selected piece if second click is user piece', async()=>{
    const {findByTestId,queryAllByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('g1');
    fireEvent.press(button);
    await waitFor(()=>{
      expect(within(button).getByTestId('selected')).toBeDefined();
    })
    fireEvent.press(button2)
    await waitFor(()=>{
      expect(within(button2).getByTestId('selected')).toBeDefined();
      expect(within(button).queryByTestId('selected')).toBeNull();
      expect(mockMove).not.toHaveBeenCalled();
    })
  })
  it('moves the piece if the second click is a legal move', async () => {
    const {findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('a2');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(() =>{
      expect(mockMove).toHaveBeenCalledWith({
        from: 'a1',
        to: 'a2',
        promotion: 'q',
      })
      expect(mockLoad).toHaveBeenCalledTimes(2);
    })
  });
  it('resets the legalMove squares once a piece is moved', async () => {
    const {queryAllByTestId, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('a2');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(()=>{
      expect(mockMove).toHaveBeenCalled();
      expect(queryAllByTestId('legalMove')).toHaveLength(0);
      expect(mockLoad).toHaveBeenCalledTimes(2);
    })
  });
  it('does not move the piece if the second click is not a legal move', async () => {
    const {findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('b5');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(()=>{
      expect(mockMove).not.toHaveBeenCalled();
    })
  });
  it('colors the squares properly', async () => {
    const {findByTestId, debug} = renderWithContext(<Game />);
    const a8 = await findByTestId('a8');
    const a7 = await findByTestId('a7');
    const b8 = await findByTestId('b8');
    const b7 = await findByTestId('b7');
    await waitFor(()=>{
      expect(within(a8).getByTestId('square')).toHaveStyle(lightSquare);
      expect(within(a7).getByTestId('square')).toHaveStyle(darkSquare);
      expect(within(b8).getByTestId('square')).toHaveStyle(darkSquare);
      expect(within(b7).getByTestId('square')).toHaveStyle(lightSquare);  
    })
  });
  it('shows the solution when the button is pressed', async () => {
    const {findByTestId} = renderWithContext(<Game />);
    mockOnce.mockReturnValueOnce(Promise.resolve(fakeTactic));
    const button = await findByTestId('showSolution');
    fireEvent.press(button);
    await waitFor(
      () => {
        expect(mockMove).toHaveBeenCalledTimes(5);
      },
      {timeout: 7000}
    );
  }, 10000);
  it('shows the solution in text after playing through it', async () => {
    const {queryByText, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('showSolution');
    fireEvent.press(button);
    await waitFor(() => {
      expect(queryByText(PGN)).toBeDefined();
      expect(mockMove).toHaveBeenLastCalledWith('Rh1+')
    });
  }),
    it('shows the next, analyze, and retry buttons after the solution', async () => {
      const {getByText, findByTestId} = renderWithContext(<Game />);
      const button = await findByTestId('showSolution');
      fireEvent.press(button);
      await waitFor(() => {
        expect(getByText('Retry')).toBeDefined();
        expect(getByText('Analysis')).toBeDefined();
        expect(getByText('Next')).toBeDefined();
      });
    });
  it('lets the user retry the tactic', async () => {
    const {findByText, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('showSolution');
    fireEvent.press(button);
    const test = await findByText('Retry');
    fireEvent.press(test);
    expect(mockLoad).toHaveBeenCalledWith(fakeTactic.fen);
  });
  it('runs the analysis', async () => {
    const {findByText, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('showSolution');
    const link = jest.spyOn(Linking, 'openURL');
    fireEvent.press(button);
    const test = await findByText('Analysis');
    fireEvent.press(test);
    expect(link).toHaveBeenCalled();
  });
  it('goes to the next tactic', async () => {
    const {findByText, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('showSolution');
    fireEvent.press(button);
    const test = await findByText('Next');
    fireEvent.press(test);
    await waitFor(() => {
      expect(mockLoad).toHaveBeenCalledTimes(2);
    });
  });
  it('makes a computer move if the move is correct', async () => {
    mockOnce.mockReturnValue(
      Promise.resolve({
        ...fakeTactic,
        pgn: [{move: 'Ra2'}, {move: 'Re2'}],
      })
    );
    const {findByTestId} = renderWithContext(<Game />);

    const button = await findByTestId('a1');
    const button2 = await findByTestId('a2');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(()=>{
      expect(mockMove).toHaveBeenLastCalledWith('Re2');
    });

  });
  it('does not make computer move if tactic is solved',async()=>{
    mockMove.mockReturnValueOnce({san: 'Rh1'});
    mockOnce.mockReturnValue(Promise.resolve({...fakeShortTactic, pgn:
      [
        {
          move: 'Rh1+',
          move_number: 1,
        },
        null
      ],
    }))
    const {findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('g1');
    const button2 = await findByTestId('h1');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(()=>{
      expect(mockMove).toHaveBeenCalledTimes(1);
    })
  })
  it('moves the piece back if the move is wrong', async () => {
    const {findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('a3');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(() => {
      expect(mockLoad).toHaveBeenCalledTimes(2);
    });
  });
  it('displays the proper text for the move', async () => {
    const {getByText, findByTestId, debug} = renderWithContext(<Game />);
    const button = await findByTestId('a1');
    const button2 = await findByTestId('a3');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(() => {
      expect(getByText('Incorrect, keep trying!')).toBeDefined();
      expect(mockLoad).toHaveBeenCalledTimes(2);
    });
  });
  it('displays the green text if the move is correct', async () => {
    mockMove.mockReturnValueOnce({san: 'Rh1'});
    const {getByText, findByTestId} = renderWithContext(<Game />);
    const button = await findByTestId('g1');
    const button2 = await findByTestId('h1');
    fireEvent.press(button);
    fireEvent.press(button2);
    await waitFor(() => {
      expect(getByText('Great Job!')).toBeDefined();
      expect(mockMove).toHaveBeenCalled();
    });
  });
});
