import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { configureUI } from '~/common/renderer-config';

export const renderUI = (Component: any) => {
  window.ipcRenderer.setMaxListeners(0);
  configureUI();

  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
