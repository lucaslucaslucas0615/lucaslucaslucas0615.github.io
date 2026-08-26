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
  setupStoryChronicle();
  setupMegaArise();
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
  const now = audioCtx.currentTime;

  if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.1);
  } 
  else if (type === 'slash') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.12);
  }
  else if (type === 'dash') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.18);
  }
  else if (type === 'parry') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.25);
  }
  else if (type === 'laser') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.35);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.35);
  }
  else if (type === 'magic') {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.linearRampToValueAtTime(783.99, now + 0.3);
    osc2.frequency.setValueAtTime(261.63, now);
    osc2.frequency.linearRampToValueAtTime(392.00, now + 0.3);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }
  else if (type === 'warning') {
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
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }
  else if (type === 'hit') {
    const osc = audioCtx.createOscillator();
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
  else if (type === 'arise_voice') {
    // Majestic chord synthesis for "ARISE"
    const freqs = [65.41, 130.81, 196.00, 261.63, 392.00, 523.25];
    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 3.0);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(3, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      
      osc.start(now);
      osc.stop(now + 3.3);
    });
  }
  else if (type === 'portal_warp') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.8);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.8);
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
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.glass-card') || e.target.closest('.rank-btn') || e.target.closest('.campaign-item') || e.target.closest('.v-btn')) {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = 'var(--color-secondary)';
      cursor.style.backgroundColor = 'rgba(208, 188, 255, 0.05)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.glass-card') || e.target.closest('.rank-btn') || e.target.closest('.campaign-item') || e.target.closest('.v-btn')) {
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
    if (pointsRemaining) pointsRemaining.textContent = playerState.statPoints;
    
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

    // Update campaign mini stats HUD
    const campStr = document.getElementById('camp-str-val');
    const campAgi = document.getElementById('camp-agi-val');
    const campVit = document.getElementById('camp-vit-val');
    const campInt = document.getElementById('camp-int-val');
    const campSen = document.getElementById('camp-sen-val');
    if (campStr) campStr.textContent = playerState.str;
    if (campAgi) campAgi.textContent = playerState.agi;
    if (campVit) campVit.textContent = playerState.vit;
    if (campInt) campInt.textContent = playerState.int;
    if (campSen) campSen.textContent = playerState.sen;

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

    if (confirmBtn) {
      if (playerState.statPoints === 0) {
        confirmBtn.removeAttribute('disabled');
        confirmBtn.classList.add('btn-primary');
        confirmBtn.classList.remove('btn-secondary');
      } else {
        confirmBtn.setAttribute('disabled', 'true');
        confirmBtn.classList.remove('btn-primary');
        confirmBtn.classList.add('btn-secondary');
      }
    }

    // Sync level to HUD
    if (levelVal) levelVal.textContent = playerState.level;
    if (levelText) levelText.textContent = playerState.level;
  };

  const plusButtons = document.querySelectorAll('.stat-btn-plus');
  plusButtons.forEach(btn => {
    let holdTimeout = null;
    let holdInterval = null;

    function applySingleStatIncrease() {
      if (playerState.statPoints > 0) {
        const stat = btn.getAttribute('data-stat');
        playerState[stat]++;
        playerState.statPoints--;
        updateStatsUI();
        playSynthSound('click');
        return true;
      }
      stopHolding();
      return false;
    }

    function startHolding(e) {
      if (e) e.preventDefault();
      stopHolding();
      btn.classList.add('pressing');

      // Apply first increment immediately on press
      const ok = applySingleStatIncrease();
      if (!ok) return;

      // Start continuous repeat after short delay
      holdTimeout = setTimeout(() => {
        holdInterval = setInterval(() => {
          const success = applySingleStatIncrease();
          if (!success) {
            stopHolding();
          }
        }, 70);
      }, 250);
    }

    function stopHolding() {
      btn.classList.remove('pressing');
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
      }
      if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
      }
    }

    // Pointer events for universal cross-platform long press
    btn.addEventListener('pointerdown', startHolding);
    btn.addEventListener('pointerup', stopHolding);
    btn.addEventListener('pointercancel', stopHolding);
    btn.addEventListener('pointerleave', stopHolding);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (playerState.statPoints === 0) {
        // Complete confirmation
        playerState.statPoints = 0; 
        updateStatsUI();
        playSynthSound('levelup');
        triggerLevelUpOverlay();
      }
    });
  }

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
  const returnBtn = document.getElementById('quest-return-btn');
  const noticeCloseBtn = document.getElementById('notice-close-btn');
  const noticePanel = document.getElementById('hud-notice-panel');

  function getTodayDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  const todayStr = getTodayDateString();
  const storedDate = localStorage.getItem('solo_daily_quest_completed_date');
  let isDailyQuestCompleted = (storedDate === todayStr);

  function openQuestModal() {
    if (questModal) {
      updateQuestUI();
      questModal.classList.add('active');
      playSynthSound(isDailyQuestCompleted ? 'click' : 'warning');
    }
  }

  function closeQuestModal() {
    if (questModal) {
      questModal.classList.remove('active');
      playSynthSound('click');
    }
  }

  function updateQuestUI() {
    const statusBadge = document.getElementById('quest-status-badge');
    const modalIcon = document.getElementById('quest-modal-icon');
    const rewardStatTxt = document.getElementById('quest-reward-stat-txt');
    const hudNoticeTitle = document.getElementById('hud-notice-title-txt');
    const hudNoticeContent = document.getElementById('hud-notice-content-txt');

    if (isDailyQuestCompleted) {
      if (statusBadge) {
        statusBadge.textContent = "今日任務已達成 (COMPLETED)";
        statusBadge.className = "quest-status-badge completed";
      }
      if (modalIcon) {
        modalIcon.textContent = "✓";
        modalIcon.style.color = "#10b981";
        modalIcon.style.borderColor = "#10b981";
        modalIcon.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.4)";
      }
      if (rewardStatTxt) {
        rewardStatTxt.textContent = "已領取 (+5 PTS)";
        rewardStatTxt.style.color = "var(--color-outline)";
      }
      if (acceptBtn) {
        acceptBtn.textContent = "今日任務已結算 (冷卻中)";
        acceptBtn.disabled = true;
        acceptBtn.style.marginRight = "10px";
      }
      if (declineBtn) {
        declineBtn.style.display = "none";
      }
      if (returnBtn) {
        returnBtn.style.display = "inline-flex";
        returnBtn.className = "btn btn-primary btn-sm";
        returnBtn.textContent = "✕ 關閉並返回主頁";
      }
      if (hudNoticeTitle) hudNoticeTitle.textContent = "【今日每日任務已達成 ✓】";
      if (hudNoticeContent) {
        hudNoticeContent.innerHTML = `今日日常訓練已全部完成，自由屬性點已全數發放！點擊 <a href="#" id="daily-quest-trigger-done" style="color: #10b981; text-decoration: underline;">這裡</a> 查看訓練報告。`;
        const doneTrigger = document.getElementById('daily-quest-trigger-done');
        if (doneTrigger) {
          doneTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openQuestModal();
          });
        }
      }
    } else {
      if (statusBadge) {
        statusBadge.textContent = "今日任務進行中 (IN PROGRESS)";
        statusBadge.className = "quest-status-badge";
      }
      if (modalIcon) {
        modalIcon.textContent = "!";
        modalIcon.style.color = "var(--color-secondary)";
        modalIcon.style.borderColor = "var(--color-secondary)";
        modalIcon.style.boxShadow = "0 0 15px rgba(208, 188, 255, 0.3)";
      }
      if (rewardStatTxt) {
        rewardStatTxt.textContent = "+5 PTS";
        rewardStatTxt.style.color = "var(--color-primary)";
      }
      if (acceptBtn) {
        acceptBtn.textContent = "完成訓練並結算獎勵";
        acceptBtn.disabled = false;
        acceptBtn.style.marginRight = "10px";
      }
      if (declineBtn) {
        declineBtn.style.display = "inline-flex";
        declineBtn.style.marginRight = "10px";
      }
      if (returnBtn) {
        returnBtn.style.display = "inline-flex";
        returnBtn.className = "btn btn-secondary btn-sm";
        returnBtn.textContent = "✕ 暫時關閉";
      }
      if (hudNoticeTitle) hudNoticeTitle.textContent = "【每日挑戰未完成】";
      if (hudNoticeContent) {
        hudNoticeContent.innerHTML = `您今日有一項日常訓練待結算。點擊 <a href="#" id="daily-quest-trigger" style="color: var(--color-primary); text-decoration: underline;">這裡</a> 進入任務面板結算 +5 屬性點！`;
        const trigger = document.getElementById('daily-quest-trigger');
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openQuestModal();
          });
        }
      }
    }
  }

  function updateCountdownTimer() {
    const timerClock = document.getElementById('quest-timer-clock');
    if (!timerClock) return;
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diffMs = midnight - now;
    if (diffMs <= 0) {
      // Midnight reset
      isDailyQuestCompleted = false;
      localStorage.removeItem('solo_daily_quest_completed_date');
      updateQuestUI();
      timerClock.textContent = "00:00:00 (即將刷新)";
      return;
    }
    const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
    const mins = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const secs = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
    timerClock.textContent = `${hours}:${mins}:${secs}`;
  }
  setInterval(updateCountdownTimer, 1000);
  updateCountdownTimer();

  // Floating Corner Notice Trigger
  setTimeout(() => {
    if (noticePanel) {
      updateQuestUI();
      noticePanel.style.display = 'block';
      if (!isDailyQuestCompleted) {
        playSynthSound('warning');
      } else {
        // If already completed, automatically slide away after 4 seconds
        setTimeout(() => {
          noticePanel.style.transform = 'translateY(100px) scale(0.8)';
          noticePanel.style.opacity = '0';
          setTimeout(() => noticePanel.remove(), 500);
        }, 4000);
      }
    }
  }, 4000);

  if (noticeCloseBtn && noticePanel) {
    noticeCloseBtn.addEventListener('click', () => {
      noticePanel.style.transform = 'translateY(100px) scale(0.8)';
      noticePanel.style.opacity = '0';
      setTimeout(() => noticePanel.remove(), 500);
    });
  }

  const initialTrigger = document.getElementById('daily-quest-trigger');
  if (initialTrigger) {
    initialTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openQuestModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeQuestModal);
  if (returnBtn) returnBtn.addEventListener('click', closeQuestModal);

  // Close modal when clicking outside on dark backdrop
  if (questModal) {
    questModal.addEventListener('click', (e) => {
      if (e.target === questModal) closeQuestModal();
    });
  }

  // Global ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuestModal();
    }
  });

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      if (isDailyQuestCompleted) {
        playSynthSound('warning');
        alert('【系統提示】今日每日任務已於稍早完成並結算獎勵！系統冷卻中，請明日再行訓練。');
        closeQuestModal();
        return;
      }

      // Mark as completed for today
      isDailyQuestCompleted = true;
      localStorage.setItem('solo_daily_quest_completed_date', getTodayDateString());

      playSynthSound('levelup');
      // Award 5 stat points ONLY ONCE!
      playerState.statPoints += 5;
      if (window.updateStatsUI) window.updateStatsUI();

      updateQuestUI();
      closeQuestModal();

      alert('【系統通知】每日訓練目標全部達成！\n\n獲得獎勵：\n• 疲勞度全部清除 (RECOVERY)\n• 自由屬性點數 +5 點 (已入帳)\n• 隨機補給箱 1 個\n\n今日任務已完成，請前往下方面板分配點數！');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      playSynthSound('warning');
      alert('【系統警告】拒絕任務將立刻觸發「懲罰任務 (Penalty Quest)」，於沙漠地下城存活 4 小時！\n\n系統已強制鎖定您的「接受」按鈕。');
      declineBtn.style.display = 'none';
      acceptBtn.style.padding = '12px 40px';
      acceptBtn.textContent = '被迫完成並領取';
    });
  }
}

/* ==========================================
   9. Real-Time Action Combat Story Game Engine
   ========================================== */
