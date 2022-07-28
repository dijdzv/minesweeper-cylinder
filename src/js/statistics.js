const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//グラフの外枠
const cWidth = canvas.width;
const cHeight = canvas.height;
const gWidth = cWidth - 100;
const gHeight = cHeight - 100;
const leftEnd = 50;
const rightEnd = cWidth - 50;
const topEnd = 50;
const btmEnd = cHeight - 50;

createBorder();

const newDate = new Date();
const thisYear = newDate.getFullYear();
const thisMonth = newDate.getMonth() + 1;
const thisDate = newDate.getDate();

let year = newDate.getFullYear();
let month = newDate.getMonth() + 1;
let date = newDate.getDate();
let hour = newDate.getHours();

let last = new Date(year, month, 0).getDate();
const leftP = document.getElementById('left');
const rightP = document.getElementById('right');
const topP = document.getElementById('top');
const centerP = document.getElementById('center');
const btmP = document.getElementById('btm');

let list1 = document.getElementById('list1');
let typeName = 'プレイ回数';
let type = 'p';

let jsonTimeList = jsonPlayTimeList;

let flg = 'M';

leftRightText();

graph();

//左右
leftP.addEventListener('click', () => {
  leftPClick();
})
rightP.addEventListener('click', () => {
  rightPClick();
})

//YMD
topP.addEventListener('click', () => {
  flg = 'Y';
  year = thisYear;
  last = 12;
  topPClick();
})
centerP.addEventListener('click', () => {
  flg = 'M';
  year = thisYear;
  month = thisMonth;
  last = new Date(year, month, 0).getDate();
  centerPClick();
})
btmP.addEventListener('click', () => {
  flg = 'D';
  year = thisYear;
  month = thisMonth;
  date = thisDate;
  last = 24;
  btmPClick();
})

//種類
let buf;
list1.addEventListener('click', () => {
  year = thisYear;
  month = thisMonth;
  date - thisDate;
  buf = list1.textContent;
  list1.textContent = typeName;
  typeName = buf;
  if (type === 'p') {
    jsonTimeList = jsonVisitTimeList;
    type = 'v';
  } else if (type === 'v') {
    jsonTimeList = jsonPlayTimeList;
    type = 'p';
  }
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  leftRightText();
  graph();
})

