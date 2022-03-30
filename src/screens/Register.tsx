import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from '../components';
import socket from '../service/socket';
import {userService} from '../service/store';

export const RegisterScreen = () => {
  const [username, setUsername] = useState('');

  const onSubmit = () => {
    if (!username) {
      return;
    }
    socket.auth = {username};
    socket.connect();
    userService.loginUser();
  };

  return (
    <View style={styles.container}>
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
});
