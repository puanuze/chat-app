import AsyncStorage from '@react-native-community/async-storage';
import {io} from 'socket.io-client';
import {SERVER_URL} from '../../config';
import {userService, ContactUser, messageService, Message} from '../store';

const socket = io(SERVER_URL, {
  autoConnect: false,
});

socket.on('users', (users: ContactUser[]) => {
  let onlineUsersMap: {[id: string]: boolean} = {};
  users?.forEach(user => {
    onlineUsersMap[user.id] = true;
    if (!userService.isUserConnected(user.id)) {
      userService.addConnection(user);
    }
  });

  userService.setOnlineUsers(onlineUsersMap);
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
  if (!userService.isUserConnected(user.id)) {
    userService.addConnection(user);
  }
  userService.addOnlineUser(user);
});

socket.on('user disconnected', user => {
  userService.removeOnlineUser(user.id);
});

socket.on('private message', (message: Message) => {
  messageService.addMessagetoUser(message.sender, message);
});

socket.on('interaction', async ({userId, lastInteractionTime}: any) => {
  if (!userId && !lastInteractionTime) {
    return;
  }
  messageService.setUserInteraction(userId, new Date(lastInteractionTime));
});

export default socket;
