import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ChatInput, ChatHeader, MessagesList} from '../components';
import {SERVER_URL} from '../config';
import socket from '../service/socket';
import {Message, messageService, userService} from '../service/store';

export const Conversation = ({route, navigation}: any) => {
  const {id, name} = route.params;
  const onBackPress = () => {
    navigation.goBack();
  };
  const [messages, setMessages] = useState<[{title: string; data: Message[]}]>(
    [] as any,
  );
  const [userId, setUserId] = useState<string>();
  const [userInteractionTime, setUserInteractionTime] = useState<Date | null>(
    null,
  );

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
    if (id && userId) {
      socket.emit('interaction', {userId, targetUserId: id});

      fetch(`${SERVER_URL}/api/message?ids=${JSON.stringify([userId, id])}`)
        .then(res => res.json())
        .then(res => {
          messageService.setMessageForUser(id, res.data);
        })
        .catch(err => {
          console.log('Error in fetching messages->', err);
        });

      fetch(
        `${SERVER_URL}/api/interaction?userId=${userId}&&targetUserId=${id}`,
      )
        .then(res => res.json())
        .then(res => {
          if (new Date(res.data?.lastInteractionTime)) {
            messageService.setUserInteraction(
              id,
              new Date(res.data.lastInteractionTime),
            );
          }
        })
        .catch(err => {
          console.log('Error in fetching messages->', err);
        });
    }
  }, [userId, id]);

  useEffect(() => {
    const subscription = userService.getUser().subscribe(res => {
      setUserId(res.id);
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

    const interactionSubscription = messageService
      .subscribeToUserInteraction()
      .subscribe(res => {
        setUserInteractionTime(res);
      });

    return () => {
      subscription.unsubscribe();
      messageService.setActiveUserId(null);
      interactionSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <ChatHeader style={{flex: 0.1}} name={name} onBackPress={onBackPress} />
      <MessagesList
        style={{flex: 0.8}}
        userInteractionTime={userInteractionTime}
        userId={userId}
        messages={messages}
      />
      <ChatInput onSend={sendMessage} style={{flex: 0.1}} />
    </View>
  );
};
