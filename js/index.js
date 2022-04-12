// let flag = false;
// let timerId = window.setTimeout(() => {
//   flag = true;
//   window.clearTimeout(timerId);
// }, 4500);

let flag = true;

const animate = document.getElementsByClassName('animate1')[0];
document.body.addEventListener('click', () => {
  if (flag) {
    animate.classList.add('animate2');
    window.setTimeout(() => {
      window.location.href = './main.php';
    }, 1000);
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && flag) {
    animate.classList.add('animate2');
    window.setTimeout(() => {
      window.location.href = './main.php';
    }, 1000);
  }
});
