import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import socket from '../service/socket';
import {ContactUser, userService} from '../service/store';
import {Navigation} from '../types';

type Props = {
  navigation: Navigation;
};

const Item = ({name, onPress}: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.title}>{name}</Text>
  </TouchableOpacity>
);

export const ContactScreen = ({navigation}: Props) => {
  const renderItem = ({item}: any) => (
    <Item
      key={item.id}
      id={item.id}
      name={item.username}
      onPress={() =>
        navigation.navigate('Conversation', {id: item.id, name: item.username})
      }
    />
  );
  const [users, setUsers] = useState<ContactUser[]>();

  useEffect(() => {
    const userSubscription = userService.getUser().subscribe((res: any) => {
      socket.auth = {userId: res.userId, sessionId: res.sessionId};
      socket.connect();
    });

    const subscription = userService.getOnlineUsers().subscribe(res => {
      setUsers(res);
    });

    return () => {
      subscription.unsubscribe();
      userSubscription.unsubscribe()
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Active Users</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerText: {
    padding: 20,
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
});
