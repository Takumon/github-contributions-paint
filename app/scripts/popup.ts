/**
 * 初期ロード時の処理
 */
document.addEventListener('DOMContentLoaded', () => {
  // corColorが変わった時に、入力項目に反映させる
  chrome.storage.onChanged.addListener((changes, namespace) => {
    chrome.storage.sync.get('curColor', function(item) {
        const $colorInput = <HTMLInputElement>document.getElementById('colorInput');
        if ($colorInput) {
          $colorInput.value = item.curColor;
        }
    });
  });


  // 入力項目に色が指定された場合にそれをcurColorに設定する
  const $colorInput = <HTMLInputElement>document.getElementById('colorInput');
  $colorInput.addEventListener('input', function() {
    setSelectedColor($colorInput.value);
  });

  // curColorを入力項目の値に初期値として設定する
  chrome.storage.sync.get('curColor', (item) => {
      const $colorInput = <HTMLInputElement>document.getElementById('colorInput');
      $colorInput.value = item.curColor;
  });

  const $colors = document.querySelectorAll('.color');
  for (let i = 0; i < $colors.length; i++) {
      $colors[i].addEventListener('click', onClick);
  }
});

// Colorがクリック時の処理
function onClick(event: Event) {
  const target = <HTMLElement> event.target;
  setSelectedColor(target.getAttribute('data-id'));
}


/**
 * 色変更
 *
 * @param color 色
 */
function setSelectedColor(color: string | null) {
  if (!color) return;

  chrome.storage.sync.set({ 'curColor': color }, () => console.log('Color changed'));
}