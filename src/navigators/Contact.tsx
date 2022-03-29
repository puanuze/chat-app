import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ContactScreen, Conversation} from '../screens';

const Stack = createNativeStackNavigator();

export function ContactNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ContactMain">
      <Stack.Screen name="ContactMain" component={ContactScreen} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  );
}
