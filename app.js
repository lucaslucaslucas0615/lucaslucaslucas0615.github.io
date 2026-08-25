/* ==========================================
   SHADOW SOVEREIGN INTERACTIVE GAME SCRIPT
   Inspired by Solo Leveling "The System" HUD
   ========================================== */

// 1. Global Player State and Stats Integration
const playerState = {
  level: 1,
  statPoints: 10,
  str: 10,
  agi: 10,
  vit: 10,
  int: 10,
  sen: 10,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  xp: 0,
  xpNeeded: 100,
  rank: "E-RANK",
  unlockedShadows: {
    igrit: false,
    beru: false
  }
};

// Combat Simulation State
const combatState = {
  currentAct: 1,
  currentHp: 100,
  currentMp: 50,
  bossActive: false,
  bossName: "",
  bossHp: 0,
  bossMaxHp: 0,
  activeState: "intro" // intro, state1, state2, boss, win, lose
};

document.addEventListener('DOMContentLoaded', () => {
  setupAudio();
  setupCustomCursor();
  setupStatsSimulator();
  setupRankShowcase();
  setupAriseEffect();
  setupScrollCounters();
  setupQuestNotices();
  setupCampaignGame();
});

/* ==========================================
   2. Programmatic Web Audio Synthesizer
   ========================================== */
let audioCtx = null;

function setupAudio() {
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  document.body.addEventListener('click', initAudio, { once: true });
}

function playSynthSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const dest = audioCtx.destination;

  if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } 
  else if (type === 'warning') {
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.setValueAtTime(660, now + 0.12);
    osc2.frequency.setValueAtTime(885, now);
    osc2.frequency.setValueAtTime(663, now + 0.12);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.2);
    gain.gain.linearRampToValueAtTime(0, now + 0.25);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);
    osc1.start();
    osc2.start();
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }
  else if (type === 'hit') {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const noise = audioCtx.createOscillator(); // low rumble white-like noise
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.2);
  }
  else if (type === 'boss_roar') {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(60, now + 1.2);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(92, now);
    osc2.frequency.linearRampToValueAtTime(62, now + 1.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }
  else if (type === 'levelup') {
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });

    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(100, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(now);
    subOsc.stop(now + 0.8);
  }
  else if (type === 'arise') {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(30, now + 2.5);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(82, now);
    osc2.frequency.linearRampToValueAtTime(32, now + 2.5);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(50, now + 2.0);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 3.0);
    osc2.stop(now + 3.0);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.rank-btn')) {
    playSynthSound('click');
  }
});

/* ==========================================
   3. Custom Cyber HUD Cursor
   ========================================== */
function setupCustomCursor() {
  const cursor = document.querySelector('.custom-cursor') || document.createElement('div');
  const dot = document.querySelector('.custom-cursor-dot') || document.createElement('div');
  
  if (!cursor.parentNode) {
    cursor.className = 'custom-cursor';
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  if (window.matchMedia('(hover: hover)').matches) {
    cursor.style.display = 'block';
    dot.style.display = 'block';
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.glass-card') || e.target.closest('.rank-btn') || e.target.closest('.campaign-item')) {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = 'var(--color-secondary)';
      cursor.style.backgroundColor = 'rgba(208, 188, 255, 0.05)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.glass-card') || e.target.closest('.rank-btn') || e.target.closest('.campaign-item')) {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = 'var(--color-primary)';
      cursor.style.backgroundColor = 'transparent';
    }
  });
}

/* ==========================================
   4. Character Stats Simulator (Level Up)
   ========================================== */
function setupStatsSimulator() {
  const levelVal = document.getElementById('hud-level-val');
  const levelText = document.getElementById('stats-level-num');
  const pointsRemaining = document.getElementById('stat-points-val');
  const confirmBtn = document.getElementById('stat-confirm-btn');

  function calculateDerivedStats() {
    playerState.maxHp = 100 + (playerState.vit - 10) * 15;
    playerState.maxMp = 50 + (playerState.int - 10) * 10;
  }

  window.updateStatsUI = function() {
    calculateDerivedStats();
    pointsRemaining.textContent = playerState.statPoints;
    
    // Update individual values and progress bars
    const statsKeys = ['str', 'agi', 'vit', 'int', 'sen'];
    statsKeys.forEach(stat => {
      const valEl = document.getElementById(`stat-val-${stat}`);
      const fillEl = document.getElementById(`stat-fill-${stat}`);
      if (valEl && fillEl) {
        valEl.textContent = playerState[stat];
        const percentage = Math.min((playerState[stat] / 50) * 100, 100);
        fillEl.style.width = percentage + '%';
      }
    });

    // Update derived UI values
    const manaLabel = document.querySelector('.mana-bar-label span:last-child');
    const manaFill = document.querySelector('.mana-bar-fill');
    if (manaLabel && manaFill) {
      manaLabel.textContent = `${playerState.maxMp} / ${playerState.maxMp}`;
      manaFill.style.width = '100%';
    }

    // Disable plus buttons if no points
    const plusButtons = document.querySelectorAll('.stat-btn-plus');
    plusButtons.forEach(btn => {
      if (playerState.statPoints <= 0) {
        btn.style.opacity = '0.3';
        btn.style.pointerEvents = 'none';
      } else {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      }
    });

    if (playerState.statPoints === 0) {
      confirmBtn.removeAttribute('disabled');
      confirmBtn.classList.add('btn-primary');
      confirmBtn.classList.remove('btn-secondary');
    } else {
      confirmBtn.setAttribute('disabled', 'true');
      confirmBtn.classList.remove('btn-primary');
      confirmBtn.classList.add('btn-secondary');
    }

    // Sync level to HUD
    if (levelVal) levelVal.textContent = playerState.level;
    if (levelText) levelText.textContent = playerState.level;
  };

  const plusButtons = document.querySelectorAll('.stat-btn-plus');
  plusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (playerState.statPoints > 0) {
        const stat = btn.getAttribute('data-stat');
        playerState[stat]++;
        playerState.statPoints--;
        updateStatsUI();
      }
    });
  });

  confirmBtn.addEventListener('click', () => {
    if (playerState.statPoints === 0) {
      // Complete confirmation
      playerState.statPoints = 0; 
      updateStatsUI();
      playSynthSound('levelup');
      triggerLevelUpOverlay();
    }
  });

  function triggerLevelUpOverlay() {
    const overlay = document.getElementById('levelup-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 2500);
  }

  updateStatsUI();
}

