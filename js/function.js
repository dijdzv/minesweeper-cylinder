/* 関数名
squareSize : squareのサイズ
flagCount : flagの数
displayRankingTable : 表示するランキングテーブルを選択
gameEnd : ゲーム終了時の処理
gameEndAnimation : ゲーム終了時のアニメーション
allExplode : 全部爆破する
explodeSearch : 周囲8マスから爆破していないところを爆破する
gameClear : ゲームクリア時の処理
checkClear : クリアチェック
countMine : 周囲8マスの地雷の数を数える
autoOpenSearch : 周囲8マスから自動オープンで開けるマスを探す
autoOpen : autoOpenSearchで探したところを開ける
btnOpen : openボタンでランダムにマスを開ける
timePassed : ゲームの経過時間
checkForm : formのチェック(サニタイズや空白処理など)
rotateMouseMove : 対象を回転させる(マウス、タッチパッド)
rotateTouchMove : 対象を回転させる(スマホ、スワイプ)
addTimeAnime : 自動オープンペナルティの追加時間のアニメーション
elapsedTimeFontSize: 経過時間のフォントサイズを調整;

*/

//関数置場-----------------------------------------------------------------------------
function squareSize(i) {
  square[i].style.width = `${540 / scaleVal}px`;
  square[i].style.height = `${540 / scaleVal}px`;
  square[i].style.fontSize = `${28.8 / scaleVal}rem`;
  square[i].style.lineHeight = `${540 / scaleVal}px`;
  square[i].style.borderWidth = `${10 / scaleVal}px`;
  if (i % (scaleVal * 2) === 0) {
    square[i].style.width = `${545 / scaleVal}px`
    square[i].style.height = `${545 / scaleVal}px`
  }
}

function flagCount() {
  const flag = document.querySelectorAll('.flag');
  const flagCount = document.getElementById('flagCount');
  flagCount.textContent = flag.length;
}

function displayRankingTable() {
  const rankingTable = document.getElementsByClassName('rankingTable');

  if (document.querySelectorAll('.displayRankingTable')[0]) {
    document.querySelectorAll('.displayRankingTable')[0].classList.remove('displayRankingTable');
  }
  rankingTable[degreeOfDifficultyI + scaleI * 3].classList.add('displayRankingTable');
}

function gameEnd() {
  gameEndAnimation().then(() => {
    const gameEnd = document.getElementById('gameEnd');
    gameEnd.style.display = 'block';
    gameEnd.addEventListener('click', () => {
      window.location.reload();
    });
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.location.reload();
      }
    });
  });
}

function gameEndAnimation() {
  return new Promise((resolve) => {
    const squareList = Array.from(square);
    const index = squareList.findIndex((testList) => testList.classList.contains('explodeMine'));
    explodeSearch(index);
    let squareNum = scaleVal ** 2 * 2;
    let endTimer = window.setInterval(() => {
      if (document.querySelectorAll('.explodeMine').length === squareNum) {
        window.clearInterval(endTimer);
        resolve();
      }
    }, 200)
  });
}

function allExplode(i) {
  square[i].classList.remove('flag');
  square[i].classList.add('explodeMine');
  square[i].textContent = '';
  window.setTimeout(() => {
    explodeSearch(i);
  }, 100)
}

