import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "@/components/screens/main";
import Record from "../screens/Record";
import Setting from "../screens/setting";
import Entypo from '@expo/vector-icons/Entypo';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'gray'
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Main}
        options={{
          tabBarLabel: 'Inicio',
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          
        }}  
      />
      <Tab.Screen 
        name="Record" 
        component={Record}
        options={{
          tabBarLabel: 'Historial',
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Entypo name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Setting" 
        component={Setting}
        options={{
          tabBarLabel: 'Ajustes',
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Entypo name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
