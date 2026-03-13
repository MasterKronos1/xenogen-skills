'use client'

import { useState, useRef, useEffect } from 'react'
import {
  SKILLS,
  SKILL_TRACKS,
  WORKSHOPS,
  PLATFORM_STATS,
  type Skill,
  type SkillTrack,
  type Workshop,
} from './data/skills'
import { ARBI_WELCOME } from './core/arbi'

// ── TYPES ────────────────────────────────────────────────────────
type View = 'home' | 'skills' | 'tracks' | 'workshops' | 'arbi' | 'skill-detail'
type Message = { role: 'user' | 'assistant'; content: string }

// ── STYLES ───────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #040a0f;
    --surface: #070e17;
    --surface2: #0a1520;
    --border: #0d1f2d;
    --border2: #162840;
    --text: #b8cdd8;
    --text-dim: #3d5a6a;
    --text-muted: #1a2f3d;
    --accent: #00e676;
    --accent2: #00e5ff;
    --accent-dim: #00e67611;
    --accent-glow: #00e67633;
    --warn: #ffca28;
    --danger: #ff3d71;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Grid bg */
  .grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(0,230,118,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,230,118,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Scanlines */
  .scanlines {
    position: fixed; inset: 0; z-index: 999; pointer-events: none;
    background: repeating-linear-gradient(
      0deg, rgba(0,0,0,0.025) 0, transparent 1px, transparent 3px
    );
  }

  /* Layout */
  .shell { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }

  /* Nav */
  .nav {
    display: flex; align-items: center; gap: 0;
    padding: 0 32px; height: 52px;
    border-bottom: 1px solid var(--border);
    background: rgba(4,10,15,0.95);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-weight: 800; font-size: 0.75rem;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-right: 32px;
    display: flex; align-items: center; gap: 8px; cursor: pointer;
  }

  .nav-logo-icon {
    width: 24px; height: 24px;
    border: 1.5px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem;
    box-shadow: 0 0 8px var(--accent-glow);
  }

  .nav-links { display: flex; gap: 0; flex: 1; }

  .nav-link {
    padding: 0 16px; height: 52px; display: flex; align-items: center;
    font-size: 0.5rem; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent;
    transition: all 0.15s; white-space: nowrap; border-top: none;
    border-left: none; border-right: none; background: none;
    font-family: var(--font-mono);
  }
  .nav-link:hover { color: var(--text); border-bottom-color: var(--border2); }
  .nav-link.active { color: var(--accent); border-bottom-color: var(--accent); }

  .nav-arbi-btn {
    margin-left: auto;
    background: var(--accent); color: #040a0f;
    border: none; padding: 6px 16px;
    font-family: var(--font-display); font-weight: 700;
    font-size: 0.55rem; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: opacity 0.2s;
    box-shadow: 0 0 16px var(--accent-glow);
    display: flex; align-items: center; gap: 6px;
  }
  .nav-arbi-btn:hover { opacity: 0.85; }
  .nav-arbi-btn.active { background: var(--accent2); }

  /* Main content */
  .main { flex: 1; padding: 48px 32px; max-width: 1280px; margin: 0 auto; width: 100%; }

  /* Section headers */
  .section-header { margin-bottom: 40px; }
  .section-label {
    font-size: 0.45rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::before { content: ''; display: block; width: 16px; height: 1px; background: var(--accent); }
  .section-title {
    font-family: var(--font-display); font-weight: 800;
    font-size: 2rem; line-height: 1.1; color: #ddeaf2;
    letter-spacing: -0.5px;
  }
  .section-sub { margin-top: 8px; font-size: 0.65rem; color: var(--text-dim); line-height: 1.6; max-width: 560px; }

  /* HERO ─────────────────────────────────────── */
  .hero { padding: 64px 0 80px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.45rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 24px;
    border: 1px solid var(--accent-glow); padding: 4px 12px;
    background: var(--accent-dim);
  }
  .hero-title {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(2.2rem, 5vw, 4rem); line-height: 1.05;
    color: #ddeaf2; letter-spacing: -1px; max-width: 700px;
    margin-bottom: 20px;
  }
  .hero-title span { color: var(--accent); }
  .hero-sub {
    font-size: 0.7rem; color: var(--text-dim);
    line-height: 1.8; max-width: 500px; margin-bottom: 40px;
  }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

  .btn-primary {
    background: var(--accent); color: #040a0f;
    border: none; padding: 12px 24px;
    font-family: var(--font-display); font-weight: 700;
    font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 0 20px var(--accent-glow);
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border2); padding: 11px 24px;
    font-family: var(--font-mono); font-size: 0.55rem;
    letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-ghost:hover { border-color: var(--text-dim); color: var(--text); }

  /* Stats bar */
  .stats-bar {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 64px;
  }
  .stat-cell {
    background: var(--surface); padding: 20px 24px;
  }
  .stat-value {
    font-family: var(--font-display); font-weight: 800;
    font-size: 1.8rem; color: var(--accent); line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label { font-size: 0.45rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-dim); }

  /* Cards grid */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1px; background: var(--border); }
  .cards-grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1px; background: var(--border); }

  /* Skill Card */
  .skill-card {
    background: var(--surface); padding: 24px;
    cursor: pointer; transition: all 0.15s; position: relative; overflow: hidden;
  }
  .skill-card:hover { background: var(--surface2); }
  .skill-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: var(--card-color, var(--accent)); opacity: 0;
    transition: opacity 0.15s;
  }
  .skill-card:hover::before { opacity: 1; }

  .skill-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .skill-icon {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    font-size: 1rem; border: 1px solid; opacity: 0.8;
  }
  .skill-badges { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
  .badge {
    font-size: 0.38rem; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 2px 6px; border: 1px solid;
  }
  .badge-level { border-color: var(--border2); color: var(--text-dim); }
  .badge-hours { border-color: var(--border2); color: var(--text-dim); }
  .badge-enrolled { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .badge-soon { border-color: var(--warn); color: var(--warn); background: rgba(255,202,40,0.08); }
  .badge-credential { border-color: #b47eff44; color: #b47eff; background: rgba(180,126,255,0.06); }

  .skill-title {
    font-family: var(--font-display); font-weight: 700;
    font-size: 0.9rem; color: #ccdde8; margin-bottom: 6px;
  }
  .skill-desc { font-size: 0.58rem; color: var(--text-dim); line-height: 1.7; margin-bottom: 16px; }

  .skill-progress-bar { height: 2px; background: var(--border); margin-bottom: 12px; }
  .skill-progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; }

  .skill-card-footer { display: flex; justify-content: space-between; align-items: center; }
  .skill-modules { font-size: 0.42rem; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase; }
  .skill-outputs { display: flex; gap: 4px; }
  .output-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }

  /* Track Card */
  .track-card {
    background: var(--surface); padding: 28px; cursor: pointer;
    transition: background 0.15s; position: relative; overflow: hidden;
  }
  .track-card:hover { background: var(--surface2); }
  .track-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .track-icon-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .track-icon {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; border: 1px solid;
  }
  .track-title { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #ccdde8; }
  .track-desc { font-size: 0.58rem; color: var(--text-dim); line-height: 1.7; margin-bottom: 16px; }
  .track-outcome {
    font-size: 0.5rem; color: var(--text-dim);
    border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 12px;
    line-height: 1.6;
  }
  .track-outcome strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 0.4rem; letter-spacing: 1.5px; text-transform: uppercase; }
  .track-footer { display: flex; justify-content: space-between; align-items: center; }
  .track-hours { font-size: 0.45rem; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; }
  .track-skills-count { font-size: 0.45rem; color: var(--text-dim); }

  /* Workshop Card */
  .workshop-card { background: var(--surface); padding: 24px; position: relative; overflow: hidden; }
  .workshop-type-badge {
    display: inline-block; font-size: 0.38rem; letter-spacing: 2px; text-transform: uppercase;
    padding: 2px 8px; margin-bottom: 12px;
    border: 1px solid; color: var(--accent2); border-color: rgba(0,229,255,0.3);
    background: rgba(0,229,255,0.05);
  }
  .workshop-title { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; color: #ccdde8; margin-bottom: 8px; }
  .workshop-desc { font-size: 0.58rem; color: var(--text-dim); line-height: 1.7; margin-bottom: 16px; }
  .workshop-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
  .workshop-meta-item { font-size: 0.45rem; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
  .workshop-meta-item::before { content: '◈'; font-size: 0.4rem; color: var(--text-muted); }
  .workshop-footer { display: flex; justify-content: space-between; align-items: center; }
  .free-badge {
    font-size: 0.4rem; letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 10px; border: 1px solid var(--accent);
    color: var(--accent); background: var(--accent-dim); font-weight: 600;
  }
  .spots-left { font-size: 0.45rem; color: var(--warn); }
  .apply-btn {
    font-size: 0.45rem; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid var(--border2); color: var(--text-dim);
    background: transparent; cursor: pointer; transition: all 0.15s; font-family: var(--font-mono);
  }
  .apply-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* Filter bar */
  .filter-bar { display: flex; gap: 4px; margin-bottom: 32px; flex-wrap: wrap; }
  .filter-btn {
    padding: 5px 14px; font-size: 0.45rem; letter-spacing: 1.5px; text-transform: uppercase;
    border: 1px solid var(--border); color: var(--text-dim);
    background: transparent; cursor: pointer; transition: all 0.15s; font-family: var(--font-mono);
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

  /* Skill Detail */
  .detail-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.45rem; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text-dim); cursor: pointer; margin-bottom: 32px;
    background: none; border: none; font-family: var(--font-mono);
  }
  .detail-back:hover { color: var(--accent); }
  .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 24px; }
  .detail-title { font-family: var(--font-display); font-weight: 800; font-size: 2rem; color: #ddeaf2; }
  .detail-desc { font-size: 0.65rem; color: var(--text-dim); line-height: 1.8; max-width: 560px; margin-top: 8px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2px; background: var(--border); }
  .detail-main { background: var(--surface); padding: 32px; }
  .detail-sidebar { background: var(--surface); padding: 24px; }

  .modules-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); }
  .module-item {
    background: var(--bg); padding: 16px 20px;
    display: flex; align-items: center; gap: 16px;
    transition: background 0.15s; cursor: pointer;
  }
  .module-item:hover { background: var(--surface); }
  .module-item.completed { opacity: 0.6; }
  .module-num {
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border2); font-size: 0.5rem; color: var(--text-dim);
    flex-shrink: 0;
  }
  .module-num.done { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .module-info { flex: 1; }
  .module-title { font-size: 0.62rem; color: var(--text); margin-bottom: 2px; }
  .module-meta { font-size: 0.42rem; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; }
  .module-type {
    font-size: 0.38rem; padding: 2px 8px; border: 1px solid var(--border);
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;
  }

  /* ARBI PANEL ────────────────────────────────── */
  .arbi-panel { display: flex; flex-direction: column; height: calc(100vh - 52px); }
  .arbi-header {
    padding: 20px 32px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    background: var(--surface);
  }
  .arbi-avatar {
    width: 40px; height: 40px; border: 1.5px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
    animation: pulse 3s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{box-shadow:0 0 12px var(--accent-glow);} 50%{box-shadow:0 0 24px var(--accent-glow);} }

  .arbi-header-info { flex: 1; }
  .arbi-name { font-family: var(--font-display); font-weight: 800; font-size: 0.9rem; color: var(--accent); letter-spacing: 2px; }
  .arbi-subtitle { font-size: 0.42rem; color: var(--text-dim); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
  .arbi-status { display: flex; align-items: center; gap: 6px; font-size: 0.42rem; color: var(--text-dim); }
  .arbi-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .arbi-messages { flex: 1; overflow-y: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 16px; }
  .arbi-messages::-webkit-scrollbar { width: 2px; }
  .arbi-messages::-webkit-scrollbar-thumb { background: var(--border2); }

  .msg { display: flex; gap: 12px; animation: fadeIn 0.2s ease; max-width: 720px; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(4px);} to{opacity:1;transform:translateY(0);} }
  .msg-user { align-self: flex-end; flex-direction: row-reverse; }
  .msg-avatar {
    width: 28px; height: 28px; border: 1px solid; display: flex; align-items: center;
    justify-content: center; font-size: 0.55rem; flex-shrink: 0; align-self: flex-start;
  }
  .msg-arbi-avatar { border-color: var(--accent); color: var(--accent); }
  .msg-user-avatar { border-color: var(--border2); color: var(--text-dim); }
  .msg-bubble { padding: 12px 16px; font-size: 0.62rem; line-height: 1.8; }
  .msg-arbi-bubble { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
  .msg-user-bubble { background: var(--accent-dim); border: 1px solid var(--accent-glow); color: var(--text); }
  .msg-typing { display: flex; gap: 4px; align-items: center; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: typing 1.2s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.4;} 30%{transform:translateY(-5px);opacity:1;} }

  .arbi-input-area { padding: 16px 32px; border-top: 1px solid var(--border); background: var(--surface); }
  .arbi-input-row { display: flex; gap: 8px; }
  .arbi-input {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    color: var(--text); font-family: var(--font-mono); font-size: 0.62rem;
    padding: 10px 14px; outline: none; resize: none;
    transition: border-color 0.15s;
  }
  .arbi-input:focus { border-color: var(--accent); }
  .arbi-input::placeholder { color: var(--text-muted); }
  .arbi-send {
    background: var(--accent); color: #040a0f; border: none;
    width: 40px; font-size: 0.9rem; cursor: pointer;
    transition: opacity 0.2s; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .arbi-send:hover { opacity: 0.85; }
  .arbi-send:disabled { opacity: 0.4; cursor: not-allowed; }
  .arbi-hint { font-size: 0.4rem; color: var(--text-muted); margin-top: 8px; letter-spacing: 1px; }

  /* Pathway strip */
  .pathway-strip {
    display: flex; gap: 1px; background: var(--border);
    border: 1px solid var(--border); margin-bottom: 48px; overflow-x: auto;
  }
  .pathway-node {
    flex: 1; min-width: 100px; background: var(--surface); padding: 12px 16px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; transition: background 0.15s; text-align: center;
  }
  .pathway-node.active { background: var(--surface2); }
  .pathway-node-icon { font-size: 1rem; margin-bottom: 2px; }
  .pathway-node-name { font-size: 0.38rem; letter-spacing: 1px; text-transform: uppercase; color: var(--text-dim); }
  .pathway-node-status { font-size: 0.35rem; letter-spacing: 0.5px; color: var(--text-muted); }
  .pathway-node.current .pathway-node-name { color: var(--accent); }

  @media (max-width: 768px) {
    .main { padding: 32px 16px; }
    .nav { padding: 0 16px; }
    .detail-grid { grid-template-columns: 1fr; }
    .hero-title { font-size: 2rem; }
    .arbi-messages { padding: 16px; }
    .arbi-input-area { padding: 12px 16px; }
  }
`

// ── PATHWAY NODES ────────────────────────────────────────────────
const PATHWAY = [
  { id: 'utils', icon: '⟳', name: 'Utils', status: 'complete', url: 'https://utils-pi-one.vercel.app' },
  { id: 'groundzero', icon: '▣', name: 'GroundZero', status: 'complete', url: 'https://gzbnos.vercel.app' },
  { id: 'btu', icon: '⊕', name: 'BTU', status: 'complete', url: 'https://btu-two.vercel.app' },
  { id: 'skills', icon: '◎', name: 'Skills', status: 'current', url: '#' },
  { id: 'guuz', icon: '◆', name: 'Guuz', status: 'next', url: '#' },
  { id: 'profile', icon: '◉', name: 'Profile', status: 'locked', url: '#' },
  { id: 'career', icon: '✦', name: 'Career', status: 'locked', url: '#' },
]

// ── CATEGORY FILTERS ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'ai', label: 'AI Upskilling' },
  { id: 'consciousness', label: 'Consciousness' },
  { id: 'critical-thinking', label: 'Critical Thinking' },
  { id: 'soft-skill', label: 'Soft Skills' },
  { id: 'hard-skill', label: 'Trade Skills' },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function SkillsApp() {
  const [view, setView] = useState<View>('home')
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const [catFilter, setCatFilter] = useState('all')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: ARBI_WELCOME },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || streaming) return
    const newMsgs: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMsgs)
    setInput('')
    setStreaming(true)
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.map(m => ({ role: m.role, content: m.content })) }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(m => {
          const last = [...m]
          last[last.length - 1] = { role: 'assistant', content: last[last.length - 1].content + chunk }
          return last
        })
      }
    } catch {
      setMessages(m => {
        const last = [...m]
        last[last.length - 1] = { role: 'assistant', content: 'Connection lost. Please try again.' }
        return last
      })
    } finally {
      setStreaming(false)
    }
  }

  const filteredSkills = SKILLS.filter(
    s => catFilter === 'all' || s.category === catFilter
  )

  function openSkill(skill: Skill) {
    setActiveSkill(skill)
    setView('skill-detail')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grid-bg" />
      <div className="scanlines" />
      <div className="shell">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setView('home')}>
            <div className="nav-logo-icon">◎</div>
            XenoGen Skills
          </div>
          <div className="nav-links">
            {(['home', 'skills', 'tracks', 'workshops'] as const).map(v => (
              <button
                key={v}
                className={`nav-link ${view === v || (view === 'skill-detail' && v === 'skills') ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === 'home' ? 'Overview' : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button
            className={`nav-arbi-btn ${view === 'arbi' ? 'active' : ''}`}
            onClick={() => setView(v => v === 'arbi' ? 'home' : 'arbi')}
          >
            ◈ {view === 'arbi' ? 'Close ARBI' : 'Talk to ARBI'}
          </button>
        </nav>

        {/* ARBI FULL PANEL */}
        {view === 'arbi' && (
          <div className="arbi-panel">
            <div className="arbi-header">
              <div className="arbi-avatar">◈</div>
              <div className="arbi-header-info">
                <div className="arbi-name">ARBI</div>
                <div className="arbi-subtitle">Skills Platform Guide · XenoGenesis</div>
              </div>
              <div className="arbi-status">
                <div className="arbi-dot" />
                Active
              </div>
            </div>
            <div className="arbi-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role === 'user' ? 'msg-user' : ''}`}>
                  <div className={`msg-avatar ${msg.role === 'assistant' ? 'msg-arbi-avatar' : 'msg-user-avatar'}`}>
                    {msg.role === 'assistant' ? '◈' : '○'}
                  </div>
                  {msg.role === 'assistant' && streaming && i === messages.length - 1 && msg.content === '' ? (
                    <div className="msg-typing">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  ) : (
                    <div className={`msg-bubble ${msg.role === 'assistant' ? 'msg-arbi-bubble' : 'msg-user-bubble'}`}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="arbi-input-area">
              <div className="arbi-input-row">
                <textarea
                  className="arbi-input"
                  rows={2}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask ARBI anything about your learning journey..."
                />
                <button className="arbi-send" onClick={sendMessage} disabled={streaming || !input.trim()}>
                  →
                </button>
              </div>
              <div className="arbi-hint">ENTER to send · SHIFT+ENTER for new line · ARBI knows your entire pathway</div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        {view !== 'arbi' && (
          <main className="main">

            {/* PATHWAY STRIP — always visible */}
            <div className="pathway-strip">
              {PATHWAY.map(node => (
                <div
                  key={node.id}
                  className={`pathway-node ${node.status === 'current' ? 'current active' : ''}`}
                  onClick={() => { if (node.url !== '#') window.open(node.url, '_blank') }}
                  title={node.status === 'locked' ? 'Complete earlier stages first' : `Go to ${node.name}`}
                  style={{ opacity: node.status === 'locked' ? 0.35 : 1 }}
                >
                  <div className="pathway-node-icon">{node.icon}</div>
                  <div className="pathway-node-name">{node.name}</div>
                  <div className="pathway-node-status">{node.status}</div>
                </div>
              ))}
            </div>

            {/* HOME VIEW */}
            {view === 'home' && (
              <>
                <div className="hero">
                  <div className="hero-eyebrow">◎ XenoGenesis Layer 3 — Education & Skills</div>
                  <h1 className="hero-title">
                    From zero to<br /><span>verified capability.</span>
                  </h1>
                  <p className="hero-sub">
                    Every skill you complete builds your credential. Every credential unlocks the next stage of the pathway.
                    ARBI guides you — wherever you're starting from.
                  </p>
                  <div className="hero-actions">
                    <button className="btn-primary" onClick={() => setView('skills')}>Browse Skills</button>
                    <button className="btn-ghost" onClick={() => setView('arbi')}>Talk to ARBI First</button>
                    <button className="btn-ghost" onClick={() => setView('tracks')}>See Learning Tracks</button>
                  </div>
                </div>

                <div className="stats-bar">
                  <div className="stat-cell">
                    <div className="stat-value">{PLATFORM_STATS.learnersEnrolled.toLocaleString()}</div>
                    <div className="stat-label">Learners Enrolled</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-value">{PLATFORM_STATS.credentialsIssued.toLocaleString()}</div>
                    <div className="stat-label">Credentials Issued</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-value">{PLATFORM_STATS.skillsAvailable}</div>
                    <div className="stat-label">Skills Available</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-value">{PLATFORM_STATS.completionRate}%</div>
                    <div className="stat-label">Completion Rate</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-value">{PLATFORM_STATS.workshopsRunning}</div>
                    <div className="stat-label">Free Workshops</div>
                  </div>
                </div>

                <div className="section-header">
                  <div className="section-label">Featured Tracks</div>
                  <h2 className="section-title">Structured learning paths</h2>
                  <p className="section-sub">Each track takes you from where you are to a verified outcome. Pick the one that fits where you want to go.</p>
                </div>

                <div className="cards-grid" style={{ marginBottom: 64 }}>
                  {SKILL_TRACKS.slice(0, 4).map(track => (
                    <TrackCard key={track.id} track={track} onClick={() => setView('tracks')} />
                  ))}
                </div>

                <div className="section-header">
                  <div className="section-label">Upcoming Workshops</div>
                  <h2 className="section-title">Free. In Gauteng and online.</h2>
                </div>
                <div className="cards-grid" style={{ marginBottom: 64 }}>
                  {WORKSHOPS.map(ws => (
                    <WorkshopCard key={ws.id} workshop={ws} />
                  ))}
                </div>
              </>
            )}

            {/* SKILLS VIEW */}
            {view === 'skills' && (
              <>
                <div className="section-header">
                  <div className="section-label">Skill Library</div>
                  <h2 className="section-title">Every skill you need</h2>
                  <p className="section-sub">From literacy foundations to advanced trade skills. Each one earns you a verified credential.</p>
                </div>

                <div className="filter-bar">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`filter-btn ${catFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setCatFilter(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="cards-grid">
                  {filteredSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} onClick={() => openSkill(skill)} />
                  ))}
                </div>
              </>
            )}

            {/* TRACKS VIEW */}
            {view === 'tracks' && (
              <>
                <div className="section-header">
                  <div className="section-label">Learning Tracks</div>
                  <h2 className="section-title">Structured pathways to outcomes</h2>
                  <p className="section-sub">Tracks combine skills into a guided journey. Start a track and ARBI walks you through every step.</p>
                </div>
                <div className="cards-grid-3">
                  {SKILL_TRACKS.map(track => (
                    <TrackCard key={track.id} track={track} onClick={() => {}} />
                  ))}
                </div>
              </>
            )}

            {/* WORKSHOPS VIEW */}
            {view === 'workshops' && (
              <>
                <div className="section-header">
                  <div className="section-label">Workshops & Programmes</div>
                  <h2 className="section-title">Free. Real. In your area.</h2>
                  <p className="section-sub">All workshops are free. In-person sessions are in Johannesburg and Gauteng. Online sessions run weekly.</p>
                </div>
                <div className="cards-grid">
                  {WORKSHOPS.map(ws => (
                    <WorkshopCard key={ws.id} workshop={ws} />
                  ))}
                </div>
              </>
            )}

            {/* SKILL DETAIL VIEW */}
            {view === 'skill-detail' && activeSkill && (
              <SkillDetail skill={activeSkill} onBack={() => setView('skills')} onARBI={() => setView('arbi')} />
            )}

          </main>
        )}
      </div>
    </>
  )
}

// ── SKILL CARD ────────────────────────────────────────────────────
function SkillCard({ skill, onClick }: { skill: Skill; onClick: () => void }) {
  return (
    <div
      className="skill-card"
      onClick={onClick}
      style={{ '--card-color': skill.color } as React.CSSProperties}
    >
      <div className="skill-card-top">
        <div className="skill-icon" style={{ borderColor: skill.color + '44', color: skill.color }}>
          {skill.icon}
        </div>
        <div className="skill-badges">
          {skill.enrolled && <span className="badge badge-enrolled">Enrolled</span>}
          {skill.status === 'coming-soon' && <span className="badge badge-soon">Soon</span>}
          <span className="badge badge-level">{skill.level}</span>
          <span className="badge badge-hours">{skill.hours}h</span>
          {skill.outputsCredential && <span className="badge badge-credential">Credential</span>}
        </div>
      </div>
      <div className="skill-title">{skill.title}</div>
      <div className="skill-desc">{skill.description}</div>
      {skill.progress !== undefined && (
        <div className="skill-progress-bar">
          <div className="skill-progress-fill" style={{ width: `${skill.progress}%`, background: skill.color }} />
        </div>
      )}
      <div className="skill-card-footer">
        <div className="skill-modules">{skill.modules.length} modules</div>
        <div className="skill-outputs">
          {skill.outputsToProfile && (
            <div className="output-dot" title="Updates Profile" style={{ background: '#b47eff' }} />
          )}
          {skill.outputsToMarket && (
            <div className="output-dot" title="Lists on Guuz" style={{ background: '#ffca28' }} />
          )}
          {skill.outputsCredential && (
            <div className="output-dot" title="Issues Credential" style={{ background: skill.color }} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── TRACK CARD ────────────────────────────────────────────────────
function TrackCard({ track, onClick }: { track: SkillTrack; onClick: () => void }) {
  return (
    <div className="track-card" onClick={onClick}>
      <div className="track-card-accent" style={{ background: track.color }} />
      <div className="track-icon-row">
        <div className="track-icon" style={{ borderColor: track.color + '44', color: track.color }}>
          {track.icon}
        </div>
        <div className="track-title">{track.title}</div>
      </div>
      <div className="track-desc">{track.description}</div>
      <div className="track-outcome">
        <strong>Outcome</strong>
        {track.outcome}
      </div>
      <div className="track-footer">
        <div className="track-hours">{track.totalHours}h total</div>
        <div className="track-skills-count">{track.skills.length} skills</div>
      </div>
    </div>
  )
}

// ── WORKSHOP CARD ─────────────────────────────────────────────────
function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <div className="workshop-card">
      <div className="workshop-type-badge">{workshop.type}</div>
      <div className="workshop-title">{workshop.title}</div>
      <div className="workshop-desc">{workshop.description}</div>
      <div className="workshop-meta">
        {workshop.location && <div className="workshop-meta-item">{workshop.location}</div>}
        {workshop.date && <div className="workshop-meta-item">{workshop.date}</div>}
        <div className="workshop-meta-item">{workshop.duration} · {workshop.provider}</div>
      </div>
      <div className="workshop-footer">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="free-badge">FREE</span>
          {workshop.spotsLeft && workshop.spotsLeft < 10 && (
            <span className="spots-left">{workshop.spotsLeft} spots left</span>
          )}
        </div>
        <button className="apply-btn">Apply →</button>
      </div>
    </div>
  )
}

// ── SKILL DETAIL ──────────────────────────────────────────────────
function SkillDetail({ skill, onBack, onARBI }: { skill: Skill; onBack: () => void; onARBI: () => void }) {
  return (
    <>
      <button className="detail-back" onClick={onBack}>← Back to Skills</button>
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${skill.color}44`, color: skill.color, fontSize: '1.2rem'
            }}>
              {skill.icon}
            </div>
            <div className="section-label" style={{ marginBottom: 0 }}>{skill.category.replace('-', ' ')}</div>
          </div>
          <div className="detail-title">{skill.title}</div>
          <div className="detail-desc">{skill.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ background: skill.color, boxShadow: `0 0 20px ${skill.color}33` }}>
            Enrol Now
          </button>
          <button className="btn-ghost" onClick={onARBI}>Ask ARBI →</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Modules</div>
            {skill.modules.length > 0 ? (
              <div className="modules-list">
                {skill.modules.map((mod, i) => (
                  <div key={mod.id} className={`module-item ${mod.completed ? 'completed' : ''}`}>
                    <div className={`module-num ${mod.completed ? 'done' : ''}`}>
                      {mod.completed ? '✓' : i + 1}
                    </div>
                    <div className="module-info">
                      <div className="module-title">{mod.title}</div>
                      <div className="module-meta">{mod.duration} · {mod.type}</div>
                    </div>
                    <div className="module-type">{mod.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 24, border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Modules being finalised — check back soon.</div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Skill Details</div>
            {[
              ['Level', skill.level],
              ['Duration', `${skill.hours} hours`],
              ['Modules', `${skill.modules.length}`],
              ['Credential', skill.outputsCredential ? 'Yes — issued on completion' : 'No'],
              ['Market listing', skill.outputsToMarket ? 'Yes — on Guuz' : 'No'],
              ['Profile update', skill.outputsToProfile ? 'Yes — XenoGen Profile' : 'No'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.45rem', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: '0.52rem', color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </div>

          {skill.prerequisites.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Prerequisites</div>
              {skill.prerequisites.map(pre => (
                <div key={pre} style={{
                  padding: '6px 10px', border: '1px solid var(--border)',
                  fontSize: '0.5rem', color: 'var(--text-dim)', marginBottom: 4
                }}>
                  {pre}
                </div>
              ))}
            </div>
          )}

          <div style={{
            padding: 16, border: '1px solid var(--accent-glow)',
            background: 'var(--accent-dim)'
          }}>
            <div style={{ fontSize: '0.45rem', color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
              Not sure this is right for you?
            </div>
            <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 12 }}>
              Ask ARBI and she'll tell you honestly whether this skill fits where you are and where you're going.
            </div>
            <button className="btn-ghost" onClick={onARBI} style={{ width: '100%', textAlign: 'center' }}>
              Ask ARBI →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
