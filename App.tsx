import React, {createContext, useEffect} from 'react';
import Game from './game';
import FirebaseProvider from './helpers/firebase';
import * as ScreenOrientation from 'expo-screen-orientation'


const App = () =>{
  useEffect(()=>{
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  },[])
return(<FirebaseProvider><Game/></FirebaseProvider>)
}


export default App;