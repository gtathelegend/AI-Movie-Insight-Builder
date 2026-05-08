/* POP — main app */
gsap.registerPlugin(ScrollTrigger);

const D = window.POP_DATA;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

/* ========== RENDER ========== */
function renderPosters() {
  const grid = $('#posterGrid');
  grid.innerHTML = D.trending.map(m => `
    <div class="poster-card" data-card>
      <div class="poster-img" style="background: linear-gradient(135deg, ${m.color} 0%, ${m.color2} 100%); display: flex; align-items: center; justify-content: center;">
        <span class="poster-rank">${m.rank}</span>
        <span class="poster-score">${m.score.toFixed(2)}</span>
        <div style="font-family: 'Bagel Fat One', sans-serif; color: rgba(255,255,255,0.9); font-size: 28px; line-height: 0.9; padding: 24px; text-align: center; text-shadow: 3px 3px 0 rgba(0,0,0,0.3);">${m.title.toUpperCase()}</div>
      </div>
      <div class="poster-info">
        <div class="poster-title">${m.title}</div>
        <div class="poster-meta">${m.year} · ${m.genre} · ${m.runtime}</div>
      </div>
    </div>
  `).join('');
}

function renderDetail() {
  $('#detailSynopsis').textContent = D.detail.synopsis;
  $('#castList').innerHTML = D.detail.cast.map(c => `
    <div class="cast-card">
      <div class="cast-avatar">${c.initials}</div>
      <div class="cast-name">${c.name}</div>
      <div class="cast-role">${c.role}</div>
    </div>
  `).join('');
  $('#scoreNumeric').textContent = '0.00';
}

function renderBreakdown() {
  const grid = $('#breakdownGrid');
  grid.innerHTML = D.detail.breakdown.map(b => `
    <div class="bd-card" data-bd>
      <div class="bd-head">
        <div>
          <div class="bd-name">${b.name}</div>
          <div class="bd-score"><b>${b.score.toFixed(1)}</b> / 10</div>
        </div>
        <div class="bd-icon">${b.icon}</div>
      </div>
      <div class="bd-bar"><div class="bd-bar-fill" data-pct="${b.score * 10}"></div></div>
      <p class="bd-note">${b.note}</p>
    </div>
  `).join('');
}

function renderFilmstrip() {
  const track = $('#filmstripTrack');
  const all = [...D.filmstrip, ...D.filmstrip]; // duplicate for length
  track.innerHTML = all.map((f, i) => {
    const colors = [
      ['#FF3D7F', '#9B5DE5'], ['#FFD23F', '#F4A460'], ['#06D6A0', '#118AB2'],
      ['#EF476F', '#FFD23F'], ['#9B5DE5', '#3A86FF'], ['#FF6B9D', '#C77DFF'],
      ['#FFD23F', '#FF3D7F'], ['#3A86FF', '#9B5DE5']
    ];
    const c = colors[i % colors.length];
    return `
      <div class="frame" style="background: linear-gradient(135deg, ${c[0]}, ${c[1]});">
        <span class="frame-num">FRAME · ${f.num}</span>
        <div class="frame-title">${f.title}</div>
        <div class="frame-meta">${f.meta}</div>
      </div>
    `;
  }).join('');
}

