const btn = document.createElement('input');
btn.type = 'button';
btn.value = 'Start paint!';
let on = false;

const panel = <HTMLElement>document.querySelector('.contrib-legend.text-gray');
panel.appendChild(btn);
btn.addEventListener('click', (event: Event) => {
  resetSelected();

  if (on) {
    on = false;
    btn.value = 'Start paint!';
  } else {
    on = true;
    initSelected();
    btn.value = 'Stop paint';
  }
});

// Contributionsの色見本を色選択ボタンとする
const $colors = <NodeList>document.querySelectorAll('.legend>li');

for (let i = 0; i < $colors.length; i++) {
  const $color = <Element>$colors.item(i);
  $color.addEventListener('click', selectColor, false);
  (<HTMLElement>$color).style.cursor = 'pointer';
}



function selectColor(event: Event) {
  if (!on) return;

  const target = <HTMLElement> event.target;
  selectedColor(target.style.backgroundColor);
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
  chrome.storage.sync.get('curColor', (item) => {
    // 色がまだ選択されていない場合
    if (!item.curColor) {
      const lastColor = <HTMLElement>$colors.item($colors.length - 1);
      setSelectedStyle(lastColor);
      chrome.storage.sync.set({ 'curColor': lastColor.style.backgroundColor }, () => console.log('Color changed'));
      return;
    }

    // 色が選択されている場合
    for (let i = 0; i < $colors.length; i++) {
      const color = <HTMLElement>$colors.item(i);
      if (color.style.backgroundColor === item.curColor) {
        setSelectedStyle(color);
        break;
      }
    }
  });
}

/**
 * Contributionsの色見本のうち選択した色のスタイルを選択済みに変える
 *
 * @param target Contributionsの色見本の要素
 */
function setSelectedStyle(target: HTMLElement) {
  target.style.boxShadow = '0 0 1px 3px #46b372';
}


/**
 * 色変更
 *
 * @param color 色
 */
function selectedColor(color: string | null) {
  if (!color) return;

  chrome.storage.sync.set({ 'curColor': color }, () => console.log('Color changed'));
}



// 1マス1マスに対してクリック時に色を変える
const $contributionList = <NodeList>document.querySelectorAll('.js-calendar-graph-svg .day');
for (let i = 0; i < $contributionList.length; i++) {
  const $contribution = <Element>$contributionList.item(i);
  // mouseenterをデリゲートしたいのでキャプチャフェーズでイベントを監視する
  $contribution.addEventListener('mouseenter', paint);
  $contribution.addEventListener('click', paintOnClick);
}

// 色をセットする
function paintOnClick(event: any) {
  if (!on) return;

  event.preventDefault();
  event.stopPropagation();

  // 1マスの要素fillに対して色を設定する
  chrome.storage.sync.get('curColor', item => {
    const target = <HTMLElement> event.target;
    target.setAttribute('fill', item.curColor);
  });
}

function paint(event: any) {
  if (!on) return;

  // マウスクリック時のみpaintする
  if (!event.which) return;

  event.preventDefault();
  event.stopPropagation();

  // 1マスの要素fillに対して色を設定する
  chrome.storage.sync.get('curColor', item => {
    const target = <HTMLElement> event.target;
    target.setAttribute('fill', item.curColor);
  });
}

