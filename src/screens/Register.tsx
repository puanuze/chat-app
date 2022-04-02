import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Button, TextInput} from '../components';
import {SERVER_URL} from '../config';
import {theme} from '../core/theme';
import {userService} from '../service/store';

export const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async () => {
    if (!username) {
      return;
    }

    try {
      let res = await fetch(`${SERVER_URL}/api/user`, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
        body: JSON.stringify({username}),
      });

      if (res.status === 200) {
        const {
          data: {_id: userId},
        } = await res.json();
        userService.setUser({id: userId, isLoggedIn: true} as any);
      } else {
        let errorResponse = await res.json();
        setErrorMessage(errorResponse.message);
      }
    } catch (error) {
      console.log('Error in registering user->', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.error}>{errorMessage}</Text>
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username}
        onChangeText={text => setUsername(text)}
        autoCapitalize="none"
      />

      <Button mode="contained" onPress={onSubmit}>
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  error: {
    color: theme.colors.error,
  },
});
