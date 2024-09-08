import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform } from 'react-native';

import { getAllCallLogs } from 'react-native-call-log';


const RecentCalls = () => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (Platform.OS === 'android') {
        try {
          // Request permission to read call logs
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            {
              title: 'Call Log Permission',
              message: 'This app needs access to your call logs.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          // Check if permission was granted
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted');
            try {
              // Fetch all call logs
              const data = await CallLogs.loadAll();
              console.log('Call logs fetched:', data);
              setCalls(data);
            } catch (error) {
              console.log('Error fetching call logs:', error);
            }
          } else {
            console.log('Call log permission denied');
          }
        } catch (err) {
          console.warn('Error requesting permission:', err);
        }
      }
    };

    fetchCalls();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id.toString()} // Make sure ID is a string
        renderItem={({ item }) => (
          <View style={styles.callItem}>
            <Text>{item.name || 'Unknown'}</Text>
            <Text>{item.number}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Ensure background color is set
  },
  callItem: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9', // Set a background color to ensure visibility
  },
});

export default RecentCalls;