async function explodeSearch(i) {
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== 0
    && !square[i - (scaleVal * 2) - 1].classList.contains('explodeMine')) { //左上
    allExplode(i - (scaleVal * 2) - 1);
  }
  if (i / (scaleVal * 2) >= 1
    && !square[i - (scaleVal * 2)].classList.contains('explodeMine')) { //上
    allExplode(i - (scaleVal * 2));
  }
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && !square[i - (scaleVal * 2) + 1].classList.contains('explodeMine')) { //右上
    allExplode(i - (scaleVal * 2) + 1);
  }
  if (i % (scaleVal * 2) !== 0
    && !square[i - 1].classList.contains('explodeMine')) { //左
    allExplode(i - 1);
  }
  if (i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && !square[i + 1].classList.contains('explodeMine')) { //右
    allExplode(i + 1);
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== 0
    && !square[i + (scaleVal * 2) - 1].classList.contains('explodeMine')) { //左下
    allExplode(i + (scaleVal * 2) - 1);
  }
  if (i / (scaleVal * 2) < scaleVal - 1
    && !square[i + (scaleVal * 2)].classList.contains('explodeMine')) { //下
    allExplode(i + (scaleVal * 2));
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && !square[i + (scaleVal * 2) + 1].classList.contains('explodeMine')) { //右下
    allExplode(i + (scaleVal * 2) + 1);
  }
  //円柱
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === 0
    && !square[i - 1].classList.contains('explodeMine')) { //左上(円柱)
    allExplode(i - 1);
  }
  if (i % (scaleVal * 2) === 0
    && !square[i + (scaleVal * 2) - 1].classList.contains('explodeMine')) { //左(円柱)
    allExplode(i + (scaleVal * 2) - 1);
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === 0
    && !square[i + (scaleVal * 4) - 1].classList.contains('explodeMine')) { //左下(円柱)
    allExplode(i + (scaleVal * 4) - 1);
  }
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
    && !square[i - (scaleVal * 4) + 1].classList.contains('explodeMine')) { //右上(円柱)
    allExplode(i - (scaleVal * 4) + 1);
  }
  if (i % (scaleVal * 2) === (scaleVal * 2) - 1
    && !square[i - (scaleVal * 2) + 1].classList.contains('explodeMine')) { //右(円柱)
    allExplode(i - (scaleVal * 2) + 1);
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
    && !square[i + 1].classList.contains('explodeMine')) { //右下(円柱)
    allExplode(i + 1);
  }
}

function gameClear() {
  const gameClear = document.getElementById('gameClear');
  gameClear.style.display = 'block';
  const time = document.getElementById('time');
  time.textContent = elapsedTime;
  const rankTime = document.getElementsByName('rankTime')[0];
  rankTime.value = elapsedTime;
  //順位
  const rankObj = document.getElementById('rank');
  for (let i = 0; i < jsonScoreList.length; i++) {
    if (jsonScoreList[i][2] > Number(elapsedTimeObj.textContent)) {
      var rank = i + 1;
      break;
    } else if (jsonScoreList.length === 0) {
      var rank = 1;
      break;
    }
  }
  if (typeof rank === 'undefined') {
    var rank = jsonScoreList.length + 1;
  }

  rankObj.textContent = rank;
  //最高順位
  if (sessionStorage.getItem('login_name')) {
    if (sessionStorage.getItem('highest_rank') > rank) {
      sessionStorage.setItem('highest_rank', rank);
    } else if (!sessionStorage.getItem('highest_rank')) {
      sessionStorage.setItem('highest_rank', rank);
    }
  }
  //ボタン制御
  if (rankName.value.length > 0) {
    registerBtn.removeAttribute('disabled');
  }
  //素通り処理
  const clearTime = document.getElementsByName('clearTime')[0];
  clearTime.value = elapsedTime;
  const clearP = document.getElementsByClassName('clearP');
  const url = document.URL;
  gameClear.addEventListener('click', (e) => {
    if (e.target === e.currentTarget
      || e.target === clearP[0]
      || e.target === clearP[1]) {
      if (url.match(/\?/)) {
        window.location.href = url + `&clearTime=${elapsedTime}`;
      } else {
        window.location.href = url + `?clearTime=${elapsedTime}`;
      }
    }
  });
}

function checkClear() {
  if (document.querySelectorAll('.basis').length === 0) {
    gameClear();
  }
}

