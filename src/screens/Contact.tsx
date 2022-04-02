import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SERVER_URL} from '../config';
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
      onPress={() => {
        navigation.navigate('Conversation', {id: item.id, name: item.username});
      }}
    />
  );
  const [onlineUsers, setOnlineUsers] = useState<ContactUser[]>();
  const [usersConnections, setUsersConnections] = useState<ContactUser[]>();
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (userId) {
      fetch(`${SERVER_URL}/api/user/${userId}/connections`)
        .then(res => res.json())
        .then(res => {
          setUsersConnections(res.data);
        })
        .catch(err => {
          console.log('Error in fetching connections->', err);
        });
    }
  }, [userId]);

  useEffect(() => {
    const userSubscription = userService.getUser().subscribe((res: any) => {
      setUserId(res.id);
      socket.auth = {userId: res.id, sessionId: res.sessionId};
      socket.connect();
    });

    const subscription = userService.getOnlineUsers().subscribe(res => {
      setOnlineUsers(res);
    });

    return () => {
      subscription.unsubscribe();
      userSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Active Users</Text>
      <View style={{flex: 0.5}}>
        <FlatList
          data={onlineUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Text style={styles.headerText}>Previous Connections</Text>
      <View style={{flex: 0.5}}>
        <FlatList
          data={usersConnections}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
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
