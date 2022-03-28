import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {IconButton} from 'react-native-paper';

export const ChatInput = ({}: any) => {
  const [message, setMessage] = useState('');

  return (
    <View style={{...styles.container}}>
      <View style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            placeholder={'Message...'}
            style={styles.input}
            value={message}
            onChangeText={text => setMessage(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            // send message to other user
            setMessage('');
          }}>
          <IconButton icon="send" color="#8250df" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopColor: '#171717',
    borderTopWidth: 0.5,
  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'transparent',
    flex: 3,
    fontSize: 15,
    height: 50,
    alignSelf: 'center',
  },
});