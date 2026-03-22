/* 
  AI-FRIENDLY ARCHITECTURE NOTES:
  This script handles dynamic content injection from JSON files.
  To update the site, modify /src/data/config.json or /src/data/blog.json.
*/

import { initTerminalEffect } from './src/terminal.js';

const CONFIG_PATH = './src/data/config.json';
const BLOG_PATH = './src/data/blog.json';

async function init() {
  try {
    const config = await fetchData(CONFIG_PATH);
    const blog = await fetchData(BLOG_PATH);

    renderHero(config.sections.hero);
    initTerminalEffect('terminal-canvas');
    renderBlog(blog);
    renderAbout(config.sections.about);
    renderContact(config.sections.contact);
    
    setupNav();
    handleRouting(blog); // Initial route check
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

async function fetchData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not fetch ${path}`);
  return await response.json();
}

/**
 * HOME / HERO SECTION
 */
function renderHero(heroData) {
  const heroContainer = document.getElementById('hero-content');
  heroContainer.innerHTML = `
    <h1 class="text-gradient" style="font-size: clamp(2rem, 8vw, 4.5rem); margin-bottom: 1rem;">${heroData.title}</h1>
    <h3 style="color: var(--accent); margin-bottom: 1.5rem; letter-spacing: 2px;">${heroData.subtitle}</h3>
    <p style="color: var(--text-secondary); max-width: 600px; font-size: 1.2rem; margin-bottom: 2rem;">${heroData.description}</p>
    <div class="hero-btns">
      <a href="#blog" class="btn btn-primary">Learning Log</a>
      <a href="#about" class="btn btn-secondary">More About Me</a>
    </div>
  `;
}

/**
 * BLOG SECTION
 * Renders cards for each log entry.
 */
function renderBlog(blogEntries) {
  const blogGrid = document.getElementById('blog-grid');
  blogGrid.innerHTML = blogEntries.map(entry => `
    <article class="card">
      <div style="font-size: 0.8rem; color: var(--accent); margin-bottom: 0.5rem; font-weight: 600;">${entry.date}</div>
      <h3 style="margin-bottom: 1rem;">${entry.title}</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">${entry.excerpt}</p>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${entry.tags.map(tag => `<span style="font-size: 0.7rem; background: var(--accent-muted); color: var(--accent); border: 1px solid var(--accent-muted); padding: 2px 8px; border-radius: 4px;">${tag}</span>`).join('')}
      </div>
      <a href="#post/${entry.id}" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.9rem;">Read More</a>
    </article>
  `).join('');
}

/**
 * ABOUT SECTION
 */
function renderAbout(aboutData) {
  const aboutContainer = document.getElementById('about-content');
  aboutContainer.innerHTML = `
    <h2 style="margin-bottom: 2rem;">${aboutData.title}</h2>
    <div class="card" style="max-width: 800px; font-size: 1.1rem; line-height: 1.8;">
      <p>${aboutData.content}</p>
    </div>
  `;
}

/**
 * CONTACT SECTION
 */
function renderContact(contactData) {
  const contactLinks = document.getElementById('contact-links');
  contactLinks.innerHTML = contactData.links.map(link => `
    <a href="${link.url}" target="_blank" class="card" style="display: flex; align-items: center; gap: 1rem;">
      <div style="width: 40px; height: 40px; background: var(--accent-muted); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent);">
        <!-- Icon placeholder -->
        <span style="font-size: 1.2rem; font-weight: bold;">${link.name[0]}</span>
      </div>
      <div>
        <h4 style="margin: 0;">${link.name}</h4>
        <span style="font-size: 0.8rem; color: var(--text-secondary);">View Profile →</span>
      </div>
    </a>
  `).join('');
}

/**
 * NAVIGATION SCROLL EFFECT
 */
function setupNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '0.5rem 0';
      nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      nav.style.padding = '1rem 0';
      nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
  });

  // Simple scroll animation for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href').startsWith('#post/')) return; // Let the hashchange handle posts
      
      // If we are currently in a post detail, we want the hash to actually change 
      // so that handleRouting can clear the overlay and show main sections.
      if (document.getElementById('post-detail-overlay')) return;

      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * ROUTING LOGIC
 * Toggles between main view and post detail view based on hash.
 */
function handleRouting(blogEntries) {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    
    if (hash.startsWith('#post/')) {
      const postId = hash.split('/')[1];
      const post = blogEntries.find(p => p.id === postId);
      if (post) renderPostDetail(post);
    } else {
      // Show main sections
      document.querySelector('main').style.display = 'block';
      const postDetail = document.getElementById('post-detail-overlay');
      if (postDetail) postDetail.remove();
      
      // If returning to a main section, scroll to it
      if (hash && document.querySelector(hash)) {
        document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Check initial load
  if (window.location.hash.startsWith('#post/')) {
    const postId = window.location.hash.split('/')[1];
    const post = blogEntries.find(p => p.id === postId);
    if (post) renderPostDetail(post);
  }
}

/**
 * POST DETAIL VIEW
 */
function renderPostDetail(post) {
  // Hide main sections
  document.querySelector('main').style.display = 'none';

  // Create overlay container if not exists
  let overlay = document.getElementById('post-detail-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'post-detail-overlay';
    overlay.className = 'container section-padding';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div style="margin-bottom: var(--space-md);">
      <a href="#blog" class="nav-link" style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent); font-weight: 600;">
        ← Back to Learning Log
      </a>
    </div>
    <article class="card" style="padding: var(--space-lg); max-width: 800px; margin: 0 auto;">
      <div style="font-size: 0.9rem; color: var(--accent); margin-bottom: 1rem; font-weight: 600;">${post.date}</div>
      <h1 style="margin-bottom: 2rem; font-size: 2.5rem;">${post.title}</h1>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 2.5rem;">
        ${post.tags.map(tag => `<span style="font-size: 0.8rem; background: var(--accent-muted); color: var(--accent); border: 1px solid var(--accent-muted); padding: 4px 12px; border-radius: 4px;">${tag}</span>`).join('')}
      </div>
      <div style="color: var(--text-primary); font-size: 1.1rem; line-height: 2; white-space: pre-wrap;">
        ${post.content.replace(/```bash([\s\S]*?)```/g, '<pre><code>$1</code></pre>')}
      </div>
    </article>
    <div style="text-align: center; margin-top: var(--space-lg);">
      <a href="#blog" class="btn btn-secondary">Back to List</a>
    </div>
  `;
  
  addCopyButtons();
  window.scrollTo(0, 0);
}

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    // Check if button already exists
    if (block.querySelector('.copy-btn')) return;

    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = 'Copy';
    
    button.addEventListener('click', () => {
      const code = block.querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = 'Copied!';
        button.style.color = 'var(--accent)';
        setTimeout(() => {
          button.innerHTML = 'Copy';
          button.style.color = '';
        }, 2000);
      });
    });

    block.appendChild(button);
  });
}

// Mobile Menu Logic
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

init();
initMobileMenu();
