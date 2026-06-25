'use strict';


function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}


const toRad = (deg) => (deg * Math.PI) / 180;



function initMusic() {
  const audio     = document.getElementById('bg-music');
  const btn       = document.getElementById('music-btn');
  const icon      = document.getElementById('music-icon');
  let   hasStarted = false;

  if (!audio || !btn) return;


  function syncUI() {
    if (audio.paused) {
      icon.textContent = '♪';
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Putar musik');
    } else {
      icon.textContent = '♬';
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Jeda musik');
    }
  }

 
  function toggleMusic() {
    if (audio.paused) {
      audio.play().catch(() => {
      
      });
    } else {
      audio.pause();
    }
    syncUI();
  }

  btn.addEventListener('click', toggleMusic);
  audio.addEventListener('play',  syncUI);
  audio.addEventListener('pause', syncUI);


  function attemptAutoPlay() {
    if (hasStarted) return;
    hasStarted = true;
    audio.play().then(syncUI).catch(() => {
      syncUI(); 
    });
  }


  ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
    document.addEventListener(evt, attemptAutoPlay, { once: true, passive: true });
  });
}



function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, petals = [];
  let animId;

  
  const COLORS = ['#F2C4CE', '#C8536A', '#FDF0F3', '#C9A96E', '#ffd6e0', '#e8a0b4'];
  const SHAPES = ['❤', '•', '✦', '✿'];

 
  function petalCount() {
    if (W < 480)  return 14;
    if (W < 768)  return 20;
    if (W < 1200) return 28;
    return 36;
  }


  function makePetal() {
    return {
      x:     Math.random() * W,
      y:     -30,
      size:  8 + Math.random() * 18,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.9,
      spin:  (Math.random() - 0.5) * 0.045,
      angle: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      alpha: 0.4 + Math.random() * 0.6,
    };
  }


  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }


  function populate() {
    const count = petalCount();
    petals = [];
    for (let i = 0; i < count; i++) {
      const p = makePetal();
      if (i < count * 0.7) {
        p.y = Math.random() * H; 
      }
      petals.push(p);
    }
  }


  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');


  function draw() {
    if (prefersReduced.matches) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    petals.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px Arial, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();

      p.y     += p.speed;
      p.x     += p.drift;
      p.angle += p.spin;

     
      if (p.y > H + 40 || p.x < -40 || p.x > W + 40) {
        Object.assign(p, makePetal());
      }
    });

    animId = requestAnimationFrame(draw);
  }


  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', debounce(() => {
    resize();
    populate();
  }, 200));

  resize();
  populate();
  draw();
}



function initRing() {
  const stage = document.getElementById('ring-stage');
  if (!stage) return;


  function positionSlots() {
    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;

 
    if (stageW === 0) {
      requestAnimationFrame(positionSlots);
      return;
    }

    const cx = stageW / 2;
    const cy = stageH / 2;

  
    const slotSize = Math.min(120, Math.max(52, Math.round(stageW * 0.22)));
    const slotHalf = slotSize / 2;


     */
    function place(el, angleDeg, radius) {
      if (!el) return;
      const rad = toRad(angleDeg - 90);
      const x   = cx + radius * Math.cos(rad) - slotHalf;
      const y   = cy + radius * Math.sin(rad) - slotHalf;

      el.style.cssText = [
        `left: ${x}px`,
        `top: ${y}px`,
        `width: ${slotSize}px`,
        `height: ${slotSize}px`,
        `border-radius: 50%`,
        `overflow: hidden`,
      ].join('; ');
    }

    // Radius cincin: proporsi dari lebar stage
    const rInner = stageW * 0.30;   // Cincin dalam  — 30%
    const rOuter = stageW * 0.435;  // Cincin luar   — 43.5%

    
    stage.querySelectorAll('.ring-orbit--inner .photo-slot')
      .forEach((el, i) => place(el, i * 90, rInner));

 
    stage.querySelectorAll('.ring-orbit--outer .photo-slot')
      .forEach((el, i) => place(el, i * 60, rOuter));

    const emojiFontSize = Math.round(slotSize * 0.45);
    stage.querySelectorAll('.photo-slot').forEach((el) => {
    
      if (!el.querySelector('img')) {
        el.style.fontSize = `${emojiFontSize}px`;
      }
    });
  }


  requestAnimationFrame(positionSlots);


  window.addEventListener('resize', debounce(positionSlots, 120));

  window.addEventListener('load', positionSlots);
}



function initScrollReveal() {


  const observerOptions = {
    threshold: 0.12,   
    rootMargin: '0px 0px -40px 0px', 
  };

 
  function makeObserver(extraOptions = {}) {
    return new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); 
        }
      });
    }, { ...observerOptions, ...extraOptions });
  }

  
  const revealObs = makeObserver();
  document.querySelectorAll('.js-reveal').forEach((el) => revealObs.observe(el));

  
  const quoteObs = makeObserver({ threshold: 0.2 });
  document.querySelectorAll('.js-reveal-quote').forEach((el) => quoteObs.observe(el));

  const tlObs = makeObserver({ threshold: 0.08 });
  document.querySelectorAll('.js-reveal-tl').forEach((el, i) => {
 
    el.style.transitionDelay = `${i * 0.1}s`;
    tlObs.observe(el);
  });

 
  const closingObs = makeObserver({ threshold: 0.15 });
  document.querySelectorAll('.closing .js-reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
    closingObs.observe(el);
  });
}



document.addEventListener('DOMContentLoaded', () => {

  initMusic();        
  initPetals();      
  initRing();         
  initScrollReveal(); 

  document.querySelectorAll('.photo-slot img').forEach((img) => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
  });

});

window.addEventListener('load', () => {
  initRing();
});
