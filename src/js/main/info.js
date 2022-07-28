const infoBtn = document.getElementsByClassName('fa-info-circle')[0];
const infoModal = document.getElementById('infoModal');

//モーダルエリアの表示・非表示
let infoFlg = false;

infoBtn.addEventListener('click', () => {
  if (!infoFlg) {
    infoModal.style.display = 'block';
    infoFlg = true;
  } else {
    infoModal.style.display = 'none';
    infoFlg = false;
  }
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('#infoModal')
    && e.target !== infoBtn
    && infoFlg) {
    infoModal.style.display = 'none';
    infoFlg = false;
  }
})