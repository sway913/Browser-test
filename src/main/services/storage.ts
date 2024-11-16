/* Copyright (c) 2021-2024 Damon Smith */

import { ipcMain, dialog } from 'electron';
import Nedb, * as Datastore from '@seald-io/nedb';
import { fileTypeFromBuffer } from 'file-type';
import * as icojs from 'parse-ico';

import { getPath } from '~/utils'; // Import getPath function from utils module
import {
  IFindOperation,
  IInsertOperation,
  IRemoveOperation,
  IUpdateOperation,
} from '~/interfaces';
import { promises } from 'fs';
import { requestURL } from '../network/request';
import * as parse from 'node-parse-bookmarks';
import { Settings } from '../models/settings';

interface Databases {
[key: string]: Nedb;
}

const convertIcoToPng = async (icoData: Buffer): Promise<ArrayBuffer> => {
  return (await icojs.parse(icoData, 'image/png'))[0].buffer;
};

const indentLength = 4;
const indentType = ' ';

export class StorageService {
  public settings: Settings;

  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
    startupTabs: null,
    permissions: null,
  };

  public favicons: Map<any, any> = new Map();

  public constructor(settings: Settings) {
    this.settings = settings;

    ipcMain.handle('storage-get', async (e, data: IFindOperation) => {
      return await this.find(data);
    });

    ipcMain.handle('storage-get-one', async (e, data: IFindOperation) => {
      return await this.findOne(data);
    });

    ipcMain.handle('storage-insert', async (e, data: IInsertOperation) => {
      return await this.insert(data);
    });

    ipcMain.handle('storage-remove', async (e, data: IRemoveOperation) => {
      return await this.remove(data);
    });

    ipcMain.handle('storage-update', async (e, data: IUpdateOperation) => {
      return await this.update(data);
    });

    ipcMain.handle('import-bookmarks', async () => {
      const dialogRes = await dialog.showOpenDialog({
        filters: [{ name: 'Bookmark file', extensions: ['html'] }],
      });

      try {
        const file = await promises.readFile(dialogRes.filePaths[0], 'utf8');
        return parse(file);
      } catch (err) {
        console.error(err);
      }

      return [];
    });


    ipcMain.handle('history-get', () => {
      return '';
    });

    ipcMain.on('history-remove', (e, ids: string[]) => {

    });

    ipcMain.handle('topsites-get', (e, count) => {

    });
  }

  public find<T>(data: IFindOperation): Promise<T[]> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].find(query, (err: any, docs: any) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  public findOne<T>(data: IFindOperation): Promise<T> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].findOne(query, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public insert<T>(data: IInsertOperation): Promise<T> {
    const { scope, item } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].insert(item, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public remove(data: IRemoveOperation): Promise<number> {
    const { scope, query, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].remove(
        query,
        { multi },
        (err: any, removed: number) => {
          if (err) reject(err);
          resolve(removed);
        },
      );
    });
  }

  public update(data: IUpdateOperation): Promise<number> {
    const { scope, query, value, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].update(
        query,
        { $set: value },
        { multi },
        (err: any, replaced: number) => {
          if (err) reject(err);
          resolve(replaced);
        },
      );
    });
  }

  public async run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key.toLowerCase());
    }
    await this.loadBookmarks();
    await this.loadFavicons();
    await this.loadHistory();
  }

  private async loadFavicons() {

  }

  private async loadHistory() {

  }

  private async loadBookmarks() {
  }

  public async removeBookmark(id: string) {

  }

  private createDatabase = (name: string) => {
    // @ts-ignore
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  };

  public addFavicon = async (url: string): Promise<string> => {
    try {
      if (!this.favicons.get(url)) {
        const res = await requestURL(url);

        if (res.statusCode === 404) {
          throw new Error('404 favicon not found');
        }

        let data = Buffer.from(res.data, 'binary');

        const type = await fileTypeFromBuffer(data);

        if (type && type.ext === 'ico') {
          data = Buffer.from(new Uint8Array(await convertIcoToPng(data)));
        }

        const str = `data:${
          (await fileTypeFromBuffer(data))?.ext
        };base64,${data.toString('base64')}`;

        await this.insert({
          scope: 'favicons',
          item: {
            url,
            data: str,
          },
        });

        this.favicons.set(url, str);

        return str;
      } else {
        return this.favicons.get(url);
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  private createBookmarkArray = (
    parentFolderId: string = null,
    first = true,
    depth = 1,
  ): string[] => {

    return [''];
  };

  public exportBookmarks = async () => {

  };
}
