import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Communications from 'react-native-communications'; 
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get('window');

const DialerPad = ({ onCall, onHide }) => {
  const [input, setInput] = useState('');

  const handlePress = (digit) => {
    setInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (input) {
      Communications.phonecall(input, true); // Make a call using the Communications library
      onCall(input); // Notify the parent about the call
      setInput('');
      onHide(); // Hide the dialer after making the call
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <Text style={styles.input}>{input}</Text>
        <TouchableOpacity style={styles.backspaceButton} onPress={handleBackspace}>
          <Text style={styles.backspaceText}>⌫</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.padContainer}>
        <View style={styles.row}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity key={num} style={styles.button} onPress={() => handlePress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity key={num} style={styles.button} onPress={() => handlePress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity key={num} style={styles.button} onPress={() => handlePress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('*')}>
            <Text style={styles.buttonText}>*</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('#')}>
            <Text style={styles.buttonText}>#</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Entypo name="phone" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    
  },
  inputBox: {
    width: width * 1,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
   
    marginVertical: 20,

    position: 'relative',
    paddingHorizontal: 10,
    overflow: 'hidden', // Ensure content does not overflow
  },
  input: {
    fontSize: 40,
    color: 'white',
    flex: 1,
    textAlign: 'center', 
    verticalAlign: 'center',// Center the text
    fontFamily: 'LexendDeca',
    height: '100%', // Ensure it fills the height
    overflow: 'hidden', // Prevent text from overflowing
    flexShrink: 1, // Ensure text shrinks if needed
  },
  backspaceButton: {
    position: 'absolute',
    right: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backspaceText: {
    fontSize: 24,
    color: '#fff',
  },
  padContainer: {
    width: width * 0.9,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    width: '15%',
    height: 80,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    marginHorizontal: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'LexendDeca',
  },
  actionContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  callButton: {
    width: '15%',
    height: 80,
    backgroundColor: '#00c3f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    marginBottom: 100,
  },
});

export default DialerPad;
