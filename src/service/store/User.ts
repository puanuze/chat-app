import {BehaviorSubject} from 'rxjs';
import {messageService} from './Message';

type User = {
  id: string;
  username: string;
  sessionId: string;
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

  setConnections(users: ContactUser[]) {
    let connectionMap: any = {};
    users?.forEach(user => {
      messageService.addMessagetoUser(user.id, [] as any);
      connectionMap[user.id] = true;
    });
    this.setConnections(connectionMap);

    this.connections = [...users];
    this.connections$.next(this.connections);
  }

  addConnection(user: ContactUser) {
    this.userConnectionMap = {...this.userConnectionMap, [user.id]: true};
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
    if (!messageService.userHasConversation(userId)) {
      userService.removeConnection(userId);
    }
    this.updateOnlineUsersObs();
  }
}

export const userService = new UserService();
