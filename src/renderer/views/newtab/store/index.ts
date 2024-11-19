import { observable, computed, makeObservable } from 'mobx';
import { ISettings, ITheme } from '~/interfaces';
import { getTheme } from '~/utils/themes';
import { INewsItem } from '~/interfaces/news-item';

type NewsBehavior = 'on-scroll' | 'always-visible' | 'hidden';
export type Preset = 'focused' | 'inspirational' | 'informational' | 'custom';

export class Store {
  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @observable
  public news: INewsItem[] = [];

  @observable
  private _newsBehavior: NewsBehavior = 'on-scroll';

  @computed
  public get newsBehavior() {
    return this._newsBehavior;
  }

  public set newsBehavior(value: NewsBehavior) {
    this._newsBehavior = value;

    if (value === 'always-visible') {
      this.loadNews();
    }
  }

  @computed
  public get fullSizeImage() {
    // return this.newsBehavior === 'on-scroll' || this.newsBehavior === 'hidden';
    return true;
  }

  @observable
  public image = '';

  @observable
  private _imageVisible = true;

  public set imageVisible(value: boolean) {
    this._imageVisible = value;
    if (value && this.image == '') this.loadImage();
  }

  @computed
  public get imageVisible() {
    return this._imageVisible;
  }

  @observable
  public changeImageDaily = true;

  @observable
  public topSitesVisible = true;

  @observable
  public overflowVisible = false;

  @observable
  private _preferencesContent: 'main' | 'custom' = 'main';

  public set preferencesContent(value: 'main' | 'custom') {
    this._preferencesContent = value;
    this.overflowVisible = false;
  }

  @computed
  public get preferencesContent() {
    return this._preferencesContent;
  }

  @observable
  private _dashboardSettingsVisible = false;

  public set dashboardSettingsVisible(value: boolean) {
    this._dashboardSettingsVisible = value;

    if (!value) {
      this.preferencesContent = 'main';
    }
  }

  @computed
  public get dashboardSettingsVisible() {
    return this._dashboardSettingsVisible;
  }

  @observable
  private _preset: Preset = 'inspirational';

  @computed
  public get preset() {
    return this._preset;
  }

  public set preset(value: Preset) {
    this._preset = value;

    if (['focused', 'informational', 'inspirational'].includes(value)) {
      this.topSitesVisible = true;
      this.changeImageDaily = true;
    }

    if (['focused', 'inspirational'].includes(value)) {
      this.newsBehavior = 'on-scroll';
    }

    if (['informational', 'inspirational'].includes(value)) {
      this.imageVisible = true;
    }

    if (value === 'focused') {
      this.imageVisible = false;
    } else if (value === 'informational') {
      this.newsBehavior = 'always-visible';
    }

    localStorage.setItem('preset', value);
  }

  private page = 1;
  private loaded = true;

  public constructor() {
    makeObservable(this);

    (window as any).updateSettings = (settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    };

    this.preset = localStorage.getItem('preset') as Preset;

    if (this.preset === 'custom') {
      [
        'changeImageDaily',
        'topSitesVisible',
        'imageVisible',
      ].forEach(
        (x) =>
          ((this as any)[x] =
            localStorage.getItem(x) == null
              ? (this as any)[x]
              : JSON.parse(localStorage.getItem(x))),
      );

      this.newsBehavior = localStorage.getItem('newsBehavior') as NewsBehavior;
    }

    if (this.imageVisible) {
      this.loadImage();
    }

    this.loadTopSites();
  }

  public async loadImage() {
    let url = localStorage.getItem('imageURL');
    let isNewUrl = false;

    if (this.changeImageDaily) {
      const dateString = localStorage.getItem('imageDate');

      if (dateString && dateString !== '') {
        const date = new Date(dateString);
        const date2 = new Date();
        const diffTime = Math.floor(
          (date2.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffTime > 1) {
          url = '';
          isNewUrl = true;
        }
      }
    }

    if (!url || url == '') {
      url = 'https://picsum.photos/1920/1080';
      isNewUrl = true;
    }

    fetch(url)
      .then((response) => Promise.all([response.url, response.blob()]))
      .then(([resource, blob]) => {
        this.image = URL.createObjectURL(blob);

        return resource;
      })
      .then((imgUrl) => {
        if (isNewUrl) {
          localStorage.setItem('imageURL', imgUrl);
          localStorage.setItem('imageDate', new Date().toString());
        }
      })
      .catch((e) => console.error(e));
  }

  public async updateNews() {
    const scrollPos = window.scrollY;
    const scrollMax =
      document.body.scrollHeight - document.body.clientHeight - 768;

    if (scrollPos >= scrollMax && this.loaded && this.page !== 10) {
      this.page++;
      this.loaded = false;
      try {
        await this.loadNews();
      } catch (e) {
        console.error(e);
      }
      this.loaded = true;
    }
  }

  public async loadNews() {
  }

  public async loadTopSites() {

  }
}

export default new Store();
