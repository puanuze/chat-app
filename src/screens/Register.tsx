import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from '../components';
import userService from '../service/User';

export const RegisterScreen = () => {
  const [username, setUsername] = useState('');

  const onSubmit = () => {
    if (!username) {
      return;
    }
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
