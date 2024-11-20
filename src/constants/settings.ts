import { ISettings } from '~/interfaces';


export const DEFAULT_SETTINGS: ISettings = {
  theme: 'lunarwolf-light',
  darkContents: false,
  shield: true,
  multrin: true,
  animations: true,
  bookmarksBar: false,
  suggestions: true,
  themeAuto: true,
  startupBehavior: {
    type: 'empty',
  },
  warnOnQuit: false,
  version: 2,
  doNotTrack: true,
  topBarVariant: 'default',
};
