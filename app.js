/**
 * Deblina's Personal Portfolio Application Logic
 * Features:
 * - Dynamic Project Filtering & Modal Previews
 * - Interactive K-Means Clustering Playground (2D Machine Learning Simulation)
 * - Light/Dark Theme Switcher with LocalStorage
 * - Contact Form Handler with Validation & Toast Alerts
 * - Mobile Navigation Drawer
 */

// =============================================================================
// 1. Projects Data (Featuring "Where Can I Sit?", "CyScan AI", "FloraPulse")
// =============================================================================
const PROJECTS_DATA = [
  {
    id: 'where-can-i-sit',
    title: 'Where Can I Sit?',
    category: 'accessibility',
    tag: '🌟 Featured Prototype',
    icon: '🪑',
    thumbClass: 'thumb-sit',
    excerpt: 'A map-based community guide helping people find places to rest. Features filters for shade, backrests, armrests, and step-free access.',
    fullDesc: 'Where Can I Sit? is an empathetic, community-oriented urban mobility prototype. Built with an understanding that every journey requires moments of rest, it allows pedestrians, elderly individuals, parents with strollers, and mobility-device users to locate public seating before setting out. Users can filter by physical accommodations like shaded canopies, ergonomic backrests, armrests for pushing up, and step-free pathway access.',
    techStack: ['JavaScript (ES6)', 'Leaflet.js', 'HTML5', 'CSS3', 'Geolocation API'],
    highlights: [
      'Interactive Leaflet map with custom seating pins & popups',
      'Need-based filtering: shade, backrest, armrests, step-free access',
      'Community addition workflow to suggest and verify local benches',
      '100% client-side privacy with local storage'
    ],
    liveDemoUrl: '#',
    sourceUrl: '#'
  },
  {
    id: 'cyscan-ai',
    title: 'CyScan AI',
    category: 'aiml',
    tag: '🌪️ Deep Learning & Meteorology',
    icon: '🌀',
    thumbClass: 'thumb-cyclone',
    excerpt: 'Satellite cyclone detection and early warning dashboard analyzing vortex cloud tops, pressure drop, and wind velocity.',
    fullDesc: 'CyScan AI is an exploration into applying deep learning architectures (YOLOv8 + EfficientNet + Dvorak scaling) to satellite telemetry feeds (INSAT-3D, GOES-16). The prototype offers infrared cloud-top temperature analysis, automated eye-coordinate localization, central barometric pressure tracking, and Saffir-Simpson / IMD intensity grading to deliver timely coastal warning bulletins.',
    techStack: ['Python Concept', 'FastAPI Architecture', 'Chart.js Telemetry', 'Leaflet.js', 'Tailwind CSS'],
    highlights: [
      'Multi-spectral satellite viewport simulation (IR 10.8µm Thermal Channel)',
      'Automated bounding-box detection for cyclonic eye & spiral bands',
      'Real-time wind velocity and barometric pressure drop telemetry charts',
      'IMD coastal threat and evacuation assessment logic'
    ],
    liveDemoUrl: '#',
    sourceUrl: '#'
  },
  {
    id: 'florapulse',
    title: 'FloraPulse',
    category: 'web',
    tag: '🌿 Plant Care & Science',
    icon: '🌱',
    thumbClass: 'thumb-plant',
    excerpt: 'Botanical encyclopedia and interactive watering calculator adjusting schedules for room climate, pot volume, and sunlight.',
    fullDesc: 'FloraPulse is a responsive plant care companion that demystifies indoor botany. Featuring a curated directory of houseplant profiles, it solves the #1 houseplant killer — overwatering — with an interactive smart care calculator that factors in pot size, indoor ambient temperature, sunlight intensity, and seasonal dormancy.',
    techStack: ['Vanilla JavaScript', 'Dynamic DOM Filters', 'CSS3 Grid/Flexbox', 'Responsive UI'],
    highlights: [
      'Smart 3-step watering and fertilizer calculator based on environment',
      'Pet safety filters identifying calcium oxalate toxicity in common plants',
      'Soil composition recipes (aroid chunky mix vs standard peat)',
      'Bookmark and save favorite plants using browser storage'
    ],
    liveDemoUrl: '#',
    sourceUrl: '#'
  }
];

// =============================================================================
// 2. DOM Initialization
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProjects('all');
  initProjectFilters();
  initKMeansPlayground();
  initContactForm();
  initMobileNav();
});

