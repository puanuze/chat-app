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
  const [onlineUsersMap, setOnlineUsersMap] = useState<{[id: string]: boolean}>(
    {},
  );
  const [usersConnections, setUsersConnections] = useState<ContactUser[]>();
  const [activeUsers, setActiveUsers] = useState<ContactUser[]>();
  const [inactiveUsers, setInactiveUsers] = useState<ContactUser[]>();
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (userId) {
      fetch(`${SERVER_URL}/api/user/${userId}/connections`)
        .then(res => res.json())
        .then(res => {
          userService.setConnections(res.data ?? []);
          socket.auth = {userId};
          socket.connect();
        })
        .catch(err => {
          console.log('Error in fetching connections->', err);
        });
    }
  }, [userId]);

  useEffect(() => {
    const userSubscription = userService.getUser().subscribe((res: any) => {
      setUserId(res.id);
    });

    const subscription = userService.getOnlineUsers().subscribe(res => {
      setOnlineUsersMap(res);
    });

    const connectionSubscription = userService
      .getConnections()
      .subscribe(res => {
        setUsersConnections(res);
      });

    return () => {
      connectionSubscription.unsubscribe();
      subscription.unsubscribe();
      userSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let onlineUsers: ContactUser[] = [];
    let connections: ContactUser[] = [];

    usersConnections?.forEach(user => {
      if (onlineUsersMap[user.id]) {
        onlineUsers.push(user);
      } else {
        connections.push(user);
      }
    });
    setActiveUsers([...onlineUsers]);
    setInactiveUsers([...connections]);
  }, [onlineUsersMap, usersConnections]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Active Users</Text>
      <View style={{flex: 0.5}}>
        <FlatList
          data={activeUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Text style={styles.headerText}>Connected Users</Text>
      <View style={{flex: 0.5}}>
        <FlatList
          data={inactiveUsers}
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
