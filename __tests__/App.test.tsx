import React from 'react';
import {
  fireEvent,
  render,
  within,
  act,
  waitFor,
} from '@testing-library/react-native';
import App from '../App';
import {FirebaseContext} from '../helpers/firebase';
import * as ScreenOrientation from 'expo-screen-orientation'

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



describe('App container component', ()=>{
  it('locks the screen upon mount',async ()=>{
    const lock = jest.spyOn(ScreenOrientation, 'lockAsync');
    const {findByTestId} = render(<App />)
    const wait = await findByTestId('showSolution')
    await waitFor(()=>{
      expect(lock).toHaveBeenCalled();
    })
  })
})