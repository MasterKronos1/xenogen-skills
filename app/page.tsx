'use client'

import { useState, useRef, useEffect } from 'react'
import {
  BookOpen, Cpu, Brain, Lightbulb, Users, Wrench,
  CalendarDays, ChevronRight, ArrowLeft, Circle,
  CheckCircle2, Clock, BarChart3, Award, Layers,
  MessageCircle, Send, X, Zap
} from 'lucide-react'
import {
  SKILLS, SKILL_TRACKS, WORKSHOPS, PLATFORM_STATS,
  type Skill, type SkillTrack, type Workshop,
} from './data/skills'
import { ARBI_WELCOME } from './core/arbi'

type View = 'home' | 'skills' | 'tracks' | 'workshops' | 'skill-detail'
type Message = { role: 'user' | 'assistant'; content: string }

// Gradient placeholders per category — rich, intentional, cinematic
const CATEGORY_GRADIENTS: Record<string, string> = {
  foundation:        'linear-gradient(135deg, #0d2b1a 0%, #0a4a2a 50%, #062010 100%)',
  ai:                'linear-gradient(135deg, #071a2b 0%, #0a3a4a 50%, #041520 100%)',
  consciousness:     'linear-gradient(135deg, #1a0d2b 0%, #2a0a3a 50%, #100620 100%)',
  'critical-thinking':'linear-gradient(135deg, #0d1a2b 0%, #0a2a4a 50%, #061020 100%)',
  'soft-skill':      'linear-gradient(135deg, #1a1a0d 0%, #2a2a0a 50%, #101006 100%)',
  'hard-skill':      'linear-gradient(135deg, #2b1a0d 0%, #3a2a0a 50%, #201006 100%)',
  workshop:          'linear-gradient(135deg, #0d2b1a 0%, #1a3a2a 50%, #062010 100%)',
}

