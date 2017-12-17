import { themeColorsList } from './theme-colors-list';
import { Constant } from './constant';
import { colorUtil } from './color-util';

/** Contributionsの1マス１マス */
let $panel: HTMLElement;
/** Contributionsの色見本(5マス) */
let $colors: NodeList;
/** ペイント機能オンオフ切り替えボタン */
let $paintButton: HTMLInputElement;

/** ペイント機能を有効にするか */
let nowPainting = false;

init();

/**
 * 初期化処理
 */
function init() {
  cacheDom();
  addEventListener();
}

/**
 * 初期表示時に本ファイルの処理で使用するDOMをキャッシュする.
 */
function cacheDom() {
  $panel = <HTMLElement>document.querySelector('.contrib-legend');
  $colors = <NodeList>document.querySelectorAll('.legend>li');

  // ペイントボタン追加
  $paintButton = document.createElement('input');
  $paintButton.type = 'button';
  $paintButton.value = 'Start paint!';
  $panel.appendChild($paintButton);
}

/**
 * イベントリスナーを割り当てる
 */
function addEventListener() {
  // 色見本の要素をクリック時の選択済みカラー変更処理を登録
  for (let i = 0; i < $colors.length; i++) {
    const $color = <Element>$colors.item(i);
    $color.addEventListener('click', applyColor, false);
    (<HTMLElement>$color).style.cursor = 'pointer';
  }

  // テーマが変更時のUI変更処理を登録
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    const selectedThemeChange = changes[Constant.STORAGE_KEY_OF_SELECTED_THEME];
    const oldThemeColors = themeColorsList[selectedThemeChange.oldValue];
    const newThemeColors = themeColorsList[selectedThemeChange.newValue];

    applyColorOnChangeTheme(oldThemeColors, newThemeColors);
    const $target = findSelectedColor();
    if ($target) {
      setSelectedStyle($target);
    }
  });


  // ペイント開始・終了ボタンクリック時の処理登録
  $paintButton.addEventListener('click', (event: Event) => {
    resetSelected();

    if (nowPainting) {
      nowPainting = false;
      $paintButton.value = 'Start paint!';
    } else {
      nowPainting = true;
      initSelected();
      $paintButton.value = 'Stop paint';
    }
  });


  // Contributionsパネル1マス1マスをペイント時(クリック時またはクリックしながらマウスエンター時)に色を変更する処理を登録
  const $contributionList = <NodeList>document.querySelectorAll('.js-calendar-graph-svg .day');
  for (let i = 0; i < $contributionList.length; i++) {
    const $contribution = <Element>$contributionList.item(i);
    // mouseenterをデリゲートしたいのでキャプチャフェーズでイベントを監視する
    $contribution.addEventListener('mouseenter', paint);
    $contribution.addEventListener('click', paintOnClick);
  }
}


/**
 * 選択済みカラーのスタイルが設定されている色見本の要素を取得する.
 *
 * @return 選択済みカラーのスタイルが設定されている色見本. <b>見つからない場合はnull</b>.
 */
function findSelectedColor(): HTMLElement | null {
  for ( let i = 0, len = $colors.length; i < len; i++) {
    const $color = <HTMLElement>$colors[i];
    if ($color.style &&  $color.style.boxShadow) {
      return $color;
    }
  }
  return null;
}


/**
 * 指定した変更前と変更後のテーマカラーリストをもとにペイント用の色を変更する.
 *
 * @param oldThemeColors 変更前テーマカラーリスト
 * @param newThemeColors 変更後テーマカラーリスト
 */
function applyColorOnChangeTheme(oldThemeColors: Array<string>, newThemeColors: Array<string>): void {
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_COLOR, item => {
    const selectedColor = item[Constant.STORAGE_KEY_OF_SELECTED_COLOR];

    for (let i = 0, len = oldThemeColors.length; i < len; i++) {
      if (oldThemeColors[i] === selectedColor) {
        const setting: any = {};
        setting[Constant.STORAGE_KEY_OF_SELECTED_COLOR] = newThemeColors[i];
        chrome.storage.local.set(setting, () => console.log('Color Change!'));
        break;
      }
    }
  });
}


