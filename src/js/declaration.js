//ログイン
const loginBtn = document.getElementById('loginBtn');
const submitBtn = document.getElementsByClassName('submitBtn');
const removeBtn = document.getElementById('removeBtn');
const inputLoginName = document.getElementById('inputLoginName');
const rankName = document.getElementsByName('rankName')[0];
const highestRank = document.getElementById('highestRank');

//ランキング登録
const registerBtn = document.getElementById('registerBtn');

//地雷
const square = document.getElementsByClassName('square'); //全てのマス
const mine = document.getElementsByClassName('mine'); //地雷

//なんか
const startObj = document.getElementById('start');
const elapsedTimeObj = document.getElementById('elapsedTime');
const elapsedTimeBox = document.getElementById('elapsedTimeBox');
let elapsedTime = 0;
const addTimeObj = document.getElementById('addTimeObj');


//難易度
const degreeOfDifficultyBtn = document.getElementsByClassName('degreeOfDifficultyBtn');
const scaleBtn = document.getElementsByClassName('scaleBtn');
const wrapDegreeOfDifficultyBtn = document.getElementsByClassName('wrapDegreeOfDifficultyBtn')[0];
const wrapScaleBtn = document.getElementsByClassName('wrapScaleBtn');

//2つ以上のファイルで同程度の使い方をしている宣言
const board = document.getElementById('board');