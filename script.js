document.addEventListener('DOMContentLoaded', () => {
  const board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;

  const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const boxes = document.querySelectorAll('.box');
  const msgElement = document.getElementById('msg');
  const msgContainer = document.getElementById('message-box');
  const resetBtn = document.getElementById('reset-btn');
  const winLine = document.getElementById('win-line');

  function initGame() {
  board.fill('');
  currentPlayer = 'X';
  gameActive = true;
  boxes.forEach(box => {
    box.classList.remove('x', 'o');
    box.innerHTML = '';
  });
  msgContainer.classList.add('hide');
  msgContainer.classList.remove('show');
  msgElement.textContent = '';
  winLine.classList.add('hide');
  winLine.style.display = 'none';
}


  function handleBoxClick(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    e.target.innerHTML = `<span>${currentPlayer}</span>`;

    if (checkWin()) {
      drawWinLine();
      endGame(false);
    } else if (checkDraw()) {
      endGame(true);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  function checkWin() {
    return winningConditions.some(([a,b,c]) => {
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  }

  function checkDraw() {
    return board.every(cell => cell !== '');
  }

  function drawWinLine() {
    const win = winningConditions.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
    if (!win) return;

    const [a, , c] = win;
    const boxA = boxes[a].getBoundingClientRect();
    const boxC = boxes[c].getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect();

    const x1 = boxA.left + boxA.width / 2 - containerRect.left;
    const y1 = boxA.top + boxA.height / 2 - containerRect.top;
    const x2 = boxC.left + boxC.width / 2 - containerRect.left;
    const y2 = boxC.top + boxC.height / 2 - containerRect.top;

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    winLine.style.width = `${length}px`;
    winLine.style.top = `${y1}px`;
    winLine.style.left = `${x1}px`;
    winLine.style.transform = `rotate(${angle}deg)`;
    winLine.style.transformOrigin = '0 0';
    winLine.style.display = 'block';
    winLine.classList.remove('hide');
  }

  function endGame(draw) {
  gameActive = false;
  setTimeout(() => {
    if (draw) {
      msgElement.innerHTML = `<strong>🤝 It's a Draw!</strong>`;
    } else {
      msgElement.innerHTML = `<strong>🎉 Congratulations! Player ${currentPlayer} Wins! 🎉</strong>`;
    }
    msgContainer.classList.remove('hide');
    msgContainer.classList.add('show');
  }, 300);
}


  boxes.forEach(box => box.addEventListener('click', handleBoxClick));
  resetBtn.addEventListener('click', initGame);
  initGame();

  // ✨ Particle background animation
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function createParticles() {
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff88';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    });
    requestAnimationFrame(drawParticles);
  }

  createParticles();
  drawParticles();
});
