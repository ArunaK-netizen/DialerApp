import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { Searchbar, Avatar, IconButton } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import * as Updates from 'expo-updates'; 
import DialerPad from '../../components/DailerPad';
import * as Font from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [dialerVisible, setDialerVisible] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false); // Add a state for font loading

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'LexendDeca': require('../../assets/fonts/LexendDeca.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    // Check for updates when the component mounts
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new update is available. The app will restart to apply the update.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  try {
                    await Updates.reloadAsync();
                  } catch (reloadError) {
                    Alert.alert('Error', 'Failed to reload the app. Please try again later.');
                    console.error('Error reloading the app:', reloadError);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        Alert.alert('Update Error', 'Failed to check for updates. Please try again later.');
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();

    // Hide the dialer when the keyboard appears
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setDialerVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data && data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        }
      } else {
        console.log('Permission to access contacts was denied');
      }
    };

    fetchContacts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const makeCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => item.phoneNumbers?.length > 0 && makeCall(item.phoneNumbers[0].number)}
    >
      <Avatar.Text size={40} label={item.name?.charAt(0)} style={styles.avatar} />
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers?.length > 0 && (
          <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
        )}
      </View>
      <IconButton icon="phone" onPress={() => item.phoneNumbers?.length > 0 && makeCall(item.phoneNumbers[0].number)} />
    </TouchableOpacity>
  );

  const handleDialerVisibility = () => {
    setDialerVisible(!dialerVisible);
    Keyboard.dismiss(); // Hide the keyboard when toggling the dialer
  };

  const handleDial = (number) => {
    setDialedNumber((prev) => prev + number);
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialedNumber) {
      makeCall(dialedNumber);
      setDialedNumber(''); // Clear the number after calling
      handleDialerVisibility(); // Hide the dialer pad after calling
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contactsContainer}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search Contacts"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            onFocus={() => setDialerVisible(false)} // Hide the dialer when the search bar is focused
          />
          <TouchableOpacity style={styles.toggleDialerButton} onPress={handleDialerVisibility}>
            <Text style={styles.toggleDialerButtonText}>{dialerVisible ? <MaterialCommunityIcons name="dialpad" size={24} color="black" /> : <MaterialCommunityIcons name="dialpad" size={24} color="black" />}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          ListEmptyComponent={<Text style={styles.noContactsText}>No Contacts Found</Text>}
        />
      </View>
      <View style={[styles.dialerContainer, { bottom: dialerVisible ? 0 : '-60%' }]}>
        <DialerPad 
          onDial={handleDial}
          onBackspace={handleBackspace}
          onCall={handleCall}
          enteredNumber={dialedNumber}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    color:'black',
    
  },
  contactsContainer: {
    flex: 1,
    paddingBottom: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
    fontFamily :'LexendDeca'
  },
  searchbar: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    fontFamily :'LexendDeca'
  },
  toggleDialerButton: {
    marginLeft: 10,
    backgroundColor: '#00C3F2',
    padding: 10,
    borderRadius: 50,
    fontFamily :'LexendDeca'
  },
  toggleDialerButtonText: {
    color: 'black',
    fontFamily :'LexendDeca'
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  contactDetails: {
    flex: 1,
    marginLeft: 15,
  },
  contactName: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'LexendDeca'
  },
  contactNumber: {
    color: '#bbb',
  },
  avatar: {
    backgroundColor: '#00C3F2',
  },
  noContactsText: {
    textAlign: 'center',
    color: '#bbb',
    marginTop: 20,
  },
  dialerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
  
    zIndex: 1,
  },
});


