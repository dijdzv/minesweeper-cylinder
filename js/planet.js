const container = document.getElementsByClassName('container')[0];
const circle = document.getElementsByClassName('circle');

let Xi = 0;
let Yi = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let littleAngle = 2;

onmousedown = () => {
  document.addEventListener('mousemove', rotateMouseMove);
}

onmouseup = () => {
  document.removeEventListener('mousemove', rotateMouseMove);
}

document.oncontextmenu = () => {
  return false;
}

//関数
function rotateMouseMove(e) {
  let tY = 0;
  Yi = prevMouseX - e.pageX;
  // Xi = prevMouseY - e.pageY;
  Xi = 0;
  container.style.transform = `rotateX(${Xi * littleAngle}deg) rotateY(${-Yi * littleAngle}deg) rotateZ(0deg) translateY(${tY}px)`;
}

for (let i = 0; i < circle.length; i++) {
  circle[i].addEventListener('click', () => {
    circle[i].style.background = 'red';
  })
  // circle[i].textContent = i + 1;
  // circle[i].style.color = 'white';
  circle[i].style.textAlign = 'center';
}