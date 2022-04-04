import {BehaviorSubject} from 'rxjs';
import {messageService} from './Message';

export type User = {
  id: string;
  username: string;
  isLoggedIn: boolean;
};

export type ContactUser = {
  id: string;
  username: string;
};

class UserService {
  private user: User = {isLoggedIn: false} as User;
  private onlineUsersMap: {[id: string]: boolean} = {};
  private userConnectionMap: {[id: string]: boolean} = {};
  private connections: ContactUser[] = [];
  private readonly user$ = new BehaviorSubject(this.user);
  private readonly connections$ = new BehaviorSubject(this.connections);
  private readonly onlineUsersMap$ = new BehaviorSubject(this.onlineUsersMap);

  getUser() {
    return this.user$.asObservable();
  }

  getUserId() {
    return this.user.id;
  }

  private updateUserObs() {
    this.user$.next(this.user);
  }

  getOnlineUsers() {
    return this.onlineUsersMap$.asObservable();
  }

  setUser(user: User) {
    this.user = {...user};
    this.updateUserObs();
  }

  isUserConnected(userId: string) {
    return this.userConnectionMap[userId];
  }

  isUserOnline(userId: string) {
    return this.onlineUsersMap[userId];
  }

  setConnections(users: ContactUser[]) {
    let connectionMap: any = {};
    users?.forEach(user => {
      connectionMap[user.id] = true;
    });
    this.setUserConnection(connectionMap);
    this.connections = [...users];
    this.connections$.next(this.connections);
  }

  addConnection(user: ContactUser) {
    this.connections = [...this.connections, user];
    this.connections$.next(this.connections);
  }

  removeConnection(userId: string) {
    const {[userId]: omit, ...res} = this.userConnectionMap;
    this.userConnectionMap = {...res};
    const newConnections = this.connections.filter(
      connection => connection.id !== userId,
    );
    this.connections = [...newConnections];
    this.connections$.next(this.connections);
  }

  getConnections() {
    return this.connections$.asObservable();
  }

  setUserConnection(userConnection: {[id: string]: boolean}) {
    this.userConnectionMap = {...userConnection};
  }

  addUserConnection(userId: string) {
    this.userConnectionMap = {...this.userConnectionMap, [userId]: true};
  }

  loginUser() {
    this.user = {...this.user, isLoggedIn: true};
    this.updateUserObs();
  }

  private updateOnlineUsersObs() {
    this.onlineUsersMap$.next(this.onlineUsersMap);
  }

  setOnlineUsers(users: {[id: string]: boolean}) {
    this.onlineUsersMap = {
      ...users,
    };
    this.updateOnlineUsersObs();
  }

  addOnlineUser(user: ContactUser) {
    this.onlineUsersMap = {...this.onlineUsersMap, [user.id]: true};
    this.updateOnlineUsersObs();
    if (!this.userConnectionMap[user.id]) {
      this.addConnection({id: user.id, username: user.username});
    }
  }

  removeOnlineUser(userId: string) {
    this.onlineUsersMap = {...this.onlineUsersMap, [userId]: false};
    if (!this.userConnectionMap[userId]) {
      userService.removeConnection(userId);
    }
    this.updateOnlineUsersObs();
  }
}

export const userService = new UserService();
