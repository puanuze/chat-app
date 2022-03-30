import {BehaviorSubject} from 'rxjs';

class UserService {
  private user = {isLoggedIn: false};
  private readonly user$ = new BehaviorSubject(this.user);

  getUser() {
    return this.user$.asObservable();
  }

  private setUser() {
    this.user$.next(this.user);
  }

  loginUser() {
    this.user = {...this.user, isLoggedIn: true};
    this.setUser();
  }
}

const userService = new UserService();
export default userService;
