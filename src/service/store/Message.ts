import {Subject} from 'rxjs';

export type Message = {
  content: string;
  sender: string;
  createdAt: string;
  to: string;
};

type UserMessage = {
  [userId: string]: [{title: string; data: Message[]}];
};

type UserInteraction = {
  [userId: string]: Date;
};

class MessageService {
  private userMessage: UserMessage = {};
  private interactions: UserInteraction = {};
  private activeUserId: string | null = null;
  private readonly userInteraction$ = new Subject<Date | null>();
  private readonly message$ = new Subject<[{title: string; data: Message[]}]>();

  subscribeToMessage() {
    return this.message$.asObservable();
  }

  subscribeToUserInteraction() {
    return this.userInteraction$.asObservable();
  }

  private updateMessageObs() {
    if (this.activeUserId) {
      this.message$.next(this.userMessage[this.activeUserId] || []);
      return;
    }
    this.message$.next([] as any);
  }

  setActiveUserId(id: string | null) {
    this.activeUserId = id;
    this.updateMessageObs();
    if (id && this.interactions[id]) {
      this.userInteraction$.next(this.interactions[id]);
      return;
    }
    this.userInteraction$.next(null);
  }

  setMessageForUser(userId: string, messages: Message[]) {
    const messageSection: any = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!messageSection[date]) {
        messageSection[date] = [message];
      } else {
        messageSection[date].push(message);
      }
    });

    const userMessage: any = [];

    Object.keys(messageSection).forEach(item => {
      userMessage.push({title: item, data: messageSection[item]});
    });

    this.userMessage = {
      ...this.userMessage,
      [userId]: userMessage,
    };
    this.updateMessageObs();
  }

  addMessagetoUser(userId: string, message: Message) {
    const msgDate = new Date(message.createdAt).toDateString();
    let messageSection: any = [];
    if (msgDate === this.userMessage[userId][0]?.title) {
      const messages = [message, ...this.userMessage[userId][0].data];
      messageSection = [{title: msgDate, data: messages}];
    }

    this.userMessage = {
      ...this.userMessage,
      [userId]: messageSection,
    };
    this.updateMessageObs();
  }

  setUserInteraction(userId: string, lastInteractionTime: Date) {
    this.interactions = {
      ...this.interactions,
      [userId]: lastInteractionTime,
    };

    if (this.activeUserId === userId) {
      this.userInteraction$.next(lastInteractionTime);
    }
  }
}

export const messageService = new MessageService();
