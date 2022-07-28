const settingBtn = document.getElementById('settingBtn');
const settingModal = document.getElementById('settingModal');
const sensitivityBar = document.getElementById('sensitivityBar');
const sensitivityVal = document.getElementById('sensitivityVal');

//モーダルエリアの表示・非表示
let settingFlg = false;

settingBtn.addEventListener('click', () => {
  if (!settingFlg) {
    settingModal.style.display = 'block';
    settingFlg = true;
  } else {
    settingModal.style.display = 'none';
    settingFlg = false;
  }
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('#settingModal')
    && e.target !== settingBtn
    && e.target !== settingBtn.getElementsByTagName('i')[0]
    && settingFlg) {
    settingModal.style.display = 'none';
    settingFlg = false;
  }
})

//
let sensitivityFlg = false;

settingModal.addEventListener('mouseover', () => {
  sensitivityFlg = true;
})
settingModal.addEventListener('mouseout', () => {
  sensitivityFlg = false;
})

// sensitivityVal.textContent = sensitivityBar.value;

sensitivityBar.addEventListener('input', () => {
  if (sensitivityBar.value.length > 1) {
    sensitivityVal.textContent = sensitivityBar.value;
  } else {
    sensitivityVal.textContent = sensitivityBar.value + '.0';
  }
  littleAngle = sensitivityBar.value;
})
