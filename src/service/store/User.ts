import {BehaviorSubject} from 'rxjs';

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
  private onlineUsers: ContactUser[] = [];
  private readonly user$ = new BehaviorSubject(this.user);
  private readonly onlineUsers$ = new BehaviorSubject(this.onlineUsers);

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
    return this.onlineUsers$.asObservable();
  }

  setUser(user: User) {
    this.user = {...user};
    this.updateUserObs();
  }

  loginUser() {
    this.user = {...this.user, isLoggedIn: true};
    this.updateUserObs();
  }

  private updateOnlineUsersObs() {
    this.onlineUsers$.next(this.onlineUsers);
  }

  setOnlineUsers(users: ContactUser[]) {
    this.onlineUsers = [...users];
    this.updateOnlineUsersObs();
  }

  addOnlineUser(user: ContactUser) {
    this.onlineUsers = [...this.onlineUsers, user];
    this.updateOnlineUsersObs();
  }

  removeOnlineUser(user: ContactUser) {
    const users: ContactUser[] = [];
    this.onlineUsers.forEach(usr => {
      if (usr.id !== user.id) {
        users.push(user);
      }
    });
    this.onlineUsers = [...users];
    this.updateOnlineUsersObs();
  }
}

export const userService = new UserService();
