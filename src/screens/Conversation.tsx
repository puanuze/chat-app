import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ChatInput, ChatHeader, MessagesList} from '../components';
import socket from '../service/socket';
import {Message, messageService} from '../service/store';

export const Conversation = ({route, navigation}: any) => {
  const {id, name} = route.params;
  const onBackPress = () => {
    navigation.goBack();
  };
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (message: string) => {
    messageService.addMessagetoUser(id, {content: message, selfSent: true});
    socket.emit('private message', {
      content: message,
      to: id,
    });
  };

  useEffect(() => {
    const subscription = messageService.subscribeToMessage().subscribe(res => {
      setMessages(res);
    });
    messageService.setActiveUserId(id);

    return () => {
      subscription.unsubscribe();
      messageService.setActiveUserId(null);
    };
  }, []);

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <ChatHeader style={{flex: 0.1}} name={name} onBackPress={onBackPress} />
      <MessagesList style={{flex: 0.8}} messages={messages} />
      <ChatInput onSend={sendMessage} style={{flex: 0.1}} />
    </View>
  );
};