function countMine(i) {
  let mineCount = 0;
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== 0
    && square[i - (scaleVal * 2) - 1].classList.contains('mine')) { //左上
    mineCount++;
  }
  if (i / (scaleVal * 2) >= 1
    && square[i - (scaleVal * 2)].classList.contains('mine')) { //上
    mineCount++;
  }
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && square[i - (scaleVal * 2) + 1].classList.contains('mine')) { //右上
    mineCount++;
  }
  if (i % (scaleVal * 2) !== 0
    && square[i - 1].classList.contains('mine')) { //左
    mineCount++;
  }
  if (i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && square[i + 1].classList.contains('mine')) { //右
    mineCount++;
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== 0
    && square[i + (scaleVal * 2) - 1].classList.contains('mine')) { //左下
    mineCount++;
  }
  if (i / (scaleVal * 2) < scaleVal - 1
    && square[i + (scaleVal * 2)].classList.contains('mine')) { //下
    mineCount++;
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
    && square[i + (scaleVal * 2) + 1].classList.contains('mine')) { //右下
    mineCount++;
  }
  //円柱
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === 0
    && square[i - 1].classList.contains('mine')) { //左上(円柱)
    mineCount++;
  }
  if (i % (scaleVal * 2) === 0
    && square[i + (scaleVal * 2) - 1].classList.contains('mine')) { //左(円柱)
    mineCount++;
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === 0
    && square[i + (scaleVal * 4) - 1].classList.contains('mine')) { //左下(円柱)
    mineCount++;
  }
  if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
    && square[i - (scaleVal * 4) + 1].classList.contains('mine')) { //右上(円柱)
    mineCount++;
  }
  if (i % (scaleVal * 2) === (scaleVal * 2) - 1
    && square[i - (scaleVal * 2) + 1].classList.contains('mine')) { //右(円柱)
    mineCount++;
  }
  if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
    && square[i + 1].classList.contains('mine')) { //右下(円柱)
    mineCount++;
  }
  //-------------------------------------------------------
  if (mineCount > 0) {
    square[i].textContent = mineCount;
  } else {
    square[i].classList.add('mine0');
  }
}

function autoOpenSearch(i) {
  if (square[i].classList.contains('mine0')) { //mineがないならまた探す
    if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== 0
      && !square[i - (scaleVal * 2) - 1].classList.contains('mine')) { //左上
      autoOpen(i - (scaleVal * 2) - 1);
    }
    if (i / (scaleVal * 2) >= 1
      && !square[i - (scaleVal * 2)].classList.contains('mine')) { //上
      autoOpen(i - (scaleVal * 2));
    }
    if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
      && !square[i - (scaleVal * 2) + 1].classList.contains('mine')) { //右上
      autoOpen(i - (scaleVal * 2) + 1);
    }
    if (i % (scaleVal * 2) !== 0
      && !square[i - 1].classList.contains('mine')) { //左
      autoOpen(i - 1);
    }
    if (i % (scaleVal * 2) !== (scaleVal * 2) - 1
      && !square[i + 1].classList.contains('mine')) { //右
      autoOpen(i + 1);
    }
    if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== 0
      && !square[i + (scaleVal * 2) - 1].classList.contains('mine')) { //左下
      autoOpen(i + (scaleVal * 2) - 1);
    }
    if (i / (scaleVal * 2) < scaleVal - 1
      && !square[i + (scaleVal * 2)].classList.contains('mine')) { //下
      autoOpen(i + (scaleVal * 2));
    }
    if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) !== (scaleVal * 2) - 1
      && !square[i + (scaleVal * 2) + 1].classList.contains('mine')) { //右下
      autoOpen(i + (scaleVal * 2) + 1);
    }
    //円柱
    if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === 0
      && !square[i - 1].classList.contains('mine')) { //左上(円柱)
      autoOpen(i - 1);
    }
    if (i % (scaleVal * 2) === 0
      && !square[i + (scaleVal * 2) - 1].classList.contains('mine')) { //左(円柱)
      autoOpen(i + (scaleVal * 2) - 1);
    }
    if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === 0
      && !square[i + (scaleVal * 4) - 1].classList.contains('mine')) { //左下(円柱)
      autoOpen(i + (scaleVal * 4) - 1);
    }
    if (i / (scaleVal * 2) >= 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
      && !square[i - (scaleVal * 4) + 1].classList.contains('mine')) { //右上(円柱)
      autoOpen(i - (scaleVal * 4) + 1);
    }
    if (i % (scaleVal * 2) === (scaleVal * 2) - 1
      && !square[i - (scaleVal * 2) + 1].classList.contains('mine')) { //右(円柱)
      autoOpen(i - (scaleVal * 2) + 1);
    }
    if (i / (scaleVal * 2) < scaleVal - 1 && i % (scaleVal * 2) === (scaleVal * 2) - 1
      && !square[i + 1].classList.contains('mine')) { //右下(円柱)
      autoOpen(i + 1);
    }
  }
}

