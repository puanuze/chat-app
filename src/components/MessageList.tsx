import React, {useState, useRef} from 'react';
import {ScrollView} from 'react-native';

import Message from './Message';

export const MessagesList = ({messages}: any) => {
  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      {messages.map((message: any, index: number) => (
        <Message
          key={index}
          time={message.time}
          isLeft={true}
          message={message.content}
        />
      ))}
    </ScrollView>
  );
};