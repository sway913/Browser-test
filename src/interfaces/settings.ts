export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
}

export type TopBarVariant = 'default' | 'compact';

export interface ISettings {
  theme: string;
  themeAuto: boolean;
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  startupBehavior: IStartupBehavior;
  warnOnQuit: boolean;
  version: number;
  darkContents: boolean;
  topBarVariant: TopBarVariant;
}
