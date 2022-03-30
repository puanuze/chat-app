import {Subject} from 'rxjs';

export type Message = {
  content: string;
  selfSent: boolean;
};

type UserMessage = {
  [userId: string]: Message[];
};

class MessageService {
  private userMessage: UserMessage = {};
  private activeUserId: string | null = null;
  private readonly message$ = new Subject<Message[]>();

  subscribeToMessage() {
    return this.message$.asObservable();
  }

  private updateMessageObs() {
    if (this.activeUserId) {
      this.message$.next(this.userMessage[this.activeUserId] || []);
      return;
    }
    this.message$.next([]);
  }

  setActiveUserId(id: string | null) {
    this.activeUserId = id;
    this.updateMessageObs();
  }

  addMessagetoUser(userId: string, message: Message) {
    this.userMessage = {
      ...this.userMessage,
      [userId]: [...(this.userMessage[userId] ?? []), message],
    };
    this.updateMessageObs();
  }
}

export const messageService = new MessageService();