import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from './components/weather';
import HomeScreen from './components/Home'; 
import SoilTypeClassifier from './components/SoilType'; 
import DiseaseTypeClassifier from './components/Disease'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import vector icons

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Determine the icon name based on the route
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Disease') {
              iconName = focused ? 'bug' : 'bug-outline';
            } else if (route.name === 'Soil Type') {
              iconName = focused ? 'leaf' : 'leaf-outline';
            } else if (route.name === 'Weather') {
              iconName = focused ? 'cloud' : 'cloud-outline';
            }

            // Return the Icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8e8e8e',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Disease" component={DiseaseTypeClassifier} />
        <Tab.Screen name="Soil Type" component={SoilTypeClassifier} />
        <Tab.Screen name="Weather" component={WeatherScreen} />        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