// =============================================================================
// 3. Theme Toggle (Midnight Dark / Crisp Light)
// =============================================================================
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('deblina_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('deblina_theme', newTheme);
      updateThemeIcon(newTheme);
      
      // Redraw KMeans canvas to match theme background
      if (window.redrawKMeans) {
        window.redrawKMeans();
      }
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

// =============================================================================
// 4. Project Rendering & Filtering
// =============================================================================
function renderProjects(filterCategory) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === filterCategory);

  container.innerHTML = filtered.map(project => `
    <div class="project-card" data-category="${project.category}">
      <div class="project-thumbnail ${project.thumbClass}">
        <span class="thumb-icon-center">${project.icon}</span>
      </div>
      <div class="project-body">
        <div class="project-tags">
          <span class="badge badge-teal">${project.tag}</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-excerpt">${project.excerpt}</p>
        <div class="project-footer">
          <button class="project-link-btn" onclick="openProjectModal('${project.id}')">
            <span>Explore Case Study</span> →
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-tab');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(category);
    });
  });
}

// =============================================================================
// 5. Project Modal Details
// =============================================================================
window.openProjectModal = function(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const modalBackdrop = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');

  if (!modalBackdrop || !modalTitle || !modalBody) return;

  modalTitle.textContent = project.title;
  modalCategory.textContent = project.tag;

  modalBody.innerHTML = `
    <p style="color: var(--text-muted); font-size: 1.02rem; line-height: 1.7; margin-bottom: 1.5rem;">
      ${project.fullDesc}
    </p>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-main); margin-bottom: 0.75rem;">
        Key Architectural Features
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
        ${project.highlights.map(h => `
          <li style="display: flex; gap: 0.6rem; align-items: center; font-size: 0.92rem; color: var(--text-muted);">
            <span style="color: var(--accent-teal);">✓</span> ${h}
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 2rem;">
      <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-main); margin-bottom: 0.75rem;">
        Tech Stack & Tools
      </h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${project.techStack.map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="${project.liveDemoUrl}" class="btn btn-primary btn-sm" onclick="showToast('Live demo link placeholder. Coming soon!')">
        <span>Live Prototype</span> ↗
      </a>
      <a href="${project.sourceUrl}" class="btn btn-secondary btn-sm" onclick="showToast('Source repository placeholder. Coming soon!')">
        <span>GitHub Repository</span> 💻
      </a>
    </div>
  `;

  modalBackdrop.classList.add('open');
};

window.closeProjectModal = function() {
  const modalBackdrop = document.getElementById('projectModal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('open');
  }
};

// =============================================================================
// 6. Interactive K-Means Clustering Playground
// =============================================================================
function initKMeansPlayground() {
  const canvas = document.getElementById('kmeansCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let k = 3;
  let points = [];
  let centroids = [];
  let iteration = 0;
  const numPoints = 80;

  // Colors for clusters (Violet, Teal, Amber, Sky, Rose)
  const clusterColors = [
    { base: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.75)', ring: '#a78bfa' }, // Violet
    { base: '#14b8a6', fill: 'rgba(20, 184, 166, 0.75)', ring: '#2dd4bf' }, // Teal
    { base: '#f59e0b', fill: 'rgba(245, 158, 11, 0.75)', ring: '#fbbf24' }, // Amber
    { base: '#38bdf8', fill: 'rgba(56, 189, 248, 0.75)', ring: '#7dd3fc' }, // Sky
    { base: '#f43f5e', fill: 'rgba(244, 63, 94, 0.75)', ring: '#fb7185' }   // Rose
  ];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function generateRandomPoints() {
    points = [];
    iteration = 0;
    const width = canvas.width || 450;
    const height = canvas.height || 280;

    // Create 3 natural Gaussian-like clusters for visual realism
    const naturalCenters = [
      { x: width * 0.25, y: height * 0.35 },
      { x: width * 0.75, y: height * 0.4 },
      { x: width * 0.5, y: height * 0.75 }
    ];

    for (let i = 0; i < numPoints; i++) {
      const center = naturalCenters[i % naturalCenters.length];
      const spread = 45;
      points.push({
        x: Math.max(15, Math.min(width - 15, center.x + (Math.random() - 0.5) * spread * 2)),
        y: Math.max(15, Math.min(height - 15, center.y + (Math.random() - 0.5) * spread * 2)),
        cluster: -1
      });
    }

    // Initialize K centroids randomly from existing points
    centroids = [];
    const usedIndices = new Set();
    while (centroids.length < k && usedIndices.size < points.length) {
      const idx = Math.floor(Math.random() * points.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        centroids.push({
          x: points[idx].x,
          y: points[idx].y
        });
      }
    }

    draw();
    updateIterationDisplay();
  }

  function stepKMeans() {
    if (points.length === 0 || centroids.length === 0) return;

    // Step 1: Assign each point to the closest centroid
    let hasChanged = false;
    points.forEach(p => {
      let minDist = Infinity;
      let closestCluster = 0;
      centroids.forEach((c, idx) => {
        const dist = Math.hypot(p.x - c.x, p.y - c.y);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = idx;
        }
      });
      if (p.cluster !== closestCluster) {
        hasChanged = true;
        p.cluster = closestCluster;
      }
    });

    // Step 2: Recompute centroid positions
    for (let i = 0; i < k; i++) {
      const assigned = points.filter(p => p.cluster === i);
      if (assigned.length > 0) {
        const sumX = assigned.reduce((acc, p) => acc + p.x, 0);
        const sumY = assigned.reduce((acc, p) => acc + p.y, 0);
        centroids[i].x = sumX / assigned.length;
        centroids[i].y = sumY / assigned.length;
      }
    }

    iteration++;
    draw();
    updateIterationDisplay(hasChanged);
  }

  function draw() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Canvas Background Grid
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Data Points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      if (p.cluster === -1) {
        ctx.fillStyle = isLight ? '#94a3b8' : '#64748b';
      } else {
        ctx.fillStyle = clusterColors[p.cluster % clusterColors.length].fill;
      }
      ctx.fill();
      ctx.strokeStyle = isLight ? '#ffffff' : '#090d16';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Draw Centroids with Target Icon
    centroids.forEach((c, idx) => {
      const color = clusterColors[idx % clusterColors.length];

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = color.fill;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Centroid Center Cross
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color.base;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner Diamond or Cross
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(c.x - 4, c.y);
      ctx.lineTo(c.x + 4, c.y);
      ctx.moveTo(c.x, c.y - 4);
      ctx.lineTo(c.x, c.y + 4);
      ctx.stroke();
    });
  }

  function updateIterationDisplay(hasChanged = true) {
    const iterText = document.getElementById('kmeansIterationText');
    if (iterText) {
      if (iteration === 0) {
        iterText.textContent = 'Initialized points & centroids.';
      } else if (!hasChanged) {
        iterText.textContent = `Iteration ${iteration}: Converged! No further shifts.`;
      } else {
        iterText.textContent = `Iteration ${iteration}: Centroids adjusted towards mean.`;
      }
    }
  }

  // Setup Event Listeners
  resizeCanvas();
  generateRandomPoints();

  window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
  });

  const stepBtn = document.getElementById('kmeansStepBtn');
  if (stepBtn) {
    stepBtn.addEventListener('click', stepKMeans);
  }

  const resetBtn = document.getElementById('kmeansResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', generateRandomPoints);
  }

  const kSelect = document.getElementById('kmeansKSelect');
  if (kSelect) {
    kSelect.addEventListener('change', (e) => {
      k = parseInt(e.target.value, 10);
      generateRandomPoints();
    });
  }

  // Expose redraw function for theme switch
  window.redrawKMeans = draw;
}

// =============================================================================
// 7. Contact Form Handler with Feedback
// =============================================================================
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const topicInput = document.getElementById('inquiryTopic');
    const messageInput = document.getElementById('senderMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const topic = topicInput ? topicInput.value : 'General';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.');
      return;
    }

    // Prepare simulated dispatch & mailto option
    showToast(`✨ Thanks for reaching out, ${name}! Generating your message...`);
    
    // Construct optional mailto link
    const mailtoSubject = encodeURIComponent(`[Portfolio Contact: ${topic}] from ${name}`);
    const mailtoBody = encodeURIComponent(`Hi Deblina,\n\n${message}\n\nFrom: ${name} (${email})`);
    const mailtoUrl = `mailto:your-email@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    setTimeout(() => {
      form.reset();
      showToast('📬 Message drafted! Check your email client or say hi on LinkedIn.');
      window.location.href = mailtoUrl;
    }, 1200);
  });
}

// =============================================================================
// 8. Toast Notification Utility
// =============================================================================
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>💬</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// =============================================================================
// 9. Mobile Navigation Drawer
// =============================================================================
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-secondary)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-subtle)';
        navLinks.style.boxShadow = 'var(--shadow-md)';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}