/* ==========================================
   5. Hunter Rank Interface & Assessment
   ========================================== */
const RANK_DATA = {
  S: {
    title: "國家級獵人 / S級 (Shadow Sovereign)",
    desc: "擁有毀天滅地的魔力值與不可測量的暗影支配力量。是能獨自應對「S級傳送門」與天災級魔獸的至高存在，能夠將死亡生靈化為聽命於你的不滅影之軍團。",
    str: 99, agi: 99, vit: 95
  },
  A: {
    title: "頂尖精英獵人 / A級",
    desc: "戰略級的核心主力，能在大型公會中擔任副會長或突擊隊長。擁有極為強大的破壞能力與卓越的戰鬥技巧，是人類抗衡高階傳送門的中流柱石。",
    str: 78, agi: 80, vit: 75
  },
  B: {
    title: "精英突擊獵人 / B級",
    desc: "資深戰士，是大型討伐隊的主攻手。魔力輸出穩定且強大，在戰場上能夠敏銳地尋找魔獸破綻，是任何隊伍都渴望招募的精英戰鬥力。",
    str: 62, agi: 58, vit: 60
  },
  C: {
    title: "中堅戰士 / C級",
    desc: "經驗豐富的職業獵人，能夠熟練地應對常規地下城。雖然魔力值有限，但憑藉團隊配合和嫻熟的武器技藝，能夠保障常規任務的安全執行。",
    str: 45, agi: 42, vit: 44
  },
  D: {
    title: "基層戰鬥員 / D級",
    desc: "剛脫離新手的普通獵人。魔力反應輕微，在小規模討伐或低風險門扉中負責後勤配合與邊緣戰鬥，面臨高難度魔獸時會感到非常吃力。",
    str: 28, agi: 30, vit: 25
  },
  E: {
    title: "人類最弱兵器 / E級",
    desc: "最底層的覺醒者，魔力值僅略高於普通人類。哪怕是在最低階的「E級傳送門」中也隨時面臨生命危險，需要依靠超越常人的意志與智慧苟延殘喘。",
    str: 12, agi: 15, vit: 10
  }
};

function setupRankShowcase() {
  const rankButtons = document.querySelectorAll('.rank-btn');
  const badgeLetter = document.getElementById('badge-rank-letter');
  const rankTitle = document.getElementById('rank-title-text');
  const rankDesc = document.getElementById('rank-desc-text');
  const rankStr = document.getElementById('rank-stat-str');
  const rankAgi = document.getElementById('rank-stat-agi');
  const rankVit = document.getElementById('rank-stat-vit');

  function selectRank(rankKey) {
    rankButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.rank-btn-${rankKey.toLowerCase()}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (badgeLetter) {
      badgeLetter.style.transform = 'scale(0.3)';
      badgeLetter.textContent = rankKey;
      badgeLetter.offsetHeight;
      badgeLetter.style.transform = 'scale(1)';
    }

    const data = RANK_DATA[rankKey];
    if (data) {
      if (rankTitle) rankTitle.textContent = data.title;
      if (rankDesc) rankDesc.textContent = data.desc;
      if (rankStr) rankStr.textContent = data.str;
      if (rankAgi) rankAgi.textContent = data.agi;
      if (rankVit) rankVit.textContent = data.vit;
    }
    playerState.rank = rankKey + "-RANK";
  }

  rankButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectRank(btn.getAttribute('data-rank'));
    });
  });

  const awakenAssessmentBtn = document.getElementById('awaken-assessment-btn');
  if (awakenAssessmentBtn) {
    awakenAssessmentBtn.addEventListener('click', () => {
      awakenAssessmentBtn.setAttribute('disabled', 'true');
      awakenAssessmentBtn.textContent = '魔力值掃描中...';
      playSynthSound('warning');

      let count = 0;
      const letterSequence = ['E', 'D', 'C', 'B', 'A', 'S'];
      const interval = setInterval(() => {
        badgeLetter.textContent = letterSequence[count % letterSequence.length];
        badgeLetter.style.transform = 'scale(1.1)';
        setTimeout(() => badgeLetter.style.transform = 'scale(1)', 50);
        count++;
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        
        // Final evaluation based on level or stats. Give S rank if they completed Act 4!
        let chosen = 'B';
        if (playerState.unlockedShadows.beru) {
          chosen = 'S';
        } else if (playerState.unlockedShadows.igrit) {
          chosen = 'A';
        } else if (playerState.level > 2) {
          chosen = 'C';
        } else {
          chosen = 'D';
        }
        
        selectRank(chosen);
        
        const navRank = document.getElementById('hud-rank-val');
        if (navRank) {
          navRank.textContent = chosen + '-RANK';
          navRank.style.textShadow = '0 0 10px var(--color-primary)';
        }

        awakenAssessmentBtn.removeAttribute('disabled');
        awakenAssessmentBtn.textContent = '重新檢測魔力';
        playSynthSound('levelup');
      }, 2500);
    });
  }
}

/* ==========================================
   6. Arise (起來吧) Shadow Particle Effect
   ========================================== */
