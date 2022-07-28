//リセットボタン
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
  window.location.reload();
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'r') {
    if (document.activeElement === document.body
      || document.activeElement === loginBtn) {
      window.location.reload();
    }
  }
});

//オープンボタン
let openCnt = 0;
let addTime = 0;

const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  openCnt++;
  addTime = openCnt * 10;
  elapsedTime += addTime;
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
  btnOpen();
  window.requestAnimationFrame(addTimeAnime);
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'o') {
    if (document.activeElement === document.body
      || document.activeElement === loginBtn) {
      if (startObj.style.display !== 'block'
        && document.querySelectorAll('.basis').length > 0) {
        openCnt++;
        addTime = openCnt * 10;
        elapsedTime += addTime;
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
        btnOpen();
        window.requestAnimationFrame(addTimeAnime);
      }
    }
  }
});

//経過時間
startObj.style.display = 'block';

startObj.addEventListener('click', () => {
  timePassed();
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && startObj.style.display === 'block') {
    timePassed();
  }
});

let dateFlg = false;
let toDate = 0;
let d = 0;
let h = 0;
let m = 0;
let s = 0;
elapsedTimeBox.addEventListener('click', () => {
  if (!dateFlg) {
    dateFlg = true;
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
  } else {
    dateFlg = false;
    elapsedTimeObj.textContent = elapsedTime;
  }
  elapsedTimeFontSize();
});

//オープンとフラグのモード変更(スマホ用)
let leftClickSquare = 'open';
let rightClickSquare = 'flag';

const modeBtn = document.getElementById('modeBtn');
modeBtn.addEventListener('click', () => {
  if (leftClickSquare === 'open') {
    leftClickSquare = 'flag';
    rightClickSquare = 'open';
    modeBtn.classList.add('changed');
  } else {
    leftClickSquare = 'open';
    rightClickSquare = 'flag';
    modeBtn.classList.remove('changed');
  }
});

//押したときの動作
for (let i = 0; i < square.length; i++) {
  squareSize(i);
  if (square[i].classList.contains('mine') === false) {
    square[i].addEventListener('click', () => { //squareを左クリックしたとき
      if (leftClickSquare === 'open'
        && square[i].classList.contains('basis')) {
        square[i].classList.remove('basis');
        square[i].classList.add('open');
        countMine(i);
        autoOpenSearch(i);
        checkClear();
      } else if (leftClickSquare === 'flag'
        && square[i].classList.contains('basis')) {
        square[i].classList.remove('basis');
        square[i].classList.add('flag');
        flagCount();
      } else if (leftClickSquare === 'flag'
        && square[i].classList.contains('flag')) {
        square[i].classList.remove('flag');
        square[i].classList.add('basis');
        flagCount();
      }
    });
    square[i].oncontextmenu = () => { //squareを右クリックしたとき
      if (rightClickSquare === 'flag'
        && square[i].classList.contains('basis')) {
        square[i].classList.remove('basis');
        square[i].classList.add('flag');
        flagCount();
      } else if (rightClickSquare === 'flag'
        && square[i].classList.contains('flag')) {
        square[i].classList.remove('flag');
        square[i].classList.add('basis');
        flagCount();
      } else if (rightClickSquare === 'open'
        && square[i].classList.contains('basis')) {
        square[i].classList.remove('basis');
        square[i].classList.add('open');
        countMine(i);
        autoOpenSearch(i);
        checkClear();
      }
    };
  }
}

//地雷を押したときの動作
for (let i = 0; i < mine.length; i++) {
  mine[i].classList.remove('basis');
  mine[i].classList.add('buryMine');
  mine[i].addEventListener('click', () => { //mineを左クリックしたとき
    if (leftClickSquare === 'open'
      && mine[i].classList.contains('buryMine')) {
      mine[i].classList.remove('buryMine');
      mine[i].classList.add('explodeMine');
      gameEnd();
    } else if (leftClickSquare === 'flag'
      && mine[i].classList.contains('buryMine')) {
      mine[i].classList.remove('buryMine');
      mine[i].classList.add('flag');
      flagCount();
    } else if (leftClickSquare === 'flag'
      && mine[i].classList.contains('flag')) {
      mine[i].classList.remove('flag');
      mine[i].classList.add('buryMine');
      flagCount();
    }
  });
  mine[i].oncontextmenu = () => { //mineを右クリックしたとき
    if (rightClickSquare === 'open'
      && mine[i].classList.contains('buryMine')) {
      mine[i].classList.remove('buryMine');
      mine[i].classList.add('explodeMine');
      gameEnd();
    } else if (rightClickSquare === 'flag'
      && mine[i].classList.contains('buryMine')) {
      mine[i].classList.remove('buryMine');
      mine[i].classList.add('flag');
      flagCount();
    } else if (rightClickSquare === 'flag'
      && mine[i].classList.contains('flag')) {
      mine[i].classList.remove('flag');
      mine[i].classList.add('buryMine');
      flagCount();
    }
  };
}

//円柱回転させる
let Xi = 0;
let Yi = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let littleAngle = 2;

onmousedown = () => {
  if (!sensitivityFlg) {
    document.addEventListener('mousemove', rotateMouseMove, { passive: true });
  }
};

onmouseup = () => {
  document.removeEventListener('mousemove', rotateMouseMove);
};

ontouchstart = () => {
  document.addEventListener('touchmove', rotateTouchMove);
};

ontouchend = () => {
  document.removeEventListener('touchmove', rotateTouchMove);
};

//クリックで回転させる
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

leftArrow.addEventListener('click', () => {
  Yi = Yi - 20;
  board.style.transform = `rotateX(${Xi * littleAngle}deg) rotateY(${-Yi * littleAngle}deg) rotateZ(0deg)`;
});

rightArrow.addEventListener('click', () => {
  Yi = Yi + 20;
  board.style.transform = `rotateX(${Xi * littleAngle}deg) rotateY(${-Yi * littleAngle}deg) rotateZ(0deg)`;
});


//右クリックmenuを消す
document.body.oncontextmenu = () => {
  return false;
};

//表示・非表示
const leftEye = document.getElementsByClassName('fa-eye')[0];
const leftEyeSlash = document.getElementsByClassName('fa-eye-slash')[0];
const rightEye = document.getElementsByClassName('fa-eye')[1];
const rightEyeSlash = document.getElementsByClassName('fa-eye-slash')[1];
const wrapDifficulty = document.getElementById('wrapDifficulty');
const rankingList = document.getElementById('rankingList');
leftEye.addEventListener('click', () => {
  wrapDifficulty.style.display = 'none';
  leftEyeSlash.style.display = 'block';
});
leftEyeSlash.addEventListener('click', () => {
  wrapDifficulty.style.display = 'block';
  leftEyeSlash.style.display = 'none';
});
rightEye.addEventListener('click', () => {
  rankingList.style.display = 'none';
  rightEyeSlash.style.display = 'block';
});
rightEyeSlash.addEventListener('click', () => {
  rankingList.style.display = 'block';
  rightEyeSlash.style.display = 'none';
});

//統計ウィンドウ生成
const anchorStatistics = document.getElementById('anchorStatistics');
const winWidth = 700;
const winHeight = 600;

anchorStatistics.addEventListener('click', () => {
  window.open(`./statistics.php?winWidth=${winWidth}&winHeight=${winHeight}`, 'newwindow', `width=${winWidth},height=${winHeight},top=100,left=800`);
});


//スマホ拡大無効
if (window.matchMedia('(max-width:500px)').matches) {
  document.addEventListener('dblclick', (e) => {
    e.preventDefault();
  }, {
    passive: false
  });
}

//sp高さ
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);