function renderComments() {
  const grid = $('#commentGrid');
  grid.innerHTML = D.comments.map((c, i) => `
    <div class="comment-card ${i % 3 === 0 ? 'tilt-l' : i % 3 === 2 ? 'tilt-r' : ''}" data-comment>
      <div class="comment-head">
        <div class="comment-avatar" style="background: ${c.color};">${c.initials}</div>
        <div>
          <div class="comment-name">${c.name}</div>
          <div class="comment-handle">${c.handle}</div>
        </div>
      </div>
      <div class="comment-stars">${'★'.repeat(c.stars)}${'☆'.repeat(5-c.stars)}</div>
      <div class="comment-text">"${c.text}"</div>
      <div class="comment-foot">
        <span class="comment-time">${c.time}</span>
        <div class="comment-likes">
          <button>♥ ${c.likes}</button>
          <button>💬 ${c.replies}</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSnacks() {
  const bar = $('#snackBar');
  bar.innerHTML = D.snacks.map(s => `
    <div class="snack">
      <div class="snack-icon">${s.icon}</div>
      <div class="snack-name">${s.name}</div>
      <div class="snack-price">${s.price}</div>
    </div>
  `).join('');
}

/* ========== KERNEL PILE (in score bucket) ========== */
function renderKernels(targetScore) {
  const pile = $('#kernelPile');
  pile.innerHTML = '';
  const count = Math.round(targetScore * 60);
  // Random kernel positions inside the bucket region
  for (let i = 0; i < count; i++) {
    const x = 45 + Math.random() * 110;
    const yBase = 205 - (i / count) * 130;
    const y = yBase + (Math.random() - 0.5) * 12;
    const r = 4 + Math.random() * 3;
    const yellow = Math.random() > 0.3 ? '#FFD23F' : '#FFF8E7';
    const k = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    k.setAttribute('cx', x);
    k.setAttribute('cy', y);
    k.setAttribute('r', r);
    k.setAttribute('fill', yellow);
    k.setAttribute('stroke', '#1A1A2E');
    k.setAttribute('stroke-width', '1.5');
    k.classList.add('kernel-svg');
    k.style.opacity = 0;
    pile.appendChild(k);
  }
  // Top fluffy popcorn
  const topCount = 12;
  for (let i = 0; i < topCount; i++) {
    const cx = 50 + (i / topCount) * 100 + (Math.random() - 0.5) * 8;
    const cy = 60 + Math.random() * 12;
    const r = 7 + Math.random() * 4;
    const k = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    k.setAttribute('cx', cx);
    k.setAttribute('cy', cy);
    k.setAttribute('r', r);
    k.setAttribute('fill', '#FFF8E7');
    k.setAttribute('stroke', '#1A1A2E');
    k.setAttribute('stroke-width', '2');
    k.classList.add('kernel-top');
    k.style.opacity = 0;
    pile.appendChild(k);
  }
}

/* ========== SEARCH ========== */
window.popSearch = () => {
  const v = $('#searchInput').value.trim();
  if (!v) return;
  // Smooth scroll to trending; you'd replace with actual results
  document.querySelector('#trending').scrollIntoView({ behavior: 'smooth' });
  // Highlight effect
  gsap.fromTo('.poster-card', 
    { scale: 0.95 },
    { scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.7)' }
  );
};
window.setSearch = (v) => {
  $('#searchInput').value = v;
  $('#searchInput').focus();
};

/* ========== ANIMATIONS ========== */
function curtainReveal(style) {
  const tl = gsap.timeline({ delay: 0.2 });
  
  if (style === 'curtain') {
    document.body.style.overflow = 'hidden';
    tl.to('#curtainL', { x: '-100%', duration: 1.6, ease: 'power3.inOut' }, 0)
      .to('#curtainR', { x: '100%', duration: 1.6, ease: 'power3.inOut' }, 0)
      .add(() => {
        document.body.style.overflow = '';
        $('#curtainL').remove();
        $('#curtainR').remove();
      }, '>-0.3');
  } else if (style === 'kernels') {
    $('#curtainL').remove();
    $('#curtainR').remove();
  } else if (style === 'flicker') {
    gsap.to('#curtainL', { x: '-100%', duration: 0.4 });
    gsap.to('#curtainR', { x: '100%', duration: 0.4 });
    setTimeout(() => { $('#curtainL').remove(); $('#curtainR').remove(); }, 500);
  }
  
  // Hero text reveal
  gsap.set('.reveal-word', { y: 80, opacity: 0 });
  tl.to('.reveal-word', {
    y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.4)'
  }, style === 'curtain' ? 1.0 : 0.2)
  .from('.hero-eyebrow', { y: -20, opacity: 0, duration: 0.5 }, '<-0.2')
  .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.5 }, '<+0.2')
  .from('.search-wrap', { y: 30, opacity: 0, duration: 0.6, ease: 'back.out(1.2)' }, '<')
  .from('.search-suggestions .chip', { y: 10, opacity: 0, stagger: 0.04, duration: 0.3 }, '<+0.2')
  .from('.float-snack', {
    scale: 0, rotation: 'random(-180, 180)', opacity: 0,
    duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)'
  }, '<-0.4');
  
  // Float loop
  $$('.float-snack').forEach((el, i) => {
    gsap.to(el, {
      y: 'random(-15, 15)', x: 'random(-10, 10)', rotation: 'random(-8, 8)',
      duration: 'random(3, 5)', repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: i * 0.2
    });
  });
}

function setupScrollAnims() {
  // Split-text headlines reveal letter-by-letter
  $$('.split-text').forEach(el => {
    const html = el.innerHTML;
    // Wrap each character in a span (preserve existing inner spans)
    const wrapped = html.replace(/(<[^>]+>|.)/g, (m) => {
      if (m.startsWith('<')) return m;
      if (m === ' ') return '<span class="char">&nbsp;</span>';
      return `<span class="char">${m}</span>`;
    });
    el.innerHTML = wrapped;
    
    gsap.from(el.querySelectorAll('.char'), {
      scrollTrigger: { trigger: el, start: 'top 80%' },
      y: 60, opacity: 0, rotateX: -90,
      duration: 0.6, stagger: 0.015, ease: 'back.out(1.5)'
    });
  });
  
  // Section labels & subs
  $$('.section-label, .section-sub').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.5
    });
  });
  
  // Poster cards 3D tilt as they enter
  $$('[data-card]').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 60, rotateY: 25, rotateX: -10, opacity: 0,
      duration: 0.8, ease: 'power3.out', delay: (i % 4) * 0.05
    });
    // Mouse 3D tilt
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 12, rotateX: -py * 12, duration: 0.3, transformPerspective: 800 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
  
  // Detail block
  ScrollTrigger.create({
    trigger: '.detail',
    start: 'top 70%',
    onEnter: () => {
      gsap.from('.detail-poster', { x: -80, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.detail-info', { y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.score-card', { x: 80, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.from('.cast-card', { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.6 });
      animateScore();
    },
    once: true
  });
  
  // Breakdown bars
  $$('[data-bd]').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => {
        gsap.from(card, { y: 50, opacity: 0, duration: 0.6, ease: 'back.out(1.2)' });
        const fill = card.querySelector('.bd-bar-fill');
        const pct = fill.dataset.pct;
        setTimeout(() => fill.style.width = pct + '%', 200);
      },
      once: true
    });
  });
  
  // Filmstrip horizontal scroll (pinned)
  const track = $('#filmstripTrack');
  if (track) {
    const trackWidth = track.scrollWidth;
    const viewWidth = window.innerWidth;
    const distance = trackWidth - viewWidth + 72;
    
    gsap.to(track, {
      x: -distance,
      ease: 'none',
      scrollTrigger: {
        trigger: '.filmstrip-section',
        start: 'top top',
        end: () => `+=${distance + 200}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }
  
  // Comments
  $$('[data-comment]').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      y: 60, opacity: 0, duration: 0.7, ease: 'back.out(1.2)', delay: (i % 3) * 0.1
    });
  });
  
  // Snacks
  ScrollTrigger.create({
    trigger: '.snack-bar',
    start: 'top 85%',
    onEnter: () => {
      gsap.from('.snack', { y: 60, scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' });
    },
    once: true
  });
  
  // Footer
  ScrollTrigger.create({
    trigger: '.footer-grid',
    start: 'top 90%',
    onEnter: () => {
      gsap.from('.footer-grid > *', { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 });
    },
    once: true
  });
  
  // Nav hide/show
  let lastY = 0;
  ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
      const y = self.scroll();
      if (y > lastY && y > 200) $('#nav').classList.add('hidden');
      else $('#nav').classList.remove('hidden');
      lastY = y;
    }
  });
  
  // Popcorn rain — triggered as user scrolls past hero
  setupPopcornRain();
}

