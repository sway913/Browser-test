/* Copyright (c) 2021-2024 Damon Smith */

import store from '../store';

export const isDialogVisible = async (dialog: string) =>
  await window.ipcRenderer.invoke(`is-dialog-visible-${store.windowId}`, dialog);
