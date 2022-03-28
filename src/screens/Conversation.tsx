import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {ChatInput, MessagesList} from '../components';

const messages: any[] = [];

const Conversation = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <MessagesList style={{flex: 0.8}} messages={messages} />
      <ChatInput style={{flex: 0.1}} />
    </View>
  );
};

export default Conversation;
