import { observer } from 'mobx-react-lite';
import * as React from 'react';

import store from '../../store';
import { Tabbar } from '../Tabbar';
import { platform } from 'os';
import { WindowsControls } from 'react-windows-controls';
import { StyledTitlebar, FullscreenExitButton } from './style';

const onCloseClick = () => window.ipcRenderer.send(`window-close-${store.windowId}`);

const onMaximizeClick = () =>
  window.ipcRenderer.send(`window-toggle-maximize-${store.windowId}`);

const onMinimizeClick = () =>
  window.ipcRenderer.send(`window-minimize-${store.windowId}`);

const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

};


export const Titlebar = observer(() => {
  return (
    <StyledTitlebar
      onMouseDown={onMouseDown}
    >
      <Tabbar />
      {platform() !== 'darwin' &&
        (store.isFullscreen ? (
          <FullscreenExitButton
            style={{
              height: store.isCompact ? '100%' : 32,
            }}
            theme={store.theme}
          />
        ) : (
          <WindowsControls
            style={{
              height: store.isCompact ? '100%' : 32,
              WebkitAppRegion: 'no-drag',
              marginLeft: 8,
            }}
            onClose={onCloseClick}
            onMinimize={onMinimizeClick}
            onMaximize={onMaximizeClick}
            dark={store.theme['toolbar.lightForeground']}
          />
        ))}
    </StyledTitlebar>
  );
});
