import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Searchbar, Avatar, IconButton } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import DialerPad from '../../components/DailerPad';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [dialerVisible, setDialerVisible] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        console.log(data); // Log the data
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
    setDialedNumber(prev => prev + number);
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
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
        <Searchbar
          placeholder="Search Contacts"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          ListEmptyComponent={<Text style={styles.noContactsText}>No Contacts Found</Text>}
        />
      </View>
      <View style={[styles.dialerContainer, { bottom: dialerVisible ? 0 : '-50%' }]}>
        <DialerPad 
          onDial={handleDial}
          onBackspace={handleBackspace}
          onCall={handleCall}
          enteredNumber={dialedNumber}
        />
        <TouchableOpacity style={styles.toggleDialerButton} onPress={handleDialerVisibility}>
          <Text style={styles.toggleDialerButtonText}>{dialerVisible ? 'Hide Dialer' : 'Show Dialer'}</Text>
        </TouchableOpacity>
      </View>
      {!dialerVisible && (
        <TouchableOpacity style={styles.showDialerButton} onPress={handleDialerVisibility}>
          <Text style={styles.showDialerButtonText}>Show Dialer</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
  },
  contactsContainer: {
    flex: 1,
    paddingBottom: 60, // Ensure space for dialer pad
  },
  searchbar: {
    margin: 10,
    marginTop: 20, // Added top margin to bring the search bar down
    borderRadius: 20,
    backgroundColor: '#333', // Darker searchbar background
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Darker border color
  },
  contactDetails: {
    flex: 1,
    marginLeft: 15,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
  contactNumber: {
    color: '#bbb', // Light gray text color
  },
  avatar: {
    backgroundColor: '#6200ea', // Accent color
  },
  noContactsText: {
    textAlign: 'center',
    color: '#bbb', // Light gray text color
    marginTop: 20,
  },
  dialerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#1f1f1f', // Darker dialer background
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
    transition: 'bottom 0.3s ease-in-out', // Smooth transition
  },
  toggleDialerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleDialerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  showDialerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  showDialerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
