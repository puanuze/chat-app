import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';

const Item = ({id, name, onPress}: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.title}>{name}</Text>
  </TouchableOpacity>
);

export const ContactScreen = ({navigation}: any) => {
  const renderItem = ({item}: any) => (
    <Item
      id={item.id}
      name={item.name}
      onPress={() =>
        navigation.navigate('Conversation', {id: item.id, name: item.name})
      }
    />
  );
  const [users, setUsers] = useState<{id: string; name: string}[]>([
    {id: '123', name: 'User 1'},
  ]);

  return (
    <FlatList
      style={styles.container}
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  item: {
    padding: 20,
  },
  title: {
    fontSize: 18,
  },
});
