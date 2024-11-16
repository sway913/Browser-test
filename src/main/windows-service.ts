/* Copyright (c) 2021-2024 Damon Smith */

import { AppWindow } from './windows/app';
import { app, BrowserWindow, ipcMain } from 'electron';
import { SessionsService } from './sessions-service';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  public lastFocused: AppWindow;

  constructor(sessions: SessionsService) {

  }

  public open(incognito = false) {
    const window = new AppWindow(incognito);
    this.list.push(window);

    window.win.on('focus', () => {
      this.lastFocused = window;
    });

    return window;
  }

  public findByContentsView(webContentsId: number) {
    return this.list.find((x) => !!x.viewManager.views.get(webContentsId));
  }

  public fromBrowserWindow(browserWindow: BrowserWindow) {
    return this.list.find((x) => x.id === browserWindow.id);
  }

  public broadcast(channel: string, ...args: unknown[]) {
    this.list.forEach((appWindow) =>
      appWindow.win.webContents.send(channel, ...args),
    );
  }
}
