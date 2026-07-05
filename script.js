/* ==========================================================================
   AOS INIT
   ========================================================================== */
if (window.AOS) {
  AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 50 });
}

/* ==========================================================================
   LOADER
   ========================================================================== */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const barFill = document.getElementById('loaderBarFill');
  requestAnimationFrame(() => {
    barFill.style.transition = 'width .9s cubic-bezier(0.16,1,0.3,1)';
    barFill.style.width = '100%';
  });
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.style.overflow = '';
  }, 1100);
});
setTimeout(() => { document.body.style.overflow = ''; }, 1400);

/* ==========================================================================
   SCROLL PROGRESS + BACK TO TOP
   ========================================================================== */
(function onScroll(){
  const fill = document.getElementById('scrollProgressFill');
  const backToTop = document.getElementById('backToTop');
  const navbar = document.getElementById('navbar');
  function update(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = pct + '%';
    backToTop.classList.toggle('visible', scrollTop > 600);
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 20);
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ==========================================================================
   MOBILE NAV
   ========================================================================== */
(function mobileNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));
})();

/* ==========================================================================
   TYPED.JS HERO LINE
   ========================================================================== */
(function initTyped(){
  const el = document.getElementById('typedText');
  if (!el) return;
  if (window.Typed) {
    new Typed('#typedText', {
      strings: ['LEARN.', 'PROTECT.', 'STAY CYBER SMART.'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1300,
      startDelay: 200,
      loop: true,
      showCursor: false,
    });
  } else {
    el.textContent = 'LEARN. PROTECT. STAY CYBER SMART.';
  }
})();

/* ==========================================================================
   VANILLA TILT
   ========================================================================== */
(function initTilt(){
  if (!window.VanillaTilt) return;
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  VanillaTilt.init(cards, { max: 4, speed: 350, scale: 1.01, glare: false });
})();

/* ==========================================================================
   RIPPLE
   ========================================================================== */
(function initRipple(){
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });
})();

/* ==========================================================================
   STAT COUNTERS
   ========================================================================== */
(function initCounters(){
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;
  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1100;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();

/* ==========================================================================
   IMPORTANT ACTIONS PROGRESS
   ========================================================================== */
(function initActionsProgress(){
  const ring = document.getElementById('actionsProgressRing');
  const value = document.getElementById('actionsProgressValue');
  const buttons = document.querySelectorAll('[data-progress-step]');
  if (!ring || !value || !buttons.length) return;

  const steps = ['portal', 'certificate', 'labs', 'presentation'];
  const completedSteps = new Set();
  let currentPct = 0;
  let animationFrameId = null;

  function renderRing(pct){
    ring.style.background = `conic-gradient(var(--volt) 0 ${pct}%, rgba(245,243,236,.14) ${pct}% 100%)`;
    value.textContent = Math.round(pct) + '%';
  }

  function animateRing(targetPct){
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    const startPct = currentPct;
    const duration = 520;
    const startTime = performance.now();

    function step(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentPct = startPct + (targetPct - startPct) * eased;
      renderRing(currentPct);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        animationFrameId = null;
        currentPct = targetPct;
        renderRing(currentPct);
      }
    }

    animationFrameId = requestAnimationFrame(step);
  }

  function updateRing(){
    const done = steps.filter(step => completedSteps.has(step)).length;
    const pct = Math.round((done / steps.length) * 100);
    animateRing(pct);
  }

  updateRing();

  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (button.getAttribute('href') === '#') {
        event.preventDefault();
      }
      const step = button.dataset.progressStep;
      if (!step) return;
      if (!completedSteps.has(step)) {
        completedSteps.add(step);
        updateRing();
      }
    });
  });
})();

/* ==========================================================================
   SAFETY THREAT TABS
   ========================================================================== */
