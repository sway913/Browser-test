/* Copyright (c) 2021-2024 Damon Smith */

import { session, ipcMain } from 'electron';
import { Application } from './application';
import { registerProtocol } from './models/protocol';
import { URL } from 'url';

const rimraf = require('rimraf');

const rf = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    rimraf(path, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
};

export class SessionsService {
  public view = session.fromPartition('persist:view');
  public viewIncognito = session.fromPartition('view_incognito');

  public incognitoExtensionsLoaded = false;
  public extensionsLoaded = false;

  public extensions: Electron.Extension[] = [];

  public constructor() {
    registerProtocol(this.view);
    registerProtocol(this.viewIncognito);

    this.clearCache('incognito');

    this.view.setPermissionRequestHandler(
      async (webContents, permission, callback, details) => {
        const window = Application.instance.windows.findByContentsView(
          webContents.id,
        );

        if (webContents.id !== window.viewManager.selectedId) return;

        if (permission === 'fullscreen') {
          callback(true);
        } else {
          try {
            const { hostname } = new URL(details.requestingUrl);
            let mediaTypes = '';
            if ('mediaTypes' in details) {
              mediaTypes = JSON.stringify(details.mediaTypes);
            }
          } catch (e) {
            callback(false);
          }
        }
      },
    );

    ipcMain.on('clear-browsing-data', () => {
      this.clearCache('normal');
      this.clearCache('incognito');
    });
  }

  public clearCache(session: 'normal' | 'incognito') {
    const ses = session === 'incognito' ? this.viewIncognito : this.view;

    ses.clearCache().catch((err) => {
      console.error(err);
    });

    ses.clearStorageData({
      storages: [
        'cookies',
        'filesystem',
        'indexdb',
        'localstorage',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage',
      ],
    });
  }

  public unloadIncognitoExtensions() {

  }

  // Loading extensions in an off the record BrowserContext is not supported.
  public async loadExtensions() {
    if (!process.env.ENABLE_EXTENSIONS) return;
  }

  async uninstallExtension(id: string) {

  }

  public onCreateTab = async (details: chrome.tabs.CreateProperties) => {
    const view = Application.instance.windows.list
      .find((x) => x.win.id === details.windowId)
      .viewManager.create(details, false, true);

    return view.id;
  };
}