function setupCampaignGame() {
  const canvas = document.getElementById('combat-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // HUD Elements
  const hpFill = document.getElementById('combat-hp-fill');
  const hpVal = document.getElementById('combat-hp-val');
  const mpFill = document.getElementById('combat-mp-fill');
  const mpVal = document.getElementById('combat-mp-val');
  const objectiveBadge = document.getElementById('combat-objective-badge');
  const objectiveText = document.getElementById('combat-objective-text');

  // Boss HUD
  const bossHud = document.getElementById('boss-hud-panel');
  const bossNameTxt = document.getElementById('boss-name-txt');
  const bossHpValTxt = document.getElementById('boss-hp-val-txt');
  const bossHpFill = document.getElementById('boss-hp-fill');
  const bossPhaseTag = document.getElementById('boss-phase-tag');

  // Overlays
  const storyOverlay = document.getElementById('arena-story-overlay');
  const actTitleTxt = document.getElementById('arena-act-title');
  const actDescTxt = document.getElementById('arena-act-desc');
  const startBattleBtn = document.getElementById('arena-start-battle-btn');

  const resultOverlay = document.getElementById('arena-result-overlay');
  const resultCard = document.getElementById('arena-result-card');
  const resultTitle = document.getElementById('arena-result-title');
  const resultSubtitle = document.getElementById('arena-result-subtitle');
  const resultRewards = document.getElementById('arena-result-rewards');
  const resultNextBtn = document.getElementById('arena-result-next-btn');
  const resultReplayBtn = document.getElementById('arena-result-replay-btn');

  // Combo UI & Mini log
  const comboCounter = document.getElementById('combat-combo-counter');
  const comboNumTxt = document.getElementById('combo-num-txt');
  const miniLogText = document.getElementById('combat-mini-log-text');

  // Virtual buttons & Cooldown overlays
  const vBtnAttack = document.getElementById('v-btn-attack');
  const vBtnDash = document.getElementById('v-btn-dash');
  const vBtnSkill1 = document.getElementById('v-btn-skill1');
  const vBtnSkill2 = document.getElementById('v-btn-skill2');
  const vBtnUlt = document.getElementById('v-btn-ult');
  const cdSkill1Overlay = document.getElementById('v-cd-skill1');
  const cdSkill2Overlay = document.getElementById('v-cd-skill2');
  const cdUltOverlay = document.getElementById('v-cd-ult');

  // Canvas Dimensions & Scaling
  let arenaWidth = 800;
  let arenaHeight = 420;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      arenaWidth = rect.width;
      arenaHeight = rect.height;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Input State
  const input = {
    up: false, down: false, left: false, right: false,
    attack: false, dash: false, skill1: false, skill2: false, ult: false
  };

  // Keyboard Event Listeners
  window.addEventListener('keydown', (e) => {
    // Only capture combat keys if canvas is visible / in view
    const key = e.key.toLowerCase();
    let handled = false;

    if (key === 'w' || key === 'arrowup') { input.up = true; handled = true; }
    if (key === 's' || key === 'arrowdown') { input.down = true; handled = true; }
    if (key === 'a' || key === 'arrowleft') { input.left = true; handled = true; }
    if (key === 'd' || key === 'arrowright') { input.right = true; handled = true; }
    if (key === 'j' || key === ' ') { input.attack = true; handled = true; triggerPlayerAttack(); }
    if (key === 'k') { input.dash = true; handled = true; triggerPlayerDash(); }
    if (key === 'u') { input.skill1 = true; handled = true; triggerPlayerSkill1(); }
    if (key === 'i') { input.skill2 = true; handled = true; triggerPlayerSkill2(); }
    if (key === 'o') { input.ult = true; handled = true; triggerPlayerUlt(); }

    if (handled && storyOverlay && storyOverlay.style.display === 'none' && resultOverlay && resultOverlay.style.display === 'none') {
      // Prevent page scrolling with arrow keys during fight
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') input.up = false;
    if (key === 's' || key === 'arrowdown') input.down = false;
    if (key === 'a' || key === 'arrowleft') input.left = false;
    if (key === 'd' || key === 'arrowright') input.right = false;
    if (key === 'j' || key === ' ') input.attack = false;
    if (key === 'k') input.dash = false;
    if (key === 'u') input.skill1 = false;
    if (key === 'i') input.skill2 = false;
    if (key === 'o') input.ult = false;
  });

  // Touch / Virtual Buttons Bindings
  if (vBtnAttack) vBtnAttack.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerPlayerAttack(); });
  if (vBtnDash) vBtnDash.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerPlayerDash(); });
  if (vBtnSkill1) vBtnSkill1.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerPlayerSkill1(); });
  if (vBtnSkill2) vBtnSkill2.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerPlayerSkill2(); });
  if (vBtnUlt) vBtnUlt.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerPlayerUlt(); });

  // Mouse / Touch Direct Canvas Move/Aim
  let isPointerDownOnCanvas = false;
  let pointerTargetX = 0, pointerTargetY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    if (storyOverlay.style.display !== 'none' || resultOverlay.style.display !== 'none') return;
    const rect = canvas.getBoundingClientRect();
    pointerTargetX = e.clientX - rect.left;
    pointerTargetY = e.clientY - rect.top;
    isPointerDownOnCanvas = true;
    // Clicking canvas performs attack towards pointer
    triggerPlayerAttack(pointerTargetX, pointerTargetY);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDownOnCanvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerTargetX = e.clientX - rect.left;
    pointerTargetY = e.clientY - rect.top;
  });

  window.addEventListener('pointerup', () => {
    isPointerDownOnCanvas = false;
  });

  // Combat State & Settings
  let currentAct = 1;
  let gameState = 'intro'; // 'intro', 'playing', 'victory', 'defeat'
  let screenShakeTime = 0;
  let screenShakeIntensity = 0;
  let bulletTime = 1.0;
  let bulletTimeTimer = 0;

  // Combo system
  let comboCount = 0;
  let comboTimer = 0;

  // Entity Lists
  let enemies = [];
  let shadowAllies = [];
  let particles = [];
  let floatingTexts = [];
  let slashTrails = [];
  let hazardAreas = []; // AOE indicators, laser strips

  // Player Object
  const player = {
    x: 100,
    y: 220,
    vx: 0,
    vy: 0,
    width: 24,
    height: 42,
    facing: 1, // 1 for right, -1 for left
    state: 'idle', // 'idle', 'run', 'attack', 'dash', 'skill', 'hit'
    stateTimer: 0,
    
    // Attack Combo
    comboStep: 0,
    comboWindow: 0,
    attackHitDone: false,
    
    // Dash & Evasion
    dashTimer: 0,
    dashCd: 0,
    dashGhostTimer: 0,
    isInvulnerable: false,
    ghosts: [],
    
    // Skill Cooldowns
    cdSkill1: 0,
    maxCdSkill1: 3.5,
    cdSkill2: 0,
    maxCdSkill2: 6.0,
    cdUlt: 0,
    maxCdUlt: 12.0,

    // Rulers Hand active effect
    rulerHandTimer: 0,

    // Visuals
    eyeGlow: 0,
    damageFlash: 0
  };

  // 12 Story Acts Data & Boss AI Configurations
  const ACT_DATA = {
    1: {
      title: "ACT 01: 雙重地下城",
      desc: "【卡特農神廟】神殿中央巨神像雙眼散發猩紅死光！每隔數秒橫掃神殿射出毀滅雷射！擊破合圍的魔裝石侍騎士，利用瞬步閃避死光，突破絕境！",
      objective: "消滅神殿魔裝石侍 (0/5) 並閃避巨神像死光",
      bgType: "temple",
      bossActive: false,
      bossName: "",
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        for (let i = 0; i < 4; i++) {
          list.push(createStoneGuardian(arenaWidth - 100 - i * 60, 100 + i * 70, false));
        }
        list.push(createStoneGuardian(arenaWidth - 80, 210, true)); // 1 Elite Commander
        return list;
      },
      rewards: { exp: 500, points: 10, nextLevel: 2 }
    },
    2: {
      title: "ACT 02: 罰時沙丘與背叛之門",
      desc: "【罰時沙漠與背叛地下城】巨型毒牙沙蟲鑽地襲殺！隨後返回現實遭遇黃東石隊伍背叛封口。系統發布抹殺令，清除所有叛逆者！",
      objective: "斬殺突襲巨沙蟲與背叛者首領黃東石",
      bgType: "desert",
      bossActive: true,
      bossName: "背叛隊長 黃東石",
      bossHp: 800,
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        list.push(createSandWorm(arenaWidth * 0.45, 120));
        list.push(createSandWorm(arenaWidth * 0.7, 280));
        list.push(createSandWorm(arenaWidth * 0.85, 150));
        list.push(createSandWorm(arenaWidth * 0.6, 320));
        list.push(createHwangDongSoo(arenaWidth - 120, 210));
        return list;
      },
      rewards: { exp: 1000, points: 5, nextLevel: 3, weapon: "騎士殺手 (Knight Killer)" }
    },
    3: {
      title: "ACT 03: 轉職挑戰：耶格利特",
      desc: "【深淵王座轉職神殿】血色指揮官耶格利特手握猩紅大劍佇立於王座。斬斷重裝鐵甲槍兵防線，與巔峰劍聖展開高速劍技決鬥！通關後發動『起來吧』提取影之將軍！",
      objective: "擊敗血色指揮官耶格利特並提取暗影",
      bgType: "throne",
      bossActive: true,
      bossName: "血色指揮官 耶格利特",
      bossHp: 1200,
      totalEnemies: 4,
      spawnEnemies: () => {
        const list = [];
        list.push(createRoyalKnight(arenaWidth * 0.55, 120));
        list.push(createRoyalKnight(arenaWidth * 0.55, 300));
        list.push(createRoyalKnight(arenaWidth * 0.75, 210));
        list.push(createIgritBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 2000, points: 5, nextLevel: 4, shadow: "耶格利特 (Igrit)" }
    },
    4: {
      title: "ACT 04: 濟州島：蟻王討伐戰",
      desc: "【S級濟州島蟻巢天災】天災級魔王【蟻王貝爾】凌空嘶吼！擁有頂尖的撕裂速度與劇毒音波。釋放所有暗影軍團並肩合擊，斬滅魔王，登基暗影君王神座！",
      objective: "召喚暗影軍團合力擊殺天災蟻王貝爾",
      bgType: "hive",
      bossActive: true,
      bossName: "天災魔王 蟻王貝爾",
      bossHp: 2200,
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        list.push(createMutantAnt(arenaWidth * 0.5, 100));
        list.push(createMutantAnt(arenaWidth * 0.65, 300));
        list.push(createMutantAnt(arenaWidth * 0.8, 120));
        list.push(createMutantAnt(arenaWidth * 0.85, 280));
        list.push(createBeruBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 5000, points: 10, nextLevel: 5, shadow: "貝爾 (Beru)" }
    },
    5: {
      title: "ACT 05: 我獨自返校 · 高校突襲戰",
      desc: "【高校美術室血戰】高階獸人紅色傳送門血洗校園！成振宇撕裂空間極速馳援妹妹，召喚暗影螞蟻大軍協同合圍，斬殺狂暴高階半獸人與咒術首領！",
      objective: "全滅嗜血半獸人軍團並斬殺咒術首領庫爾卡克",
      bgType: "school",
      bossActive: true,
      bossName: "獸人咒術首領 庫爾卡克",
      bossHp: 2600,
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        list.push(createHighOrc(arenaWidth * 0.45, 110));
        list.push(createHighOrc(arenaWidth * 0.65, 310));
        list.push(createHighOrc(arenaWidth * 0.8, 130));
        list.push(createHighOrc(arenaWidth * 0.6, 230));
        list.push(createOrcShamanBoss(arenaWidth - 110, 210));
        setTimeout(() => {
          if (gameState === 'playing') {
            shadowAllies.push(createShadowSoldier(player.x - 30, player.y, 'beru'));
            setMiniLog("【支援】暗影螞蟻軍團出陣，撕碎半獸人防線！");
          }
        }, 1200);
        return list;
      },
      rewards: { exp: 6000, points: 10, nextLevel: 6, shadow: "牙齒 (Tusk)" }
    },
    6: {
      title: "ACT 06: 獨自有特權 · 深海大屠殺",
      desc: "【一人攻略特權傳送門】獲得獵人協會一人攻略高級傳送門特權！在深海高難地下城中化身殺神，屠滅深海兇獸並降服雙叉戟霸主『芝麻 (Jima)』！",
      objective: "清剿深海巨怪並收服BOSS魚人芝麻",
      bgType: "ocean",
      bossActive: true,
      bossName: "深海雙叉戟霸主 芝麻",
      bossHp: 3200,
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        list.push(createSeaMonster(arenaWidth * 0.45, 120));
        list.push(createSeaMonster(arenaWidth * 0.65, 300));
        list.push(createSeaMonster(arenaWidth * 0.8, 140));
        list.push(createSeaMonster(arenaWidth * 0.55, 260));
        list.push(createJimaBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 8000, points: 10, nextLevel: 7, shadow: "芝麻 (Jima)" }
    },
    7: {
      title: "ACT 07: 獨自回原點 · 卡特農神廟再臨",
      desc: "【吞噬系統之戰】手持漆黑未知鑰匙重回神廟！體內第二顆暗影黑心臟產生Bug反噬系統，揮刀斬滅邪神巨像與神像建築師，完全吞噬系統權限！",
      objective: "斬滅系統設計者建築師與邪神巨像",
      bgType: "cartenon",
      bossActive: true,
      bossName: "系統設計者 建築師",
      bossHp: 4000,
      totalEnemies: 4,
      spawnEnemies: () => {
        const list = [];
        list.push(createStoneGuardian(arenaWidth * 0.45, 120, true));
        list.push(createStoneGuardian(arenaWidth * 0.65, 300, true));
        list.push(createStoneGuardian(arenaWidth * 0.8, 210, true));
        list.push(createArchitectBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 12000, points: 15, nextLevel: 8, weapon: "暗影君王之核 (Black Heart)" }
    },
    8: {
      title: "ACT 08: 我獨自旅日 · 始祖君王太祖萊吉亞",
      desc: "【東京S級百米巨人天災】日本頂尖獵人全滅，成振宇單槍匹馬赴日挽救滅頂之災！深入傳送門深處，一刀斬殺被鎖鏈禁錮的始祖巨人君王！",
      objective: "斬殺百米巨人軍團與始祖君王太祖萊吉亞",
      bgType: "tokyo",
      bossActive: true,
      bossName: "始祖巨人君王 太祖萊吉亞",
      bossHp: 5000,
      totalEnemies: 4,
      spawnEnemies: () => {
        const list = [];
        list.push(createColossalGiant(arenaWidth * 0.45, 120));
        list.push(createColossalGiant(arenaWidth * 0.65, 300));
        list.push(createColossalGiant(arenaWidth * 0.8, 200));
        list.push(createLegiaBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 18000, points: 15, nextLevel: 9, weapon: "惡魔王之短劍" }
    },
    9: {
      title: "ACT 09: 我獨自旅美 · 暴打托馬斯·安德烈",
      desc: "【清道夫公會巔峰決戰】為解救被凌虐的富二代晨浩，成振宇暴怒降臨！將不可一世的世界第一國家級獵人托馬斯按在地上瘋狂摩擦，處決黃東樹提取為無厭！",
      objective: "擊潰清道夫公會S級獵人並戰勝托馬斯·安德烈",
      bgType: "america",
      bossActive: true,
      bossName: "國家級最強 托馬斯·安德烈",
      bossHp: 6500,
      totalEnemies: 5,
      spawnEnemies: () => {
        const list = [];
        list.push(createScavengerHunter(arenaWidth * 0.45, 100));
        list.push(createScavengerHunter(arenaWidth * 0.6, 320));
        list.push(createScavengerHunter(arenaWidth * 0.75, 120));
        list.push(createScavengerHunter(arenaWidth * 0.8, 300));
        list.push(createThomasAndreBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 25000, points: 20, nextLevel: 10, shadow: "無厭 (Greed)", weapon: "卡米什的狂怒 (Kamish Daggers)" }
    },
    10: {
      title: "ACT 10: 我獨自扛戰 · 首爾三大君王圍攻",
      desc: "【君王滅世突襲】高建利會長光輝碎片殞落！百獸君王、酷寒君王與瘟疫君王聯手圍殺主角！成振宇隻身扛下戰局，於絕境中怒斬三大君王！",
      objective: "以一人之力獨抗並斬殺瘟疫、百獸與酷寒三大君王",
      bgType: "seoul",
      bossActive: true,
      bossName: "三大君王聯軍 (瘟疫 / 百獸 / 酷寒)",
      bossHp: 8000,
      totalEnemies: 3,
      spawnEnemies: () => {
        const list = [];
        list.push(createPlagueMonarchBoss(arenaWidth * 0.5, 110));
        list.push(createBeastMonarchBoss(arenaWidth * 0.7, 310));
        list.push(createFrostMonarchBoss(arenaWidth - 110, 210));
        return list;
      },
      rewards: { exp: 35000, points: 20, nextLevel: 11, weapon: "真王神格之刃" }
    },
    11: {
      title: "ACT 11: 我獨自宣戰 · 加拿大龍帝終焉決戰",
      desc: "【全球8大傳送門末日】破滅君王龍帝安塔利斯於加拿大降臨！成振宇急速折返，斬滅幻界君王與金剛君王，聯手支配者光明神罰光矛徹底擊潰龍帝！",
      objective: "擊殺遠古狂暴巨龍並誅滅最強破滅君王龍帝安塔利斯",
      bgType: "canada",
      bossActive: true,
      bossName: "破滅君王 龍帝安塔利斯",
      bossHp: 11000,
      totalEnemies: 4,
      spawnEnemies: () => {
        const list = [];
        list.push(createDragonEnemy(arenaWidth * 0.45, 100));
        list.push(createDragonEnemy(arenaWidth * 0.65, 320));
        list.push(createDragonEnemy(arenaWidth * 0.8, 140));
        list.push(createAntaresBoss(arenaWidth - 120, 210));
        return list;
      },
      rewards: { exp: 50000, points: 30, nextLevel: 12, shadow: "伯利昂 (Bellion)" }
    },
    12: {
      title: "ACT 12: 我獨自成神 · 次元裂縫終極征伐",
      desc: "【時光倒轉十年 · 孤獨成神】要求啟動輪迴之盃倒轉十年！成振宇孤身踏入次元裂縫征伐27年，召喚全體暗影軍團將所有君王斬盡殺絕，締造和平地球！",
      objective: "率領全體暗影軍團蕩平次元裂縫所有混沌虛空主宰！",
      bgType: "rift",
      bossActive: true,
      bossName: "混沌虛空之主 · 諸神意志",
      bossHp: 15000,
      totalEnemies: 4,
      spawnEnemies: () => {
        const list = [];
        list.push(createDragonEnemy(arenaWidth * 0.45, 110));
        list.push(createColossalGiant(arenaWidth * 0.65, 310));
        list.push(createHighOrc(arenaWidth * 0.8, 120));
        list.push(createVoidMonarchBoss(arenaWidth - 120, 210));

        setTimeout(() => {
          if (gameState === 'playing') {
            shadowAllies.push(createShadowSoldier(player.x - 40, player.y - 30, 'beru'));
            shadowAllies.push(createShadowSoldier(player.x - 30, player.y + 30, 'igrit'));
            shadowAllies.push(createShadowSoldier(player.x - 60, player.y, 'soldier'));
            shadowAllies.push(createShadowSoldier(player.x - 70, player.y - 40, 'soldier'));
            playSynthSound('arise_voice');
            setMiniLog("【全軍降臨】數十萬暗影軍團齊出！總軍團長伯利昂與諸將軍全力參戰！");
          }
        }, 800);
        return list;
      },
      rewards: { exp: 99999, points: 50, nextLevel: 99, shadow: "暗影真神 (Shadow God)" }
    }
  };

  // God Statue Hazard in Act 1
  const godStatue = {
    eyeChargeTimer: 0,
    laserTelegraphTimer: 0,
    laserActiveTimer: 0,
    laserY: 210,
    laserHeight: 40
  };

  // --- Entity Factory Functions ---

  function createStoneGuardian(x, y, isElite = false) {
    return {
      type: 'stone_guardian',
      isElite: isElite,
      name: isElite ? "魔裝石侍將領" : "神殿石侍",
      x: x, y: y,
      vx: 0, vy: 0,
      width: isElite ? 36 : 28,
      height: isElite ? 52 : 44,
      hp: isElite ? 380 : 160,
      maxHp: isElite ? 380 : 160,
      speed: isElite ? 1.6 : 1.2,
      facing: -1,
      attackCd: 1.5 + Math.random(),
      attackTimer: 0,
      isAttacking: false,
      hitFlash: 0,
      shieldUp: false
    };
  }

  function createSandWorm(x, y) {
    return {
      type: 'sandworm',
      name: "毒牙巨沙蟲",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 32, height: 46,
      hp: 240, maxHp: 240,
      speed: 1.8,
      facing: -1,
      burrowState: 'underground',
      burrowTimer: 1.0 + Math.random() * 2.0,
      attackCd: 2.0,
      hitFlash: 0
    };
  }

  function createHwangDongSoo(x, y) {
    return {
      type: 'boss_hwang',
      isBoss: true,
      name: "背叛隊長 黃東石",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 34, height: 50,
      hp: 800, maxHp: 800,
      speed: 2.0,
      facing: -1,
      attackCd: 1.8,
      attackTimer: 0,
      leapAttackTimer: 0,
      isAttacking: false,
      hitFlash: 0
    };
  }

  function createRoyalKnight(x, y) {
    return {
      type: 'royal_knight',
      name: "血色鐵甲侍衛",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 28, height: 44,
      hp: 280, maxHp: 280,
      speed: 1.8,
      facing: -1,
      attackCd: 1.5 + Math.random(),
      hitFlash: 0
    };
  }

  function createIgritBoss(x, y) {
    return {
      type: 'boss_igrit',
      isBoss: true,
      name: "血色指揮官 耶格利特",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 34, height: 52,
      hp: 1200, maxHp: 1200,
      speed: 2.6,
      facing: -1,
      attackCd: 1.4,
      specialCd: 4.5,
      whirlwindTimer: 0,
      isAttacking: false,
      hitFlash: 0
    };
  }

  function createMutantAnt(x, y) {
    return {
      type: 'mutant_ant',
      name: "變異兵蟻",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 26, height: 36,
      hp: 260, maxHp: 260,
      speed: 2.4,
      facing: -1,
      attackCd: 1.2,
      hitFlash: 0
    };
  }

  function createBeruBoss(x, y) {
    return {
      type: 'boss_beru',
      isBoss: true,
      name: "天災魔王 蟻王貝爾",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 36, height: 54,
      hp: 2200, maxHp: 2200,
      speed: 3.8,
      facing: -1,
      attackCd: 1.0,
      teleportCd: 3.5,
      roarCd: 6.0,
      hitFlash: 0
    };
  }

  function createHighOrc(x, y) {
    return {
      type: 'high_orc',
      name: "高階狂暴半獸人",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 30, height: 46,
      hp: 340, maxHp: 340,
      speed: 2.1,
      facing: -1,
      attackCd: 1.4,
      hitFlash: 0
    };
  }

  function createOrcShamanBoss(x, y) {
    return {
      type: 'boss_orc_shaman',
      isBoss: true,
      name: "獸人咒術首領 庫爾卡克",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 36, height: 52,
      hp: 2600, maxHp: 2600,
      speed: 1.8,
      facing: -1,
      attackCd: 1.2,
      firePillarCd: 3.5,
      hitFlash: 0
    };
  }

  function createSeaMonster(x, y) {
    return {
      type: 'sea_monster',
      name: "深海巨齒海獸",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 32, height: 42,
      hp: 380, maxHp: 380,
      speed: 2.3,
      facing: -1,
      attackCd: 1.3,
      hitFlash: 0
    };
  }

  function createJimaBoss(x, y) {
    return {
      type: 'boss_jima',
      isBoss: true,
      name: "深海雙叉戟 芝麻",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 38, height: 56,
      hp: 3200, maxHp: 3200,
      speed: 2.8,
      facing: -1,
      attackCd: 1.1,
      waveCd: 4.0,
      hitFlash: 0
    };
  }

  function createArchitectBoss(x, y) {
    return {
      type: 'boss_architect',
      isBoss: true,
      name: "系統設計者 建築師",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 40, height: 60,
      hp: 4000, maxHp: 4000,
      speed: 2.0,
      facing: -1,
      attackCd: 1.2,
      laserCd: 3.2,
      hitFlash: 0
    };
  }

  function createColossalGiant(x, y) {
    return {
      type: 'colossal_giant',
      name: "百米狂暴巨人",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 44, height: 64,
      hp: 600, maxHp: 600,
      speed: 1.4,
      facing: -1,
      attackCd: 1.8,
      hitFlash: 0
    };
  }

  function createLegiaBoss(x, y) {
    return {
      type: 'boss_legia',
      isBoss: true,
      name: "始祖巨人君王 太祖萊吉亞",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 46, height: 68,
      hp: 5000, maxHp: 5000,
      speed: 1.9,
      facing: -1,
      attackCd: 1.5,
      slamCd: 3.8,
      hitFlash: 0
    };
  }

  function createScavengerHunter(x, y) {
    return {
      type: 'scavenger_hunter',
      name: "清道夫公會 S級獵人",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 28, height: 46,
      hp: 450, maxHp: 450,
      speed: 2.5,
      facing: -1,
      attackCd: 1.2,
      hitFlash: 0
    };
  }

  function createThomasAndreBoss(x, y) {
    return {
      type: 'boss_thomas',
      isBoss: true,
      name: "國家級最強 托馬斯·安德烈",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 42, height: 60,
      hp: 6500, maxHp: 6500,
      speed: 2.6,
      facing: -1,
      attackCd: 1.0,
      smashCd: 3.0,
      reinforcementActive: false,
      hitFlash: 0
    };
  }

  function createPlagueMonarchBoss(x, y) {
    return {
      type: 'boss_plague',
      isBoss: true,
      name: "瘟疫君王 奎雷夏",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 32, height: 48,
      hp: 2400, maxHp: 2400,
      speed: 2.2,
      facing: -1,
      attackCd: 1.4,
      poisonCd: 3.0,
      hitFlash: 0
    };
  }

  function createBeastMonarchBoss(x, y) {
    return {
      type: 'boss_beast',
      isBoss: true,
      name: "百獸君王 獠牙",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 38, height: 54,
      hp: 2800, maxHp: 2800,
      speed: 3.5,
      facing: -1,
      attackCd: 0.9,
      leapCd: 3.2,
      hitFlash: 0
    };
  }

  function createFrostMonarchBoss(x, y) {
    return {
      type: 'boss_frost',
      isBoss: true,
      name: "酷寒君王 冰霜",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 34, height: 50,
      hp: 2800, maxHp: 2800,
      speed: 2.6,
      facing: -1,
      attackCd: 1.2,
      frostCd: 2.8,
      hitFlash: 0
    };
  }

  function createDragonEnemy(x, y) {
    return {
      type: 'dragon_enemy',
      name: "遠古狂暴巨龍",
      x: x, y: y,
      vx: 0, vy: 0,
      width: 44, height: 58,
      hp: 680, maxHp: 680,
      speed: 2.2,
      facing: -1,
      attackCd: 1.4,
      hitFlash: 0
    };
  }

  function createAntaresBoss(x, y) {
    return {
      type: 'boss_antares',
      isBoss: true,
      name: "破滅君王 龍帝安塔利斯",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 46, height: 66,
      hp: 11000, maxHp: 11000,
      speed: 3.2,
      facing: -1,
      attackCd: 0.9,
      breathCd: 3.5,
      meteorCd: 5.5,
      hitFlash: 0
    };
  }

  function createVoidMonarchBoss(x, y) {
    return {
      type: 'boss_void',
      isBoss: true,
      name: "混沌虛空之主 · 諸神意志",
      phase: 1,
      x: x, y: y,
      vx: 0, vy: 0,
      width: 48, height: 70,
      hp: 15000, maxHp: 15000,
      speed: 3.4,
      facing: -1,
      attackCd: 0.8,
      riftCd: 3.0,
      hitFlash: 0
    };
  }

  function createShadowSoldier(x, y, variant = 'igrit') {
    return {
      variant: variant, // 'igrit', 'beru', 'soldier'
      x: x, y: y,
      vx: 0, vy: 0,
      width: 28, height: 44,
      facing: 1,
      speed: variant === 'beru' ? 4.2 : 3.0,
      attackCd: variant === 'beru' ? 0.6 : 1.0,
      attackTimer: 0,
      lifeTimer: 15.0 // stays for 15s or per summon
    };
  }

  // --- Attack & Skill Triggers ---

  function triggerPlayerAttack(targetX, targetY) {
    if (gameState !== 'playing' || player.dashTimer > 0) return;
    
    // Set facing direction towards click if provided
    if (targetX !== undefined) {
      player.facing = targetX > player.x ? 1 : -1;
    } else if (input.left) {
      player.facing = -1;
    } else if (input.right) {
      player.facing = 1;
    }

    if (player.stateTimer <= 0.05) {
      player.comboStep = (player.comboStep % 3) + 1;
      player.state = 'attack';
      player.stateTimer = 0.22;
      player.comboWindow = 0.5;
      player.attackHitDone = false;

      playSynthSound('slash');

      // Add forward impulse
      player.vx = player.facing * (player.comboStep === 3 ? 5.5 : 3.5);

      // Create glowing weapon slash arc
      createSlashArc(
        player.x + player.facing * 18,
        player.y,
        player.facing,
        player.comboStep
      );
    }
  }

  function triggerPlayerDash() {
    if (gameState !== 'playing' || player.dashCd > 0) return;

    const agiBonus = (playerState.agi - 10) * 0.03;
    player.dashCd = Math.max(1.2 - agiBonus, 0.4);
    player.dashTimer = 0.25;
    player.isInvulnerable = true;
    player.ghosts = [];

    // Determine dash direction from movement keys
    let dx = 0, dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    if (dx === 0 && dy === 0) dx = player.facing;
    const len = Math.hypot(dx, dy) || 1;
    
    const dashSpeed = 11.0 + (playerState.agi - 10) * 0.2;
    player.vx = (dx / len) * dashSpeed;
    player.vy = (dy / len) * dashSpeed;

    if (dx !== 0) player.facing = dx > 0 ? 1 : -1;

    playSynthSound('dash');

    // Add immediate ghost clone
    addPlayerGhost();
  }

  function triggerPlayerSkill1() {
    // 疾影突刺 (Dagger Rush) - 10 MP
    if (gameState !== 'playing' || player.cdSkill1 > 0) return;
    if (combatState.currentMp < 10) {
      playSynthSound('warning');
      setMiniLog("【魔力不足】無法施展 疾影突刺！");
      return;
    }

    combatState.currentMp -= 10;
    player.cdSkill1 = player.maxCdSkill1;
    player.isInvulnerable = true;
    player.state = 'skill';
    player.stateTimer = 0.35;

    playSynthSound('slash');
    playSynthSound('magic');

    // Super dash piercing thrust
    const thrustDist = 180 * player.facing;
    const startX = player.x;
    player.x = Math.max(30, Math.min(arenaWidth - 30, player.x + thrustDist));

    // Pierce hit all enemies along line
    const hitBox = {
      minX: Math.min(startX, player.x) - 20,
      maxX: Math.max(startX, player.x) + 20,
      minY: player.y - 30,
      maxY: player.y + 30
    };

    const baseDmg = 65 + (playerState.str - 10) * 5 + (playerState.int - 10) * 4;

    enemies.forEach(e => {
      if (e.x >= hitBox.minX && e.x <= hitBox.maxX && e.y >= hitBox.minY && e.y <= hitBox.maxY) {
        dealDamageToEnemy(e, baseDmg * 1.5, true, "疾影穿刺!");
      }
    });

    // Particle flash trail
    createThrustLineParticle(startX, player.y, player.x, player.y);
    triggerScreenShake(6, 0.25);
    setMiniLog("【技能】施展『疾影突刺』，貫穿敵軍防線！");
  }

  function triggerPlayerSkill2() {
    // 支配者之手 (Ruler's Reach) - 20 MP
    if (gameState !== 'playing' || player.cdSkill2 > 0) return;
    if (combatState.currentMp < 20) {
      playSynthSound('warning');
      setMiniLog("【魔力不足】無法施展 支配者之手！");
      return;
    }

    combatState.currentMp -= 20;
    player.cdSkill2 = player.maxCdSkill2;
    player.rulerHandTimer = 0.8;

    playSynthSound('magic');
    triggerScreenShake(8, 0.35);

    // Gravity Pull: Pull all enemies towards front of player and stun them
    const pullX = player.x + player.facing * 90;
    const pullY = player.y;

    enemies.forEach(e => {
      e.vx = (pullX - e.x) * 0.15;
      e.vy = (pullY - e.y) * 0.15;
      e.stunTimer = 1.2;
      dealDamageToEnemy(e, 35 + (playerState.int - 10) * 4, false, "重力壓制");
    });

    createRulerHandVisual(pullX, pullY);
    setMiniLog("【技能】施展『支配者之手』，無形重力將敵人全數吸附！");
  }

  function triggerPlayerUlt() {
    // 暗影軍團 / 起來吧 (Arise) - 35 MP
    if (gameState !== 'playing' || player.cdUlt > 0) return;
    if (combatState.currentMp < 35) {
      playSynthSound('warning');
      setMiniLog("【魔力不足】無法召喚 暗影軍團！");
      return;
    }

    combatState.currentMp -= 35;
    player.cdUlt = player.maxCdUlt;

    playSynthSound('arise');
    triggerScreenShake(12, 0.5);

    // Spawn Shadow Soldiers based on unlocked generals
    if (playerState.unlockedShadows.beru) {
      shadowAllies.push(createShadowSoldier(player.x - 40, player.y - 20, 'beru'));
    }
    if (playerState.unlockedShadows.igrit || currentAct >= 3) {
      shadowAllies.push(createShadowSoldier(player.x - 30, player.y + 20, 'igrit'));
    }
    shadowAllies.push(createShadowSoldier(player.x - 50, player.y, 'soldier'));

    // Massive screen-wide dark explosion
    enemies.forEach(e => {
      dealDamageToEnemy(e, 90 + (playerState.int - 10) * 6 + (playerState.str - 10) * 4, true, "暗影降臨!");
    });

    createDarkBurstParticles(player.x, player.y);
    setMiniLog("【奧義】君王呼喚：『起來吧 (ARISE)！』暗影軍團降臨戰場！");
  }

  // --- Combat Damage & Physics Helpers ---

  function dealDamageToEnemy(enemy, rawDmg, canCrit = true, label = "") {
    if (enemy.hp <= 0) return;

    let isCrit = false;
    let finalDmg = rawDmg;

    if (canCrit) {
      const critChance = 0.15 + (playerState.sen - 10) * 0.02;
      if (Math.random() < critChance) {
        isCrit = true;
        finalDmg *= 1.8 + (playerState.str - 10) * 0.02;
      }
    }

    // Weapon bonus
    if (playerState.level >= 3) finalDmg *= 1.15; // Knight Killer / Kamish bonus
    finalDmg = Math.max(Math.round(finalDmg), 1);

    enemy.hp -= finalDmg;
    enemy.hitFlash = 0.15;

    // Knockback
    enemy.vx += player.facing * (isCrit ? 6 : 3.5);

    // Increment combo
    comboCount++;
    comboTimer = 2.0;
    updateComboUI();

    // Floating text
    addFloatingText(
      enemy.x + (Math.random() - 0.5) * 20,
      enemy.y - 25,
      isCrit ? `CRIT! -${finalDmg}` : `-${finalDmg}`,
      isCrit ? '#fbbf24' : '#adc6ff',
      isCrit ? 18 : 14,
      isCrit
    );

    // Spark particles
    createHitSparks(enemy.x, enemy.y, isCrit);
    playSynthSound('hit');

    // Check enemy death
    if (enemy.hp <= 0) {
      onEnemyKilled(enemy);
    }
  }

  function dealDamageToPlayer(damage, reason = "") {
    if (gameState !== 'playing' || player.isInvulnerable || player.dashTimer > 0) return;

    // Defense reduction from VIT
    const vitReduction = (playerState.vit - 10) * 0.015;
    const finalDmg = Math.max(Math.round(damage * (1 - vitReduction)), 5);

    combatState.currentHp = Math.max(combatState.currentHp - finalDmg, 0);
    player.damageFlash = 0.25;
    triggerScreenShake(7, 0.25);
    playSynthSound('hit');

    // Break combo
    comboCount = 0;
    updateComboUI();

    addFloatingText(player.x, player.y - 30, `-${finalDmg}`, '#ef4444', 16, true);
    setMiniLog(`【警告】成振宇受到重創，HP -${finalDmg}！(${reason})`);

    if (combatState.currentHp <= 0) {
      triggerPlayerDefeat(reason || "戰力耗盡倒在地下城中");
    }
  }

  function onEnemyKilled(enemy) {
    createDeathBurst(enemy.x, enemy.y, enemy.isBoss ? 40 : 15);
    setMiniLog(`【消滅】成功擊殺 ${enemy.name}！`);

    // Check Stage Clear conditions
    const remaining = enemies.filter(e => e.hp > 0);
    if (remaining.length === 0) {
      triggerStageVictory();
    }
  }

  // --- FX Particle Generators ---

  function addFloatingText(x, y, text, color, size, isCrit) {
    floatingTexts.push({
      x: x, y: y,
      text: text,
      color: color,
      size: size,
      isCrit: isCrit,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2.0 - Math.random() * 1.5,
      alpha: 1.0,
      life: 0.8
    });
  }

  function createSlashArc(x, y, facing, step) {
    slashTrails.push({
      x: x, y: y,
      facing: facing,
      step: step,
      radius: step === 3 ? 55 : 42,
      startAngle: facing > 0 ? -Math.PI * 0.6 : -Math.PI * 0.4,
      endAngle: facing > 0 ? Math.PI * 0.6 : Math.PI * 1.4,
      alpha: 1.0,
      color: step === 3 ? '#d0bcff' : '#adc6ff',
      glowColor: step === 3 ? '#571bc1' : '#4d8eff',
      life: 0.18
    });
  }

  function addPlayerGhost() {
    player.ghosts.push({
      x: player.x,
      y: player.y,
      facing: player.facing,
      alpha: 0.7
    });
  }

  function createHitSparks(x, y, isCrit) {
    const count = isCrit ? 14 : 7;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: isCrit ? '#fde047' : '#adc6ff',
        alpha: 1.0,
        decay: Math.random() * 0.05 + 0.03
      });
    }
  }

  function createThrustLineParticle(x1, y1, x2, y2) {
    for (let i = 0; i < 20; i++) {
      const t = i / 20;
      particles.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 10,
        y: y1 + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: '#d0bcff',
        alpha: 1.0,
        decay: 0.04
      });
    }
  }

  function createRulerHandVisual(x, y) {
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120 + 20;
      particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: -Math.cos(angle) * 5,
        vy: -Math.sin(angle) * 5,
        size: 3,
        color: '#4cd7f6',
        alpha: 0.8,
        decay: 0.03
      });
    }
  }

  function createDarkBurstParticles(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: Math.random() > 0.5 ? '#d0bcff' : '#1e1b4b',
        alpha: 1.0,
        decay: 0.025
      });
    }
  }

  function createDeathBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: '#571bc1',
        alpha: 1.0,
        decay: 0.03
      });
    }
  }

  function triggerScreenShake(intensity = 6, duration = 0.25) {
    screenShakeIntensity = intensity;
    screenShakeTime = duration;
  }

  function updateComboUI() {
    if (comboCount > 1) {
      if (comboCounter) comboCounter.style.display = 'block';
      if (comboNumTxt) comboNumTxt.textContent = comboCount;
    } else {
      if (comboCounter) comboCounter.style.display = 'none';
    }
  }

  function setMiniLog(text) {
    if (miniLogText) miniLogText.textContent = text;
  }

  // --- Stage Lifecycle Flow ---

  function selectAct(actId) {
    currentAct = actId;
    document.querySelectorAll('.campaign-item').forEach(i => i.classList.remove('active'));
    const item = document.getElementById(`campaign-item-${actId}`);
    if (item) item.classList.add('active');

    const data = ACT_DATA[actId];
    if (actTitleTxt) actTitleTxt.textContent = data.title;
    if (actDescTxt) actDescTxt.textContent = data.desc;
    if (objectiveText) objectiveText.textContent = data.objective;

    // Show Story Overlay
    if (storyOverlay) storyOverlay.style.display = 'flex';
    if (resultOverlay) resultOverlay.style.display = 'none';
    gameState = 'intro';
  }

  function startBattle() {
    if (storyOverlay) storyOverlay.style.display = 'none';
    if (resultOverlay) resultOverlay.style.display = 'none';
    gameState = 'playing';

    // Reset Combat HP / MP based on player attributes
    playerState.maxHp = 100 + (playerState.vit - 10) * 15;
    playerState.maxMp = 50 + (playerState.int - 10) * 10;
    combatState.currentHp = playerState.maxHp;
    combatState.currentMp = playerState.maxMp;

    // Reset Player position
    player.x = 90;
    player.y = arenaHeight / 2;
    player.vx = 0;
    player.vy = 0;
    player.dashTimer = 0;
    player.dashCd = 0;
    player.cdSkill1 = 0;
    player.cdSkill2 = 0;
    player.cdUlt = 0;

    // Clear and Spawn Enemies
    particles = [];
    floatingTexts = [];
    slashTrails = [];
    hazardAreas = [];
    shadowAllies = [];
    enemies = ACT_DATA[currentAct].spawnEnemies();

    // Setup Boss HUD if Act has boss
    const data = ACT_DATA[currentAct];
    if (data.bossActive) {
      if (bossHud) bossHud.style.display = 'block';
      if (bossNameTxt) bossNameTxt.textContent = `BOSS: ${data.bossName}`;
      if (bossPhaseTag) bossPhaseTag.textContent = "PHASE 1";
    } else {
      if (bossHud) bossHud.style.display = 'none';
    }

    playSynthSound('levelup');
    setMiniLog(`【戰役開始】已傳送至 ${data.title}！消滅所有目標！`);
  }

  function triggerStageVictory() {
    gameState = 'victory';
    playSynthSound('levelup');
    playSynthSound('arise');

    const data = ACT_DATA[currentAct];

    // Give Rewards
    playerState.level = data.rewards.nextLevel;
    playerState.statPoints += data.rewards.points;
    if (window.updateStatsUI) window.updateStatsUI();

    // Trigger Arise overlay
    const ariseOverlay = document.getElementById('arise-overlay');
    if (ariseOverlay) {
      ariseOverlay.classList.add('active');
      setTimeout(() => ariseOverlay.classList.remove('active'), 2500);
    }

    // Unlock Shadows on corresponding acts
    if (currentAct === 3) {
      playerState.unlockedShadows.igrit = true;
      const card = document.getElementById('soldier-card-igrit');
      const status = document.getElementById('soldier-lock-status-igrit');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 影之將軍)";
        status.style.color = "var(--color-primary)";
      }
    } else if (currentAct === 4) {
      playerState.unlockedShadows.beru = true;
      const card = document.getElementById('soldier-card-beru');
      const status = document.getElementById('soldier-lock-status-beru');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 影之將軍)";
        status.style.color = "var(--color-primary)";
      }
    } else if (currentAct === 5) {
      const card = document.getElementById('soldier-card-tusk');
      const status = document.getElementById('soldier-lock-status-tusk');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 影之領主)";
        status.style.color = "var(--color-primary)";
      }
    } else if (currentAct === 6) {
      const card = document.getElementById('soldier-card-jima');
      const status = document.getElementById('soldier-lock-status-jima');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 突擊隊長)";
        status.style.color = "var(--color-primary)";
      }
    } else if (currentAct === 9) {
      const card = document.getElementById('soldier-card-greed');
      const status = document.getElementById('soldier-lock-status-greed');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 影之將軍)";
        status.style.color = "var(--color-primary)";
      }
    } else if (currentAct === 11 || currentAct === 12) {
      const card = document.getElementById('soldier-card-bellion');
      const status = document.getElementById('soldier-lock-status-bellion');
      if (card && status) {
        card.classList.remove('soldier-locked');
        status.textContent = "(已解鎖 - 影之總軍團長)";
        status.style.color = "#ffd700";
      }
    }

    // Unlock next act in catalog
    const nextActItem = document.getElementById(`campaign-item-${currentAct + 1}`);
    if (nextActItem) {
      nextActItem.classList.remove('locked');
    }

    // Setup Victory Modal
    if (resultCard) resultCard.className = "arena-result-card";
    if (resultTitle) resultTitle.textContent = "VICTORY";
    if (resultSubtitle) resultSubtitle.textContent = `【${data.title}】完美通關！`;
    if (resultRewards) {
      resultRewards.innerHTML = `
        <div class="reward-row"><span>獲得經驗值:</span><span class="glow-text-primary">+${data.rewards.exp} EXP (等級升至 LV.${data.rewards.nextLevel})</span></div>
        <div class="reward-row"><span>獲得自由屬性點:</span><span class="glow-text-primary">+${data.rewards.points} 點</span></div>
        ${data.rewards.shadow ? `<div class="reward-row"><span>解鎖暗影將軍:</span><span class="glow-text-purple">【${data.rewards.shadow}】提取完成！</span></div>` : ''}
        ${data.rewards.weapon ? `<div class="reward-row"><span>解鎖神話兵刃:</span><span class="glow-text-primary">【${data.rewards.weapon}】已獲得！</span></div>` : ''}
      `;
    }

    if (resultNextBtn) {
      if (currentAct < 12) {
        resultNextBtn.textContent = `確認獎勵 / 挑戰 ACT 0${currentAct + 1 > 9 ? currentAct + 1 : '0' + (currentAct + 1)}`;
        resultNextBtn.onclick = () => selectAct(currentAct + 1);
      } else {
        resultNextBtn.textContent = "👑 登基至高暗影真神！";
        resultNextBtn.onclick = () => {
          resultOverlay.style.display = 'none';
          window.location.hash = '#story-chronicle';
        };
      }
    }

    if (resultReplayBtn) {
      resultReplayBtn.onclick = () => startBattle();
    }

    if (resultOverlay) resultOverlay.style.display = 'flex';
    setMiniLog(`【大勝利】${data.title} 通關！獲得點數獎勵，暗影力量覺醒！`);
  }

  function triggerPlayerDefeat(reason) {
    gameState = 'defeat';
    playSynthSound('warning');

    if (resultCard) resultCard.className = "arena-result-card defeat";
    if (resultTitle) resultTitle.textContent = "DEFEAT";
    if (resultSubtitle) resultSubtitle.textContent = "生命值歸零，戰役失敗！";
    if (resultRewards) {
      resultRewards.innerHTML = `
        <div class="reward-row" style="color: #ef4444;"><span>死亡原因:</span><span>${reason || '體力不支'}</span></div>
        <div class="reward-row"><span>系統提示:</span><span>前往下方面板分配屬性點數，大幅增強戰鬥力後再次挑戰！</span></div>
      `;
    }

    if (resultNextBtn) {
      resultNextBtn.textContent = "提升屬性面板";
      resultNextBtn.onclick = () => {
        resultOverlay.style.display = 'none';
        window.location.hash = '#features-section';
      };
    }

    if (resultReplayBtn) {
      resultReplayBtn.textContent = "立即重試此關";
      resultReplayBtn.onclick = () => startBattle();
    }

    if (resultOverlay) resultOverlay.style.display = 'flex';
  }

  // Bind Start Button
  if (startBattleBtn) {
    startBattleBtn.addEventListener('click', () => {
      playSynthSound('click');
      startBattle();
    });
  }

  // Bind Act item tabs
  document.querySelectorAll('.campaign-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('locked')) {
        playSynthSound('warning');
        alert('【系統鎖定】前置戰役尚未通關，無法啟動此傳送門！');
        return;
      }
      const act = parseInt(item.getAttribute('data-act'));
      selectAct(act);
    });
  });

  // Global launcher for chronicle links
  window.launchActBattle = (actId) => {
    const item = document.getElementById(`campaign-item-${actId}`);
    if (item) item.classList.remove('locked');
    selectAct(actId);
  };

  // --- Main 60FPS Game Loop ---

  let lastTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  // --- Update Mechanics ---

  function update(dt) {
    if (gameState !== 'playing') {
      updateCooldownsUI();
      return;
    }

    // Cooldown ticks
    if (player.dashCd > 0) player.dashCd -= dt;
    if (player.cdSkill1 > 0) player.cdSkill1 -= dt;
    if (player.cdSkill2 > 0) player.cdSkill2 -= dt;
    if (player.cdUlt > 0) player.cdUlt -= dt;
    if (player.stateTimer > 0) player.stateTimer -= dt;
    if (player.damageFlash > 0) player.damageFlash -= dt;
    if (player.rulerHandTimer > 0) player.rulerHandTimer -= dt;

    // Mana natural regen
    const mpRegen = (0.2 + (playerState.int - 10) * 0.04) * dt * 60;
    combatState.currentMp = Math.min(combatState.currentMp + mpRegen, playerState.maxMp);

    // Screen Shake decay
    if (screenShakeTime > 0) {
      screenShakeTime -= dt;
    }

    // Combo timer decay
    if (comboTimer > 0) {
      comboTimer -= dt;
      if (comboTimer <= 0) {
        comboCount = 0;
        updateComboUI();
      }
    }

    // Update Player Movement & State
    updatePlayerPhysics(dt);

    // Update Shadow Army Allies
    updateShadowAllies(dt);

    // Update Enemies & Bosses
    updateEnemies(dt);

    // Update Hazards (God statue laser, etc.)
    updateHazards(dt);

    // Update Particles & Floating Texts
    updateParticles(dt);

    // Sync HUD Health & Mana
    updateHUDValues();
    updateCooldownsUI();
  }

  function updatePlayerPhysics(dt) {
    const agiSpeed = 3.8 + (playerState.agi - 10) * 0.12;

    if (player.dashTimer > 0) {
      player.dashTimer -= dt;
      player.x += player.vx;
      player.y += player.vy;
      player.vx *= 0.92;
      player.vy *= 0.92;

      // Spawn trailing ghost clones
      player.dashGhostTimer += dt;
      if (player.dashGhostTimer > 0.04) {
        player.dashGhostTimer = 0;
        addPlayerGhost();
      }

      if (player.dashTimer <= 0) {
        player.isInvulnerable = false;
      }
    } else {
      let moveX = 0, moveY = 0;

      if (input.left) moveX -= 1;
      if (input.right) moveX += 1;
      if (input.up) moveY -= 1;
      if (input.down) moveY += 1;

      // Pointer drag movement on canvas
      if (isPointerDownOnCanvas) {
        const dx = pointerTargetX - player.x;
        const dy = pointerTargetY - player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 25) {
          moveX = dx / dist;
          moveY = dy / dist;
        }
      }

      if (moveX !== 0 || moveY !== 0) {
        const len = Math.hypot(moveX, moveY);
        player.vx = (moveX / len) * agiSpeed;
        player.vy = (moveY / len) * agiSpeed;
        if (moveX !== 0) player.facing = moveX > 0 ? 1 : -1;
        if (player.state !== 'attack' && player.state !== 'skill') {
          player.state = 'run';
        }
      } else {
        player.vx *= 0.8;
        player.vy *= 0.8;
        if (player.state !== 'attack' && player.state !== 'skill') {
          player.state = 'idle';
        }
      }

      player.x += player.vx;
      player.y += player.vy;
    }

    // Arena boundary clamp
    player.x = Math.max(25, Math.min(arenaWidth - 25, player.x));
    player.y = Math.max(50, Math.min(arenaHeight - 35, player.y));

    // Check Attack Hitbox Trigger
    if (player.state === 'attack' && !player.attackHitDone && player.stateTimer <= 0.12) {
      player.attackHitDone = true;
      const attackRange = player.comboStep === 3 ? 65 : 48;
      const baseDmg = (28 + (playerState.str - 10) * 3) * (player.comboStep === 3 ? 1.7 : 1.0);

      enemies.forEach(e => {
        const dx = e.x - player.x;
        const dy = Math.abs(e.y - player.y);
        const inFront = (player.facing > 0 && dx > -10 && dx < attackRange) || (player.facing < 0 && dx < 10 && dx > -attackRange);
        if (inFront && dy < 35) {
          dealDamageToEnemy(e, baseDmg);
        }
      });
    }

    // Update Dash Ghosts
    for (let i = player.ghosts.length - 1; i >= 0; i--) {
      const g = player.ghosts[i];
      g.alpha -= dt * 3.5;
      if (g.alpha <= 0) player.ghosts.splice(i, 1);
    }
  }

  function updateShadowAllies(dt) {
    shadowAllies.forEach(s => {
      s.lifeTimer -= dt;
      s.attackTimer -= dt;

      // Find nearest living enemy
      let nearest = null;
      let minDist = 9999;

      enemies.forEach(e => {
        if (e.hp > 0) {
          const d = Math.hypot(e.x - s.x, e.y - s.y);
          if (d < minDist) {
            minDist = d;
            nearest = e;
          }
        }
      });

      if (nearest) {
        const dx = nearest.x - s.x;
        const dy = nearest.y - s.y;
        const dist = Math.hypot(dx, dy);
        s.facing = dx > 0 ? 1 : -1;

        if (dist > 45) {
          s.x += (dx / dist) * s.speed;
          s.y += (dy / dist) * s.speed;
        } else if (s.attackTimer <= 0) {
          s.attackTimer = s.attackCd;
          const dmg = s.variant === 'beru' ? 55 : (s.variant === 'igrit' ? 45 : 30);
          dealDamageToEnemy(nearest, dmg, true, `${s.variant.toUpperCase()} 斬擊!`);
          createSlashArc(s.x + s.facing * 16, s.y, s.facing, 1);
        }
      } else {
        // Follow player
        const dx = (player.x - 30 * s.facing) - s.x;
        const dy = player.y - s.y;
        if (Math.hypot(dx, dy) > 40) {
          s.x += dx * 0.05;
          s.y += dy * 0.05;
        }
      }
    });

    shadowAllies = shadowAllies.filter(s => s.lifeTimer > 0);
  }

  function updateEnemies(dt) {
    enemies.forEach(e => {
      if (e.hp <= 0) return;
      if (e.hitFlash > 0) e.hitFlash -= dt;

      // Stunned
      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        e.x += e.vx;
        e.y += e.vy;
        e.vx *= 0.85;
        e.vy *= 0.85;
        return;
      }

      e.x += e.vx;
      e.y += e.vy;
      e.vx *= 0.85;
      e.vy *= 0.85;

      const dx = player.x - e.x;
      const dy = player.y - e.y;
      const dist = Math.hypot(dx, dy);
      if (dx !== 0) e.facing = dx > 0 ? 1 : -1;

      // Specific Enemy AI
      if (e.type === 'stone_guardian') {
        if (dist > 40) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = e.isElite ? 1.4 : 2.0;
            dealDamageToPlayer(e.isElite ? 28 : 18, `${e.name} 巨刃劈砍`);
          }
        }
      }
      else if (e.type === 'sandworm') {
        e.burrowTimer -= dt;
        if (e.burrowTimer <= 0) {
          if (e.burrowState === 'underground') {
            e.burrowState = 'above';
            e.burrowTimer = 2.5;
            e.x = player.x + (Math.random() - 0.5) * 80;
            e.y = player.y + (Math.random() - 0.5) * 80;
            createHitSparks(e.x, e.y, false);
            dealDamageToPlayer(20, "巨型沙蟲破土撕咬");
          } else {
            e.burrowState = 'underground';
            e.burrowTimer = 1.8;
          }
        }
      }
      else if (e.type === 'boss_hwang') {
        if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.6;
            dealDamageToPlayer(32, "黃東石 重劍碎岩斬");
            triggerScreenShake(8, 0.3);
          }
        }
      }
      else if (e.type === 'royal_knight') {
        if (dist > 42) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.5;
            dealDamageToPlayer(22, "鐵甲侍衛 長槍穿刺");
          }
        }
      }
      else if (e.type === 'boss_igrit') {
        // Phase 2 transition at 50% HP
        if (e.hp < e.maxHp * 0.5 && e.phase === 1) {
          e.phase = 2;
          e.speed = 3.6;
          if (bossPhaseTag) bossPhaseTag.textContent = "PHASE 2: 狂暴雙刀";
          playSynthSound('boss_roar');
          triggerScreenShake(10, 0.4);
          setMiniLog("【狂暴】耶格利特丟棄大劍，拔出血色雙刀進入狂暴衝刺！");
        }

        if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = e.phase === 2 ? 0.8 : 1.5;
            dealDamageToPlayer(e.phase === 2 ? 35 : 28, "耶格利特 猩紅連斬");
            createSlashArc(e.x + e.facing * 18, e.y, e.facing, 2);
          }
        }
      }
      else if (e.type === 'mutant_ant') {
        if (dist > 35) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.0;
            dealDamageToPlayer(20, "變異兵蟻 劇毒撕咬");
          }
        }
      }
      else if (e.type === 'boss_beru') {
        // Hyper speed teleport & slash AI
        e.teleportCd -= dt;
        if (e.teleportCd <= 0) {
          e.teleportCd = 2.8;
          e.x = player.x - player.facing * 40;
          e.y = player.y;
          playSynthSound('dash');
          dealDamageToPlayer(38, "蟻王貝爾 移形換影突襲");
          triggerScreenShake(9, 0.35);
        } else if (dist > 40) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 0.9;
            dealDamageToPlayer(34, "蟻王貝爾 劇毒骨刺");
          }
        }
      }
      else if (e.type === 'high_orc') {
        if (dist > 40) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.3;
            dealDamageToPlayer(24, "高階半獸人 狂暴戰斧劈砍");
          }
        }
      }
      else if (e.type === 'boss_orc_shaman') {
        e.firePillarCd -= dt;
        if (e.firePillarCd <= 0) {
          e.firePillarCd = 3.5;
          createDeathBurst(player.x, player.y, 15);
          dealDamageToPlayer(36, "獸人咒術首領 猩紅烈焰爆裂");
          playSynthSound('magic');
          triggerScreenShake(8, 0.3);
        } else if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.2;
            dealDamageToPlayer(28, "咒術法杖 黑暗法球");
          }
        }
      }
      else if (e.type === 'sea_monster') {
        if (dist > 38) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.2;
            dealDamageToPlayer(25, "深海海獸 巨齒撕裂");
          }
        }
      }
      else if (e.type === 'boss_jima') {
        e.waveCd -= dt;
        if (e.waveCd <= 0) {
          e.waveCd = 4.0;
          dealDamageToPlayer(42, "深海霸主芝麻 巨型雙叉戟海嘯衝擊");
          playSynthSound('boss_roar');
          triggerScreenShake(10, 0.4);
          createHitSparks(player.x, player.y, true);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.0;
            dealDamageToPlayer(32, "芝麻 雙叉戟連刺");
          }
        }
      }
      else if (e.type === 'boss_architect') {
        e.laserCd -= dt;
        if (e.laserCd <= 0) {
          e.laserCd = 3.2;
          dealDamageToPlayer(45, "建築師 系統重構死光橫掃");
          playSynthSound('laser');
          triggerScreenShake(11, 0.4);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.1;
            dealDamageToPlayer(34, "多臂石像 巨臂重砸");
          }
        }
      }
      else if (e.type === 'colossal_giant') {
        if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.8;
            dealDamageToPlayer(30, "百米巨人 大地崩裂踏擊");
            triggerScreenShake(7, 0.25);
          }
        }
      }
      else if (e.type === 'boss_legia') {
        e.slamCd -= dt;
        if (e.slamCd <= 0) {
          e.slamCd = 3.8;
          dealDamageToPlayer(50, "太祖萊吉亞 鎖鏈禁錮風暴");
          playSynthSound('boss_roar');
          triggerScreenShake(12, 0.5);
        } else if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.3;
            dealDamageToPlayer(38, "始祖巨人君王 滅神碎岩拳");
          }
        }
      }
      else if (e.type === 'scavenger_hunter') {
        if (dist > 38) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.1;
            dealDamageToPlayer(26, "清道夫S級獵人 瞬影斬");
          }
        }
      }
      else if (e.type === 'boss_thomas') {
        if (e.hp < e.maxHp * 0.4 && !e.reinforcementActive) {
          e.reinforcementActive = true;
          e.speed = 3.2;
          if (bossPhaseTag) bossPhaseTag.textContent = "PHASE 2: 金剛強化 (霸體)";
          playSynthSound('boss_roar');
          triggerScreenShake(12, 0.5);
          setMiniLog("【世界最強】托馬斯·安德烈開啟金剛霸體強化！");
        }

        e.smashCd -= dt;
        if (e.smashCd <= 0) {
          e.smashCd = 3.0;
          dealDamageToPlayer(52, "托馬斯·安德烈 支配者黑洞重力抓取");
          playSynthSound('magic');
          triggerScreenShake(11, 0.4);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = e.reinforcementActive ? 0.7 : 1.0;
            dealDamageToPlayer(e.reinforcementActive ? 42 : 35, "托馬斯 崩壞金剛重拳");
          }
        }
      }
      else if (e.type === 'boss_plague') {
        e.poisonCd -= dt;
        if (e.poisonCd <= 0) {
          e.poisonCd = 3.0;
          dealDamageToPlayer(38, "瘟疫君王 劇毒腐蝕之霧");
          createDeathBurst(player.x, player.y, 12);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.2;
            dealDamageToPlayer(28, "瘟疫之刺");
          }
        }
      }
      else if (e.type === 'boss_beast') {
        e.leapCd -= dt;
        if (e.leapCd <= 0) {
          e.leapCd = 3.2;
          e.x = player.x;
          e.y = player.y;
          dealDamageToPlayer(48, "百獸君王 獠牙狂暴撲殺");
          triggerScreenShake(10, 0.35);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 0.9;
            dealDamageToPlayer(35, "野性狂暴撕咬");
          }
        }
      }
      else if (e.type === 'boss_frost') {
        e.frostCd -= dt;
        if (e.frostCd <= 0) {
          e.frostCd = 2.8;
          dealDamageToPlayer(44, "酷寒君王 絕對零度冰錐風暴");
          playSynthSound('laser');
          triggerScreenShake(9, 0.35);
        } else if (dist > 45) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.1;
            dealDamageToPlayer(30, "極寒冰刃斬");
          }
        }
      }
      else if (e.type === 'dragon_enemy') {
        if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 1.3;
            dealDamageToPlayer(32, "狂暴巨龍 烈焰龍息");
          }
        }
      }
      else if (e.type === 'boss_antares') {
        e.breathCd -= dt;
        if (e.breathCd <= 0) {
          e.breathCd = 3.5;
          dealDamageToPlayer(58, "龍帝安塔利斯 滅世龍息狂嵐");
          playSynthSound('boss_roar');
          triggerScreenShake(14, 0.5);
          createHitSparks(player.x, player.y, true);
        } else if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 0.8;
            dealDamageToPlayer(42, "破滅君王 焚天龍爪");
          }
        }
      }
      else if (e.type === 'boss_void') {
        e.riftCd -= dt;
        if (e.riftCd <= 0) {
          e.riftCd = 2.8;
          dealDamageToPlayer(62, "混沌虛空之主 萬象湮滅次元斬");
          playSynthSound('arise_voice');
          triggerScreenShake(15, 0.55);
        } else if (dist > 50) {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        } else {
          e.attackCd -= dt;
          if (e.attackCd <= 0) {
            e.attackCd = 0.7;
            dealDamageToPlayer(45, "虛空撕裂");
          }
        }
      }

      // Clamp inside arena
      e.x = Math.max(30, Math.min(arenaWidth - 30, e.x));
      e.y = Math.max(50, Math.min(arenaHeight - 35, e.y));
    });
  }

  function updateHazards(dt) {
    // Act 1 God Statue Laser Hazard
    if (currentAct === 1) {
      godStatue.eyeChargeTimer += dt;
      
      // Every 4.5 seconds statue prepares laser
      if (godStatue.eyeChargeTimer >= 4.0 && godStatue.laserTelegraphTimer <= 0 && godStatue.laserActiveTimer <= 0) {
        godStatue.laserTelegraphTimer = 1.2;
        godStatue.laserY = Math.max(80, Math.min(arenaHeight - 80, player.y));
        playSynthSound('warning');
        setMiniLog("【危險警報】巨神像眼眶猩紅聚能！立刻瞬步閃避死光！");
      }

      if (godStatue.laserTelegraphTimer > 0) {
        godStatue.laserTelegraphTimer -= dt;
        if (godStatue.laserTelegraphTimer <= 0) {
          godStatue.laserActiveTimer = 0.5;
          godStatue.eyeChargeTimer = 0;
          playSynthSound('laser');
          triggerScreenShake(12, 0.4);
        }
      }

      if (godStatue.laserActiveTimer > 0) {
        godStatue.laserActiveTimer -= dt;
        // Hit player if in laser band
        if (Math.abs(player.y - godStatue.laserY) < godStatue.laserHeight / 2) {
          dealDamageToPlayer(35, "巨神像猩紅毀滅死光");
        }
      }
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) particles.splice(i, 1);
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.x += ft.vx;
      ft.y += ft.vy;
      ft.life -= dt;
      ft.alpha = ft.life / 0.8;
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    for (let i = slashTrails.length - 1; i >= 0; i--) {
      const st = slashTrails[i];
      st.life -= dt;
      st.alpha = st.life / 0.18;
      if (st.life <= 0) slashTrails.splice(i, 1);
    }
  }

  function updateHUDValues() {
    // Health bar fill
    const hpPct = Math.max((combatState.currentHp / playerState.maxHp) * 100, 0);
    if (hpFill) hpFill.style.width = hpPct + "%";
    if (hpVal) hpVal.textContent = `${Math.round(combatState.currentHp)}/${playerState.maxHp}`;

    // Mana bar fill
    const mpPct = Math.max((combatState.currentMp / playerState.maxMp) * 100, 0);
    if (mpFill) mpFill.style.width = mpPct + "%";
    if (mpVal) mpVal.textContent = `${Math.round(combatState.currentMp)}/${playerState.maxMp}`;

    // Boss bar fill if boss active
    const activeBoss = enemies.find(e => e.isBoss);
    if (activeBoss && bossHpFill && bossHpValTxt) {
      const bPct = Math.max((activeBoss.hp / activeBoss.maxHp) * 100, 0);
      bossHpFill.style.width = bPct + "%";
      bossHpValTxt.textContent = `${Math.max(activeBoss.hp, 0)}/${activeBoss.maxHp}`;
    }
  }

  function updateCooldownsUI() {
    if (cdSkill1Overlay) {
      const pct = Math.max((player.cdSkill1 / player.maxCdSkill1) * 100, 0);
      cdSkill1Overlay.style.height = pct + "%";
    }
    if (cdSkill2Overlay) {
      const pct = Math.max((player.cdSkill2 / player.maxCdSkill2) * 100, 0);
      cdSkill2Overlay.style.height = pct + "%";
    }
    if (cdUltOverlay) {
      const pct = Math.max((player.cdUlt / player.maxCdUlt) * 100, 0);
      cdUltOverlay.style.height = pct + "%";
    }
  }

  // --- Rendering Pipeline ---

  function render() {
    ctx.save();

    // Camera shake offset
    if (screenShakeTime > 0) {
      const sx = (Math.random() - 0.5) * screenShakeIntensity;
      const sy = (Math.random() - 0.5) * screenShakeIntensity;
      ctx.translate(sx, sy);
    }

    // 1. Draw Arena Background
    renderArenaBackground();

    // 2. Draw Hazards & Telegraphs
    renderHazards();

    // 3. Draw Shadow Army Allies
    renderShadowAllies();

    // 4. Draw Enemies
    renderEnemies();

    // 5. Draw Player Character
    renderPlayer();

    // 6. Draw Particle FX & Slashes
    renderEffects();

    // 7. Draw Floating Numbers
    renderFloatingTexts();

    ctx.restore();
  }

  function renderArenaBackground() {
    // Ground base gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, arenaHeight);
    if (currentAct === 1) {
      bgGrad.addColorStop(0, '#0c0d16');
      bgGrad.addColorStop(1, '#141522');
    } else if (currentAct === 2) {
      bgGrad.addColorStop(0, '#1c150e');
      bgGrad.addColorStop(1, '#2a1f14');
    } else if (currentAct === 3) {
      bgGrad.addColorStop(0, '#170c24');
      bgGrad.addColorStop(1, '#231438');
    } else if (currentAct === 4) {
      bgGrad.addColorStop(0, '#0d131a');
      bgGrad.addColorStop(1, '#101e2b');
    } else if (currentAct === 5) {
      bgGrad.addColorStop(0, '#181119');
      bgGrad.addColorStop(1, '#251528');
    } else if (currentAct === 6) {
      bgGrad.addColorStop(0, '#081a24');
      bgGrad.addColorStop(1, '#0d2838');
    } else if (currentAct === 7) {
      bgGrad.addColorStop(0, '#0f0d14');
      bgGrad.addColorStop(1, '#1d1226');
    } else if (currentAct === 8) {
      bgGrad.addColorStop(0, '#13141f');
      bgGrad.addColorStop(1, '#1e1e2d');
    } else if (currentAct === 9) {
      bgGrad.addColorStop(0, '#181522');
      bgGrad.addColorStop(1, '#282036');
    } else if (currentAct === 10) {
      bgGrad.addColorStop(0, '#220e1a');
      bgGrad.addColorStop(1, '#351428');
    } else if (currentAct === 11) {
      bgGrad.addColorStop(0, '#2a0c0c');
      bgGrad.addColorStop(1, '#3d1414');
    } else if (currentAct === 12) {
      bgGrad.addColorStop(0, '#0a081c');
      bgGrad.addColorStop(1, '#1d0e3a');
    } else {
      bgGrad.addColorStop(0, '#0d131a');
      bgGrad.addColorStop(1, '#101e2b');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, arenaWidth, arenaHeight);

    // Floor Grid Tile Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < arenaWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, arenaHeight);
      ctx.stroke();
    }
    for (let y = 0; y < arenaHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(arenaWidth, y);
      ctx.stroke();
    }

    // Act 1 & 7: Draw God Statue / Architect glyph at top center
    if (currentAct === 1 || currentAct === 7) {
      ctx.save();
      const statueX = arenaWidth / 2;
      const statueY = 32;

      ctx.fillStyle = '#222330';
      ctx.beginPath();
      ctx.arc(statueX, statueY, 26, 0, Math.PI * 2);
      ctx.fill();

      const eyeGlow = currentAct === 1 && (godStatue.laserTelegraphTimer > 0 || godStatue.laserActiveTimer > 0);
      ctx.fillStyle = eyeGlow ? '#ef4444' : (currentAct === 7 ? '#a855f7' : '#661111');
      ctx.shadowColor = eyeGlow ? '#ef4444' : (currentAct === 7 ? '#a855f7' : 'transparent');
      ctx.shadowBlur = eyeGlow || currentAct === 7 ? 15 : 0;
      ctx.fillRect(statueX - 10, statueY - 4, 6, 6);
      ctx.fillRect(statueX + 4, statueY - 4, 6, 6);
      ctx.restore();
    }
  }

  function renderHazards() {
    if (currentAct === 1) {
      // Laser telegraph red strip
      if (godStatue.laserTelegraphTimer > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.fillRect(0, godStatue.laserY - godStatue.laserHeight / 2, arenaWidth, godStatue.laserHeight);
        ctx.strokeRect(0, godStatue.laserY - godStatue.laserHeight / 2, arenaWidth, godStatue.laserHeight);
        ctx.restore();
      }

      // Laser firing beam
      if (godStatue.laserActiveTimer > 0) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 25;
        ctx.fillRect(0, godStatue.laserY - godStatue.laserHeight / 2, arenaWidth, godStatue.laserHeight);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, godStatue.laserY - godStatue.laserHeight / 4, arenaWidth, godStatue.laserHeight / 2);
        ctx.restore();
      }
    }
  }

  function renderShadowAllies() {
    shadowAllies.forEach(s => {
      ctx.save();
      ctx.translate(s.x, s.y);

      // Dark shadow aura under feet
      ctx.fillStyle = 'rgba(87, 27, 193, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shadow silhouette
      ctx.fillStyle = s.variant === 'beru' ? '#1e1035' : (s.variant === 'igrit' ? '#2d0a18' : '#141424');
      ctx.strokeStyle = s.variant === 'beru' ? '#c084fc' : (s.variant === 'igrit' ? '#f43f5e' : '#818cf8');
      ctx.lineWidth = 1.5;

      ctx.fillRect(-10, -20, 20, 38);
      ctx.strokeRect(-10, -20, 20, 38);

      // Head
      ctx.beginPath();
      ctx.arc(0, -26, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = s.variant === 'igrit' ? '#fb7185' : '#a855f7';
      ctx.fillRect(s.facing > 0 ? 1 : -5, -28, 4, 3);

      ctx.restore();
    });
  }

  function renderEnemies() {
    enemies.forEach(e => {
      if (e.hp <= 0) return;

      ctx.save();
      ctx.translate(e.x, e.y);

      // Shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, e.height / 2, e.width / 2 + 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hit flash white or specific color palette
      if (e.hitFlash > 0) {
        ctx.fillStyle = '#ffffff';
      } else if (e.type === 'boss_igrit') {
        ctx.fillStyle = e.phase === 2 ? '#dc2626' : '#881337';
      } else if (e.type === 'boss_beru') {
        ctx.fillStyle = '#3b0764';
      } else if (e.type === 'boss_hwang') {
        ctx.fillStyle = '#78350f';
      } else if (e.type === 'stone_guardian') {
        ctx.fillStyle = e.isElite ? '#334155' : '#475569';
      } else if (e.type === 'sandworm') {
        ctx.fillStyle = '#b45309';
      } else if (e.type === 'high_orc') {
        ctx.fillStyle = '#854d0e';
      } else if (e.type === 'boss_orc_shaman') {
        ctx.fillStyle = '#991b1b';
      } else if (e.type === 'sea_monster') {
        ctx.fillStyle = '#0e7490';
      } else if (e.type === 'boss_jima') {
        ctx.fillStyle = '#0369a1';
      } else if (e.type === 'boss_architect') {
        ctx.fillStyle = '#4c1d95';
      } else if (e.type === 'colossal_giant') {
        ctx.fillStyle = '#57534e';
      } else if (e.type === 'boss_legia') {
        ctx.fillStyle = '#713f12';
      } else if (e.type === 'scavenger_hunter') {
        ctx.fillStyle = '#475569';
      } else if (e.type === 'boss_thomas') {
        ctx.fillStyle = e.reinforcementActive ? '#eab308' : '#ca8a04';
      } else if (e.type === 'boss_plague') {
        ctx.fillStyle = '#15803d';
      } else if (e.type === 'boss_beast') {
        ctx.fillStyle = '#b91c1c';
      } else if (e.type === 'boss_frost') {
        ctx.fillStyle = '#0284c7';
      } else if (e.type === 'dragon_enemy') {
        ctx.fillStyle = '#9a3412';
      } else if (e.type === 'boss_antares') {
        ctx.fillStyle = '#7f1d1d';
      } else if (e.type === 'boss_void') {
        ctx.fillStyle = '#311042';
      } else {
        ctx.fillStyle = '#374151';
      }

      // Draw Body
      ctx.strokeStyle = e.isBoss ? '#f43f5e' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = e.isBoss ? 2 : 1;
      
      ctx.fillRect(-e.width / 2, -e.height / 2, e.width, e.height);
      ctx.strokeRect(-e.width / 2, -e.height / 2, e.width, e.height);

      // Draw Eyes
      ctx.fillStyle = e.isBoss ? '#ef4444' : '#f87171';
      const eyeX = e.facing > 0 ? 2 : -6;
      ctx.fillRect(eyeX, -e.height / 2 + 6, 4, 3);

      // Health bar above head (for non-boss minions)
      if (!e.isBoss) {
        const barWidth = 32;
        const hpPct = Math.max(e.hp / e.maxHp, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(-barWidth / 2, -e.height / 2 - 12, barWidth, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-barWidth / 2, -e.height / 2 - 12, barWidth * hpPct, 4);
      }

      ctx.restore();
    });
  }

  function renderPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);

    // 1. Draw Dash Ghost Clones (殘影)
    player.ghosts.forEach(g => {
      ctx.save();
      ctx.translate(g.x - player.x, g.y - player.y);
      ctx.fillStyle = `rgba(173, 198, 255, ${g.alpha * 0.4})`;
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      ctx.restore();
    });

    // 2. Dark shadow aura under Jin-Woo
    ctx.fillStyle = 'rgba(77, 142, 255, 0.25)';
    ctx.shadowColor = '#4d8eff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(0, player.height / 2, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Jin-Woo Body (Sleek Dark Coat with Purple Highlights)
    if (player.damageFlash > 0) {
      ctx.fillStyle = '#ef4444';
    } else {
      ctx.fillStyle = '#0f172a';
    }
    ctx.strokeStyle = player.isInvulnerable ? '#adc6ff' : '#475569';
    ctx.lineWidth = 1.5;

    // Body rectangle / coat
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    ctx.strokeRect(-player.width / 2, -player.height / 2, player.width, player.height);

    // Head
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Iconic Glowing Blue Eyes (成振宇招牌發光藍眼)
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    const eyeX = player.facing > 0 ? 1 : -5;
    ctx.fillRect(eyeX, -player.height / 2 - 8, 4, 3);

    // 5. Glowing Dagger in Hand
    ctx.strokeStyle = '#adc6ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#adc6ff';
    ctx.shadowBlur = 8;
    const handX = player.facing > 0 ? 14 : -14;
    ctx.beginPath();
    ctx.moveTo(handX, 2);
    ctx.lineTo(handX + player.facing * 12, -4);
    ctx.stroke();

    ctx.restore();
  }

  function renderEffects() {
    // 1. Draw Slash Trails
    slashTrails.forEach(st => {
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.strokeStyle = st.color;
      ctx.shadowColor = st.glowColor;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.globalAlpha = st.alpha;

      ctx.beginPath();
      ctx.arc(0, 0, st.radius, st.startAngle, st.endAngle, st.facing < 0);
      ctx.stroke();
      ctx.restore();
    });

    // 2. Draw Sparks & Dust Particles
    particles.forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function renderFloatingTexts() {
    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.font = `${ft.isCrit ? 'bold ' : ''}${ft.size}px 'Montserrat', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = ft.isCrit ? 10 : 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  // Initialize First Act
  selectAct(1);
}

/* ==========================================
   10. The Sovereign Chronicle (12 Epic Story Arcs)
   ========================================== */
const CHRONICLE_CHAPTERS = {
  1: {
    act: "ARC 01",
    tag: "預言之王 · 無極限",
    tagClass: "tag-gold",
    era: "君王崛起篇",
    title: "我獨自成王",
    quote: "「他不是普通的獵人……他是真正的王，而且他的力量——根本沒有極限！」",
    desc: "在美國最高級別預言家賽諾夫人（諾瑪·賽諾）的占卜中，世間所有強者的潛力都有著清晰的天花板與極限。唯獨在看透成振宇的靈魂深處時，她看見了無窮無盡的深淵與君王神格，親口承認他就是超越常理的唯一真王！",
    highlights: [
      "👑 美國神級預言家賽諾夫人（諾瑪·賽諾）深度占卜",
      "🌌 窺見成振宇靈魂深處浩瀚無垠的暗影深淵",
      "⚡ 證實主角打破人類獵人上限，為唯一的『無限成長之王』"
    ]
  },
  2: {
    act: "ARC 02",
    tag: "嘯牙公會 · 車車入會",
    tagClass: "tag-blue",
    era: "公會創立篇",
    title: "獨自當會長",
    quote: "「原本想叫單身公會太難聽，改名嘯牙 (Ahjin)……車車滿臉想入會，表姊劉蘇嫻也來了！」",
    desc: "為了自由出入高級地下城並提取更多高階魔物之影，成振宇決定自創公會。起初取名『單身公會』被副手劉晨浩瘋狂吐槽太難聽，最終更名為『嘯牙公會 (Ahjin)』。S級女獵人車海印聞訊前來考核一臉想入會，劉晨浩的名媛表姊劉蘇嫻也順利加入湊齊三人門檻！",
    highlights: [
      "🐺 成立史上人數最精簡、戰力最恐怖的『嘯牙公會』",
      "😳 S級頂尖女獵人『車車 (車海印)』滿臉通紅期待入會",
      "💼 財閥名媛劉蘇嫻（晨浩表姊）加入，公會三人架構正式完備"
    ]
  },
  3: {
    act: "ARC 03",
    tag: "高校血洗 · 影蟻屠戮",
    tagClass: "tag-purple",
    era: "深淵救援篇",
    title: "我獨自返校",
    quote: "「動我妹妹者死！瞬步撕裂長空回援，留在地下城的暗影螞蟻已將怪物全滅！」",
    desc: "妹妹成珍雅的高中美術室突發高階紅色傳送門，嗜血獸人魔物血洗校園。正在攻略遠方地下城的成振宇感應到妹妹影中的暗影護衛警報，立刻拋下眼前地下城以極速瞬步破空趕到妹妹面前！而他留在地下城的影子士兵螞蟻，僅憑自身就將地下城魔物全數虐殺殆盡！",
    highlights: [
      "🏫 高中美術室突發高階未測量紅色傳送門",
      "⚡ 感應到妹妹遇險，成振宇極速破空跨越都市回援",
      "🐜 留在地下城的影之螞蟻軍團（貝爾部屬）單方面全滅高階魔獸"
    ]
  },
  4: {
    act: "ARC 04",
    tag: "協會特權 · 屠殺清剿",
    tagClass: "tag-cyan",
    era: "深淵清剿篇",
    title: "獨自有特權",
    quote: "「得到獵人協會一人攻略高級地下城的特權，單人展開大屠殺，收服BOSS魚人芝麻！」",
    desc: "獵人協會會長高建利深知成振宇的驚世戰力，破例授予他前所未有的「單人攻略高級傳送門特權」。成振宇自此展開瘋狂的單人刷本升級大屠殺，並在深海高難地下城中力克雙叉戟兇暴魚人首領，將其收服為影之突擊隊長——「芝麻 (Jima)」！",
    highlights: [
      "📜 獵人協會會長高建利破例授予『單人高級傳送門攻略許可』",
      "⚔️ 成振宇化身深淵收割者，展開大規模單人屠戮清剿",
      "🔱 擊潰深海雙叉戟魚人BOSS，成功提取影之突擊隊長『芝麻 (Jima)』"
    ]
  },
  5: {
    act: "ARC 05",
    tag: "漆黑鑰匙 · 吞噬系統",
    tagClass: "tag-purple",
    era: "宿命原點篇",
    title: "獨自回原點",
    quote: "「體內長出第二顆暗影黑心臟，引發系統Bug反噬吞噬系統，滅了邪神與系統設計者！」",
    desc: "成振宇手持漆黑的未知鑰匙，重回宿命的起點——卡特農神廟（雙重地下城）。系統設計者（神像建築師）試圖將主角當作暗影君王降臨的容器，卻驚愕發現主角體內不知何時孕育了第二顆「暗影心臟」，導致系統產生Bug被反向吞噬！成振宇揮刃將邪神巨像與設計者徹底斬殺！",
    highlights: [
      "🗝️ 獲得神秘漆黑鑰匙，重返雙重地下城『卡特農神廟』",
      "🖤 體內覺醒第二顆暗影君王之核（黑心臟），導致系統邏輯反噬Bug",
      "🗿 徹底斬滅神像設計者（建築師），完全吞噬系統權限"
    ]
  },
  6: {
    act: "ARC 06",
    tag: "跨海救日 · 始祖君王",
    tagClass: "tag-gold",
    era: "國際危機篇",
    title: "我獨自旅日",
    quote: "「日本國內力量全滅無法抵擋S級危機，主角一人拯救日本，進入傳送口滅太祖君王萊吉亞！」",
    desc: "日本東京上空爆發S級超巨型傳送門，百米巨人魔物肆虐，日本頂尖獵人全軍覆沒。成振宇單槍匹馬跨海赴日，隻身屠滅巨人軍團。深入傳送門核心後，他拒絕被利誘，一刀斬殺被鎖鏈禁錮的「始祖巨人君王·太祖萊吉亞」，並得知了九大君王與光明支配者永恆對立的創世秘辛！",
    highlights: [
      "🗾 日本東京面臨滅頂之災，成振宇單人赴日挽救整個國家",
      "⛓️ 踏入S級門扉深處，斬滅被禁錮的始祖巨人君王『太祖萊吉亞』",
      "🌌 獲悉宇宙兩大勢力『九大君王』與『光明支配者』宿命決戰真相"
    ]
  },
  7: {
    act: "ARC 07",
    tag: "國際峰會 · 暴打托馬斯",
    tagClass: "tag-blue",
    era: "世界巔峰篇",
    title: "我獨自旅美",
    quote: "「晨浩遭綁架，主角幹上清道夫公會托馬斯把世界最強按在地上摩擦，收服黃東樹為『無厭』！」",
    desc: "成振宇受邀赴美參加國際獵人會議，參觀第一巨龍「卡米什」骸骨。叛逃S級獵人黃東樹趁機綁架凌虐富二代劉晨浩，成振宇暴怒降臨，世界頂尖「清道夫公會」國家級獵人托馬斯·安德烈親自出面阻攔。成振宇隻手將不可一世的世界最強托馬斯按在地上瘋狂摩擦，並處決黃東樹提取為影之將軍——「無厭 (Greed)」！",
    highlights: [
      "🐉 參加國際獵人峰會，瞻仰人類歷史首位天災『巨龍卡米什』骸骨",
      "👊 為解救受虐的晨浩，隻手將世界最強國家級獵人托馬斯·安德烈暴揍摩擦",
      "👑 處決背叛者黃東樹，敕令『站起來！』提取為影之將軍『無厭 (Greed)』"
    ]
  },
  8: {
    act: "ARC 08",
    tag: "會長殞落 · 獨戰三君王",
    tagClass: "tag-purple",
    era: "君王突襲篇",
    title: "我獨自扛戰",
    quote: "「高建利會長光輝碎片殞落，托馬斯贈刀；遊樂園約會救場，主角一人獨扛三大君王斬瘟疫！」",
    desc: "身懷「最璀璨光輝碎片」的獵人協會會長高建利遭酷寒君王刺殺殞落。被主角打服的托馬斯前來致敬，將巨龍之牙神器「卡米什短劍」贈予主角。隨後百獸君王突襲，此時成振宇正與車車在遊樂園約會，托馬斯苦撐不敵，主角及時趕到隻身扛起戰局，面對百獸、酷寒、瘟疫三大君王圍毆，絕境中怒斬瘟疫君王！",
    highlights: [
      "🕊️ 最璀璨光輝碎片宿主——德高望重的高建利會長英勇殞落",
      "🗡️ 托馬斯·安德烈心悅誠服，贈予巨龍尖牙神器『卡米什的狂怒』雙短劍",
      "🎡 與車海印摩天輪約會後火速馳援戰場，一人扛下三大君王圍攻並斬殺瘟疫君王"
    ]
  },
  9: {
    act: "ARC 09",
    tag: "假死覺醒 · 真王降臨",
    tagClass: "tag-gold",
    era: "神格覺醒篇",
    title: "我獨自輪迴",
    quote: "「心臟被捅假死，阿斯木上歷史課講述支配者與君王由來、輪迴之盃倒轉無數次！完整神力復甦！」",
    desc: "主角被百獸君王刺穿心臟假死，於病房無限幻象中甦醒。初代暗影君王阿斯木現身上歷史課：創世神「絕對者」創造光明碎片（支配者）與黑暗碎片（君王）永恆廝殺；地球早已被當戰場毀滅過無數次，全靠支配者使用『輪迴之盃』倒轉時光！阿斯木將全部神力託付主角，真王復甦重回人間；父親程日翰動用光明碎片神力最後道別後化灰消散……",
    highlights: [
      "💔 心臟被百獸君王刺穿，於意識深處病房幻象中假死重生",
      "📖 初代暗影君王阿斯木（Ashborn）講授創世神戰歷史課與輪迴之盃倒轉秘辛",
      "🔥 完整暗影君王神力以人類肉身徹底覺醒，父親程日翰動用光輝神力力竭化灰"
    ]
  },
  10: {
    act: "ARC 10",
    tag: "原始軍團 · 總軍團長",
    tagClass: "tag-purple",
    era: "神軍降臨篇",
    title: "我獨自大軍",
    quote: "「首爾最大傳送門開啟，冒出的竟是前任君王阿斯木數十萬原始大軍！收服總軍團長伯利昂！」",
    desc: "韓國上空浮現超巨型黑色傳送門，全世界陷入絕望。然而從門扉中踏出的，竟是初代暗影君王阿斯木沉睡的原始軍團——整整數十萬名身經百戰的不死暗影大軍！全軍見到成振宇齊齊下跪高呼吾王！統領這支浩瀚大軍的，正是手握千節蜈蚣長劍的影之總軍團長「伯利昂 (Bellion)」，主角瞬間執掌宇宙最強軍勢！",
    highlights: [
      "🌌 首爾天空浮現史無前例的超巨型黑色傳送門",
      "👥 前任君王阿斯木數十萬原始暗影士兵集體出陣，全員下跪宣誓效忠",
      "⚔️ 第一戰神『影之總軍團長 伯利昂 (Bellion)』正式臣服歸附"
    ]
  },
  11: {
    act: "ARC 11",
    tag: "八門滅世 · 斬殺龍帝",
    tagClass: "tag-gold",
    era: "終焉神戰篇",
    title: "我獨自宣戰",
    quote: "「全球8大傳送口蠢蠢欲動，破滅君王龍帝加拿大降臨！滅幻界、金剛君王，結合支配者神罰打敗龍帝！」",
    desc: "地球上空8個巨型傳送口即將破滅，成振宇通告全球人類遠離撤離。主角奔赴中國防守卻遇敵方「調虎離山空城計」，邪惡最強「破滅君王·龍帝安塔利斯」於加拿大降臨大肆破壞！成振宇急速折返，斬殺幻界君王與金剛君王，最後結合支配者們神罰光矛徹底擊潰破滅君王龍帝！",
    highlights: [
      "🌍 地球上空8大巨型傳送口齊開，君王滅世浩劫全面爆發",
      "🎭 識破龍帝加拿大調虎離山計策，極速折返斬殺幻界君王與金剛君王",
      "🐉 聯手支配者從天而降的光明神罰長槍，徹底斬滅最強破滅君王龍帝安塔利斯"
    ]
  },
  12: {
    act: "ARC 12",
    tag: "逆轉十年 · 孤獨成神",
    tagClass: "tag-cyan",
    era: "神話終局篇",
    title: "我獨自成神",
    quote: "「要求重啟輪迴之盃倒轉十年，於次元裂縫孤身奮戰打敗所有君王！創造無人知曉的和平世界，極致首尾呼應『獨自』！」",
    desc: "主角對人間滿目瘡痍的結局不滿意，要求支配者啟動『輪迴之盃』讓時光倒轉十年。成振宇孤身一人踏入次元裂縫歷經27年苦戰，將所有君王逐一斬草除根，締造了一個沒有傷亡、沒有魔力與獵人的安寧地球。雖然他是世界最強、獨自守護了全人類，但世上無人知曉他的名字，首尾呼應將『獨自』的悲壯宿命推向神話巔峰！",
    highlights: [
      "⏳ 拒絕生靈塗炭的慘勝，要求支配者啟動『輪迴之盃』倒轉時光十年",
      "🌌 孤身踏入冰冷無垠的次元裂縫，歷經整整27年將所有君王全數斬盡殺絕",
      "🕊️ 締造無傳送門、無傷亡、無魔力的安寧地球",
      "👑 世界無人知曉他的名字，首尾呼應使『我獨自』的宿命達到最極致"
    ]
  }
};

function setupStoryChronicle() {
  const filterBtns = document.querySelectorAll('.chronicle-filter-btn');
  const cards = document.querySelectorAll('.chronicle-card');
  const modal = document.getElementById('chapter-modal');
  const closeBtn = document.getElementById('chapter-close-btn');
  const modalTag = document.getElementById('modal-chapter-tag');
  const modalEra = document.getElementById('modal-chapter-era');
  const modalTitle = document.getElementById('modal-chapter-title');
  const modalQuote = document.getElementById('modal-chapter-quote');
  const modalDesc = document.getElementById('modal-chapter-desc');
  const modalHighlights = document.getElementById('modal-chapter-highlights');
  const modalAriseBtn = document.getElementById('modal-arise-trigger-btn');
  const prevBtn = document.getElementById('modal-prev-chapter-btn');
  const nextBtn = document.getElementById('modal-next-chapter-btn');

  let activeChapterId = 1;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'scale-in 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
      playSynthSound('click');
    });
  });

  function openChapterModal(chId) {
    activeChapterId = parseInt(chId, 10);
    const data = CHRONICLE_CHAPTERS[activeChapterId];
    if (!data) return;

    if (modalTag) {
      modalTag.textContent = data.tag;
      modalTag.className = `chip ${data.tagClass || ''}`;
    }
    if (modalEra) modalEra.textContent = data.era;
    if (modalTitle) modalTitle.textContent = `${data.act} · ${data.title}`;
    if (modalQuote) modalQuote.textContent = data.quote;
    if (modalDesc) modalDesc.textContent = data.desc;

    if (modalHighlights) {
      modalHighlights.innerHTML = '';
      data.highlights.forEach(h => {
        const item = document.createElement('div');
        item.className = 'chapter-modal-highlight-item';
        item.innerHTML = `<span>⚡</span> <span>${h}</span>`;
        modalHighlights.appendChild(item);
      });
    }

    if (modal) {
      modal.classList.add('active');
      playSynthSound('portal_warp');
    }
  }

  function closeChapterModal() {
    if (modal) modal.classList.remove('active');
  }

  // Card detail buttons
  document.querySelectorAll('.chronicle-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ch = btn.getAttribute('data-chapter');
      openChapterModal(ch);
    });
  });

  // Play battle buttons on chronicle cards
  document.querySelectorAll('.chronicle-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = parseInt(btn.getAttribute('data-act'), 10);
      launchBattleFromChronicle(act);
    });
  });

  function launchBattleFromChronicle(actId) {
    closeChapterModal();
    const actItem = document.getElementById(`campaign-item-${actId}`);
    if (actItem) actItem.classList.remove('locked');

    const campaignSec = document.getElementById('campaign-section');
    if (campaignSec) {
      campaignSec.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.launchActBattle) {
      window.launchActBattle(actId);
    }
    playSynthSound('portal_warp');
  }

  // Play battle button inside modal
  const modalPlayBattleBtn = document.getElementById('modal-play-battle-btn');
  if (modalPlayBattleBtn) {
    modalPlayBattleBtn.addEventListener('click', () => {
      const actMapping = {
        1: 1, 2: 2, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10, 9: 3, 10: 4, 11: 11, 12: 12
      };
      const targetAct = actMapping[activeChapterId] || activeChapterId;
      launchBattleFromChronicle(targetAct);
    });
  }

  // Clicking cards directly also opens the detail modal
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.chronicle-play-btn') || e.target.closest('.chronicle-detail-btn')) return;
      const ch = card.getAttribute('data-chapter');
      openChapterModal(ch);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeChapterModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeChapterModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeChapterModal();
    }
  });

  // Prev / Next Chapter Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let target = activeChapterId - 1;
      if (target < 1) target = 12;
      openChapterModal(target);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let target = activeChapterId + 1;
      if (target > 12) target = 1;
      openChapterModal(target);
    });
  }

  // Arise action in modal
  if (modalAriseBtn) {
    modalAriseBtn.addEventListener('click', () => {
      playSynthSound('arise_voice');
      playSynthSound('arise');
      triggerScreenShake();
      const modalWindow = modal.querySelector('.chapter-modal-window');
      if (modalWindow) {
        modalWindow.style.boxShadow = '0 0 50px rgba(208, 188, 255, 0.8)';
        setTimeout(() => {
          modalWindow.style.boxShadow = '';
        }, 1800);
      }
    });
  }
}

/* ==========================================
   11. Mega Arise (站起來！) Master Feature
   ========================================== */
function setupMegaArise() {
  const megaAriseBtn = document.getElementById('mega-arise-btn');
  const ariseBtn = document.getElementById('arise-btn');
  const ariseOverlay = document.getElementById('arise-overlay');

  function executeAriseSequence() {
    playSynthSound('arise_voice');
    setTimeout(() => playSynthSound('arise'), 300);

    triggerScreenShake();

    if (ariseOverlay) {
      ariseOverlay.classList.add('active');
      setTimeout(() => ariseOverlay.classList.remove('active'), 3500);
    }

    // Glowing border burst on all cards
    document.querySelectorAll('.glass-card, .moment-card, .ally-card, .faction-card').forEach(card => {
      card.style.transition = 'all 0.5s ease';
      card.style.borderColor = 'var(--color-secondary)';
      card.style.boxShadow = '0 0 35px rgba(208, 188, 255, 0.5)';
      setTimeout(() => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }, 3500);
    });

    // Spawn massive dark mist particles
    spawnMegaShadowParticles();
  }

  if (megaAriseBtn) megaAriseBtn.addEventListener('click', executeAriseSequence);
  if (ariseBtn) ariseBtn.addEventListener('click', executeAriseSequence);

  function spawnMegaShadowParticles() {
    const particleCount = 160;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'arise-particle';
      const left = Math.random() * window.innerWidth;
      const top = window.pageYOffset + window.innerHeight * (0.3 + Math.random() * 0.7);
      const size = Math.random() * 8 + 3;
      const delay = Math.random() * 1.2;
      const duration = Math.random() * 2.2 + 1.2;

      p.style.left = left + 'px';
      p.style.top = top + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.borderRadius = '50%';
      p.style.position = 'absolute';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '9998';
      p.style.background = i % 3 === 0 ? '#4d8eff' : (i % 3 === 1 ? '#d0bcff' : '#ffffff');
      p.style.boxShadow = `0 0 ${size * 3}px var(--color-secondary)`;
      p.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.2, 1) ${delay}s, opacity ${duration}s ease ${delay}s`;

      document.body.appendChild(p);
      p.offsetHeight;

      const driftX = (Math.random() - 0.5) * 260;
      const riseY = -(Math.random() * 380 + 200);
      p.style.transform = `translate(${driftX}px, ${riseY}px) scale(0)`;
      p.style.opacity = '0';

      setTimeout(() => p.remove(), (duration + delay) * 1000);
    }
  }
}

function triggerScreenShake() {
  document.body.style.animation = 'screen-shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
}

