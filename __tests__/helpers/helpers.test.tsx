import React from 'react'
import {convertCoords} from '../../helpers/convertCoords';
import {chooseImage} from '../../helpers/chooseImage';
import firebaseConfig from '../../helpers/firebaseConfig';
import {Chess, Piece} from 'chess.js';
import {Image, View} from 'react-native';
import {render} from '@testing-library/react-native';
import pgnString from '../../helpers/pgnString'
import firebase from 'firebase/app'

//mock functions


jest.mock('../../helpers/chooseImage');

  
 


describe('the function for converting numbers into algebraic notation',()=>{
  it('converts numbers properly',()=>{
    expect(convertCoords(0,0)).toEqual('a8');
    expect(convertCoords(0,7)).toEqual('h8');
    expect(convertCoords(4,5)).toEqual('f4');
  })
})
describe('image selector',()=>{
  it('returns the right image',()=>{
    expect(chooseImage('r','w')).toEqual('whiteRook2');
    expect(chooseImage('n','w')).toEqual('whiteKnight2');
    expect(chooseImage('b','w')).toEqual('whiteBishop2');
    expect(chooseImage('q','w')).toEqual('whiteQueen2');
    expect(chooseImage('k','w')).toEqual('whiteKing2');
    expect(chooseImage('p','w')).toEqual('whitePawn2');
    expect(chooseImage('r','b')).toEqual('blackRook2');
    expect(chooseImage('n','b')).toEqual('blackKnight2');
    expect(chooseImage('b','b')).toEqual('blackBishop2');
    expect(chooseImage('q','b')).toEqual('blackQueen2');
    expect(chooseImage('k','b')).toEqual('blackKing2');
    expect(chooseImage('p','b')).toEqual('blackPawn2');
  })
})

describe('pgnString',()=>{
  it('converts the pgn into a string',()=>{
    expect(pgnString('this is a test hello 1. hi')).toEqual('1. hi');
  })
})




