import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Communications from 'react-native-communications'; // Import the library

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
      <Text style={styles.input}>{input}</Text>
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
        <TouchableOpacity style={styles.backspaceButton} onPress={handleBackspace}>
          <Text style={styles.backspaceText}>⌫</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>Call</Text>
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
  input: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 20,
  },
  padContainer: {
    width: width * 0.9,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '30%',
    height: 60,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
  actionContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backspaceButton: {
    width: '45%',
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  backspaceText: {
    fontSize: 24,
    color: '#fff',
  },
  callButton: {
    width: '45%',
    height: 60,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  callButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DialerPad;
