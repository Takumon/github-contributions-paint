/**
 * アプリ全体で使用する定数をまとめたクラス
 */
export class Constant {
  /** ストレージキー名：選択済みテーマ */
  static STORAGE_KEY_OF_SELECTED_THEME = 'selectedTheme';

  /** 選択済みテーマのデフォルト */
  static DEFAULT_THEME = 'github';

  /** ストレージキー名：選択済みの色（お絵描き用） */
  static STORAGE_KEY_OF_SELECTED_COLOR = 'selectedColor';

  /** ペイント時に選択した色の色見本に指定するスタイルのプレフィックス(テーマによってbackgroundの色は変えるのでプレフィックス) */
  static SELECTED_COLOR_STYLE_PREFIX = '0 0 1px 3px ';
}