(function initTabs(){
  const tabs = document.querySelectorAll('#safetyTabs .tab-btn');
  const cards = document.querySelectorAll('#safetyGrid .safety-card');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.tab;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

/* ==========================================================================
   ACCORDION
   ========================================================================== */
(function initAccordion(){
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();

/* ==========================================================================
   LIVE PROGRESS CHECKLIST
   ========================================================================== */
(function initChecklist(){
  const STORAGE_KEY = 'cybersmart_progress_v1';
  const items = document.querySelectorAll('#checklist .checklist-item input');
  const ringBar = document.getElementById('progressRingBar');
  const percentLabel = document.getElementById('progressPercent');
  const resetBtn = document.getElementById('resetProgress');
  const CIRCUMFERENCE = 2 * Math.PI * 60;

  if (!items.length || !ringBar || !percentLabel || !resetBtn) return;

  function loadState(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(state){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function updateRing(){
    const total = items.length;
    const checked = Array.from(items).filter(i => i.checked).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    ringBar.style.strokeDasharray = CIRCUMFERENCE;
    ringBar.style.strokeDashoffset = offset;
    percentLabel.textContent = pct + '%';
    if (pct === 100) launchConfetti();
  }

  const state = loadState();
  items.forEach(input => {
    const key = input.closest('.checklist-item').dataset.key;
    if (state[key]) input.checked = true;
    input.addEventListener('change', () => {
      const s = loadState();
      s[key] = input.checked;
      saveState(s);
      updateRing();
    });
  });
  updateRing();

  if (resetBtn){
    resetBtn.addEventListener('click', () => {
      saveState({});
      items.forEach(i => i.checked = false);
      updateRing();
    });
  }
})();

/* ==========================================================================
   CONFETTI
   ========================================================================== */
const launchConfetti = (function(){
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;

  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#D4FF00', '#FF4D6D', '#4361FF', '#0B0C10'];

  function spawn(){
    particles = [];
    for (let i = 0; i < 140; i++){
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 220,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.28 + Math.random() * 0.12,
        life: 0,
      });
    }
  }

  function frame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;
      if (p.y < canvas.height + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 220);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  return function launch(){
    if (running) return;
    running = true;
    spawn();
    frame();
  };
})();

document.getElementById('certificateAction')?.addEventListener('click', () => launchConfetti());

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
(function initThemeToggle(){
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const icon = toggle.querySelector('i');
  
  function getTheme() {
    return localStorage.getItem('csaw_theme') || 'light';
  }
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('csaw_theme', theme);
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }
  
  applyTheme(getTheme());
  
  toggle.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
})();

/* ==========================================================================
   CYBER TERMINAL
   ========================================================================== */
(function initTerminal(){
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  if (!input || !body) return;
  
  const COMMANDS = {
    help: 'Available commands:\n  - help   : Show available commands\n  - scan   : Run threat diagnostic\n  - about  : Show project details\n  - cert   : Check certificate status\n  - clear  : Clear terminal screen',
    about: 'Cyber Security Awareness Workshop\nCommunity Development Project\nConductor: Ketan Yadav, B.Tech CSE (AI/ML)',
    cert: () => {
      const STORAGE_KEY = 'cybersmart_progress_v1';
      let progress = '0%';
      try {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        const progressKeys = ['portal', 'certificate', 'labs', 'presentation'];
        const total = progressKeys.length;
        const checked = progressKeys.filter(key => state[key]).length;
        progress = Math.round((checked / total) * 100) + '%';
      } catch(e) {}
      return `Certificate progress: ${progress}\nEnsure all checklist tasks are ticked below to unlock.`;
    }
  };
  
  function addLine(text, type = 'system') {
    const div = document.createElement('div');
    div.className = `terminal-line ${type}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  
  // Background logs simulation
  const mockLogs = [
    '[LOG] Network interface monitoring active.',
    '[LOG] Firewall rules refreshed. 0 packets dropped.',
    '[LOG] Phishing filter database updated.',
    '[LOG] Active shield: QR code analyzer running.',
    '[LOG] Security audit: 0 active threats detected.',
    '[LOG] UPI payment redirect interceptor enabled.',
    '[LOG] Encrypted tunnel handshake verified.'
  ];
  
  setInterval(() => {
    const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
    addLine(randomLog, 'system');
  }, 16000);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      input.value = '';
      if (!val) return;
      
      addLine(`guest@csaw:~$ ${val}`, 'user');
      
      const cmd = val.toLowerCase();
      
      if (cmd === 'clear') {
        body.innerHTML = '';
        addLine('[Terminal screen cleared]', 'system');
        return;
      }
      
      if (cmd === 'scan') {
        addLine('Starting active threat scan...', 'system');
        setTimeout(() => {
          addLine('Scanning system memory: SECURE', 'system');
        }, 300);
        setTimeout(() => {
          addLine('Scanning QR validation logs: SECURE', 'system');
        }, 600);
        setTimeout(() => {
          addLine('Checking credential storage: SECURE', 'system');
        }, 900);
        setTimeout(() => {
          addLine('>> Result: 0 active threats found. Network safe.', 'output');
        }, 1200);
        return;
      }
      
      if (COMMANDS[cmd] !== undefined) {
        const res = typeof COMMANDS[cmd] === 'function' ? COMMANDS[cmd]() : COMMANDS[cmd];
        addLine(res, 'output');
      } else {
        addLine(`Command not found: '${val}'. Type 'help' for available commands.`, 'system');
      }
    }
  });
})();

/* ==========================================================================
   SCAM LABS (INTERACTIVE)
   ========================================================================== */
(function initScamLabs(){
  // Tab Controls
  const tabBtns = document.querySelectorAll('#labTabs .tab-btn');
  const panels = {
    phish: document.getElementById('panel-phish'),
    password: document.getElementById('panel-password')
  };
  const labsPanel = document.getElementById('labs');
  const phishTabBtn = document.querySelector('#labTabs .tab-btn[data-tab="phish"]');
  const attentionTriggers = [document.getElementById('playLabsBtn'), document.getElementById('labsAction')].filter(Boolean);
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetTab = btn.dataset.tab;
      Object.keys(panels).forEach(key => {
        if (panels[key]) {
          panels[key].classList.toggle('active', key === targetTab);
        }
      });
    });
  });

  function spotlightPhishPanel(){
    if (phishTabBtn) {
      phishTabBtn.click();
    }

    if (labsPanel) {
      labsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const phishPanel = panels.phish;
    if (!phishPanel) return;

    phishPanel.classList.remove('attention-pop');
    void phishPanel.offsetWidth;
    phishPanel.classList.add('attention-pop');
    window.setTimeout(() => phishPanel.classList.remove('attention-pop'), 900);
  }

  attentionTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      spotlightPhishPanel();
    });
  });

  // Phishing Spotter
  const targets = document.querySelectorAll('#panel-phish .phishing-target');
  const countEl = document.getElementById('phishCount');
  const feedbackEl = document.getElementById('phishFeedback');
  const successBadge = document.getElementById('phishSuccess');
  let spottedCount = 0;
  const spottedSet = new Set();
  
  targets.forEach(target => {
    target.addEventListener('click', () => {
      if (spottedSet.has(target.id)) {
        feedbackEl.innerHTML = `<strong>Spotted Flag Info:</strong> ${target.dataset.reason}`;
        return;
      }
      
      spottedSet.add(target.id);
      target.classList.add('spotted');
      spottedCount++;
      if (countEl) countEl.textContent = spottedCount;
      
      if (feedbackEl) {
        feedbackEl.innerHTML = `<strong>Red Flag Spotted!</strong> ${target.dataset.reason}`;
        feedbackEl.classList.remove('highlight');
        void feedbackEl.offsetWidth; // trigger reflow
        feedbackEl.classList.add('highlight');
      }
      
      if (spottedCount === 3 && successBadge) {
        successBadge.style.display = 'inline-flex';
        if (typeof launchConfetti === 'function') {
          launchConfetti();
        }
      }
    });
  });

  // Password Tester
  const pwdInput = document.getElementById('pwdInput');
  const pwdToggle = document.getElementById('pwdToggle');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const crackTime = document.getElementById('crackTime');
  
  const rules = {
    length: document.getElementById('rule-length'),
    upper: document.getElementById('rule-upper'),
    lower: document.getElementById('rule-lower'),
    number: document.getElementById('rule-number'),
    symbol: document.getElementById('rule-symbol')
  };

  if (pwdToggle && pwdInput) {
    pwdToggle.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      pwdToggle.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  }

  if (pwdInput) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      if (!val) {
        if (strengthBar) strengthBar.style.width = '0%';
        if (strengthText) strengthText.textContent = 'Strength: Empty';
        if (crackTime) crackTime.textContent = 'Instant';
        Object.values(rules).forEach(el => {
          if (el) {
            el.classList.remove('valid');
            el.querySelector('i').className = 'fa-solid fa-circle-xmark';
          }
        });
        return;
      }

      const checks = {
        length: val.length >= 12,
        upper: /[A-Z]/.test(val),
        lower: /[a-z]/.test(val),
        number: /[0-9]/.test(val),
        symbol: /[^A-Za-z0-9]/.test(val)
      };

      let passCount = 0;
      Object.keys(checks).forEach(key => {
        const el = rules[key];
        if (el) {
          const pass = checks[key];
          el.classList.toggle('valid', pass);
          el.querySelector('i').className = pass ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
          if (pass) passCount++;
        }
      });

      let score = 0;
      if (val.length >= 6) score += 1;
      if (val.length >= 10) score += 1;
      if (val.length >= 14) score += 1;
      if (checks.upper && checks.lower) score += 1;
      if (checks.number || checks.symbol) score += 1;
      if (val.length >= 12 && checks.upper && checks.lower && checks.number && checks.symbol) score = 5;

      let barColor = '#EF4444';
      let label = 'WEAK';
      let timeDesc = 'Instant';
      let pct = 20;

      if (score <= 2) {
        barColor = '#EF4444';
        label = 'WEAK';
        pct = Math.min(60, val.length * 6);
        timeDesc = val.length < 8 ? 'Seconds' : 'Minutes';
      } else if (score <= 4) {
        barColor = '#FFB703';
        label = 'MEDIUM';
        pct = 66;
        timeDesc = val.length < 11 ? 'Hours' : 'Months';
      } else {
        barColor = '#D4FF00';
        label = 'STRONG';
        pct = 100;
        
        if (val.includes(' ') && val.length >= 16) {
          timeDesc = 'Trillions of Centuries';
        } else {
          timeDesc = val.length >= 16 ? 'Billions of Years' : 'Centuries';
        }
      }

      if (strengthBar) {
        strengthBar.style.width = pct + '%';
        strengthBar.style.backgroundColor = barColor;
      }
      if (strengthText) strengthText.textContent = `Strength: ${label}`;
      if (crackTime) crackTime.textContent = timeDesc;
    });
  }
})();

/* ==========================================================================
   CERTIFICATE SUBMISSION SYSTEM
   ========================================================================== */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwA4l_MsWl8nNzQQm3Bh96xziEjWDjq_J3FtzUaoPMHtlgMtq8z5X-_GMwlEOuVWK5T5Q/exec";

const submissionModal = document.getElementById("submissionModal");
const submissionOverlay = document.getElementById("submissionOverlay");
const openSubmissionBtn = document.getElementById("certificateAction");
const closeSubmissionBtn = document.getElementById("closeSubmissionModal");
const cancelSubmissionBtn = document.getElementById("cancelSubmission");

const form = document.getElementById("certificateForm");

const submitBtn = document.getElementById("submitCertificateBtn");

const successScreen = document.getElementById("submissionSuccess");

const doneBtn = document.getElementById("successDoneBtn");

const fileInput = document.getElementById("certificateFile");
const fileDropLabel = document.getElementById("fileDropLabel");
const fileDropText = document.getElementById("fileDropText");

const MAX_FILE_MB = 5;
const DEFAULT_FILE_TEXT = "Click to upload or drag PDF here";

/* ===============================
   FILE DROPZONE
================================*/

function setSelectedFile(file){
    if(file){
        fileDropLabel.classList.add("has-file");
        fileDropLabel.classList.remove("error");
        fileDropText.textContent = file.name;
    } else {
        fileDropLabel.classList.remove("has-file");
        fileDropText.textContent = DEFAULT_FILE_TEXT;
    }
}

fileInput.addEventListener("change", ()=>{
    setSelectedFile(fileInput.files[0]);
});

["dragover","dragleave","drop"].forEach(evtName=>{
    fileDropLabel.addEventListener(evtName, (e)=>{
        e.preventDefault();
        if(evtName === "dragover"){
            fileDropLabel.classList.add("dragover");
        } else {
            fileDropLabel.classList.remove("dragover");
        }
    });
});

fileDropLabel.addEventListener("drop", (e)=>{
    const dropped = e.dataTransfer.files[0];
    if(dropped){
        fileInput.files = e.dataTransfer.files;
        setSelectedFile(dropped);
    }
});

function fileToBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=> resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/* ===============================
   OPEN MODAL
================================*/

function openSubmissionModal(e){

    if(e) e.preventDefault();

    submissionModal.classList.add("active");

    document.body.style.overflow="hidden";

}

/* ===============================
   CLOSE MODAL
================================*/

function closeSubmissionModal(){

    submissionModal.classList.remove("active");

    document.body.style.overflow="";

}

openSubmissionBtn.addEventListener("click",openSubmissionModal);

closeSubmissionBtn.addEventListener("click",closeSubmissionModal);

cancelSubmissionBtn.addEventListener("click",closeSubmissionModal);

submissionOverlay.addEventListener("click",closeSubmissionModal);

/* ===============================
   ESC KEY
================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeSubmissionModal();

    }

});

/* ===============================
   VALIDATION
================================*/

function validateForm(){

    let valid=true;

    document.querySelectorAll(".error").forEach(el=>el.classList.remove("error"));

    const name=document.getElementById("studentName");
    const cls=document.getElementById("studentClass");
    const sec=document.getElementById("studentSection");
    const mob=document.getElementById("studentMobile");
    const ref=document.getElementById("studentReference");
    const check=document.getElementById("confirmCompletion");

    if(name.value.trim()==""){

        name.classList.add("error");

        valid=false;

    }

    if(cls.value==""){

        cls.classList.add("error");

        valid=false;

    }

    if(sec.value.trim()==""){

        sec.classList.add("error");

        valid=false;

    }

    if(!/^[0-9]{10}$/.test(mob.value)){

        mob.classList.add("error");

        valid=false;

    }

    if(ref.value.trim()==""){

        ref.classList.add("error");

        valid=false;

    }

    if(!check.checked){

        alert("Please confirm that you completed all modules.");

        valid=false;

    }

    const file=fileInput.files[0];

    if(!file){

        fileDropLabel.classList.add("error");

        valid=false;

    } else if(file.type!=="application/pdf"){

        fileDropLabel.classList.add("error");

        alert("Please upload your certificate as a PDF file.");

        valid=false;

    } else if(file.size > MAX_FILE_MB*1024*1024){

        fileDropLabel.classList.add("error");

        alert(`That file is too large. Please upload a PDF under ${MAX_FILE_MB}MB.`);

        valid=false;

    }

    return valid;

}

/* ===============================
   SUBMIT
================================*/

form.addEventListener("submit",async function(e){

    e.preventDefault();

    if(!validateForm()) return;

    submitBtn.classList.add("loading");

    submitBtn.disabled=true;

    try{

        const file=fileInput.files[0];

        const fileData=await fileToBase64(file);

        const data={

            name:document.getElementById("studentName").value,

            class:document.getElementById("studentClass").value,

            section:document.getElementById("studentSection").value,

            mobile:document.getElementById("studentMobile").value,

            reference:document.getElementById("studentReference").value,

            fileName:file.name,

            mimeType:file.type,

            fileData:fileData

        };

        const response=await fetch(SCRIPT_URL,{

            method:"POST",

            body:JSON.stringify(data)

        });

        const result=await response.json();

        console.log(result);

        if(result.status !== "success"){

            throw new Error(result.message || "The server rejected the submission.");

        }

        form.style.display="none";

        successScreen.classList.add("active");

        if(typeof launchConfetti==="function"){

            launchConfetti();

        }

        localStorage.setItem("certificateSubmitted","true");

    }

    catch(error){

        console.error(error);

        alert("Unable to submit: " + (error.message || "Please try again."));

        submitBtn.classList.remove("loading");

        submitBtn.disabled=false;

    }

});

/* ===============================
   SUCCESS BUTTON
================================*/

doneBtn.addEventListener("click",()=>{

    form.reset();

    setSelectedFile(null);

    form.style.display="flex";

    successScreen.classList.remove("active");

    submitBtn.disabled=false;

    submitBtn.classList.remove("loading");

    closeSubmissionModal();

});

/* ===============================
   DUPLICATE SUBMISSION
================================*/

if(localStorage.getItem("certificateSubmitted")){

    openSubmissionBtn.innerHTML=`

    <div class="action-icon">

        <i class="fa-solid fa-circle-check"></i>

    </div>

    <h3>Certificate Submitted</h3>

    <p>Your submission has already been recorded.</p>

    <span class="action-go">

        Verified ✔

    </span>

    `;

}
