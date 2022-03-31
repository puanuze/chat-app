import React from 'react';
import {ScrollView} from 'react-native';
import {userService} from '../service/store';

import Message from './Message';

export const MessagesList = ({userId, messages}: any) => {

  return (
    <ScrollView style={{backgroundColor: 'white', flexDirection: 'column'}}>
      {messages.map((message: any, index: number) => {
        const date = new Date(message.createdAt);
        const time = `${date.getHours()}:${date.getMinutes()}`;

        return (
          <Message
            key={index}
            time={time}
            isLeft={message.sender !== userId}
            message={message.content}
          />
        );
      })}
    </ScrollView>
  );
};
