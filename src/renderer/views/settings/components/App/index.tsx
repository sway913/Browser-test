/* Copyright (c) 2021-2024 Damon Smith */

import * as React from 'react';
import { observer } from 'mobx-react-lite';
import store from '../../store';
import { Button } from '~/renderer/components/Button';
import { ThemeProvider } from 'styled-components';
import { OnStartup } from '../Startup';
import { Content, LeftContent, Container } from '~/renderer/components/Pages';
import { WebUIStyle } from '~/renderer/mixins/default-styles';

export const NormalButton = ({
  children,
  onClick,
}: {
  children?: any;
  onClick?: any;
}) => {
  return (
    <Button
      background={
        store.theme['dialog.lightForeground']
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.08)'
      }
      onClick={onClick}
      foreground={store.theme['dialog.lightForeground'] ? 'white' : 'black'}
    >
      {children}
    </Button>
  );
};

export default observer(() => {
  const { selectedSection } = store;

  let dialogTitle = '';

  if (store.dialogContent === 'edit-search-engine') {
    dialogTitle = 'Edit search engine';
  } else if (store.dialogContent === 'add-search-engine') {
    dialogTitle = 'Add search engine';
  }

  return (
    <ThemeProvider
      theme={{ ...store.theme, dark: store.theme['pages.lightForeground'] }}
    >
      <Container
        onMouseDown={(e) => (store.dialogVisible = false)}
        darken={store.dialogVisible}
      >
        <WebUIStyle />
        <Content>
          <LeftContent style={{ maxWidth: 800, marginTop: 56 }}>
            {selectedSection === 'startup' && <OnStartup />}
          </LeftContent>
        </Content>
      </Container>
    </ThemeProvider>
  );
});
