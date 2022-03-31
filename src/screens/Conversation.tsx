import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ChatInput, ChatHeader, MessagesList} from '../components';
import socket from '../service/socket';
import {Message, messageService, userService} from '../service/store';

export const Conversation = ({route, navigation}: any) => {
  const {id, name} = route.params;
  const onBackPress = () => {
    navigation.goBack();
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string>();

  const sendMessage = (message: string) => {
    messageService.addMessagetoUser(id, {
      content: message,
      sender: userId as string,
      to: id,
      createdAt: new Date().toISOString(),
    });
    socket.emit('private message', {
      content: message,
      to: id,
    });
  };

  useEffect(() => {
    const subscription = userService.getUser().subscribe(res => {
      setUserId(res.id);
      fetch(
        `http://192.168.1.80:5000/api/message?ids=${JSON.stringify([
          res.id,
          id,
        ])}`,
      )
        .then(res => res.json())
        .then(res => {
          messageService.setMessageForUser(id, res.data);
        })
        .catch(err => {
          console.log('Error in fetching messages->', err);
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      <MessagesList style={{flex: 0.8}} userId={userId} messages={messages} />
      <ChatInput onSend={sendMessage} style={{flex: 0.1}} />
    </View>
  );
};