// 関数-------------------------------------------------------------
function createBorder() {
  ctx.beginPath();

  ctx.moveTo(leftEnd, topEnd);
  ctx.lineTo(leftEnd, btmEnd);
  ctx.lineTo(rightEnd, btmEnd);

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

function graph() {
  //月とか日付とか
  let intervalX = gWidth / (last + 1);

  ctx.font = 'bold 20px MS 明朝';
  if (flg === 'M') {
    if (type === 'p') {
      ctx.fillText(year + '年  ' + month + '月  プレイ回数', cWidth / 2 - 120, 30);
    } else if (type === 'v') {
      ctx.fillText(year + '年  ' + month + '月  訪問回数', cWidth / 2 - 120, 30);
    }
  } else if (flg === 'Y') {
    if (type === 'p') {
      ctx.fillText(year + '年  プレイ回数', cWidth / 2 - 80, 30);
    } else if (type === 'v') {
      ctx.fillText(year + '年  訪問回数', cWidth / 2 - 80, 30);
    }
  } else if (flg === 'D') {
    if (type === 'p') {
      ctx.fillText(year + '年 ' + month + '月 ' + date + '日 プレイ回数', cWidth / 2 - 130, 30);
    } else if (type === 'v') {
      ctx.fillText(year + '年 ' + month + '月 ' + date + '日 訪問回数', cWidth / 2 - 130, 30);
    }
  }

  createVerticalLine(intervalX);

  //グラフ準備
  const setAry = setup();
  const cntList = setAry[0];
  const maxCnt = setAry[1];

  const divVertical = 11; //縦に何分割するか
  const topVal = Math.floor((maxCnt + 100) / 100) * 100;
  const intervalY = gHeight / (divVertical + 1);
  const valTopEnd = btmEnd - intervalY * divVertical;
  const valBtmEnd = btmEnd - intervalY;

  createHorizontalLine(divVertical, intervalY, topVal);

  unit();

  //グラフ描画
  drawing(cntList, topVal, intervalX, valTopEnd, valBtmEnd);
}

function createVerticalLine(intervalX) {
  for (let i = 0; i < last; i++) {
    ctx.beginPath();

    ctx.moveTo(leftEnd + intervalX * (i + 1), btmEnd - 10);
    ctx.lineTo(leftEnd + intervalX * (i + 1), btmEnd + 10);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = '1';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();

    ctx.moveTo(leftEnd + intervalX * (i + 1), btmEnd + 10);
    ctx.lineTo(leftEnd + intervalX * (i + 1), topEnd);

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = '0.2';
    ctx.stroke();
    ctx.closePath();

    ctx.font = 'normal 12px MS 明朝';
    if (flg !== 'D') {
      if (i + 1 >= 10) {
        ctx.fillText(i + 1, leftEnd + intervalX * (i + 1) - 7, btmEnd + 30);
      } else {
        ctx.fillText(i + 1, leftEnd + intervalX * (i + 1) - 4, btmEnd + 30);
      }
    } else {
      if (i >= 10) {
        ctx.fillText(i, leftEnd + intervalX * (i + 1) - 7, btmEnd + 30);
      } else {
        ctx.fillText(i, leftEnd + intervalX * (i + 1) - 4, btmEnd + 30);
      }
    }
  }
}

function setup() {
  const timeList = [];
  if (flg === 'M') {
    for (let i = 0; i < jsonTimeList.length; i++) {
      if (Number(jsonTimeList[i].substr(4, 2)) === month &&
        ((month <= thisMonth && thisYear === Number(jsonTimeList[i].substr(0, 4)))
          || (month > thisMonth && thisYear - 1 === Number(jsonTimeList[i].substr(0, 4))))) {
        timeList[i] = Number(jsonTimeList[i].substr(6, 2));
      }
    }
  } else if (flg === 'Y') {
    for (let i = 0; i < jsonTimeList.length; i++) {
      if (Number(jsonTimeList[i].substr(0, 4)) === year) {
        timeList[i] = Number(jsonTimeList[i].substr(4, 2));
      }
    }
  } else if (flg === 'D') {
    for (let i = 0; i < jsonTimeList.length; i++) {
      if (Number(jsonTimeList[i].substr(6, 2)) === date
        && Number(jsonTimeList[i].substr(0, 4)) === year
        && Number(jsonTimeList[i].substr(4, 2)) === month) {
        timeList[i] = Number(jsonTimeList[i].substr(8, 2));
      }
    }
  }

  const cntList = [];
  let maxCnt = 0;
  for (let i = 0; i < last; i++) {
    for (let j = 0; j < timeList.length; j++) {
      if (flg !== 'D') {
        if (timeList[j] === i + 1) {
          if (typeof cntList[i] !== 'undefined') {
            cntList[i]++;
          } else {
            cntList[i] = 1;
          }
        }
      } else {
        if (timeList[j] === i) {
          if (typeof cntList[i] !== 'undefined') {
            cntList[i]++;
          } else {
            cntList[i] = 1;
          }
        }
      }
    }
    if (typeof cntList[i] === 'undefined') {
      cntList[i] = 0;
    } else {
      if (maxCnt < cntList[i]) {
        maxCnt = cntList[i];
      }
    }
  }
  return [cntList, maxCnt];
}

function createHorizontalLine(divVertical, intervalY, topVal) {
  for (let i = 0; i < divVertical; i++) {
    ctx.beginPath();

    ctx.moveTo(leftEnd - 10, btmEnd - intervalY * (i + 1));
    ctx.lineTo(leftEnd + 10, btmEnd - intervalY * (i + 1));

    ctx.strokeStyle = 'black';
    ctx.lineWidth = '1';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();

    ctx.moveTo(leftEnd + 10, btmEnd - intervalY * (i + 1));
    ctx.lineTo(rightEnd, btmEnd - intervalY * (i + 1));

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = '0.2';
    ctx.stroke();
    ctx.closePath();

    ctx.font = 'normal 12px MS 明朝';
    const digits = String(topVal / 10 * i).length;
    ctx.fillText(topVal / 10 * i, leftEnd - 30 - (digits * 6) + 12, btmEnd - intervalY * (i + 1) + 3);
  }
}

function unit() {
  if (flg === 'M') {
    ctx.fillText('(日)', rightEnd + 5, btmEnd + 4);
  } else if (flg === 'Y') {
    ctx.fillText('(月)', rightEnd + 5, btmEnd + 4);
  } else if (flg === 'D') {
    ctx.fillText('(時)', rightEnd + 5, btmEnd + 4);
  }
  ctx.fillText('(回)', leftEnd - 11, topEnd - 7);
}

function drawing(cntList, topVal, intervalX, valTopEnd, valBtmEnd) {
  let ratio;
  ctx.beginPath();
  for (let i = 0; i < last; i++) {
    ratio = 1 - cntList[i] / topVal;
    if (i !== 0) {
      ctx.lineTo(leftEnd + intervalX * (i + 1), (valBtmEnd - valTopEnd) * ratio + valTopEnd);
    } else { //一回目だけmoveTo
      ctx.moveTo(leftEnd + intervalX * (i + 1), (valBtmEnd - valTopEnd) * ratio + valTopEnd);
    }
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = '1';
  ctx.stroke();
  ctx.closePath();
}

function leftRightText() {
  if (flg === 'M') { //過去一年間
    if (year === thisYear - 1 &&
      (thisMonth !== 12 && month === thisMonth + 1) || (thisMonth === 12 && month === 1)) {
      leftP.textContent = '';
    } else if (month !== 1) {
      leftP.textContent = month - 1 + '月';
    } else {
      leftP.textContent = 12 + '月';
    }
    if (month === thisMonth) {
      rightP.textContent = '';
    } else if (month !== 12) {
      rightP.textContent = month + 1 + '月';
    } else {
      rightP.textContent = 1 + '月';
    }
  } else if (flg === 'Y') { //今年と去年
    if (year !== thisYear - 1) {
      leftP.textContent = year - 1 + '年';
    } else {
      leftP.textContent = '';
    }
    if (year !== thisYear) {
      rightP.textContent = year + 1 + '年';
    } else {
      rightP.textContent = '';
    }
  } else if (flg === 'D') { //今月のみ
    if (date !== 1) {
      leftP.textContent = date - 1 + '日';
    } else {
      leftP.textContent = '';
    }
    if (year === thisYear && month === thisMonth && date === thisDate) {
      rightP.textContent = '';
    } else {
      rightP.textContent = date + 1 + '日';
    }
  }
}

function leftPClick() {
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  if (flg === 'M') {
    month--;
    if (month === 0) {
      year--;
      month = 12;
    }
    last = new Date(year, month, 0).getDate();
    graph();
  } else if (flg === 'Y') {
    year--;
    graph();
  } else if (flg === 'D') {
    date--;
    graph();
  }
  leftRightText();
}

function rightPClick() {
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  if (flg === 'M') {
    month++;
    if (month === 13) {
      year++;
      month = 1;
    }
    last = new Date(year, month, 0).getDate();
    graph();
  } else if (flg === 'Y') {
    year++;
    graph();
  } else if (flg === 'D') {
    date++;
    graph();
  }
  leftRightText();
}

function topPClick() {
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  leftRightText();
  graph();
}

function centerPClick() {
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  leftRightText();
  graph();
}

function btmPClick() {
  ctx.clearRect(0, 0, cWidth, cHeight);
  createBorder();
  leftRightText();
  graph();
}