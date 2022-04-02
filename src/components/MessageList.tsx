import React from 'react';
import {SectionList, View} from 'react-native';
import {Text} from 'react-native-paper';

import Message from './Message';

export const MessagesList = ({userInteractionTime, userId, messages}: any) => {
  const renderItem = ({item}: any) => {
    const date = new Date(item.createdAt);
    const time = `${date.getHours()}:${date.getMinutes()}`;
    const isSeen =
      userInteractionTime && userInteractionTime > date ? true : false;

    return (
      <Message
        key={item._id}
        time={time}
        isSeen={isSeen}
        isLeft={item.sender !== userId}
        message={item.content}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {messages.length > 0 && (
        <SectionList
          sections={messages}
          inverted={true}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index as unknown as string}
          renderSectionFooter={({section: {title}}) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text>{title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};
