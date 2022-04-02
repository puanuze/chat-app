import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const getPosition = (type: any, isLeft: boolean) => {
  if (isLeft && type === 'messageContainer') {
    return {
      alignSelf: 'flex-start',
      backgroundColor: '#f0f0f0',
      borderTopLeftRadius: 0,
    };
  } else if (isLeft && type === 'message') {
    return {
      color: '#000',
    };
  } else if (isLeft && type === 'time') {
    return {
      color: 'darkgray',
    };
  } else {
    return {
      backgroundColor: 'green',
      borderTopRightRadius: 0,
    };
  }
};

const Message = ({time, isLeft, isSeen, message}: any) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageContainer,
          getPosition('messageContainer', isLeft) as any,
        ]}>
        <View style={styles.messageView}>
          <Text style={[styles.message, getPosition('message', isLeft) as any]}>
            {message}
          </Text>
        </View>
        <View style={styles.timeView}>
          <Text style={[styles.time, getPosition('time', isLeft) as any]}>
            {time}
          </Text>
        </View>
      </View>
      {!isLeft && (
        <Text style={styles.status}>{isSeen ? 'Seen' : 'Not Seen'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginVertical: 5,
  },
  messageContainer: {
    maxWidth: '80%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  messageView: {
    backgroundColor: 'transparent',
    maxWidth: '80%',
  },
  timeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  message: {
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  time: {
    color: 'lightgray',
    alignSelf: 'flex-end',
    fontSize: 10,
  },
  status: {
    color: 'black',
    alignSelf: 'flex-end',
    fontSize: 10,
    marginRight: 15,
  },
});

export default Message;
