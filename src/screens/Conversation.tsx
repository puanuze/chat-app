import React from 'react';
import {View} from 'react-native';
import {ChatInput, Header, MessagesList} from '../components';

const messages: any[] = [];

const Conversation = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <Header style={{flex: 0.1}} />
      <MessagesList style={{flex: 0.8}} messages={messages} />
      <ChatInput style={{flex: 0.1}} />
    </View>
  );
};

export default Conversation;