/**
 * 選択した色をペイント様の色に設定する.
 *
 * @param event イベント
 */
function applyColor(event: Event) {
  if (!nowPainting) return;

  const target = <HTMLElement> event.target;
  const rgb = target.style.backgroundColor;
  saveSelectedColor(colorUtil.rgb2hex(rgb));
  resetSelected();
  setSelectedStyle(target);
}

/**
 * Contributionsの色見本の選択状態をリセットする
 */
function resetSelected() {
  for (let i = 0; i < $colors.length; i++) {
    const color = <HTMLElement>$colors.item(i);
    color.style.boxShadow = '';
  }
}

/**
 * Contributionsの色見本の選択状態を初期化する
 * 色が選択済みの場合、その色を選択状態にする
 * 見選択の場合は一番濃い色を設定し選択状態にする
 */
function initSelected() {
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_COLOR, (item) => {
    const selectedColor = item[Constant.STORAGE_KEY_OF_SELECTED_COLOR];
    // 色がまだ選択されていない場合
    if (!selectedColor) {
      // 色見本の最右部の色を選択する
      const lastColor = <HTMLElement>$colors.item($colors.length - 1);
      setSelectedStyle(lastColor);

      const setting: any = {};
      setting[Constant.STORAGE_KEY_OF_SELECTED_COLOR] = colorUtil.rgb2hex(lastColor.style.backgroundColor);
      chrome.storage.local.set(setting, () => console.log('Color change!'));
      return;
    }

    // 色が選択されている場合
    let foundSelectedColor = false;
    for (let i = 0; i < $colors.length; i++) {
      const color = <HTMLElement>$colors.item(i);
      if (colorUtil.rgb2hex(color.style.backgroundColor) === selectedColor) {
        setSelectedStyle(color);
        foundSelectedColor = true;
        break;
      }
    }

    // 見つからない場合は前のテーマのカラーが設定されている場合なのでその場合は
    // 色見本の最右部の色を選択する
    if (!foundSelectedColor) {
      const lastColor = <HTMLElement>$colors.item($colors.length - 1);
      setSelectedStyle(lastColor);

      const setting: any = {};
      setting[Constant.STORAGE_KEY_OF_SELECTED_COLOR] = colorUtil.rgb2hex(lastColor.style.backgroundColor);
      chrome.storage.local.set(setting, () => console.log('Color change!'));
      return;
    }
  });
}

/**
 * Contributionsの色見本のうち選択した色のスタイルを選択済みに変える.
 *
 * @param target Contributionsの色見本の要素
 */
function setSelectedStyle(target: HTMLElement) {
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_THEME, item => {
    // 未設定、またはデフォルトテーマの場合は変更する必要がない
    const theme = item[Constant.STORAGE_KEY_OF_SELECTED_THEME];
    const themeColors = themeColorsList[theme];
    const lastThemeColor = themeColors[themeColors.length - 1];
    target.style.boxShadow = Constant.SELECTED_COLOR_STYLE_PREFIX + lastThemeColor;
  });
}


/**
 * 指定した色をペイント様の色として保存する.
 *
 * @param color 色の値(#FFFFFF形式)
 */
function saveSelectedColor(color: string | null) {
  if (!color) return;

  const item: any = {};
  item[Constant.STORAGE_KEY_OF_SELECTED_COLOR] = color;
  chrome.storage.local.set(item, () => console.log('Color change!'));
}


// 色をセットする
function paintOnClick(event: any) {
  if (!nowPainting) return;

  event.preventDefault();
  event.stopPropagation();

  // 1マスの要素fillに対して色を設定する
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_COLOR, item => {
    const target = <HTMLElement> event.target;
    target.setAttribute('fill', item[Constant.STORAGE_KEY_OF_SELECTED_COLOR]);
  });
}

function paint(event: any) {
  if (!nowPainting) return;

  // マウスクリック時のみpaintする
  if (!event.which) return;

  event.preventDefault();
  event.stopPropagation();

  // 1マスの要素fillに対して色を設定する
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_COLOR, item => {
    const target = <HTMLElement> event.target;
    target.setAttribute('fill', item[Constant.STORAGE_KEY_OF_SELECTED_COLOR]);
  });
}

