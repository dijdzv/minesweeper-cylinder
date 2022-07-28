const wrapRankingDegreeOfDifficultyBtn = document.getElementById('wrapRankingDegreeOfDifficultyBtn');
const rankingDegreeOfDifficultyBtn = document.getElementsByClassName('rankingDegreeOfDifficultyBtn');
const wrapRankingScaleBtn = document.getElementById('wrapRankingScaleBtn');
const rankingScaleBtn = document.getElementsByClassName('rankingScaleBtn');



//ランキングのモード選択ボタン

//de easy->0 normal->1 hard->2
//sc 10->0 15->3 20->6 25->9 30->12 35->15 40->18 45->21

let degreeOfDifficultyI = 1;
let scaleI = 0;

for (let i = 0; i < rankingDegreeOfDifficultyBtn.length; i++) {
  if (rankingDegreeOfDifficultyBtn[i].value === degreeOfDifficultyName) {
    rankingDegreeOfDifficultyBtn[i].classList.add('selectedBtn');
    degreeOfDifficultyI = i;
  }
}
for (let i = 0; i < rankingScaleBtn.length; i++) {
  if (Number(rankingScaleBtn[i].value) === scaleVal) {
    rankingScaleBtn[i].classList.add('selectedBtn');
    scaleI = i;
  }
}

displayRankingTable();

for (let i = 0; i < rankingDegreeOfDifficultyBtn.length; i++) {
  rankingDegreeOfDifficultyBtn[i].addEventListener('click', () => {
    wrapRankingDegreeOfDifficultyBtn.querySelectorAll('.selectedBtn')[0].classList.remove('selectedBtn');
    rankingDegreeOfDifficultyBtn[i].classList.add('selectedBtn');
    degreeOfDifficultyI = i;
    displayRankingTable();
  })
}
for (let i = 0; i < rankingScaleBtn.length; i++) {
  rankingScaleBtn[i].addEventListener('click', () => {
    wrapRankingScaleBtn.querySelectorAll('.selectedBtn')[0].classList.remove('selectedBtn');
    rankingScaleBtn[i].classList.add('selectedBtn');
    scaleI = i;
    displayRankingTable();
  })
}

//ランキング登録画面
if (sessionStorage.getItem('login_name')) {
  rankName.value = sessionStorage.getItem('login_name');
  registerBtn.removeAttribute('disabled');
  registerBtn.style.opacity = '1';
  registerBtn.setAttribute('title', '登録');
  registerBtn.style.cursor = 'pointer';
} else {
  registerBtn.setAttribute('disabled', 'disabled');
  registerBtn.style.opacity = '0.5';
  registerBtn.setAttribute('title', '登録不可');
  registerBtn.style.cursor = 'auto';
}

//ランキング登録画面のボタン制御
rankName.addEventListener('input', () => {
  if (checkForm(rankName)) {
    registerBtn.removeAttribute('disabled');
    registerBtn.style.opacity = '1';
    registerBtn.setAttribute('title', '登録');
    registerBtn.style.cursor = 'pointer';
  } else {
    registerBtn.setAttribute('disabled', 'disabled');
    registerBtn.style.opacity = '0.5';
    registerBtn.setAttribute('title', '登録不可');
    registerBtn.style.cursor = 'auto';
  }
})

//ランキング表示のボタンのサイズ
for (let i = 0; i < rankingScaleBtn.length; i++) {
  rankingScaleBtn[i].style.width = `${24 / implementScale}rem`;;
}
