setTimeout(() => {
  document.querySelector('.lista-animada').classList.add('show');
}, 400);

document.querySelectorAll('.lista-animada li').forEach(li => {
  li.addEventListener('click', () => {
    const emoji = li.querySelector('.doidosono');
    const emojis = ['😴','💤','🛌','😎','😪','🥱','🧟‍♂️','🥹','😵‍💫','🐔','🧏🏻‍♀️'];
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  });
});

window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  const fill = document.querySelector('.pixel-fill');

  fill.classList.add('animate');

  setTimeout(() => {
    loading.classList.add('hidden');
  }, 3400);
});

function clicou(onde) {
  alert("você clicou " + onde + " da melhor sala");
}

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');

    if (tabId === 'aba4' && !gameRunning) {
      initGame();
    }
  });
});

let gameRunning = false;
let canvas, ctx, player, keys = {}, score = 0, health = 3;
let gravity = 0.6, friction = 0.8;
let worldBlocks = [], enemies = [], collectibles = [];
let gameOverShown = false;

function initGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameOverShown = false;

  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  player = {
    x: 100, y: 300,
    radius: 20,
    vx: 0, vy: 0,
    onGround: false,
    color: '#48e152'
  };

  worldBlocks = [];
  enemies = [];
  collectibles = [];

  for (let i = 0; i < 30; i++) {
    worldBlocks.push({x: i*40, y: canvas.height-40, w: 40, h: 40, color: '#8B4513'});
    if (i % 5 === 0) worldBlocks.push({x: i*40 + 80, y: canvas.height-160, w: 40, h: 40, color: '#556B2F'});
  }

  enemies.push({x: 500, y: canvas.height-80, w: 35, h: 35, vx: -1.2, color: '#9932CC'});
  enemies.push({x: 700, y: canvas.height-200, w: 35, h: 35, vx: 1.5, color: '#FF4500'});

  collectibles.push({x: 400, y: 200, w: 20, h: 20, color: '#00FF7F', collected: false});
  collectibles.push({x: 650, y: 120, w: 20, h: 20, color: '#00FF7F', collected: false});

  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys['ArrowLeft'] || keys['a']) player.vx = -5;
  else if (keys['ArrowRight'] || keys['d']) player.vx = 5;
  else player.vx *= friction;

  if ((keys[' '] || keys['Space']) && player.onGround) {
    player.vy = -14;
    player.onGround = false;
  }

  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  player.onGround = false;

  worldBlocks.forEach(block => {
    const closestX = Math.max(block.x, Math.min(player.x, block.x + block.w));
    const closestY = Math.max(block.y, Math.min(player.y, block.y + block.h));
    const dx = player.x - closestX;
    const dy = player.y - closestY;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < player.radius) {
      const overlap = player.radius - distance;
      const nx = dx / distance || 0;
      const ny = dy / distance || 0;

      player.x += nx * overlap;
      player.y += ny * overlap;

      if (ny < -0.7 && player.vy > 0) {
        player.vy = 0;
        player.onGround = true;
      }
    }
  });

  if (player.x - player.radius < 0) player.x = player.radius;
  if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;

  if (player.y - player.radius > canvas.height) {
    player.x = 100;
    player.y = 300;
    player.vy = 0;
    player.vx = 0;
    health--;
    document.getElementById('health').textContent = health;
    checkGameOver();
  }

  enemies.forEach(enemy => {
    enemy.x += enemy.vx;
    if (enemy.x < 0 || enemy.x + enemy.w > canvas.width) enemy.vx *= -1;

    const dx = player.x - (enemy.x + enemy.w/2);
    const dy = player.y - (enemy.y + enemy.h/2);
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < player.radius + 20) {
      health--;
      document.getElementById('health').textContent = health;
      player.x = 100;
      player.y = 300;
      player.vy = -8;
      checkGameOver();
    }
  });

  collectibles.forEach(item => {
    if (!item.collected) {
      const dx = player.x - (item.x + item.w/2);
      const dy = player.y - (item.y + item.h/2);
      const distance = Math.sqrt(dx*dx + dy*dy);

      if (distance < player.radius + 10) {
        item.collected = true;
        score += 10;
        document.getElementById('score').textContent = score;
      }
    }
  });
}

function checkGameOver() {
  if (health <= 0 && !gameOverShown) {
    gameOverShown = true;
    gameRunning = false;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = '#ff3333';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20;
    ctx.fillText('VOCÊ MORREU', canvas.width/2, canvas.height/2 - 60);

    ctx.shadowBlur = 0;

    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Pontos: ${score}`, canvas.width/2, canvas.height/2 + 10);

    ctx.font = '28px Arial';
    ctx.fillStyle = '#88ff88';
    ctx.fillText('Troque de aba e volte para tentar novamente!', canvas.width/2, canvas.height/2 + 80);
    ctx.restore();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldBlocks.forEach(block => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.w, block.h);
  });

  const gradient = ctx.createRadialGradient(
    player.x - 6, player.y - 6, 4,
    player.x, player.y, player.radius
  );
  gradient.addColorStop(0, '#90ff9e');
  gradient.addColorStop(1, player.color);

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(0, 255, 80, 0.6)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  });

  collectibles.forEach(item => {
    if (!item.collected) {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(item.x + 10, item.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
