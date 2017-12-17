/**
 * CSSの色の値を操作するユーティル.
 */
class ColorUtil {
  /** CSSでRGBで色指定する場合の値の正規表現 */
  private static RGB_COLOR_PATTERN = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;

  /**
   * RGBで指定された色の値を#FFFFFF形式に変換する.
   *
   * @param rgb RGBで指定された色の値
   * @return #FFFFFF形式の色の値
   */
  rgb2hex(rgb: string | null ) {
    if (!rgb) return rgb;

    const matchArray = rgb.match(ColorUtil.RGB_COLOR_PATTERN);
    if (!matchArray || matchArray.length !== (3 + 1)) return rgb;

    return '#' + this.hex( matchArray[1]) + this.hex(matchArray[2]) + this.hex(matchArray[3]);
  }

  private hex( x: string) {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  }
}

export const colorUtil = new ColorUtil();
