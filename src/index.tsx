import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ContactNavigator} from './navigators/Contact';
import {userService} from './service/store';
import {AuthNavigator} from './navigators/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';

const App = () => {
  const Stack = createNativeStackNavigator();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [initializingState, setInitializingState] = useState(true);

  useEffect(() => {
    const subscription = userService.getUser().subscribe(res => {
      setIsUserLoggedIn(res.isLoggedIn);
    });

    AsyncStorage.getItem('user-session').then((res: any) => {
      if (res) {
        userService.setUser({...JSON.parse(res), isLoggedIn: true});
      }
      setInitializingState(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (initializingState) {
    return <View></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isUserLoggedIn ? (
          <Stack.Group>
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
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
