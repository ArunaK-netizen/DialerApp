import { Tabs } from 'expo-router';
import React from 'react';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white', // Active tab color set to white
        tabBarInactiveTintColor: 'white', // Inactive tab color also set to white
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2f2f2f', // Background color of the tab bar
          height: 70, // Increased height for the tab bar
          paddingBottom: 10, // Padding to center the icons vertically
          borderTopColor: '#1f1f1f', // Change border color to pink
          borderTopWidth: 2, // Set the border width
        },
        tabBarLabelStyle: {
          fontSize: 14, // Increased font size for tab labels
          fontFamily: 'LexendDeca',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color="white" /> // Icon color set to white
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color }) => (
            <Fontisto name="history" size={24} color="white" /> // Icon color set to white
          ),
        }}
      />
    </Tabs>
  );
}
