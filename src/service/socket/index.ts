import {io} from 'socket.io-client';
import {userService, ContactUser, messageService} from '../store';

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

socket.on('user connected', user => {
  userService.addOnlineUser(user);
});

socket.on('user disconnected', user => {
  userService.removeOnlineUser(user);
});

socket.on('private message', ({content, from}) => {
  messageService.addMessagetoUser(from, {content, selfSent: false});
});

export default socket;
