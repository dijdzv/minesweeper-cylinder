const loginModal = document.getElementById('loginModal');

//ログインボタンの表示名
if (sessionStorage.getItem('login_name')) {
  loginBtn.textContent = sessionStorage.getItem('login_name');
  removeBtn.removeAttribute('disabled');
  removeBtn.style.opacity = '1';
} else {
  loginBtn.textContent = 'ログイン';
}

//最高順位の表示
if (sessionStorage.getItem('highest_rank')) {
  highestRank.style.display = 'block';
  highestRank.textContent += sessionStorage.getItem('highest_rank') + '位';
}

//モーダルエリアの表示・非表示
let loginFlg = false;

loginBtn.addEventListener('click', () => {
  if (!loginFlg) {
    loginModal.style.display = 'block';
    loginFlg = true;
  } else {
    loginModal.style.display = 'none';
    loginFlg = false;
  }
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('#loginModal')
    && e.target !== loginBtn
    && loginFlg) {
    loginModal.style.display = 'none';
    loginFlg = false;
  }
})


for (let i = 0; i < submitBtn.length; i++) {
  //ボタン制御
  inputLoginName.addEventListener('input', () => {
    if (checkForm(inputLoginName)) {
      submitBtn[i].removeAttribute('disabled');
      submitBtn[i].style.opacity = '1';
      submitBtn[i].setAttribute('title', 'ログイン');
      submitBtn[i].style.cursor = 'pointer';
    } else {
      submitBtn[i].setAttribute('disabled', 'disabled');
      submitBtn[i].style.opacity = '0.5';
      submitBtn[i].setAttribute('title', 'ログイン不可');
      submitBtn[i].style.cursor = 'auto';
    }
  })


  //ログイン
  submitBtn[i].addEventListener('click', () => {
    sessionStorage.setItem('login_name', inputLoginName.value);
    loginBtn.textContent = sessionStorage.getItem('login_name');
    rankName.value = sessionStorage.getItem('login_name');
    loginModal.style.display = 'none';
    removeBtn.removeAttribute('disabled');
    removeBtn.style.opacity = '1';
    loginFlg = false;
  })
}

//ログイン(enter)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'
    && loginModal.style.display === 'block'
    && checkForm(inputLoginName)) {
    sessionStorage.setItem('login_name', inputLoginName.value);
    loginBtn.textContent = sessionStorage.getItem('login_name');
    rankName.value = sessionStorage.getItem('login_name');
    loginModal.style.display = 'none';
    removeBtn.removeAttribute('disabled');
    removeBtn.style.opacity = '1';
    loginFlg = false;
  }
});

//解除
removeBtn.addEventListener('click', () => {
  if (sessionStorage.getItem('login_name')) {
    sessionStorage.removeItem('login_name');
    loginBtn.textContent = 'ログイン';
    rankName.value = '';
    removeBtn.setAttribute('disabled', 'disabled');
    removeBtn.style.opacity = '0.5';
  }
  if (sessionStorage.getItem('highest_rank')) {
    sessionStorage.removeItem('highest_rank');
    highestRank.style.display = 'none';
  }
})