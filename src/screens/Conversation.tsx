import React from 'react';
import {View} from 'react-native';
import {ChatInput, ChatHeader, MessagesList} from '../components';

const messages: any[] = [];

export const Conversation = ({route, navigation}: any) => {
  const {id, name} = route.params;
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <ChatHeader style={{flex: 0.1}} name={name} onBackPress={onBackPress} />
      <MessagesList style={{flex: 0.8}} messages={messages} />
      <ChatInput style={{flex: 0.1}} />
    </View>
  );
};