/* ========== SCORE ANIMATION ========== */
function animateScore() {
  const target = D.detail.score;
  const style = $('#scoreDisplay').dataset.style;
  
  if (style === 'bucket') {
    renderKernels(target);
    // Animate fill rect rising
    const fillRect = $('#bucketFillRect');
    if (fillRect) {
      gsap.to(fillRect, {
        attr: { y: 210 - (target * 140), height: target * 140 },
        duration: 1.4, ease: 'power2.out'
      });
    }
    // Pop kernels in
    gsap.to('.kernel-svg', {
      opacity: 1, duration: 0.05,
      stagger: { each: 0.025, from: 'random' },
      delay: 0.3
    });
    gsap.fromTo('.kernel-top', 
      { opacity: 0, scale: 0, transformOrigin: 'center' },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)', delay: 1.0 }
    );
  } else if (style === 'ring') {
    $('#scoreDisplay').style.setProperty('--ring-pct', (target * 100) + '%');
  }
  
  // Count-up
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 1.5, ease: 'power2.out',
    onUpdate: () => { $('#scoreNumeric').textContent = obj.v.toFixed(2); }
  });
}

/* ========== POPCORN RAIN ========== */
function setupPopcornRain() {
  const container = $('#popcorn-rain');
  if (!container) return;
  
  // Drop kernels at intervals as user scrolls past hero
  let active = false;
  ScrollTrigger.create({
    trigger: '.trending',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { active = self.isActive; }
  });
  
  setInterval(() => {
    if (!active) return;
    spawnKernel(container);
  }, 280);
  
  // Big bursts at section transitions
  ['.detail', '.breakdown', '.comments'].forEach(sel => {
    ScrollTrigger.create({
      trigger: sel,
      start: 'top 60%',
      onEnter: () => burstKernels(container, 25),
      once: true
    });
  });
}
function spawnKernel(container) {
  const k = document.createElement('div');
  k.className = 'kernel';
  k.textContent = Math.random() > 0.4 ? '🍿' : '🌽';
  k.style.left = Math.random() * 100 + '%';
  k.style.top = '-30px';
  k.style.fontSize = (16 + Math.random() * 16) + 'px';
  container.appendChild(k);
  
  gsap.to(k, {
    y: window.innerHeight + 50,
    x: (Math.random() - 0.5) * 200,
    rotation: Math.random() * 720 - 360,
    duration: 4 + Math.random() * 3,
    ease: 'power1.in',
    onComplete: () => k.remove()
  });
}
function burstKernels(container, n) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => spawnKernel(container), i * 30);
  }
}

