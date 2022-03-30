import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';

export const ChatHeader = ({name, onBackPress}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <IconButton icon="arrow-left" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <TouchableOpacity>
          <View>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.onlineStatus}>{'Online'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#8250df',
    paddingBottom: 10,
  },
  profileOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 65,
    width: 65,
    borderRadius: 32.5,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineStatus: {
    color: 'white',
    fontSize: 14,
  },
});
