export type Navigation = {
  navigate: (scene: string, params?: {[key: string]: any}) => void;
};
