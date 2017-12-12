// GithubのContributesパネルの1マスをクリックした場合

  // 1マス1マスに対してクリック時に色を変える
  const $contributionPanel = <Element>document.querySelector('.js-calendar-graph-svg');
  if ($contributionPanel) {
    // mouseenterをデリゲートしたいのでキャプチャフェーズでイベントを監視する
    $contributionPanel.addEventListener('mouseenter', setColor, true);
  }

  // 色をセットする
  function setColor(event: any) {
    if (!event.shiftKey) return;

    event.preventDefault();
    event.stopPropagation();

    // 1マスの要素fillに対して色を設定する
    chrome.storage.sync.get('curColor', item => {
      const target = <HTMLElement> event.target;
      target.setAttribute('fill', item.curColor);
    });
    return false;
  }

