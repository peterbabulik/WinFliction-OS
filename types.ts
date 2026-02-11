
export enum SystemState {
  BOOTING = 'BOOTING',
  DESKTOP = 'DESKTOP',
  UPDATING = 'UPDATING',
  RESTARTING = 'RESTARTING',
  RECOVERY = 'RECOVERY',
  SHUTDOWN = 'SHUTDOWN'
}

export interface WindowApp {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  type: 'DOC' | 'BROWSER' | 'SETTINGS' | 'CALCULATOR' | 'NOTEPAD' | 'FILE_EXPLORER' | 'TERMINAL' | 'GAMES' | 'TRASH' | 'MAIL' | 'PHOTOS';
}

export interface Ad {
  id: string;
  title: string;
  content: string;
  top: number;
  left: number;
}
