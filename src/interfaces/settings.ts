export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
}

export type TopBarVariant = 'default' | 'compact';

export interface ISettings {
  hardwareacceleration: boolean;
  invisibleTabs: any;
  theme: string;
  themeAuto: boolean;
  shield: boolean;
  multrin: boolean;
  notnew: boolean;
  httpsEnforce: boolean;
  animations: boolean;
  bookmarksBar: boolean;
  suggestions: boolean;
  newtab: {
    news: boolean;
    weather: boolean;
  };
  startupBehavior: IStartupBehavior;
  warnOnQuit: boolean;
  version: number;
  darkContents: boolean;
  downloadsDialog: boolean;
  downloadsPath: string;
  ignoreCertificate: boolean;
  autoplay: boolean;
  doNotTrack: boolean;
  topBarVariant: TopBarVariant;
  globalPrivacyControl: boolean;
}