function autoOpen(i) {
  if (square[i].classList.contains('basis')) {
    window.setTimeout(() => {
      square[i].classList.remove('basis');
      square[i].classList.add('open');
      countMine(i);
      autoOpenSearch(i);
      checkClear();
    }, 0)
  }
}

function btnOpen() {
  const basisArray = document.querySelectorAll('.basis'); //basis配列
  const randIndex = Math.floor(Math.random() * basisArray.length); //basisのランダムな添字
  basisArray[randIndex].classList.remove('basis');
  basisArray[randIndex].classList.add('open');
  basisArray[randIndex].classList.add('randOpen');
  for (let i = 0; i < square.length; i++) {
    if (square[i].classList.contains('randOpen')) {
      countMine(i);
      square[i].classList.remove('randOpen');
      autoOpenSearch(i);
    }
  }
  checkClear();
}

function timePassed() {
  startObj.style.display = 'none';
  let timerId = window.setInterval(() => {
    if (document.querySelectorAll('.basis').length === 0
      || document.querySelectorAll('.explodeMine').length === 1) {
      window.clearInterval(timerId);
      return;
    }
    elapsedTime++;
    if (!dateFlg) {
      elapsedTimeObj.textContent = elapsedTime;
    } else {
      toDate = elapsedTime;
      d = Math.floor(toDate / 86400);
      h = Math.floor(toDate / 3600) % 24;
      m = Math.floor(toDate / 60) % 60;
      s = toDate % 60;
      if (d === 0) {
        dd = '';
      } else {
        dd = d + 'd';
      }
      if (h === 0) {
        hh = '';
      } else {
        hh = h + 'h';
      }
      if (m === 0) {
        mm = '';
      } else {
        mm = m + 'm';
      }
      ss = s + 's';
      elapsedTimeObj.textContent = dd + hh + mm + ss;
    }
    elapsedTimeFontSize();
  }, 1000);
}


//login.js
function checkForm(form) {
  form.value = form.value.replace(/\s+/g, '');
  if (form.value !== ''
    && form.value.length < 11) {
    return true;
  }
  return false;
}

// htmlCharacter
// function h(val) {
//   return String(val).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// }

//円柱
function rotateMouseMove(e) {
  Yi = prevMouseX - e.pageX;
  // Xi = prevMouseY - e.pageY;
  Xi = 0;
  // board.style.transform = `rotateX(${Xi * littleAngle}deg) rotateY(${-Yi * littleAngle}deg) rotateZ(0deg)`;
  window.requestAnimationFrame(rotate);
}

const rotate = () => {
  board.style.transform = `rotateY(${-Yi * littleAngle}deg)`;
}

function rotateTouchMove(e) {
  // e.preventDefault();
  Yi = prevMouseX - e.pageX;
  // Xi = prevMouseY - e.pageY;
  Xi = 0;
  // board.style.transform = `rotateX(${Xi * littleAngle}deg) rotateY(${-Yi * littleAngle}deg) rotateZ(0deg)`;
  window.requestAnimationFrame(rotate);
}

const addTimeAnime = () => {
  addTimeObj.textContent = '+' + addTime;
  addTimeObj.style.display = 'block';
  window.setTimeout(() => {
    addTimeObj.style.display = 'none';
  }, 1000)
}

function elapsedTimeFontSize() {
  if (window.matchMedia('(max-width:500px)').matches) {
    elapsedTimeObj.style.fontSize = '2.5rem';
    return;
  }
  if (elapsedTimeObj.textContent.length < 9) {
    elapsedTimeObj.style.fontSize = '3.2rem';
  } else if (elapsedTimeObj.textContent.length === 9) {
    elapsedTimeObj.style.fontSize = '3rem';
  } else if (elapsedTimeObj.textContent.length === 10) {
    elapsedTimeObj.style.fontSize = '2.8rem';
  } else if (elapsedTimeObj.textContent.length === 11) {
    elapsedTimeObj.style.fontSize = '2.6rem';
  } else if (elapsedTimeObj.textContent.length === 12) {
    elapsedTimeObj.style.fontSize = '2.4rem';
  } else {
    elapsedTimeObj.style.fontSize = '2.0rem';
  }
}