function setupAriseEffect() {
  const ariseBtn = document.getElementById('arise-btn');
  const ariseOverlay = document.getElementById('arise-overlay');
  if (!ariseBtn) return;

  ariseBtn.addEventListener('click', () => {
    playSynthSound('arise');
    if (ariseOverlay) ariseOverlay.classList.add('active');
    spawnShadowParticles();

    document.querySelectorAll('.glass-card').forEach(card => {
      // Don't modify locked soldiers cards border to glow if they are locked
      if (!card.classList.contains('soldier-locked')) {
        card.style.borderColor = 'var(--color-secondary)';
        card.style.boxShadow = '0 0 30px rgba(208, 188, 255, 0.4)';
      }
    });

    setTimeout(() => {
      if (ariseOverlay) ariseOverlay.classList.remove('active');
      document.querySelectorAll('.glass-card').forEach(card => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    }, 4000);
  });

  function spawnShadowParticles() {
    const container = document.body;
    const particleCount = 120;
    
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'arise-particle';
      const left = Math.random() * window.innerWidth;
      const top = window.pageYOffset + window.innerHeight * (0.5 + Math.random() * 0.5);
      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 1.5;
      const duration = Math.random() * 2 + 1.5;
      
      p.style.left = left + 'px';
      p.style.top = top + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.opacity = Math.random() * 0.7 + 0.3;
      p.style.boxShadow = `0 0 ${size * 2}px var(--color-secondary)`;
      p.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.2, 1) ${delay}s, opacity ${duration}s ease ${delay}s`;

      container.appendChild(p);
      p.offsetHeight;

      const driftX = (Math.random() - 0.5) * 200;
      const riseY = -(Math.random() * 300 + 200);
      p.style.transform = `translate(${driftX}px, ${riseY}px) scale(0)`;
      p.style.opacity = '0';

      setTimeout(() => p.remove(), (duration + delay) * 1000);
    }
  }
}

/* ==========================================
   7. Scroll Counters
   ========================================== */
function setupScrollCounters() {
  const counters = document.querySelectorAll('.roll-counter');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNum = parseFloat(target.getAttribute('data-target'));
        const isDecimal = target.getAttribute('data-decimal') === 'true';
        const suffix = target.getAttribute('data-suffix') || '';
        
        animateCounter(target, targetNum, isDecimal, suffix);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

  function animateCounter(el, targetNum, isDecimal, suffix) {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateNum(nowTime) {
      const elapsed = nowTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * (targetNum - start);
      
      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateNum);
      } else {
        el.textContent = (isDecimal ? targetNum.toFixed(1) : targetNum.toLocaleString()) + suffix;
      }
    }
    requestAnimationFrame(updateNum);
  }
}

/* ==========================================
   8. Random Quest Alerts & Modal Controls
   ========================================== */
function setupQuestNotices() {
  const questModal = document.getElementById('quest-modal');
  const closeBtn = document.getElementById('quest-close-btn');
  const acceptBtn = document.getElementById('quest-accept-btn');
  const declineBtn = document.getElementById('quest-decline-btn');
  const noticeCloseBtn = document.getElementById('notice-close-btn');
  const noticePanel = document.getElementById('hud-notice-panel');

  setTimeout(() => {
    if (noticePanel) {
      noticePanel.style.display = 'block';
      playSynthSound('warning');
    }
  }, 5000);

  if (noticeCloseBtn && noticePanel) {
    noticeCloseBtn.addEventListener('click', () => {
      noticePanel.style.transform = 'translateY(100px) scale(0.8)';
      noticePanel.style.opacity = '0';
      setTimeout(() => noticePanel.remove(), 500);
    });
  }

  const dailyQuestTrigger = document.getElementById('daily-quest-trigger');
  if (dailyQuestTrigger) {
    dailyQuestTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (questModal) {
        questModal.classList.add('active');
        playSynthSound('warning');
      }
    });
  }

  function closeQuestModal() {
    if (questModal) questModal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeQuestModal);
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      closeQuestModal();
      playSynthSound('levelup');
      // Award 5 stat points for daily quest completion!
      playerState.statPoints += 5;
      if (window.updateStatsUI) window.updateStatsUI();
      alert('【系統通知】每日任務已接受！系統發放屬性點數 +5 點獎勵！請到下方面板分配點數。');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      playSynthSound('warning');
      alert('【系統警告】拒絕任務將立刻觸發「懲罰任務 (Penalty Quest)」，於沙漠地下城存活 4 小時！\n\n系統已強制鎖定您的「接受」按鈕。');
      declineBtn.style.display = 'none';
      acceptBtn.style.padding = '12px 60px';
      acceptBtn.textContent = '被迫接受';
    });
  }
}

/* ==========================================
   9. Playable Story Campaign Engine
   ========================================== */
function setupCampaignGame() {
  const logScreen = document.getElementById('combat-log-screen');
  const storyText = document.getElementById('combat-story-text');
  const logHistory = document.getElementById('combat-log-history');
  const choicesPanel = document.getElementById('combat-choices-panel');
  const startBtn = document.getElementById('campaign-start-btn');
  const consolePanel = document.getElementById('campaign-console-panel');

  // HUD elements
  const hpFill = document.getElementById('combat-hp-fill');
  const hpVal = document.getElementById('combat-hp-val');
  const mpFill = document.getElementById('combat-mp-fill');
  const mpVal = document.getElementById('combat-mp-val');

  // Boss HUD
  const bossHud = document.getElementById('boss-hud-panel');
  const bossNameTxt = document.getElementById('boss-name-txt');
  const bossHpValTxt = document.getElementById('boss-hp-val-txt');
  const bossHpFill = document.getElementById('boss-hp-fill');

  // Campaign database
  const CAMPAIGNS = {
    1: {
      name: "ACT 1: 雙重地下城",
      desc: "神殿中央的巨神像雙眼發出致命的猩紅射線，石侍侍衛合圍。您的小命危在旦夕！",
      hp: 100, mp: 50, boss: false,
      start: function() {
        combatState.currentHp = 100;
        combatState.currentMp = 50;
        updateCombatHUD();
        hideBossHUD();
        logHistory.innerHTML = "";
        
        writeStory("【系統載入戰役：雙重地下城】\n您被困在隱藏的卡爾提農神殿。神像雙眼突然睜開，發射毀滅性的猩紅射線！三名討伐隊員被瞬間氣化，巨型石侍騎士合圍上來。您要怎麼做？");
        writeChoices([
          { text: "立刻向神殿出口狂奔", action: () => act1Run() },
          { text: "立刻趴伏在地，降低身形", action: () => act1Prone() }
        ]);
      }
    },
    2: {
      name: "ACT 2: 罰時沙丘與背叛之門",
      desc: "因未完成日常任務，您被傳送至沙蟲橫行的懲罰沙原；隨後在C級門內遭遇黃東石隊伍背叛。",
      hp: 120, mp: 60, boss: false,
      start: function() {
        combatState.currentHp = 120;
        combatState.currentMp = 60;
        updateCombatHUD();
        hideBossHUD();
        logHistory.innerHTML = "";

        writeStory("【系統載入戰役：罰時沙丘與背叛之門】\n由於未完成日常任務，您被系統懲罰傳送至漫天黃沙的罰時沙原。地面猛烈震動，數條百米長的【毒牙巨沙蟲】鑽地而出，發出狂暴的撕咬！");
        writeChoices([
          { text: `[敏捷檢定 ≥ 14] 展開瞬步滑步躲避沙蟲 (目前敏捷: ${playerState.agi})`, action: () => act2SandstormDash() },
          { text: "拔刀與沙蟲正面搏殺", action: () => act2SandstormFight() }
        ]);
      }
    },
    3: {
      name: "ACT 3: 轉職挑戰：耶格利特",
      desc: "挑戰轉職地下城。擊敗守門鐵甲騎士群，與王座上的血色將領耶格利特進行致命對決！",
      hp: 150, mp: 80, boss: true,
      start: function() {
        combatState.currentHp = 150;
        combatState.currentMp = 80;
        combatState.bossHp = 100;
        combatState.bossMaxHp = 100;
        combatState.bossName = "血色指揮官耶格利特";
        updateCombatHUD();
        showBossHUD();
        logHistory.innerHTML = "";

        writeStory("【系統載入戰役：轉職地下城】\n您步入了深淵鐵甲王座。前血色將軍——【血色指揮官耶格利特】緩緩拔出猩紅大劍站起，散發出沉重的威壓。無數幽靈步兵持槍合圍。");
        writeChoices([
          { text: `[體力檢定 ≥ 14] 用肉身硬抗長槍陣突圍 (目前體力: ${playerState.vit})`, action: () => act3VitalityRush() },
          { text: "嘗試用匕首格擋槍陣", action: () => act3BlockDefend() }
        ]);
      }
    },
    4: {
      name: "ACT 4: 濟州島：蟻王討伐戰",
      desc: "S級天災 Jeju Island 戰役。擊敗日本與韓國獵人毫無招架之力的恐怖魔王——蟻王貝爾！",
      hp: 200, mp: 100, boss: true,
      start: function() {
        combatState.currentHp = 200;
        combatState.currentMp = 100;
        combatState.bossHp = 200;
        combatState.bossMaxHp = 200;
        combatState.bossName = "蟻王貝爾";
        updateCombatHUD();
        showBossHUD();
        logHistory.innerHTML = "";

        writeStory("【系統載入戰役：濟州島蟻王】\nS級 Jeju Island 戰場。無數強大S級獵人被瞬間撕碎。生雙翼的魔王【蟻王貝爾】浮在空中發出狂暴的咆哮，直取您的頭顱！");
        writeChoices([
          { text: "【影之將軍召喚】召喚耶格利特率盾兵阻擋 (需已提取耶格利特)", action: () => act4SummonIgrit() },
          { text: "單刀正面迎擊蟻王衝刺", action: () => act4FaceCharge() }
        ]);
      }
    }
  };

  // Helper bindings
  function writeStory(text) {
    storyText.textContent = text;
  }

  function addLog(text, type = "info") {
    const entry = document.createElement('div');
    entry.className = `log-entry log-entry-${type}`;
    entry.textContent = text;
    logHistory.appendChild(entry);
    logHistory.scrollTop = logHistory.scrollHeight;
  }

  function writeChoices(choices) {
    choicesPanel.innerHTML = "";
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = "btn btn-secondary btn-sm";
      btn.innerHTML = c.text;
      btn.addEventListener('click', () => {
        playSynthSound('click');
        c.action();
      });
      choicesPanel.appendChild(btn);
    });
  }

  function triggerScreenShake() {
    consolePanel.classList.add('shake-element');
    setTimeout(() => {
      consolePanel.classList.remove('shake-element');
    }, 300);
  }

  function updateCombatHUD() {
    // Player Health
    const hpPercent = Math.max((combatState.currentHp / CAMPAIGNS[combatState.currentAct].hp) * 100, 0);
    hpFill.style.width = hpPercent + "%";
    hpVal.textContent = `${Math.max(combatState.currentHp, 0)}/${CAMPAIGNS[combatState.currentAct].hp}`;

    // Player Mana
    const mpPercent = Math.max((combatState.currentMp / CAMPAIGNS[combatState.currentAct].mp) * 100, 0);
    mpFill.style.width = mpPercent + "%";
    mpVal.textContent = `${Math.max(combatState.currentMp, 0)}/${CAMPAIGNS[combatState.currentAct].mp}`;

    // Boss Health
    if (combatState.bossActive && bossHud.style.display !== 'none') {
      const bossPercent = Math.max((combatState.bossHp / combatState.bossMaxHp) * 100, 0);
      bossHpFill.style.width = bossPercent + "%";
      bossHpValTxt.textContent = `${Math.max(combatState.bossHp, 0)}/${combatState.bossMaxHp}`;
    }
  }

  function showBossHUD() {
    combatState.bossActive = true;
    bossHud.style.display = 'block';
    bossNameTxt.textContent = `BOSS: ${combatState.bossName}`;
    updateCombatHUD();
  }

  function hideBossHUD() {
    combatState.bossActive = false;
    bossHud.style.display = 'none';
  }

  // Bind Act Selection tabs
  const campaignItems = document.querySelectorAll('.campaign-item');
  campaignItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('locked')) {
        playSynthSound('warning');
        alert('【系統鎖定】前置戰役尚未通關，無法啟動傳送門！');
        return;
      }
      
      campaignItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const act = parseInt(item.getAttribute('data-act'));
      combatState.currentAct = act;
      
      hideBossHUD();
      writeStory(`【系統就緒】\n已鎖定傳送波：${CAMPAIGNS[act].name}。\n難度及簡介：${CAMPAIGNS[act].desc}`);
      choicesPanel.innerHTML = '<button class="btn btn-primary" id="campaign-start-btn">開始戰役</button>';
      
      // Rebind start button
      document.getElementById('campaign-start-btn').addEventListener('click', () => {
        playSynthSound('click');
        CAMPAIGNS[act].start();
      });
    });
  });

  // Start campaign button binding
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      CAMPAIGNS[1].start();
    });
  }

  // --- Campaign Act Action Logic ---

  // ACT 1 logic
  function act1Run() {
    combatState.currentHp -= 50;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    addLog("● 神像射線橫掃大門！三名隊員被氣化，您被衝擊波重傷，HP -50！", "damage");
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("神像紅色死光擊穿了您的胸口。");
      return;
    }

    writeStory("神侍騎士手持盾牌與巨劍合圍。神殿內還有樂器石像。此時神像蓄力再次鎖定您，您要如何應對？");
    writeChoices([
      { text: "與石侍騎士拚死搏殺", action: () => act1AttackStatues() },
      { text: "跑向彈奏樂器的石像尋求庇護", action: () => act1MusicStatues() }
    ]);
  }

  function act1Prone() {
    addLog("● 您迅速趴倒避開了橫掃射線。地面發燙但您的 HP 未減！", "heal");
    writeStory("石侍騎士手持盾牌與長劍開始合圍，神像的雙眼再次凝聚魔力光點蓄能。您發現殿堂內有些石侍拿著豎琴、鼓等樂器...");
    writeChoices([
      { text: "揮拳試圖破壞鐵甲石侍的防護", action: () => act1AttackStatues() },
      { text: "立刻朝著彈奏樂器的石像跑去", action: () => act1MusicStatues() }
    ]);
  }

  function act1AttackStatues() {
    combatState.currentHp -= 40;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    addLog("● 您的鐵拳砸在石盾上震得骨折！石侍巨劍橫掃，HP -40！", "damage");

    if (combatState.currentHp <= 0) {
      triggerDefeat("石侍的巨劍將您攔腰斬斷。");
      return;
    }

    writeStory("石侍逼近，神像拔地而起大步邁步踩踏！您發現祭壇藍火燃起，您要決定最後的行動：");
    writeChoices([
      { text: `[智力檢定 ≥ 12] 分析第三戒律：獻祭信仰 (目前智力: ${playerState.int})`, action: () => act1AltarSuccess() },
      { text: "拼盡全力向大門縫隙衝刺逃生", action: () => act1AltarFail() }
    ]);
  }

  function act1MusicStatues() {
    addLog("● 豎琴石侍演奏出悠揚的古樂，合圍的石侍紛紛停下了攻擊！", "info");
    writeStory("巨神像緩緩從王座站起，龐大的陰影籠罩神殿。祭壇發出湛藍聖火，大門裂開一條縫隙，您要如何證明您的信仰？");
    writeChoices([
      { text: `[智力檢定 ≥ 12] 分析第三戒律：獻祭與臣服 (目前智力: ${playerState.int})`, action: () => act1AltarSuccess() },
      { text: "拼盡全力朝門扉處奔跑逃走", action: () => act1AltarFail() }
    ]);
  }

  function act1AltarSuccess() {
    if (playerState.int >= 12) {
      addLog("● 智力檢定通過！您理解了獻祭之意，召集獵人留在祭壇中央卡槽。", "info");
      addLog("● 祭壇藍色火焰衝天，大門完全打開！獵人紛紛逃走，但您小腿被砍斷留下了...", "heal");
      triggerVictory("您在生死關頭被『系統』選中，成為唯一能不斷升級的獵人！戰役 Act 1 通關！\n系統發放獎勵：\nEXP +500 (等級提升至 LV.2！獲得 10 點屬性點數！)");
      
      // Reward Level Up
      playerState.level = 2;
      playerState.statPoints += 10;
      if (window.updateStatsUI) window.updateStatsUI();

      // Unlock Act 2
      const act2 = document.getElementById('campaign-item-2');
      if (act2) act2.classList.remove('locked');
    } else {
      addLog(`● 智力檢定失敗！(需要 12 點，您目前為 ${playerState.int} 點) 您無法看破第三條戒律的真諦！`, "damage");
      combatState.currentHp -= 100;
      triggerScreenShake();
      updateCombatHUD();
      triggerDefeat("巨神像巨大的腳掌落了下來，踩碎了祭壇與您的靈魂。");
    }
  }

  function act1AltarFail() {
    combatState.currentHp -= 100;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    triggerDefeat("神像拔山倒海的一拳擊碎了門戶，將狂奔的您砸成了齏粉。");
  }

  // ACT 2 logic
  function act2SandstormDash() {
    if (playerState.agi >= 14) {
      addLog("● 敏捷檢定通過！您使出極速瞬步在沙丘間穿行，躲過了沙蟲的撕咬！", "info");
      addLog("● 4 小時懲罰時限歸零，您化作光華傳送回現實！", "heal");
      
      writeStory("【回到現實：背叛之門】\n您與黃東石隊伍進入C級門，討伐了毒蛛領主。然而黃東石為獨吞寶藏封鎖出口，欲加害您。系統頒布抹殺令：『抹殺所有敵對目標！』黃東石獰笑砍來！");
      writeChoices([
        { text: `[力量檢定 ≥ 14] 用 Knight Killer 匕首正面突破防禦 (目前力量: ${playerState.str})`, action: () => act2DungeonSuccess() },
        { text: "嘗試求饒以求和平解決", action: () => act2DungeonFail() }
      ]);
    } else {
      addLog(`● 敏捷檢定失敗！(需要 14 點，目前 ${playerState.agi} 點)`, "damage");
      combatState.currentHp -= 60;
      triggerScreenShake();
      playSynthSound('hit');
      updateCombatHUD();
      addLog("● 沙蟲掃尾將您掃飛，HP -60！您渾身骨折狼狽躲過其餘攻擊，直到時間耗盡傳送。", "damage");
      
      writeStory("【傷痕累累回到現實：背叛之門】\n在C級地下城中被黃東石小隊封鎖並襲擊。系統抹殺任務啟動：『抹殺威脅者』！黃東石雙手握劍斬向重傷的您！");
      writeChoices([
        { text: `[力量檢定 ≥ 14] 爆發全身力量發動正面致命反擊 (目前力量: ${playerState.str})`, action: () => act2DungeonSuccess() },
        { text: "拼死側躍翻滾躲避重劍", action: () => act2DungeonFail() }
      ]);
    }
  }

  function act2SandstormFight() {
    combatState.currentHp -= 70;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    addLog("● 您的匕首崩裂在沙蟲的鐵甲上！被狂暴沙蟲攔腰一咬，HP -70！", "damage");
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("您淪為了巨型沙蟲的胃中物。");
      return;
    }

    writeStory("時間耗盡傳送回現實。黃東石一夥封鎖了毒蛛洞口，露出獠牙！系統抹殺令：『除掉對您有殺意的目標。』敵方揮劍劈下！");
    writeChoices([
      { text: `[力量檢定 ≥ 14] 拼死握緊備用刀發動極速反擊 (目前力量: ${playerState.str})`, action: () => act2DungeonSuccess() },
      { text: "抱頭蜷縮尋求防守", action: () => act2DungeonFail() }
    ]);
  }

  function act2DungeonSuccess() {
    if (playerState.str >= 14) {
      addLog("● 力量檢定通過！您手中的匕首灌注魔力，一擊斬斷黃東石重劍，穿刺其心臟！", "info");
      addLog("● 突擊隊伏擊者盡數被您抹殺。在黃東石絕望求饒中將其處決。", "heal");
      triggerVictory("黃東石已被抹殺。您獲得了致命戰利品！\n系統發放獎勵：\nEXP +1000 (等級提升至 LV.3！獲得 5 點屬性點數！)\n解鎖 B-Rank 穿甲武器【騎士殺手 (Knight Killer)】！");
      
      // Reward Level Up
      playerState.level = 3;
      playerState.statPoints += 5;
      if (window.updateStatsUI) window.updateStatsUI();

      // Unlock Act 3
      const act3 = document.getElementById('campaign-item-3');
      if (act3) act3.classList.remove('locked');
    } else {
      addLog(`● 力量檢定失敗！(需要 14 點，目前 ${playerState.str} 點) 您軟弱的刀刃被黃東石的重劍震飛！`, "damage");
      combatState.currentHp -= 120;
      triggerScreenShake();
      updateCombatHUD();
      triggerDefeat("黃東石小隊的一輪圍攻將您無情分屍。");
    }
  }

  function act2DungeonFail() {
    combatState.currentHp -= 120;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    triggerDefeat("背叛者無情嘲笑，巨劍穿心，您的升級旅程在此終結。");
  }

  // ACT 3 logic
  function act3VitalityRush() {
    if (playerState.vit >= 14) {
      addLog("● 體力檢定通過！您宛如人形坦克撞開長槍，HP 未受損！", "info");
      enterIgritFight();
    } else {
      combatState.currentHp -= 40;
      triggerScreenShake();
      playSynthSound('hit');
      updateCombatHUD();
      addLog("● 您的護甲被槍林刺穿多處，HP -40！您浴血衝向耶格利特的王座！", "damage");
      
      if (combatState.currentHp <= 0) {
        triggerDefeat("您在衝鋒中被騎士長槍刺穿成刺蝟。");
        return;
      }
      enterIgritFight();
    }
  }

  function act3BlockDefend() {
    combatState.currentHp -= 50;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    addLog("● 騎士長槍力量萬鈞，震飛了您的匕首，HP -50！您負傷突圍直奔王座！", "damage");
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("您在招架中被無數魔裝幽靈兵踩死。");
      return;
    }
    enterIgritFight();
  }

  function enterIgritFight() {
    writeStory("【最終對決：血色將軍耶格利特】\n耶格利特猩紅雙眼鎖定您，揮舞紅劍施展重力劈斬！請進行戰術指令決戰！");
    writeChoices([
      { text: `[敏捷檢定 ≥ 16] 刀刃穿切側翼，施展急速連斬 (目前敏捷: ${playerState.agi})`, action: () => act3DuelQuickCut() },
      { text: "雙手持匕首正面硬接紅劍", action: () => act3DuelClash() },
      { text: "【耗費 15 MP】釋放突刺毒刃技能", action: () => act3DuelSkill() }
    ]);
  }

  function act3DuelQuickCut() {
    if (playerState.agi >= 16) {
      addLog("● 敏捷檢定通過！您身如殘影避開紅劍，並砍擊耶格利特關節，Boss HP -50！", "heal");
      combatState.bossHp -= 50;
    } else {
      addLog(`● 敏捷檢定失敗！(需要 16 點，目前 ${playerState.agi} 點)`, "damage");
      addLog("● 您的速度慢了！被大劍斬裂肩膀，HP -40！Boss HP -20！", "damage");
      combatState.bossHp -= 20;
      combatState.currentHp -= 40;
      triggerScreenShake();
      playSynthSound('hit');
    }
    checkIgritFightState();
  }

  function act3DuelClash() {
    addLog("● 金鐵交鳴！正面撞擊，您被砸落骨折，HP -50！Boss HP -30！", "damage");
    combatState.bossHp -= 30;
    combatState.currentHp -= 50;
    triggerScreenShake();
    playSynthSound('hit');
    checkIgritFightState();
  }

  function act3DuelSkill() {
    if (combatState.currentMp >= 15) {
      combatState.currentMp -= 15;
      addLog("● 消耗 15 MP！匕首淬毒閃光，精準刺入重鎧縫隙，Boss HP -60！", "heal");
      combatState.bossHp -= 60;
      combatState.currentHp -= 10;
      addLog("● 耶格利特揮盾反擊，HP -10。", "damage");
    } else {
      addLog("● MP 不足！技能釋放失敗！您被大劍無情掃飛，HP -50！", "damage");
      combatState.currentHp -= 50;
      triggerScreenShake();
      playSynthSound('hit');
    }
    checkIgritFightState();
  }

  function checkIgritFightState() {
    updateCombatHUD();
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("您在對決中倒在耶格利特的紅劍之下。");
      return;
    }

    if (combatState.bossHp <= 0) {
      // Win!
      addLog("● 耶格利特大劍跌落，單膝跪倒在地，魔力核心碎裂。", "info");
      addLog("● 您深吸一口氣，發動君王提取，大喝：『起來吧 (ARISE)！』", "heal");
      playSynthSound('arise');
      
      // Perform screen flash
      const ariseOverlay = document.getElementById('arise-overlay');
      if (ariseOverlay) {
        ariseOverlay.classList.add('active');
        setTimeout(() => ariseOverlay.classList.remove('active'), 2500);
      }

      // Unlock Igrit Card visually
      playerState.unlockedShadows.igrit = true;
      const igritCard = document.getElementById('soldier-card-igrit');
      const igritStatus = document.getElementById('soldier-lock-status-igrit');
      if (igritCard && igritStatus) {
        igritCard.classList.remove('soldier-locked');
        igritStatus.textContent = "(已解鎖 - 影之將軍)";
        igritStatus.style.color = "var(--color-primary)";
      }

      triggerVictory("血色指揮官耶格利特已被提取為影之將軍！\n系統發放獎勵：\nEXP +2000 (等級提升至 LV.4！獲得 5 點屬性點數！)\n解鎖影之降領【耶格利特 (Igrit)】協同作戰！");
      
      playerState.level = 4;
      playerState.statPoints += 5;
      if (window.updateStatsUI) window.updateStatsUI();

      // Unlock Act 4
      const act4 = document.getElementById('campaign-item-4');
      if (act4) act4.classList.remove('locked');
      
      hideBossHUD();
    } else {
      // Continue fight
      writeStory("耶格利特怒嘯狂擊，盔甲崩裂流血。請下達決戰指令：");
      writeChoices([
        { text: "【敏捷檢定 ≥ 16】以滑步匕首致命背刺", action: () => act3DuelQuickCut() },
        { text: "與耶格利特雙刃死磕", action: () => act3DuelClash() },
        { text: "【耗費 15 MP】施展毒刺刃", action: () => act3DuelSkill() }
      ]);
    }
  }

  // ACT 4 logic
  function act4SummonIgrit() {
    if (playerState.unlockedShadows.igrit) {
      addLog("● 君王提取：『耶格利特！』血色騎士帶領重裝步兵盾牌防線築起！", "info");
      addLog("● 耶格利特抵擋了蟻王的劇毒音波衝擊，HP 未減！您獲得了絕佳刺殺機會！", "heal");
      enterBeruFight();
    } else {
      addLog("● 您尚未解鎖耶格利特！無法召喚部屬！", "damage");
      combatState.currentHp -= 70;
      triggerScreenShake();
      playSynthSound('hit');
      updateCombatHUD();
      addLog("● 蟻王羽翼閃爍殘影，利爪劃破長空撕碎您的護手，HP -70！", "damage");
      
      if (combatState.currentHp <= 0) {
        triggerDefeat("您在單打獨鬥中被蟻王撕裂啃咬致死。");
        return;
      }
      enterBeruFight();
    }
  }

  function act4FaceCharge() {
    combatState.currentHp -= 80;
    triggerScreenShake();
    playSynthSound('hit');
    updateCombatHUD();
    addLog("● 蟻王巨爪與您的武器猛烈碰撞！恐怖的力道將您重重轟在洞壁，HP -80！", "damage");
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("您被蟻王恐怖的力量碾成了血霧。");
      return;
    }
    enterBeruFight();
  }

  function enterBeruFight() {
    writeStory("【天災決戰：蟻王貝爾】\n蟻王化作黑影在洞中飛速滑行，長矛般的尖刺不斷射向您。請釋放神話武器指令！");
    writeChoices([
      { text: `[力量與敏捷檢定 ≥ 20] 揮舞卡米什的狂怒匕首發動『絕影雙斬』 (目前力量: ${playerState.str}, 敏捷: ${playerState.agi})`, action: () => act4DuelSupremeCut() },
      { text: "一般短劍極速交刃刺擊", action: () => act4DuelPoke() },
      { text: "【耗費 20 MP】命令將軍耶格利特合擊打斷其攻勢 (需已解鎖耶格利特)", action: () => act4DuelIgritSkill() }
    ]);
  }

  function act4DuelSupremeCut() {
    if (playerState.str >= 20 && playerState.agi >= 20) {
      addLog("● 力量與敏捷雙重檢定通過！卡米什短劍引發狂暴龍威，斬斷蟻王雙翼，Boss HP -120！", "heal");
      combatState.bossHp -= 120;
      combatState.currentHp -= 20;
      addLog("● 蟻王狂暴反噬，利爪掃過您的手臂，HP -20。", "damage");
    } else {
      addLog(`● 檢定未通過！(需要力敏皆 20 點。力量: ${playerState.str}, 敏捷: ${playerState.agi})`, "damage");
      addLog("● 您無法發揮卡米什的真實龍威！招式露出大破綻，被蟻王連劃三爪，HP -60！Boss HP -30！", "damage");
      combatState.currentHp -= 60;
      combatState.bossHp -= 30;
      triggerScreenShake();
      playSynthSound('hit');
    }
    checkBeruFightState();
  }

  function act4DuelPoke() {
    addLog("● 雙刃極速搏命切割！金光四濺，您胸口受擊，HP -50！Boss HP -45！", "damage");
    combatState.bossHp -= 45;
    combatState.currentHp -= 50;
    triggerScreenShake();
    playSynthSound('hit');
    checkBeruFightState();
  }

  function act4DuelIgritSkill() {
    if (!playerState.unlockedShadows.igrit) {
      addLog("● 召喚失敗！尚未擁有耶格利特影子！被蟻王極速割傷，HP -60！", "damage");
      combatState.currentHp -= 60;
      triggerScreenShake();
      playSynthSound('hit');
      checkBeruFightState();
      return;
    }

    if (combatState.currentMp >= 20) {
      combatState.currentMp -= 20;
      addLog("● 消耗 20 MP！耶格利特狂暴斬擊阻斷蟻王退路，您趁機一擊貫穿蟻王喉嚨，Boss HP -90！", "heal");
      combatState.bossHp -= 90;
      combatState.currentHp -= 10;
      addLog("● 蟻王尾刺刺中您的肩膀，HP -10。", "damage");
    } else {
      addLog("● MP 不足！合擊失敗！您被蟻王衝撞吐血，HP -55！", "damage");
      combatState.currentHp -= 55;
      triggerScreenShake();
      playSynthSound('hit');
    }
    checkBeruFightState();
  }

  function checkBeruFightState() {
    updateCombatHUD();
    
    if (combatState.currentHp <= 0) {
      triggerDefeat("您在討伐戰中倒在蟻王貝爾狂暴的噬咬下。");
      return;
    }

    if (combatState.bossHp <= 0) {
      // Complete Act 4 Victory!
      addLog("● 蟻王貝爾雙翼撕碎，悲鳴一聲跪倒在地，生命之火消散。", "info");
      addLog("● 您傲立虛空，張開雙臂引發無窮黑霧，大喝：『起來吧 (ARISE)！』", "heal");
      playSynthSound('arise');
      
      const ariseOverlay = document.getElementById('arise-overlay');
      if (ariseOverlay) {
        ariseOverlay.classList.add('active');
        setTimeout(() => ariseOverlay.classList.remove('active'), 2500);
      }

      // Unlock Beru Card visually
      playerState.unlockedShadows.beru = true;
      const beruCard = document.getElementById('soldier-card-beru');
      const beruStatus = document.getElementById('soldier-lock-status-beru');
      if (beruCard && beruStatus) {
        beruCard.classList.remove('soldier-locked');
        beruStatus.textContent = "(已解鎖 - 影之將軍)";
        beruStatus.style.color = "var(--color-primary)";
      }

      triggerVictory("蟻王貝爾已被收服為您的影之將軍！暗影軍團至高覺醒！\n系統發放獎勵：\nEXP +5000 (等級提升至 LV.5 巔峰！獲得 10 點屬性點數！)\n解鎖影之將領【貝爾 (Beru)】！\n至高暗影君王神座，在此歸位！");
      
      playerState.level = 5;
      playerState.statPoints += 10;
      if (window.updateStatsUI) window.updateStatsUI();

      hideBossHUD();
    } else {
      // Continue fight
      writeStory("蟻王貝爾雙眼充血發狂，魔力爆發。請指示絕殺進攻：");
      writeChoices([
        { text: `[力量與敏捷檢定 ≥ 20] 卡米什的狂怒『絕影雙斬』 (目前力敏: ${playerState.str}/${playerState.agi})`, action: () => act4DuelSupremeCut() },
        { text: "一般匕首近身瘋狂連切", action: () => act4DuelPoke() },
        { text: "【耗費 20 MP】耶格利特協同合擊 (需已解鎖耶格利特)", action: () => act4DuelIgritSkill() }
      ]);
    }
  }

  // Combat termination helpers
  function triggerVictory(victoryText) {
    writeStory(`【戰役大勝利：任務完成】\n${victoryText}`);
    choicesPanel.innerHTML = '<button class="btn btn-primary" id="campaign-reset-btn">返回戰役目錄</button>';
    playSynthSound('levelup');
    
    // Bind reset back button
    document.getElementById('campaign-reset-btn').addEventListener('click', () => {
      playSynthSound('click');
      resetToActList();
    });
  }

  function triggerDefeat(defeatText) {
    writeStory(`【戰役失敗：您已死亡】\n${defeatText}\n\n「系統提示：未按時存活者生命值清空，請重新來過。」`);
    choicesPanel.innerHTML = '<button class="btn btn-primary" id="campaign-restart-battle-btn">重試本關</button>';
    playSynthSound('warning');

    document.getElementById('campaign-restart-battle-btn').addEventListener('click', () => {
      playSynthSound('click');
      CAMPAIGNS[combatState.currentAct].start();
    });
  }

  function resetToActList() {
    writeStory("「系統載入戰役成功。請選擇戰役目錄中的關卡，開啟您的獵人征程。」");
    choicesPanel.innerHTML = '<button class="btn btn-primary" id="campaign-start-btn">開始戰役</button>';
    
    // Rebind original start button to currently active act
    document.getElementById('campaign-start-btn').addEventListener('click', () => {
      playSynthSound('click');
      CAMPAIGNS[combatState.currentAct].start();
    });
  }
}
