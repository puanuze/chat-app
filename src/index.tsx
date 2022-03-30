import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ContactNavigator} from './navigators/Contact';
import {RegisterScreen} from './screens/Register';
import userService from './service/User';

const App = () => {
  const Stack = createNativeStackNavigator();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const subscription = userService.getUser().subscribe(res => {
      setIsUserLoggedIn(res.isLoggedIn);
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isUserLoggedIn ? (
          <Stack.Group>
            <Stack.Screen
              name="App"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="Main"
              component={ContactNavigator}
              options={{headerShown: false}}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
