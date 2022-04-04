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
    if (user.id === (socket.auth as any).userId) {
      return;
    }
    onlineUsersMap[user.id] = true;
    if (!userService.isUserConnected(user.id)) {
      userService.addConnection(user);
    }
  });

  userService.setOnlineUsers(onlineUsersMap);
});

socket.on('session', ({userId, username}) => {
  AsyncStorage.setItem('user-session', JSON.stringify({id: userId, username}));
  userService.setUser({
    id: userId,
    username,
    isLoggedIn: true,
  });
});

socket.on('user connected', user => {
  userService.addOnlineUser(user);
});

socket.on('user disconnected', user => {
  userService.removeOnlineUser(user.id);
});

socket.on('private message', (message: Message) => {
  if (!userService.isUserConnected(message.sender)) {
    socket.emit('interaction', {
      userId: (socket.auth as any).userId,
      targetUserId: message.sender,
      isInitialization: true,
    });
    if (!userService.isUserOnline(message.sender)) {
      fetch(`${SERVER_URL}/api/user/${message.sender}`)
        .then(res => res.json())
        .then(res => {
          const user = res.data;
          userService.addConnection(user);
        });
    }
    userService.addUserConnection(message.sender);
  }
  messageService.addMessagetoUser(message.sender, message);
});

socket.on('interaction', async ({userId, lastInteractionTime}: any) => {
  if (!userId && !lastInteractionTime) {
    return;
  }
  if (!userService.isUserConnected(userId)) {
  }

  messageService.setUserInteraction(userId, new Date(lastInteractionTime));
});

export default socket;
