import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {

  public tabGroupId: number;

  public constructor() {
    super();
    this.init();
  }

  public async init() {
    const tabGroup = await this.invoke('tabgroup');

    this.tabGroupId = tabGroup.id;
  }
}

export default new Store();
