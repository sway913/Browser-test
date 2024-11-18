/* Copyright (c) 2021-2024 Damon Smith */

import { configure } from 'mobx';

export const configureUI = () => {
  configure({ enforceActions: 'never' });
};

export const configureRenderer = () => {

};
