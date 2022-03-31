import AsyncStorage from '@react-native-community/async-storage';
import {io} from 'socket.io-client';
import {userService, ContactUser, messageService, Message} from '../store';

const URL = 'http://192.168.1.80:5000';

const socket = io(URL, {
  autoConnect: false,
});

socket.on('users', (users: ContactUser[]) => {
  let userList: ContactUser[] = [];
  let activeUsers: ContactUser[] = [];

  userList = users.sort((a, b) => {
    if (a.username < b.username) return -1;
    return a.username > b.username ? 1 : 0;
  });

  userList.forEach(user => {
    if (user.id !== socket.id) {
      activeUsers.push(user);
    }
  });

  userService.setOnlineUsers(activeUsers);
});

socket.on('session', ({sessionId, userId, username}) => {
  AsyncStorage.setItem(
    'user-session',
    JSON.stringify({sessionId, userId, username}),
  );
  userService.setUser({
    id: userId,
    sessionId,
    username,
    isLoggedIn: true,
  });
});

socket.on('user connected', user => {
  userService.addOnlineUser(user);
});

socket.on('user disconnected', user => {
  userService.removeOnlineUser(user);
});

socket.on('private message', (message: Message) => {
  messageService.addMessagetoUser(message.sender, message);
});

export default socket;
