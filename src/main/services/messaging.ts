/* Copyright (c) 2021-2024 Damon Smith */

import { ipcMain } from 'electron';

import { AppWindow } from '../windows';
import { Application } from '../application';
import { showTabGroupDialog } from '../dialogs/tabgroup';

export const runMessagingService = (appWindow: AppWindow) => {
  const { id } = appWindow;

  ipcMain.on(`window-focus-${id}`, () => {
    appWindow.win.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on(`window-toggle-maximize-${id}`, () => {
    if (appWindow.win.isMaximized()) {
      appWindow.win.unmaximize();
    } else {
      appWindow.win.maximize();
    }
  });

  ipcMain.on(`window-minimize-${id}`, () => {
    appWindow.win.minimize();
  });

  ipcMain.on(`window-close-${id}`, () => {
    appWindow.win.close();
  });

  ipcMain.on(`window-fix-dragging-${id}`, () => {
    appWindow.fixDragging();
  });

  ipcMain.on(`show-menu-dialog-${id}`, (e, x, y) => {
  });

  ipcMain.on(`search-show-${id}`, (e, data) => {

  });

  ipcMain.handle(`is-dialog-visible-${id}`, (e, dialog) => {
    return Application.instance.dialogs.isVisible(dialog);
  });

  ipcMain.on(`find-show-${id}`, () => {

  });

  ipcMain.on(`find-in-page-${id}`, () => {
    appWindow.send('find');
  });

  ipcMain.on(`show-downloads-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-menu_extra-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-zoom-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-tabgroup-dialog-${id}`, (e, tabGroup) => {
    showTabGroupDialog(appWindow.win, tabGroup);
  });

  ipcMain.on(`edit-tabgroup-${id}`, (e, tabGroup) => {
    appWindow.send(`edit-tabgroup`, tabGroup);
  });

  ipcMain.on(`is-incognito-${id}`, (e) => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(`show-incognitoMenu-dialog-${id}`, (e, x, y) => {
  });
};