/* ========== TWEAKS ========== */
const PALETTES = {
  'candy': { pink: '#FF3D7F', yellow: '#FFD23F', cream: '#FFF8E7', ink: '#1A1A2E' },
  'neon':  { pink: '#FF006E', yellow: '#FFBE0B', cream: '#FFF0F8', ink: '#0A0A2E' },
  'retro': { pink: '#E63946', yellow: '#F4A261', cream: '#FFF4E6', ink: '#264653' },
  'mint':  { pink: '#FF6B9D', yellow: '#06D6A0', cream: '#F1FAEE', ink: '#1D3557' }
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "candy",
  "heroAnim": "curtain",
  "scoreStyle": "bucket",
  "popcornRain": true,
  "marqueeSpeed": 30,
  "tilt3d": true
}/*EDITMODE-END*/;

let TW = { ...TWEAK_DEFAULTS };

function applyTweaks() {
  const p = PALETTES[TW.palette] || PALETTES.candy;
  const root = document.documentElement;
  root.style.setProperty('--pink', p.pink);
  root.style.setProperty('--yellow', p.yellow);
  root.style.setProperty('--cream', p.cream);
  root.style.setProperty('--ink', p.ink);
  // Derived
  root.style.setProperty('--pink-deep', shade(p.pink, -15));
  root.style.setProperty('--yellow-deep', shade(p.yellow, -15));
  root.style.setProperty('--ink-soft', shade(p.ink, 25));
  
  $('#scoreDisplay').dataset.style = TW.scoreStyle;
  if (TW.scoreStyle === 'bucket') {
    animateScore();
  } else {
    $('#scoreDisplay').style.setProperty('--ring-pct', (D.detail.score * 100) + '%');
  }
  
  $('#popcorn-rain').style.display = TW.popcornRain ? '' : 'none';
  
  document.querySelector('.marquee-track').style.animationDuration = TW.marqueeSpeed + 's';
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + Math.round(255 * percent / 100)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + Math.round(255 * percent / 100)));
  const b = Math.max(0, Math.min(255, (num & 255) + Math.round(255 * percent / 100)));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function buildTweaksUI() {
  const body = $('#twBody');
  body.innerHTML = `
    <div class="tw-section">
      <h5>// PALETTE</h5>
      <div class="tw-grid">
        ${Object.entries(PALETTES).map(([k, p]) => `
          <button class="tw-swatch ${TW.palette === k ? 'active' : ''}" data-palette="${k}" 
            style="background: linear-gradient(135deg, ${p.pink} 0%, ${p.pink} 50%, ${p.yellow} 50%, ${p.yellow} 100%);"
            title="${k}"></button>
        `).join('')}
      </div>
    </div>
    <div class="tw-section">
      <h5>// HERO ANIMATION</h5>
      <div class="tw-options">
        <button class="tw-opt ${TW.heroAnim === 'curtain' ? 'active' : ''}" data-anim="curtain">🎭 Curtain reveal</button>
        <button class="tw-opt ${TW.heroAnim === 'kernels' ? 'active' : ''}" data-anim="kernels">🍿 Kernel pop-in</button>
        <button class="tw-opt ${TW.heroAnim === 'flicker' ? 'active' : ''}" data-anim="flicker">💡 Quick flicker</button>
      </div>
    </div>
    <div class="tw-section">
      <h5>// SCORE STYLE</h5>
      <div class="tw-options">
        <button class="tw-opt ${TW.scoreStyle === 'bucket' ? 'active' : ''}" data-score="bucket">🍿 Popcorn bucket fill</button>
        <button class="tw-opt ${TW.scoreStyle === 'ring' ? 'active' : ''}" data-score="ring">⭕ Circular ring</button>
      </div>
    </div>
    <div class="tw-section">
      <h5>// SURPRISES</h5>
      <div class="tw-options">
        <button class="tw-opt ${TW.popcornRain ? 'active' : ''}" data-toggle="popcornRain">🌧️ Popcorn rain on scroll</button>
        <button class="tw-opt ${TW.tilt3d ? 'active' : ''}" data-toggle="tilt3d">🎲 3D poster tilt on hover</button>
      </div>
      <div style="margin-top: 14px;">
        <label class="mono" style="font-size: 11px; color: var(--ink-soft); display: block; margin-bottom: 6px;">MARQUEE SPEED · ${TW.marqueeSpeed}s</label>
        <input type="range" min="10" max="60" value="${TW.marqueeSpeed}" id="marqueeRange" style="width: 100%;">
      </div>
    </div>
    <button class="tw-opt" id="replayHero" style="background: var(--ink); color: var(--yellow); border-color: var(--ink); width: 100%; text-align: center;">↻ Replay hero animation</button>
  `;
  
  // Wire up
  body.querySelectorAll('[data-palette]').forEach(b => b.onclick = () => { TW.palette = b.dataset.palette; saveTweaks(); buildTweaksUI(); applyTweaks(); });
  body.querySelectorAll('[data-anim]').forEach(b => b.onclick = () => { TW.heroAnim = b.dataset.anim; saveTweaks(); buildTweaksUI(); });
  body.querySelectorAll('[data-score]').forEach(b => b.onclick = () => { TW.scoreStyle = b.dataset.score; saveTweaks(); buildTweaksUI(); applyTweaks(); });
  body.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => { TW[b.dataset.toggle] = !TW[b.dataset.toggle]; saveTweaks(); buildTweaksUI(); applyTweaks(); });
  body.querySelector('#marqueeRange').oninput = (e) => { TW.marqueeSpeed = +e.target.value; applyTweaks(); saveTweaks(); buildTweaksUI(); };
  body.querySelector('#replayHero').onclick = () => {
    const cl = document.createElement('div'); cl.className = 'curtain left'; cl.id = 'curtainL';
    const cr = document.createElement('div'); cr.className = 'curtain right'; cr.id = 'curtainR';
    document.body.appendChild(cl); document.body.appendChild(cr);
    gsap.set([cl, cr], { x: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => curtainReveal(TW.heroAnim), 400);
  };
}

function saveTweaks() {
  try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: TW }, '*'); } catch (e) {}
}

/* ========== TWEAKS PROTOCOL ========== */
window.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.type === '__activate_edit_mode') {
    $('#twFab').classList.add('visible');
  } else if (e.data.type === '__deactivate_edit_mode') {
    $('#twFab').classList.remove('visible');
    $('#twPanel').classList.remove('visible');
  }
});

$('#twFab').onclick = () => {
  $('#twPanel').classList.toggle('visible');
  $('#twFab').classList.toggle('visible', !$('#twPanel').classList.contains('visible'));
  buildTweaksUI();
};
$('#twClose').onclick = () => {
  $('#twPanel').classList.remove('visible');
  $('#twFab').classList.add('visible');
};

try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  renderPosters();
  renderDetail();
  renderBreakdown();
  renderFilmstrip();
  renderComments();
  renderSnacks();
  applyTweaks();
  curtainReveal(TW.heroAnim);
  // Wait a tick then setup scroll anims
  setTimeout(() => {
    setupScrollAnims();
    ScrollTrigger.refresh();
  }, 100);
});