const TRACK_GRADIENTS = [
  'linear-gradient(135deg, #071a10 0%, #0a3020 100%)',
  'linear-gradient(135deg, #071018 0%, #0a2030 100%)',
  'linear-gradient(135deg, #1a1207 0%, #2a2010 100%)',
  'linear-gradient(135deg, #18070a 0%, #300a10 100%)',
  'linear-gradient(135deg, #14071a 0%, #220a2a 100%)',
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #06100a;
    --surface:     #0b1a10;
    --surface2:    #0f2016;
    --border:      #162a1e;
    --border2:     #1e3d2a;
    --text:        #d4e8db;
    --text-dim:    #5a8a6a;
    --text-muted:  #233d2c;
    --accent:      #00e676;
    --accent-soft: #00a85410;
    --accent-mid:  #00a85428;
    --btn:         #00a854;
    --btn-hover:   #008f47;
    --accent2:     #00c864;
    --warn:        #f0c040;
    --font-serif:  'Playfair Display', Georgia, serif;
    --font-sans:   'Plus Jakarta Sans', system-ui, sans-serif;
    --font-mono:   'DM Mono', monospace;
    --radius:      8px;
    --radius-lg:   12px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 15px;
    line-height: 1.65;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--accent-mid); color: var(--accent); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* ── NAV ────────────────────────────────── */
  .nav {
    height: 68px;
    display: flex; align-items: center;
    padding: 0 56px;
    background: rgba(6,16,10,0.94);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; margin-right: 52px; text-decoration: none;
  }

  .nav-logo-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }

  .nav-logo-icon svg { width: 18px; height: 18px; }

  .nav-logo-text {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 1rem;
    color: var(--text); letter-spacing: 0.2px;
  }

  .nav-links { display: flex; gap: 2px; flex: 1; }

  .nav-link {
    padding: 0 16px; height: 68px;
    display: flex; align-items: center;
    font-size: 0.875rem; font-weight: 500;
    color: var(--text-dim); cursor: pointer;
    border: none; background: none;
    font-family: var(--font-sans);
    transition: color 0.2s;
    border-bottom: 2px solid transparent;
    letter-spacing: 0.1px;
  }
  .nav-link:hover { color: var(--text); }
  .nav-link.active { color: var(--accent); border-bottom-color: var(--accent); }

  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }

  .nav-arbi {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 22px;
    background: var(--btn); color: #fff;
    border: none; cursor: pointer;
    font-family: var(--font-sans);
    font-weight: 600; font-size: 0.82rem;
    border-radius: var(--radius);
    transition: all 0.2s;
    letter-spacing: 0.2px;
  }
  .nav-arbi:hover { background: var(--btn-hover); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,168,84,0.3); }

  .nav-arbi-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,0.7);
    animation: livepulse 2s ease-in-out infinite;
  }
  @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── HERO ──────────────────────────────── */
  .hero {
    min-height: 88vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: stretch;
    border-bottom: 1px solid var(--border);
  }

  .hero-left {
    padding: 96px 56px;
    display: flex; flex-direction: column;
    justify-content: center;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 36px;
  }
  .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .hero-badge-text {
    font-size: 0.78rem; font-weight: 500;
    color: var(--accent); letter-spacing: 1px;
    text-transform: uppercase;
  }

  .hero-title {
    font-family: var(--font-serif);
    font-weight: 900;
    font-size: clamp(3rem, 5.5vw, 5.2rem);
    line-height: 1.05;
    color: #e8f5ee;
    letter-spacing: -1.5px;
    margin-bottom: 28px;
  }
  .hero-title em { font-style: italic; color: var(--accent); }

  .hero-sub {
    font-size: 1.05rem; color: var(--text-dim);
    line-height: 1.8; max-width: 460px;
    margin-bottom: 48px; font-weight: 400;
  }

  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }

  .btn-primary {
    padding: 14px 32px;
    background: var(--btn); color: #fff;
    border: none; cursor: pointer;
    font-family: var(--font-sans);
    font-weight: 600; font-size: 0.875rem;
    border-radius: var(--radius);
    transition: all 0.2s;
    letter-spacing: 0.2px;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--btn-hover); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,168,84,0.3); }

  .btn-ghost {
    padding: 13px 28px;
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border2); cursor: pointer;
    font-family: var(--font-sans);
    font-weight: 500; font-size: 0.875rem;
    border-radius: var(--radius);
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  .hero-right {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #0a2018 0%, #061510 40%, #0d2a1a 100%);
    display: flex; align-items: center; justify-content: center;
  }

  .hero-visual {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  .hero-orb {
    width: 380px; height: 380px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,230,118,0.12) 0%, rgba(0,200,100,0.06) 40%, transparent 70%);
    position: absolute;
  }
  .hero-orb-2 {
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,230,118,0.18) 0%, transparent 70%);
    position: absolute;
    animation: orbpulse 4s ease-in-out infinite;
  }
  @keyframes orbpulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }

  .hero-stat-cards {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    padding: 48px;
  }

  .hero-stat-card {
    background: rgba(11,26,16,0.8);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border2);
    border-radius: var(--radius-lg);
    padding: 24px;
  }

  .hsc-n {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 2.2rem;
    color: var(--accent); line-height: 1;
    margin-bottom: 6px;
  }
  .hsc-l {
    font-size: 0.78rem; color: var(--text-dim);
    font-weight: 500; line-height: 1.3;
  }

  /* ── PATHWAY BAR ── */
  .pathway {
    display: flex; overflow-x: auto;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .pathway::-webkit-scrollbar { height: 0; }

  .pnode {
    flex: 1; min-width: 100px; padding: 18px 20px;
    display: flex; flex-direction: column; align-items: center;
    gap: 5px; cursor: pointer; transition: background 0.2s;
    border-right: 1px solid var(--border);
  }
  .pnode:last-child { border-right: none; }
  .pnode:hover { background: var(--surface2); }
  .pnode.locked { opacity: 0.28; cursor: not-allowed; }
  .pnode.current { background: var(--accent-soft); }

  .pnode-icon {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; color: var(--text-dim);
    transition: all 0.2s;
  }
  .pnode.current .pnode-icon { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
  .pnode.complete .pnode-icon { border-color: var(--accent2); color: var(--accent2); }

  .pnode-name { font-size: 0.72rem; font-weight: 600; color: var(--text-dim); }
  .pnode.current .pnode-name { color: var(--accent); }
  .pnode-status { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; }

  /* ── SECTIONS ── */
  .section { padding: 88px 56px; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }
  .section-inner { max-width: 1240px; margin: 0 auto; }

  .section-head {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 52px;
    flex-wrap: wrap; gap: 20px;
  }

  .section-eyebrow {
    font-size: 0.72rem; font-weight: 600;
    color: var(--accent); letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-eyebrow::before {
    content: ''; display: block;
    width: 24px; height: 1.5px; background: var(--accent);
    border-radius: 1px;
  }

  .section-title {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 2.2rem;
    color: #e4f0e8; letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .section-sub {
    font-size: 0.925rem; color: var(--text-dim);
    line-height: 1.75; max-width: 480px;
    margin-top: 10px; font-weight: 400;
  }

  .see-all {
    font-size: 0.82rem; color: var(--text-dim);
    cursor: pointer; background: none; border: none;
    font-family: var(--font-sans); font-weight: 500;
    transition: color 0.2s;
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap; padding: 0;
  }
  .see-all:hover { color: var(--accent); }

  /* ── GRIDS ── */
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

  /* ── SKILL CARD ── */
  .skill-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden; cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex; flex-direction: column;
    border: 1px solid var(--border);
  }
  .skill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border2);
  }

  .skill-img {
    height: 160px; position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
  }
  .skill-img-inner {
    width: 100%; height: 100%;
    position: absolute; inset: 0;
  }
  .skill-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(11,26,16,0.9) 0%, transparent 60%);
  }
  .skill-img-tags {
    position: relative; z-index: 1;
    padding: 16px; display: flex; gap: 6px; flex-wrap: wrap;
    width: 100%; align-items: flex-end;
    justify-content: space-between;
  }

  .pill {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 100px;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.3px;
  }
  .pill-green { background: rgba(0,230,118,0.15); color: var(--accent); border: 1px solid rgba(0,230,118,0.3); }
  .pill-warn  { background: rgba(240,192,64,0.12); color: var(--warn);   border: 1px solid rgba(240,192,64,0.25); }
  .pill-purple{ background: rgba(160,100,255,0.12);color: #b47eff;       border: 1px solid rgba(160,100,255,0.25); }
  .pill-dim   { background: rgba(255,255,255,0.06); color: var(--text-dim); border: 1px solid var(--border2); }

  .skill-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }

  .skill-title {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 1.15rem;
    color: #e4f0e8; margin-bottom: 10px;
    line-height: 1.3;
  }

  .skill-desc {
    font-size: 0.862rem; color: var(--text-dim);
    line-height: 1.7; margin-bottom: 20px;
    flex: 1; font-weight: 400;
  }

  .skill-progress { height: 3px; background: var(--border); border-radius: 2px; margin-bottom: 16px; overflow: hidden; }
  .skill-progress-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 0.4s; }

  .skill-foot {
    display: flex; justify-content: space-between;
    align-items: center; padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .skill-meta { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
  .skill-outputs { display: flex; gap: 5px; }
  .out-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* ── TRACK CARD ── */
  .track-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden; cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    border: 1px solid var(--border);
    display: flex; flex-direction: column;
  }
  .track-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border2);
  }

  .track-img {
    height: 180px; position: relative;
    display: flex; align-items: flex-end; overflow: hidden;
  }
  .track-img-inner { position: absolute; inset: 0; }
  .track-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(11,26,16,0.95) 0%, rgba(11,26,16,0.3) 60%, transparent 100%);
  }
  .track-img-content {
    position: relative; z-index: 1;
    padding: 20px 24px; width: 100%;
  }
  .track-img-title {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 1.3rem;
    color: #e4f0e8; line-height: 1.2;
  }

  .track-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
  .track-desc {
    font-size: 0.862rem; color: var(--text-dim);
    line-height: 1.7; margin-bottom: 20px; flex: 1;
  }

  .track-outcome {
    background: var(--bg);
    border-radius: var(--radius);
    padding: 14px 18px;
    border-left: 3px solid var(--accent);
    margin-bottom: 20px;
  }
  .track-outcome-label {
    font-size: 0.65rem; font-weight: 700;
    color: var(--accent); letter-spacing: 1.2px;
    text-transform: uppercase; margin-bottom: 4px;
  }
  .track-outcome-text { font-size: 0.8rem; color: var(--text-dim); line-height: 1.55; }

  .track-foot {
    display: flex; justify-content: space-between;
    font-size: 0.75rem; color: var(--text-muted);
    padding-top: 14px; border-top: 1px solid var(--border);
    font-weight: 500;
  }

  /* ── WORKSHOP CARD ── */
  .ws-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex; flex-direction: column;
  }
  .ws-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }

  .ws-img {
    height: 140px; position: relative;
    background: linear-gradient(135deg, #0a2818 0%, #062010 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .ws-type-badge {
    position: absolute; top: 16px; left: 16px;
    font-size: 0.65rem; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 4px 12px; border-radius: 100px;
  }
  .ws-type-badge.online { background: rgba(0,230,118,0.15); color: var(--accent); border: 1px solid rgba(0,230,118,0.3); }
  .ws-type-badge.inperson { background: rgba(255,255,255,0.08); color: var(--text-dim); border: 1px solid var(--border2); }
  .ws-type-badge.hybrid { background: rgba(240,192,64,0.12); color: var(--warn); border: 1px solid rgba(240,192,64,0.25); }

  .ws-icon-area {
    font-size: 2.5rem; opacity: 0.15;
  }

  .ws-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
  .ws-title {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 1.1rem;
    color: #e4f0e8; margin-bottom: 10px; line-height: 1.3;
  }
  .ws-desc { font-size: 0.862rem; color: var(--text-dim); line-height: 1.7; margin-bottom: 18px; flex: 1; }

  .ws-details { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
  .ws-detail {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.8rem; color: var(--text-dim); font-weight: 400;
  }
  .ws-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; opacity: 0.7; }

  .ws-foot {
    display: flex; justify-content: space-between;
    align-items: center; padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .free-pill {
    font-size: 0.68rem; font-weight: 700;
    padding: 5px 14px; border-radius: 100px;
    background: rgba(0,230,118,0.12); color: var(--accent);
    border: 1px solid rgba(0,230,118,0.3);
    letter-spacing: 0.5px;
  }
  .spots-warn { font-size: 0.75rem; color: var(--warn); font-weight: 600; }
  .ws-apply {
    font-size: 0.8rem; font-weight: 500;
    color: var(--text-dim); background: none;
    border: 1px solid var(--border2); cursor: pointer;
    font-family: var(--font-sans); padding: 7px 18px;
    border-radius: var(--radius); transition: all 0.2s;
  }
  .ws-apply:hover { border-color: var(--accent); color: var(--accent); }

  /* ── FILTER BAR ── */
  .filters { display: flex; gap: 10px; margin-bottom: 44px; flex-wrap: wrap; }
  .filter-btn {
    padding: 8px 20px; font-size: 0.82rem; font-weight: 500;
    border: 1px solid var(--border); color: var(--text-dim);
    background: none; cursor: pointer; font-family: var(--font-sans);
    transition: all 0.2s; border-radius: 100px;
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.on { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

  /* ── SKILL DETAIL ── */
  .detail { padding: 64px 56px; max-width: 1240px; margin: 0 auto; }

  .detail-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.82rem; color: var(--text-dim);
    background: none; border: none; cursor: pointer;
    font-family: var(--font-sans); font-weight: 500;
    margin-bottom: 48px; transition: color 0.2s; padding: 0;
  }
  .detail-back:hover { color: var(--accent); }

  .detail-hero {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; border-radius: var(--radius-lg);
    overflow: hidden; border: 1px solid var(--border);
    margin-bottom: 48px;
  }

  .detail-hero-img {
    height: 340px; position: relative;
    display: flex; align-items: flex-end;
  }
  .detail-hero-img-inner { position: absolute; inset: 0; }
  .detail-hero-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(6,16,10,0.85) 0%, transparent 60%);
  }

  .detail-hero-content {
    background: var(--surface); padding: 48px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .detail-title {
    font-family: var(--font-serif);
    font-weight: 900; font-size: 2.4rem;
    color: #e8f5ee; letter-spacing: -1px;
    line-height: 1.1; margin-bottom: 16px;
  }

  .detail-desc {
    font-size: 0.95rem; color: var(--text-dim);
    line-height: 1.8; margin-bottom: 32px; font-weight: 400;
  }

  .detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }

  .detail-body {
    display: grid; grid-template-columns: 1fr 300px;
    gap: 24px;
  }

  .detail-main {
    background: var(--surface); border-radius: var(--radius-lg);
    border: 1px solid var(--border); overflow: hidden;
  }

  .modules-header {
    padding: 20px 28px; border-bottom: 1px solid var(--border);
    font-size: 0.75rem; font-weight: 700;
    color: var(--accent); letter-spacing: 1.5px; text-transform: uppercase;
  }

  .module-row {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 28px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.15s;
  }
  .module-row:last-child { border-bottom: none; }
  .module-row:hover { background: var(--surface2); }

  .mod-num {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--border2);
    font-size: 0.72rem; color: var(--text-dim);
    font-family: var(--font-serif); font-weight: 700;
    flex-shrink: 0; transition: all 0.2s;
  }
  .mod-num.done { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

  .mod-info { flex: 1; }
  .mod-title { font-size: 0.9rem; color: var(--text); font-weight: 500; margin-bottom: 3px; }
  .mod-meta { font-size: 0.72rem; color: var(--text-dim); }

  .mod-badge {
    font-size: 0.65rem; padding: 3px 10px;
    border-radius: 100px; font-weight: 600;
    background: var(--surface2); color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .detail-side { display: flex; flex-direction: column; gap: 20px; }

  .side-card {
    background: var(--surface); border-radius: var(--radius-lg);
    border: 1px solid var(--border); padding: 24px;
  }

  .side-title {
    font-size: 0.72rem; font-weight: 700;
    color: var(--accent); letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 16px;
    padding-bottom: 12px; border-bottom: 1px solid var(--border);
  }

  .meta-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--border);
    font-size: 0.82rem;
  }
  .meta-row:last-child { border-bottom: none; }
  .meta-k { color: var(--text-dim); font-weight: 400; }
  .meta-v { color: var(--text); font-weight: 600; }

  .arbi-cta {
    background: var(--accent-soft);
    border: 1px solid rgba(0,230,118,0.2);
    border-radius: var(--radius-lg);
    padding: 24px;
  }
  .arbi-cta-title {
    font-family: var(--font-serif);
    font-weight: 700; font-size: 1rem;
    color: var(--accent); margin-bottom: 10px;
  }
  .arbi-cta-text {
    font-size: 0.82rem; color: var(--text-dim);
    line-height: 1.65; margin-bottom: 16px;
  }

  /* ── ARBI DRAWER ── */
  .overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(6,16,10,0.65);
    backdrop-filter: blur(6px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .drawer {
    position: fixed; right: 0; top: 0; bottom: 0;
    width: min(500px, 100vw); z-index: 201;
    background: #040906;
    border-left: 1px solid #0d2018;
    display: flex; flex-direction: column;
    animation: drawerIn 0.28s cubic-bezier(0.16,1,0.3,1);
    box-shadow: -24px 0 80px rgba(0,0,0,0.5);
  }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

  .drawer-head {
    padding: 22px 28px;
    border-bottom: 1px solid #0d2018;
    display: flex; align-items: center; gap: 14px;
    background: #060e08;
  }

  .arbi-av {
    width: 44px; height: 44px;
    border: 1.5px solid var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; color: var(--accent);
    box-shadow: 0 0 20px rgba(0,230,118,0.15);
    animation: avpulse 3s ease-in-out infinite;
    flex-shrink: 0; font-family: var(--font-mono);
  }
  @keyframes avpulse { 0%,100%{box-shadow:0 0 16px rgba(0,230,118,0.12)} 50%{box-shadow:0 0 32px rgba(0,230,118,0.25)} }

  .drawer-head-info { flex: 1; }
  .drawer-head-name {
    font-family: var(--font-mono);
    font-size: 0.88rem; color: var(--accent);
    letter-spacing: 2px; font-weight: 500;
  }
  .drawer-head-sub {
    font-size: 0.6rem; color: #2a5a38;
    letter-spacing: 1px; margin-top: 2px;
    font-family: var(--font-mono);
    text-transform: uppercase;
  }

  .drawer-close {
    width: 34px; height: 34px;
    background: none; border: 1px solid #162a1e;
    color: #2a5a38; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; transition: all 0.15s;
    border-radius: 6px;
  }
  .drawer-close:hover { border-color: var(--accent); color: var(--accent); }

  .drawer-msgs {
    flex: 1; overflow-y: auto;
    padding: 24px 28px; display: flex;
    flex-direction: column; gap: 18px;
  }
  .drawer-msgs::-webkit-scrollbar { width: 2px; }
  .drawer-msgs::-webkit-scrollbar-thumb { background: #162a1e; border-radius: 1px; }

  .msg { display: flex; gap: 10px; animation: msgIn 0.2s ease; }
  .msg-u { flex-direction: row-reverse; align-self: flex-end; max-width: 85%; }
  @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  .msg-av {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.62rem; align-self: flex-start;
    border-radius: 6px; font-family: var(--font-mono);
  }
  .msg-av-a { border: 1px solid var(--accent); color: var(--accent); background: rgba(0,230,118,0.05); }
  .msg-av-u { border: 1px solid #162a1e; color: #2a5a38; }

  .msg-bub {
    padding: 12px 16px;
    font-size: 0.82rem; line-height: 1.75;
    font-family: var(--font-mono);
    border-radius: 8px;
  }
  .msg-bub-a { background: #0a1a10; border: 1px solid #162a1e; color: #a8c8b4; max-width: 100%; }
  .msg-bub-u { background: rgba(0,230,118,0.07); border: 1px solid rgba(0,230,118,0.18); color: #a8c8b4; }

  .typing { display: flex; gap: 5px; padding: 13px 16px; background: #0a1a10; border: 1px solid #162a1e; border-radius: 8px; }
  .td { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: td 1.2s ease-in-out infinite; }
  .td:nth-child(2){animation-delay:.2s} .td:nth-child(3){animation-delay:.4s}
  @keyframes td{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-5px);opacity:1}}

  .drawer-input-wrap { padding: 16px 28px; border-top: 1px solid #0d2018; background: #060e08; }
  .drawer-input-row { display: flex; gap: 10px; }

  .drawer-input {
    flex: 1; background: #0a1a10; border: 1px solid #162a1e;
    color: #a8c8b4; font-family: var(--font-mono); font-size: 0.8rem;
    padding: 11px 15px; outline: none; resize: none; line-height: 1.5;
    transition: border-color 0.2s; border-radius: 8px;
  }
  .drawer-input:focus { border-color: var(--accent); }
  .drawer-input::placeholder { color: #1e3d28; }

  .drawer-send {
    width: 44px; background: var(--btn); color: #fff;
    border: none; cursor: pointer; font-size: 1.1rem;
    font-weight: 700; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; flex-shrink: 0;
  }
  .drawer-send:hover{background:var(--btn-hover)} .drawer-send:disabled{opacity:.3;cursor:not-allowed}
  .drawer-hint { font-size: 0.6rem; color: #162a1e; margin-top: 8px; font-family: var(--font-mono); }

  @media(max-width:900px){
    .hero { grid-template-columns: 1fr; }
    .hero-right { min-height: 300px; }
    .detail-hero { grid-template-columns: 1fr; }
    .detail-body { grid-template-columns: 1fr; }
  }
  @media(max-width:640px){
    .nav { padding: 0 20px; }
    .section { padding: 56px 20px; }
    .hero-left { padding: 60px 20px; }
    .detail { padding: 40px 20px; }
    .nav-links .nav-link:not(.active){ display: none; }
  }
`

const PATHWAY_NODES = [
  { id:'utils',      icon:'recycle',    name:'Utils',     status:'complete', url:'https://utils-pi-one.vercel.app' },
  { id:'groundzero', icon:'home',       name:'GroundZero', status:'complete', url:'https://gzbnos.vercel.app' },
  { id:'btu',        icon:'id-card',    name:'BTU',        status:'complete', url:'https://btu-two.vercel.app' },
  { id:'skills',     icon:'book-open',  name:'Skills',     status:'current',  url:'#' },
  { id:'guuz',       icon:'store',      name:'Guuz',       status:'next',     url:'#' },
  { id:'profile',    icon:'user',       name:'Profile',    status:'locked',   url:'#' },
  { id:'career',     icon:'briefcase',  name:'Career',     status:'locked',   url:'#' },
]

// Icon map for pathway
const PathIcon = ({ name, size=16 }: { name: string; size?: number }) => {
  const props = { size, strokeWidth: 1.8 }
  switch(name) {
    case 'recycle':   return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16 3 3-3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>
    case 'home':      return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case 'id-card':   return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M15 12h2M15 9h2M9 17h6"/></svg>
    case 'book-open': return <BookOpen {...props}/>
    case 'store':     return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>
    case 'user':      return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'briefcase': return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} width={size} height={size}><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    default: return <Circle {...props}/>
  }
}

const CATS = [
  { id:'all',               label:'All Skills' },
  { id:'foundation',        label:'Foundation' },
  { id:'ai',                label:'AI Upskilling' },
  { id:'consciousness',     label:'Consciousness' },
  { id:'critical-thinking', label:'Critical Thinking' },
  { id:'soft-skill',        label:'Soft Skills' },
  { id:'hard-skill',        label:'Trade Skills' },
]

export default function SkillsApp() {
  const [view, setView]         = useState<View>('home')
  const [activeSkill, setActive]= useState<Skill | null>(null)
  const [cat, setCat]           = useState('all')
  const [arbi, setArbi]         = useState(false)
  const [msgs, setMsgs]         = useState<Message[]>([{ role:'assistant', content:ARBI_WELCOME }])
  const [input, setInput]       = useState('')
  const [streaming, setStr]     = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs])

  async function send() {
    const text = input.trim()
    if (!text || streaming) return
    const next: Message[] = [...msgs, {role:'user', content:text}]
    setMsgs(next); setInput(''); setStr(true)
    setMsgs(m=>[...m, {role:'assistant', content:''}])
    try {
      const res = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({messages: next.map(m=>({role:m.role,content:m.content}))})
      })
      const reader = res.body?.getReader()
      const dec = new TextDecoder()
      if (!reader) return
      while(true) {
        const {done, value} = await reader.read()
        if (done) break
        const chunk = dec.decode(value)
        setMsgs(m=>{ const c=[...m]; c[c.length-1]={role:'assistant',content:c[c.length-1].content+chunk}; return c })
      }
    } catch {
      setMsgs(m=>{ const c=[...m]; c[c.length-1]={role:'assistant',content:'Connection lost. Please try again.'}; return c })
    } finally { setStr(false) }
  }

  const filtered = SKILLS.filter(s=>cat==='all'||s.category===cat)

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={()=>setView('home')}>
          <div className="nav-logo-icon">
            <BookOpen size={17} color="#06100a" strokeWidth={2.2}/>
          </div>
          <span className="nav-logo-text">XenoGen Skills</span>
        </div>
        <div className="nav-links">
          {(['home','skills','tracks','workshops'] as const).map(v=>(
            <button key={v}
              className={`nav-link ${view===v||(view==='skill-detail'&&v==='skills')?'active':''}`}
              onClick={()=>setView(v)}>
              {v==='home'?'Overview':v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-arbi" onClick={()=>setArbi(true)}>
            <div className="nav-arbi-pulse"/>
            <MessageCircle size={14} strokeWidth={2}/>
            Talk to ARBI
          </button>
        </div>
      </nav>

      {/* PATHWAY */}
      <div className="pathway">
        {PATHWAY_NODES.map(n=>(
          <div key={n.id}
            className={`pnode ${n.status} ${n.status==='current'?'current':''}`}
            onClick={()=>{ if(n.url!=='#'&&n.status!=='locked') window.open(n.url,'_blank') }}>
            <div className="pnode-icon"><PathIcon name={n.icon} size={15}/></div>
            <div className="pnode-name">{n.name}</div>
            <div className="pnode-status">{n.status}</div>
          </div>
        ))}
      </div>

      {/* ── HOME ── */}
      {view==='home' && <>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="hero-badge-dot"/>
              <span className="hero-badge-text">XenoGenesis · Education & Skills</span>
            </div>
            <h1 className="hero-title">
              From zero<br/>to <em>verified</em><br/>capability.
            </h1>
            <p className="hero-sub">
              Every skill you complete builds your credential. Every credential
              unlocks the next stage of your journey. ARBI walks with you —
              wherever you're starting from.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={()=>setView('skills')}><BookOpen size={15}/>Browse Skills</button>
              <button className="btn-ghost" onClick={()=>setView('tracks')}><Layers size={15}/>View Tracks</button>
              <button className="btn-ghost" onClick={()=>setArbi(true)}><MessageCircle size={15}/>Talk to ARBI</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-visual">
              <div className="hero-orb"/>
              <div className="hero-orb-2"/>
              <div className="hero-stat-cards">
                {[
                  [PLATFORM_STATS.learnersEnrolled.toLocaleString(), 'Learners enrolled'],
                  [PLATFORM_STATS.credentialsIssued.toLocaleString(), 'Credentials issued'],
                  [PLATFORM_STATS.completionRate+'%', 'Completion rate'],
                  [PLATFORM_STATS.workshopsRunning+'', 'Free workshops'],
                ].map(([n,l])=>(
                  <div key={l} className="hero-stat-card">
                    <div className="hsc-n">{n}</div>
                    <div className="hsc-l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Learning Tracks</div>
                <h2 className="section-title">Structured paths to real outcomes</h2>
                <p className="section-sub">Each track takes you from where you are to a verified outcome. ARBI guides every step.</p>
              </div>
              <button className="see-all" onClick={()=>setView('tracks')}>All tracks →</button>
            </div>
            <div className="grid-2">
              {SKILL_TRACKS.slice(0,4).map((t,i)=><TrackCard key={t.id} track={t} gradient={TRACK_GRADIENTS[i%TRACK_GRADIENTS.length]}/>)}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Workshops & Programmes</div>
                <h2 className="section-title">Free. In Gauteng and online.</h2>
              </div>
              <button className="see-all" onClick={()=>setView('workshops')}>All workshops →</button>
            </div>
            <div className="grid-2">
              {WORKSHOPS.map(w=><WorkshopCard key={w.id} ws={w}/>)}
            </div>
          </div>
        </div>
      </>}

      {/* ── SKILLS ── */}
      {view==='skills' && (
        <div className="section">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Skill Library</div>
                <h2 className="section-title">Every skill you need</h2>
                <p className="section-sub">From literacy foundations to advanced trade skills. Each one earns a verified credential.</p>
              </div>
            </div>
            <div className="filters">
              {CATS.map(c=>(
                <button key={c.id} className={`filter-btn ${cat===c.id?'on':''}`} onClick={()=>setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid-3">
              {filtered.map(s=>(
                <SkillCard key={s.id} skill={s}
                  gradient={CATEGORY_GRADIENTS[s.category]||CATEGORY_GRADIENTS.foundation}
                  onClick={()=>{ setActive(s); setView('skill-detail') }}/>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRACKS ── */}
      {view==='tracks' && (
        <div className="section">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Learning Tracks</div>
                <h2 className="section-title">Structured pathways to outcomes</h2>
                <p className="section-sub">Tracks combine skills into a guided journey. Start one and ARBI walks you through every step.</p>
              </div>
            </div>
            <div className="grid-2">
              {SKILL_TRACKS.map((t,i)=><TrackCard key={t.id} track={t} gradient={TRACK_GRADIENTS[i%TRACK_GRADIENTS.length]}/>)}
            </div>
          </div>
        </div>
      )}

      {/* ── WORKSHOPS ── */}
      {view==='workshops' && (
        <div className="section">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Workshops & Programmes</div>
                <h2 className="section-title">Free. Real. In your area.</h2>
                <p className="section-sub">All workshops are free. In-person in Johannesburg and Gauteng. Online sessions run weekly.</p>
              </div>
            </div>
            <div className="grid-2">
              {WORKSHOPS.map(w=><WorkshopCard key={w.id} ws={w}/>)}
            </div>
          </div>
        </div>
      )}

      {/* ── SKILL DETAIL ── */}
      {view==='skill-detail' && activeSkill && (
        <SkillDetail
          skill={activeSkill}
          gradient={CATEGORY_GRADIENTS[activeSkill.category]||CATEGORY_GRADIENTS.foundation}
          onBack={()=>setView('skills')}
          onARBI={()=>setArbi(true)}
        />
      )}

      {/* ── ARBI DRAWER ── */}
      {arbi && <>
        <div className="overlay" onClick={()=>setArbi(false)}/>
        <div className="drawer">
          <div className="drawer-head">
            <div className="arbi-av">◈</div>
            <div className="drawer-head-info">
              <div className="drawer-head-name">ARBI</div>
              <div className="drawer-head-sub">Skills Platform Guide · XenoGenesis</div>
            </div>
            <button className="drawer-close" onClick={()=>setArbi(false)}><X size={14}/></button>
          </div>
          <div className="drawer-msgs">
            {msgs.map((m,i)=>(
              <div key={i} className={`msg ${m.role==='user'?'msg-u':''}`}>
                <div className={`msg-av ${m.role==='assistant'?'msg-av-a':'msg-av-u'}`}>
                  {m.role==='assistant'?'◈':'○'}
                </div>
                {m.role==='assistant'&&streaming&&i===msgs.length-1&&m.content===''
                  ? <div className="typing"><div className="td"/><div className="td"/><div className="td"/></div>
                  : <div className={`msg-bub ${m.role==='assistant'?'msg-bub-a':'msg-bub-u'}`}>{m.content}</div>
                }
              </div>
            ))}
            <div ref={endRef}/>
          </div>
          <div className="drawer-input-wrap">
            <div className="drawer-input-row">
              <textarea className="drawer-input" rows={2} value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
                placeholder="Ask ARBI about your learning journey..."/>
              <button className="drawer-send" onClick={send} disabled={streaming||!input.trim()}><Send size={16}/></button>
            </div>
            <div className="drawer-hint">ENTER to send · SHIFT+ENTER for new line</div>
          </div>
        </div>
      </>}
    </>
  )
}

// ── SKILL CARD ────────────────────────────────────────────────────
function SkillCard({ skill, gradient, onClick }: { skill: Skill; gradient: string; onClick: ()=>void }) {
  return (
    <div className="skill-card" onClick={onClick}>
      <div className="skill-img">
        <div className="skill-img-inner" style={{background: gradient}}/>
        <div className="skill-img-overlay"/>
        <div className="skill-img-tags">
          <div style={{display:'flex', gap:6}}>
            {skill.enrolled && <span className="pill pill-green">Enrolled</span>}
            {skill.status==='coming-soon' && <span className="pill pill-warn">Coming Soon</span>}
            {skill.outputsCredential && <span className="pill pill-purple">Credential</span>}
          </div>
          <span className="pill pill-dim">{skill.hours}h</span>
        </div>
      </div>
      <div className="skill-body">
        <div className="skill-title">{skill.title}</div>
        <div className="skill-desc">{skill.description}</div>
        {skill.progress!==undefined && (
          <div className="skill-progress">
            <div className="skill-progress-fill" style={{width:`${skill.progress}%`}}/>
          </div>
        )}
        <div className="skill-foot">
          <div className="skill-meta">{skill.modules.length} modules · {skill.level}</div>
          <div className="skill-outputs">
            {skill.outputsToProfile && <div className="out-dot" style={{background:'#b47eff'}} title="Updates Profile"/>}
            {skill.outputsToMarket  && <div className="out-dot" style={{background:'#f0c040'}} title="Lists on Guuz"/>}
            {skill.outputsCredential&& <div className="out-dot" style={{background:'#00e676'}} title="Issues Credential"/>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TRACK CARD ────────────────────────────────────────────────────
function TrackCard({ track, gradient }: { track: SkillTrack; gradient: string }) {
  return (
    <div className="track-card">
      <div className="track-img">
        <div className="track-img-inner" style={{background: gradient}}/>
        <div className="track-img-overlay"/>
        <div className="track-img-content">
          <div className="track-img-title">{track.title}</div>
        </div>
      </div>
      <div className="track-body">
        <div className="track-desc">{track.description}</div>
        <div className="track-outcome">
          <div className="track-outcome-label">Outcome</div>
          <div className="track-outcome-text">{track.outcome}</div>
        </div>
        <div className="track-foot">
          <span>{track.totalHours}h total</span>
          <span>{track.skills.length} skills</span>
        </div>
      </div>
    </div>
  )
}

// ── WORKSHOP CARD ─────────────────────────────────────────────────
function WorkshopCard({ ws }: { ws: Workshop }) {
  const typeClass = ws.type==='online'?'online':ws.type==='hybrid'?'hybrid':'inperson'
  const typeLabel = ws.type==='in-person'?'In Person':ws.type.charAt(0).toUpperCase()+ws.type.slice(1)
  return (
    <div className="ws-card">
      <div className="ws-img">
        <span className={`ws-type-badge ${typeClass}`}>{typeLabel}</span>
        <div className="ws-icon-area">◎</div>
      </div>
      <div className="ws-body">
        <div className="ws-title">{ws.title}</div>
        <div className="ws-desc">{ws.description}</div>
        <div className="ws-details">
          {ws.location && <div className="ws-detail"><div className="ws-dot"/>{ws.location}</div>}
          {ws.date     && <div className="ws-detail"><div className="ws-dot"/>{ws.date}</div>}
          <div className="ws-detail"><div className="ws-dot"/>{ws.duration} · {ws.provider}</div>
        </div>
        <div className="ws-foot">
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <span className="free-pill">Free</span>
            {ws.spotsLeft && ws.spotsLeft < 10 && <span className="spots-warn">{ws.spotsLeft} spots left</span>}
          </div>
          <button className="ws-apply">Apply →</button>
        </div>
      </div>
    </div>
  )
}

// ── SKILL DETAIL ──────────────────────────────────────────────────
function SkillDetail({ skill, gradient, onBack, onARBI }:
  { skill: Skill; gradient: string; onBack:()=>void; onARBI:()=>void }) {
  return (
    <div className="detail">
      <button className="detail-back" onClick={onBack}><ArrowLeft size={15}/> Back to Skills</button>
      <div className="detail-hero">
        <div className="detail-hero-img">
          <div className="detail-hero-img-inner" style={{background: gradient}}/>
          <div className="detail-hero-img-overlay"/>
        </div>
        <div className="detail-hero-content">
          <div style={{marginBottom:14}}>
            <span className="pill pill-green" style={{fontSize:'0.72rem'}}>
              {skill.category.replace('-',' ')}
            </span>
          </div>
          <h1 className="detail-title">{skill.title}</h1>
          <p className="detail-desc">{skill.description}</p>
          <div className="detail-actions">
            <button className="btn-primary"><Award size={15}/>Enrol Now</button>
            <button className="btn-ghost" onClick={onARBI}><MessageCircle size={15}/>Ask ARBI</button>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <div className="modules-header">
            Modules — {skill.modules.length} total
          </div>
          {skill.modules.length > 0
            ? skill.modules.map((mod,i)=>(
              <div key={mod.id} className="module-row">
                <div className={`mod-num ${mod.completed?'done':''}`}>{mod.completed?'✓':i+1}</div>
                <div className="mod-info">
                  <div className="mod-title">{mod.title}</div>
                  <div className="mod-meta">{mod.duration}</div>
                </div>
                <span className="mod-badge">{mod.type}</span>
              </div>
            ))
            : <div style={{padding:'40px',textAlign:'center',color:'var(--text-dim)',fontSize:'0.9rem'}}>
                Modules being finalised — check back soon.
              </div>
          }
        </div>

        <div className="detail-side">
          <div className="side-card">
            <div className="side-title">Details</div>
            {[
              ['Level', skill.level],
              ['Duration', `${skill.hours} hours`],
              ['Modules', `${skill.modules.length}`],
              ['Credential', skill.outputsCredential?'Issued on completion':'Not included'],
              ['Marketplace', skill.outputsToMarket?'Listed on Guuz':'Not listed'],
              ['Profile', skill.outputsToProfile?'Updates your profile':'Not included'],
            ].map(([k,v])=>(
              <div key={k} className="meta-row">
                <span className="meta-k">{k}</span>
                <span className="meta-v">{v}</span>
              </div>
            ))}
          </div>

          {skill.prerequisites.length > 0 && (
            <div className="side-card">
              <div className="side-title">Prerequisites</div>
              {skill.prerequisites.map(p=>(
                <div key={p} style={{padding:'8px 12px', border:'1px solid var(--border)', borderRadius:6, fontSize:'0.82rem', color:'var(--text-dim)', marginBottom:6}}>
                  {p}
                </div>
              ))}
            </div>
          )}

          <div className="arbi-cta">
            <div className="arbi-cta-title">Not sure this is right for you?</div>
            <div className="arbi-cta-text">
              Ask ARBI and she'll tell you honestly whether this skill fits where you are and where you're going.
            </div>
            <button className="btn-ghost" onClick={onARBI} style={{width:'100%',textAlign:'center'}}>
              Open ARBI →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
