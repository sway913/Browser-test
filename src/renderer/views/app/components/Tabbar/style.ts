import styled, { css } from 'styled-components';
import {
  TOOLBAR_BUTTON_WIDTH,
} from '~/constants/design';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  align-items: center;
  margin-right: 32px;
  display: flex;
  margin-left: 4px;
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  position: relative;
  overflow: hidden;
  overflow-x: overlay;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 0px;
    display: none;
    background-color: transparent;
    opacity: 0;
  }
`;
