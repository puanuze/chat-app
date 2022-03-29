import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ContactScreen, ChatsScreen} from './src/screens';
import {IconButton} from 'react-native-paper';

const Tab = createBottomTabNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused}) => {
              const iconMap: {[key: string]: string} = {
                Chats: 'android-messages',
                Contacts: 'contacts',
              };

              let iconColor = 'gray';
              if (focused) {
                iconColor = 'blue';
              }

              return (
                <IconButton icon={iconMap[route.name]} color={iconColor} />
              );
            },
          })}>
          <Tab.Screen name="Chats" component={ChatsScreen} />
          <Tab.Screen name="Contacts" component={ContactScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
