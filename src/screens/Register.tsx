import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Button, TextInput} from '../components';
import {theme} from '../core/theme';
import socket from '../service/socket';
import {userService} from '../service/store';

export const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async () => {
    if (!username) {
      return;
    }

    try {
      let res = await fetch('http://192.168.1.80:5000/api/user', {
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

        socket.auth = {userId};
        socket.connect();
        userService.loginUser();
      } else {
        let errorResponse = await res.json();
        setErrorMessage(errorResponse.message);
      }
    } catch (error) {
      console.log(error);
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
