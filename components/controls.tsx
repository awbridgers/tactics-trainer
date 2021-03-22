import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import controlStyle from '../styles/controls';
import {FontAwesome5} from '@expo/vector-icons';


interface iProps {
  tacticActive: boolean;
  showSolution: boolean;
  viewSolution: () => void;
  next: () => void;
  analysis: ()=>void;
  retry: ()=>void;
}

const Controls: React.FC<iProps> = ({
  tacticActive,
  viewSolution,
  showSolution,
  next,
  analysis,
  retry
}) => {
  if (tacticActive && !showSolution) {
    return (
      <View>
        <TouchableOpacity
          style={controlStyle.viewSolution}
          onPress={viewSolution}
          testID = 'showSolution'
        >
          <Text style={{fontSize: 24, color: '#B3b3b3'}}>View Solution</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (showSolution) {
    return <View></View>;
  } else {
    return (
      <View style={controlStyle.end}>
        <TouchableOpacity style={controlStyle.endButton} onPress={retry} testID = 'retry'>
          <FontAwesome5 name="backward" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 20, color: '#B3b3b3'}}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={controlStyle.endButton} onPress = {analysis}>
          <FontAwesome5 name="search" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 20, color: '#B3b3b3'}}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={controlStyle.endButton} onPress={next}>
          <FontAwesome5 name="forward" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 24, color: '#B3b3b3'}}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Controls;
