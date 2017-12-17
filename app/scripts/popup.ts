import { Constant } from './constant';

let $status: HTMLElement;
let $color: HTMLInputElement;
let $saveBtn: HTMLElement;

document.addEventListener('DOMContentLoaded', init);

/**
 * 初期化処理
 */
function init() {
  cacheDom();
  $color.addEventListener('change', saveTheme, false);
  restoreOptions();
}

/**
 * 初期表示時に本ファイルの処理で使用するDOMをキャッシュする.
 */
function cacheDom() {
  $status = <HTMLElement>document.getElementById('status');
  $color = <HTMLInputElement>document.getElementById('color');
  $saveBtn = <HTMLElement>document.getElementById('save');
}


/**
 * テーマを選択しストレージに保存する.
 */
function saveTheme() {
  const item: any = {};
  item[Constant.STORAGE_KEY_OF_SELECTED_THEME] = $color.value;
  chrome.storage.local.set(item, () => {
    $status.textContent = '設定を保存しました。';

    setTimeout(() => $status.textContent = '', 1000);
  });
}

/**
 * プルダウンに選択済みテーマを設定する.
 */
function restoreOptions() {
  chrome.storage.local.get(Constant.STORAGE_KEY_OF_SELECTED_THEME, item => {
    $color.value = item[Constant.STORAGE_KEY_OF_SELECTED_THEME] || Constant.DEFAULT_THEME;
  });
}
