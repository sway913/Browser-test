import * as ReactDOM from 'react-dom';
import * as React from 'react';

export const renderUI = (Component: any) => {
  window.ipcRenderer.setMaxListeners(0);

  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
