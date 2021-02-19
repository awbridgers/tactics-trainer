import { StyleSheet } from 'react-native';


const boardStyle = StyleSheet.create({
  board:{
    width:'100%',
    

  },
  rank:{
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  square:{
    flex:1,
    aspectRatio: 1
  },
  darkSquare:{
    backgroundColor: '#918151',
    aspectRatio:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lightSquare:{
    backgroundColor:'#556B25',
    aspectRatio:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedSquare:{
    position: 'absolute',
    left: 0,
    right:0,
    top:0,
    bottom:0,
    borderWidth:2,
    borderColor: 'red'
  },
  image:{
   height:'80%',
   width:'80%'
  },
  legalMoveSquare:{
    position: 'absolute',
    width:'15%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'yellow',
    zIndex:1
  },
  coordFile:{
    position: 'absolute',
    right: 2,
    bottom: 0
  },
  coordRank:{
    position: 'absolute',
    left: 2,
    top:2
  }
})


export default boardStyle