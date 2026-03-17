const subt = document.getElementById("h1");
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
    const conteudo = document.getElementById('conteudo');
    const fill = document.querySelector('.pixel-fill');
  
    fill.classList.add('animate');
  
    setTimeout(() => {
      loading.classList.add('hidden');
      conteudo.classList.remove('hidden');
  
      alert("");//nao vai ter alert pq ja tem a barra de carregamento
    }, 3400); 
  });
      function clicou (onde){
        alert("voce clicou " + onde + " da melhor sala")
      }
