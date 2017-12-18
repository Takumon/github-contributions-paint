import { themeColorsList } from './theme-colors-list';
import { Constant } from './constant';
import { colorUtil } from './color-util';

init();

/**
 * 初期処理
 */
function init() {
  // 初回はGithubのテーマからの変更
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_THEME, item => {
    // 未設定の場合デフォルトテーマをセットする
    const theme = item[Constant.STORAGE_KEY_OF_SELECTED_THEME];
    if (!theme) {
      const item: any = {};
      item[Constant.STORAGE_KEY_OF_SELECTED_THEME] = Constant.DEFAULT_THEME;
      chrome.storage.local.set(item);
    }

    // デフォルトテーマの場合は変更する必要がないためなにもしない
    if (Constant.DEFAULT_THEME === theme) return;

    changeTheme(Constant.DEFAULT_THEME, theme);
  });

  // 設定が変わったら随時UIに適用
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    const storageChange = changes[Constant.STORAGE_KEY_OF_SELECTED_THEME];
    changeTheme(storageChange.oldValue, storageChange.newValue);
  });
}


/**
 * テーマ変更時にUIに反映する.
 *
 * @param oldTheme 変更前テーマ名
 * @param newTheme 変更後テーマ名
 */
function changeTheme(oldTheme: string, newTheme: string) {
  const oldThemeColors = themeColorsList[oldTheme];
  const newThemeColors = themeColorsList[newTheme];

  applyColorToRects(oldThemeColors, newThemeColors);
  applyColorToLegend(newThemeColors);
  setTimeout(() => { applyColorToProgressBar(oldThemeColors, newThemeColors); }, 1000);
}


/**
 * Contributionsパネルの1マス１マスに新しいテーマを適用する.
 *
 * @param oldThemeColors 変更前テーマの色リスト
 * @param newThemeColors 変更後テーマの色リスト
 */
function applyColorToRects(oldThemeColors: string[], newThemeColors: string[]) {
  const $rects = document.getElementsByTagName('rect');

  for (let i = 0, l = $rects.length; i < l; i++) {
    const $rect = $rects[i];
    const fill = $rect.getAttribute('fill');
    // 変更前テーマと同じindexの変更後テーマの色を適用する
    for (let x = 0, y = oldThemeColors.length; x < y; x++) {
      if (fill === oldThemeColors[x]) {
        $rect.setAttribute('fill', newThemeColors[x]);
      }
    }
  }
}


/**
 * Contributionsパネル右下にある色見本に新しいテーマを適用する.
 *
 * @param newThemeColors 変更後テーマの色リスト
 */
function applyColorToLegend(newThemeColors: string[]) {
  const doc = document.getElementsByClassName('legend');
  if (!doc[0]) return;

  const lis = doc[0].getElementsByTagName('li');

  for (let i = 1, l = lis.length; i < l; i++) {
    lis[i].style.backgroundColor = newThemeColors[i];
  }
}

/**
 * プログレスバーに新しいテーマを適用する.
 *
 * @param oldThemeColors 変更前テーマの色リスト
 * @param newThemeColors 変更後テーマの色リスト
 */
function applyColorToProgressBar(oldThemeColors: string[], newThemeColors: string[]) {
  const progress = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('progress-bar');

  for (let i = 0, l = progress.length; i < l; i++) {
    let backgroundColor = colorUtil.rgb2hex(progress[i].style.backgroundColor);
    // 変更前テーマと同じindexの変更後テーマの色を適用する
    for (let x = 0, y = oldThemeColors.length; x < y; x++) {
      if (backgroundColor === oldThemeColors[x]) {
        progress[i].style.backgroundColor = newThemeColors[x];
      }
    }
  }
}

