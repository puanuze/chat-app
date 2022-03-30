import React from 'react';
import {ScrollView} from 'react-native';

import Message from './Message';

export const MessagesList = ({messages}: any) => {
  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      {messages.map((message: any, index: number) => (
        <Message
          key={index}
          time={message.time}
          isLeft={!message.selfSent}
          message={message.content}
        />
      ))}
    </ScrollView>
  );
};
