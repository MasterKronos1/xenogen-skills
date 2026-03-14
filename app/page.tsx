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

type View = 'home' | 'skills' | 'tracks' | 'workshops' | 'skill-detail'
type Message = { role: 'user' | 'assistant'; content: string }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #07100a;
    --surface:      #0c1810;
    --surface2:     #111f15;
    --border:       #1a3025;
    --border2:      #234d35;
    --text:         #cdddd4;
    --text-dim:     #4d7a5e;
    --text-muted:   #1e3d28;
    --accent:       #00e676;
    --accent-soft:  #00e67614;
    --accent-mid:   #00e67633;
    --accent2:      #00b894;
    --warn:         #f9ca24;
    --danger:       #e55039;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--accent-mid); color: var(--accent); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--border2); }

  /* ── LAYOUT ── */
  .shell { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── NAV ── */
  .nav {
    height: 60px;
    display: flex; align-items: center;
    padding: 0 48px;
    border-bottom: 1px solid var(--border);
    background: rgba(7,16,10,0.96);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(16px);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-weight: 800; font-size: 0.85rem;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text); margin-right: 48px; cursor: pointer;
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }

  .nav-logo-mark {
    width: 28px; height: 28px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: #07100a; font-weight: 800;
  }

  .nav-links { display: flex; gap: 4px; flex: 1; }

  .nav-link {
    padding: 0 14px; height: 60px;
    display: flex; align-items: center;
    font-size: 0.8rem; font-weight: 500;
    color: var(--text-dim); cursor: pointer;
    border: none; background: none;
    font-family: var(--font-body);
    transition: color 0.15s;
    border-bottom: 2px solid transparent;
    letter-spacing: 0.3px;
  }
  .nav-link:hover { color: var(--text); }
  .nav-link.active { color: var(--accent); border-bottom-color: var(--accent); }

  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }

  .nav-arbi {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 18px;
    background: var(--accent); color: #07100a;
    border: none; cursor: pointer;
    font-family: var(--font-display);
    font-weight: 700; font-size: 0.72rem;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: opacity 0.2s;
  }
  .nav-arbi:hover { opacity: 0.88; }
  .nav-arbi-dot { width: 6px; height: 6px; border-radius: 50%; background: #07100a; }

  /* ── MAIN ── */
  .main { flex: 1; }

  /* ── HERO ── */
  .hero {
    padding: 96px 48px 80px;
    border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
  }

  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0,230,118,0.04) 0%, transparent 70%),
      radial-gradient(ellipse 30% 60% at 10% 80%, rgba(0,184,148,0.03) 0%, transparent 60%);
  }

  .hero-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

  .hero-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.72rem; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--accent); font-weight: 600;
    margin-bottom: 28px;
  }
  .hero-label-line { width: 24px; height: 1px; background: var(--accent); }

  .hero-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.8rem, 6vw, 5rem);
    line-height: 1.0;
    color: #e8f5ee;
    letter-spacing: -2px;
    margin-bottom: 24px;
    max-width: 760px;
  }
  .hero-title em { font-style: normal; color: var(--accent); }

  .hero-sub {
    font-size: 1.05rem; color: var(--text-dim);
    line-height: 1.75; max-width: 520px;
    margin-bottom: 44px; font-weight: 400;
  }

  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

  .btn-primary {
    padding: 13px 28px;
    background: var(--accent); color: #07100a;
    border: none; cursor: pointer;
    font-family: var(--font-display);
    font-weight: 700; font-size: 0.78rem;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .btn-outline {
    padding: 12px 28px;
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border2); cursor: pointer;
    font-family: var(--font-body);
    font-weight: 500; font-size: 0.85rem;
    transition: all 0.15s;
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

  /* ── STATS ── */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    border-bottom: 1px solid var(--border);
  }
  .stat {
    padding: 32px 40px;
    border-right: 1px solid var(--border);
  }
  .stat:last-child { border-right: none; }
  .stat-n {
    font-family: var(--font-display);
    font-weight: 800; font-size: 2.4rem;
    color: var(--accent); line-height: 1;
    margin-bottom: 6px;
  }
  .stat-l {
    font-size: 0.72rem; color: var(--text-dim);
    letter-spacing: 1px; text-transform: uppercase;
    font-weight: 500;
  }

  /* ── SECTIONS ── */
  .section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }
  .section-inner { max-width: 1200px; margin: 0 auto; }

  .section-top {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 48px;
    flex-wrap: wrap; gap: 16px;
  }

  .section-label {
    font-size: 0.68rem; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent);
    font-weight: 600; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::before {
    content: ''; display: block;
    width: 20px; height: 1px; background: var(--accent);
  }

  .section-title {
    font-family: var(--font-display);
    font-weight: 800; font-size: 2rem;
    color: #e8f5ee; letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .section-sub {
    font-size: 0.9rem; color: var(--text-dim);
    line-height: 1.7; max-width: 480px;
    margin-top: 6px;
  }

  .view-all {
    font-size: 0.75rem; color: var(--text-dim);
    cursor: pointer; background: none; border: none;
    font-family: var(--font-body); transition: color 0.15s;
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .view-all:hover { color: var(--accent); }

  /* ── GRID ── */
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1px; background: var(--border); }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1px; background: var(--border); }

  /* ── SKILL CARD ── */
  .skill-card {
    background: var(--surface);
    padding: 28px 32px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
    display: flex; flex-direction: column;
  }
  .skill-card:hover { background: var(--surface2); }
  .skill-card::after {
    content: ''; position: absolute;
    left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--card-accent, var(--accent));
    opacity: 0; transition: opacity 0.15s;
  }
  .skill-card:hover::after { opacity: 1; }

  .sc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }

  .sc-icon {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    border: 1px solid var(--border2);
    color: var(--accent);
  }

  .sc-tags { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

  .tag {
    font-size: 0.62rem; padding: 3px 9px;
    border: 1px solid var(--border);
    color: var(--text-dim); letter-spacing: 0.5px;
    font-weight: 500;
  }
  .tag-green { border-color: rgba(0,230,118,0.3); color: var(--accent); background: var(--accent-soft); }
  .tag-warn  { border-color: rgba(249,202,36,0.3); color: var(--warn); background: rgba(249,202,36,0.06); }
  .tag-purple { border-color: rgba(180,126,255,0.3); color: #b47eff; background: rgba(180,126,255,0.06); }

  .sc-title {
    font-family: var(--font-display);
    font-weight: 700; font-size: 1.1rem;
    color: #e0efe6; margin-bottom: 8px;
    line-height: 1.2;
  }

  .sc-desc {
    font-size: 0.85rem; color: var(--text-dim);
    line-height: 1.65; margin-bottom: 20px; flex: 1;
  }

  .sc-progress { height: 2px; background: var(--border); margin-bottom: 16px; }
  .sc-progress-fill { height: 100%; background: var(--accent); }

  .sc-foot {
    display: flex; justify-content: space-between;
    align-items: center; padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .sc-meta { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.5px; }

  .sc-outputs { display: flex; gap: 5px; align-items: center; }
  .output-pip { width: 7px; height: 7px; border-radius: 50%; }

  /* ── TRACK CARD ── */
  .track-card {
    background: var(--surface); padding: 36px 32px;
    cursor: pointer; transition: background 0.15s;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .track-card:hover { background: var(--surface2); }

  .track-accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }

  .track-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }

  .track-icon {
    width: 50px; height: 50px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; border: 1px solid var(--border2);
    color: var(--accent); flex-shrink: 0;
  }

  .track-title {
    font-family: var(--font-display);
    font-weight: 700; font-size: 1.15rem;
    color: #e0efe6; line-height: 1.2;
  }

  .track-desc {
    font-size: 0.85rem; color: var(--text-dim);
    line-height: 1.65; margin-bottom: 20px; flex: 1;
  }

  .track-outcome-block {
    background: var(--bg); padding: 14px 16px;
    border-left: 2px solid var(--accent);
    margin-bottom: 20px;
  }
  .track-outcome-label {
    font-size: 0.62rem; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--accent);
    font-weight: 600; margin-bottom: 4px;
  }
  .track-outcome-text { font-size: 0.8rem; color: var(--text-dim); line-height: 1.5; }

  .track-foot {
    display: flex; justify-content: space-between;
    font-size: 0.72rem; color: var(--text-muted);
    padding-top: 16px; border-top: 1px solid var(--border);
  }

  /* ── WORKSHOP CARD ── */
  .ws-card {
    background: var(--surface); padding: 28px 32px;
    display: flex; flex-direction: column;
  }

  .ws-type {
    display: inline-block; font-size: 0.62rem;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 10px; margin-bottom: 16px;
    border: 1px solid var(--border2); color: var(--text-dim);
    font-weight: 500;
  }
  .ws-type.online { border-color: rgba(0,230,118,0.3); color: var(--accent); }

  .ws-title {
    font-family: var(--font-display);
    font-weight: 700; font-size: 1.1rem;
    color: #e0efe6; margin-bottom: 10px; line-height: 1.25;
  }

  .ws-desc {
    font-size: 0.85rem; color: var(--text-dim);
    line-height: 1.65; margin-bottom: 20px; flex: 1;
  }

  .ws-details { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; }
  .ws-detail {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.78rem; color: var(--text-dim);
  }
  .ws-detail-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

  .ws-foot {
    display: flex; justify-content: space-between;
    align-items: center; padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .free-tag {
    font-size: 0.65rem; letter-spacing: 2px;
    text-transform: uppercase; font-weight: 700;
    padding: 4px 12px; color: var(--accent);
    border: 1px solid var(--accent); background: var(--accent-soft);
  }

  .spots { font-size: 0.75rem; color: var(--warn); font-weight: 500; }

  .ws-apply {
    font-size: 0.75rem; color: var(--text-dim);
    background: none; border: 1px solid var(--border);
    padding: 6px 16px; cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.15s;
  }
  .ws-apply:hover { border-color: var(--accent); color: var(--accent); }

  /* ── PATHWAY ── */
  .pathway {
    display: flex; overflow-x: auto;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .pathway::-webkit-scrollbar { height: 0; }

  .pathway-node {
    flex: 1; min-width: 110px;
    padding: 20px 24px; cursor: pointer;
    transition: background 0.15s;
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; text-align: center;
  }
  .pathway-node:last-child { border-right: none; }
  .pathway-node:hover { background: var(--surface2); }
  .pathway-node.locked { opacity: 0.3; cursor: default; }
  .pathway-node.current { background: var(--accent-soft); }

  .pn-icon { font-size: 1.1rem; color: var(--text-dim); }
  .pathway-node.current .pn-icon { color: var(--accent); }
  .pn-name { font-size: 0.68rem; font-weight: 600; color: var(--text-dim); letter-spacing: 0.5px; }
  .pathway-node.current .pn-name { color: var(--accent); }
  .pn-status { font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── FILTER ── */
  .filters { display: flex; gap: 8px; margin-bottom: 40px; flex-wrap: wrap; }
  .filter {
    padding: 7px 18px; font-size: 0.78rem;
    border: 1px solid var(--border); color: var(--text-dim);
    background: none; cursor: pointer; font-family: var(--font-body);
    font-weight: 500; transition: all 0.15s;
  }
  .filter:hover { border-color: var(--border2); color: var(--text); }
  .filter.on { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

  /* ── SKILL DETAIL ── */
  .detail { padding: 56px 48px; max-width: 1200px; margin: 0 auto; }

  .detail-back {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.78rem; color: var(--text-dim);
    background: none; border: none; cursor: pointer;
    font-family: var(--font-body); margin-bottom: 40px;
    transition: color 0.15s;
  }
  .detail-back:hover { color: var(--accent); }

  .detail-head {
    display: grid; grid-template-columns: 1fr auto;
    gap: 32px; align-items: start;
    margin-bottom: 56px; padding-bottom: 40px;
    border-bottom: 1px solid var(--border);
  }

  .detail-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }

  .detail-title {
    font-family: var(--font-display);
    font-weight: 800; font-size: 2.4rem;
    color: #e8f5ee; letter-spacing: -1px;
    line-height: 1.1; margin-bottom: 14px;
  }

  .detail-desc {
    font-size: 0.95rem; color: var(--text-dim);
    line-height: 1.75; max-width: 560px;
  }

  .detail-actions { display: flex; flex-direction: column; gap: 10px; min-width: 180px; }

  .detail-body {
    display: grid; grid-template-columns: 1fr 300px;
    gap: 1px; background: var(--border);
  }

  .detail-main { background: var(--surface); padding: 36px; }
  .detail-side { background: var(--surface); padding: 28px; }

  .modules-head {
    font-size: 0.68rem; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent);
    font-weight: 600; margin-bottom: 20px;
    padding-bottom: 12px; border-bottom: 1px solid var(--border);
  }

  .module-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); }

  .module-row {
    background: var(--bg); padding: 16px 20px;
    display: flex; align-items: center; gap: 16px;
    cursor: pointer; transition: background 0.15s;
  }
  .module-row:hover { background: var(--surface2); }

  .mod-num {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border2);
    font-size: 0.68rem; color: var(--text-dim);
    font-family: var(--font-display); font-weight: 700;
  }
  .mod-num.done {
    border-color: var(--accent); color: var(--accent);
    background: var(--accent-soft);
  }

  .mod-info { flex: 1; }
  .mod-title { font-size: 0.88rem; color: var(--text); font-weight: 500; margin-bottom: 3px; }
  .mod-meta { font-size: 0.68rem; color: var(--text-dim); }

  .mod-type-badge {
    font-size: 0.6rem; padding: 2px 9px;
    border: 1px solid var(--border);
    color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .side-block { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
  .side-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .side-label {
    font-size: 0.65rem; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent);
    font-weight: 600; margin-bottom: 14px;
  }

  .meta-row {
    display: flex; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid var(--border);
    font-size: 0.8rem;
  }
  .meta-row:last-child { border-bottom: none; }
  .meta-key { color: var(--text-dim); }
  .meta-val { color: var(--text); font-weight: 500; }

  .arbi-nudge {
    background: var(--bg); padding: 18px 20px;
    border-left: 2px solid var(--accent);
  }
  .arbi-nudge-title {
    font-size: 0.7rem; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--accent);
    font-weight: 600; margin-bottom: 8px;
  }
  .arbi-nudge-text {
    font-size: 0.8rem; color: var(--text-dim);
    line-height: 1.6; margin-bottom: 14px;
  }

  /* ── ARBI PANEL ── */
  .arbi-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(7,16,10,0.7);
    backdrop-filter: blur(4px);
    animation: fadeOverlay 0.2s ease;
  }
  @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }

  .arbi-drawer {
    position: fixed; right: 0; top: 0; bottom: 0;
    width: min(480px, 100vw); z-index: 201;
    background: #050d08;
    border-left: 1px solid #0d2418;
    display: flex; flex-direction: column;
    animation: slideIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

  .arbi-head {
    padding: 20px 24px; border-bottom: 1px solid #0d2418;
    display: flex; align-items: center; gap: 14px;
  }

  .arbi-avatar {
    width: 42px; height: 42px;
    border: 1.5px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--accent);
    box-shadow: 0 0 16px rgba(0,230,118,0.2);
    animation: arbipulse 3s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes arbipulse {
    0%,100%{box-shadow:0 0 12px rgba(0,230,118,0.15);}
    50%{box-shadow:0 0 28px rgba(0,230,118,0.3);}
  }

  .arbi-head-text { flex: 1; }
  .arbi-head-name {
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem; color: var(--accent);
    letter-spacing: 2px; font-weight: 500;
  }
  .arbi-head-sub {
    font-size: 0.62rem; color: #2d5a3e;
    letter-spacing: 1px; margin-top: 2px;
    font-family: 'DM Mono', monospace;
  }

  .arbi-close {
    background: none; border: 1px solid #1a3025;
    color: #2d5a3e; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem; transition: all 0.15s;
    font-family: 'DM Mono', monospace;
  }
  .arbi-close:hover { border-color: var(--accent); color: var(--accent); }

  .arbi-msgs {
    flex: 1; overflow-y: auto;
    padding: 24px; display: flex; flex-direction: column; gap: 16px;
  }
  .arbi-msgs::-webkit-scrollbar { width: 2px; }
  .arbi-msgs::-webkit-scrollbar-thumb { background: #1a3025; }

  .msg { display: flex; gap: 10px; max-width: 100%; }
  .msg-u { flex-direction: row-reverse; align-self: flex-end; }

  .msg-av {
    width: 26px; height: 26px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem; align-self: flex-start;
    font-family: 'DM Mono', monospace;
  }
  .msg-av-a { border: 1px solid var(--accent); color: var(--accent); }
  .msg-av-u { border: 1px solid #1a3025; color: #2d5a3e; }

  .msg-bub {
    padding: 11px 15px; font-size: 0.82rem;
    line-height: 1.7; max-width: calc(100% - 40px);
    font-family: 'DM Mono', monospace;
  }
  .msg-bub-a { background: #0a1810; border: 1px solid #1a3025; color: #a8c8b4; }
  .msg-bub-u { background: rgba(0,230,118,0.07); border: 1px solid rgba(0,230,118,0.2); color: #a8c8b4; }

  .msg-typing { display: flex; gap: 5px; align-items: center; padding: 12px 15px; background: #0a1810; border: 1px solid #1a3025; }
  .tdot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: tdots 1.2s ease-in-out infinite; }
  .tdot:nth-child(2){animation-delay:.2s} .tdot:nth-child(3){animation-delay:.4s}
  @keyframes tdots{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-5px);opacity:1}}

  @keyframes msgIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
  .msg { animation: msgIn 0.2s ease; }

  .arbi-input-wrap { padding: 16px 24px; border-top: 1px solid #0d2418; }
  .arbi-input-row { display: flex; gap: 8px; }
  .arbi-input {
    flex: 1; background: #0a1810; border: 1px solid #1a3025;
    color: #a8c8b4; font-family: 'DM Mono', monospace; font-size: 0.78rem;
    padding: 10px 14px; outline: none; resize: none; line-height: 1.5;
    transition: border-color 0.15s;
  }
  .arbi-input:focus { border-color: var(--accent); }
  .arbi-input::placeholder { color: #1e3d28; }

  .arbi-send {
    width: 42px; background: var(--accent); color: #07100a;
    border: none; cursor: pointer; font-size: 1rem;
    font-weight: 700; transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .arbi-send:hover{opacity:.85} .arbi-send:disabled{opacity:.3;cursor:not-allowed}
  .arbi-hint { font-size: 0.6rem; color: #1e3d28; margin-top: 8px; font-family: 'DM Mono', monospace; }

  @media(max-width:768px){
    .nav{padding:0 20px}
    .hero{padding:60px 20px 56px}
    .section{padding:56px 20px}
    .stat{padding:24px 20px}
    .detail{padding:32px 20px}
    .detail-head{grid-template-columns:1fr}
    .detail-body{grid-template-columns:1fr}
    .nav-links .nav-link:not(.active){display:none}
  }
`

const PATHWAY_NODES = [
  { id:'utils',      icon:'⟳', name:'Utils',      status:'complete', url:'https://utils-pi-one.vercel.app' },
  { id:'groundzero', icon:'▣', name:'GroundZero',  status:'complete', url:'https://gzbnos.vercel.app' },
  { id:'btu',        icon:'⊕', name:'BTU',         status:'complete', url:'https://btu-two.vercel.app' },
  { id:'skills',     icon:'◎', name:'Skills',      status:'current',  url:'#' },
  { id:'guuz',       icon:'◆', name:'Guuz',        status:'next',     url:'#' },
  { id:'profile',    icon:'◉', name:'Profile',     status:'locked',   url:'#' },
  { id:'career',     icon:'✦', name:'Career',      status:'locked',   url:'#' },
]

const CATS = [
  { id:'all',              label:'All Skills' },
  { id:'foundation',       label:'Foundation' },
  { id:'ai',               label:'AI Upskilling' },
  { id:'consciousness',    label:'Consciousness' },
  { id:'critical-thinking',label:'Critical Thinking' },
  { id:'soft-skill',       label:'Soft Skills' },
  { id:'hard-skill',       label:'Trade Skills' },
]

export default function SkillsApp() {
  const [view, setView]           = useState<View>('home')
  const [activeSkill, setActive]  = useState<Skill | null>(null)
  const [cat, setCat]             = useState('all')
  const [arbiOpen, setArbiOpen]   = useState(false)
  const [messages, setMessages]   = useState<Message[]>([
    { role:'assistant', content: ARBI_WELCOME }
  ])
  const [input, setInput]   = useState('')
  const [streaming, setStr] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || streaming) return
    const next: Message[] = [...messages, { role:'user', content:text }]
    setMessages(next)
    setInput('')
    setStr(true)
    setMessages(m => [...m, { role:'assistant', content:'' }])
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: next.map(m=>({role:m.role,content:m.content})) })
      })
      const reader = res.body?.getReader()
      const dec = new TextDecoder()
      if (!reader) return
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value)
        setMessages(m => {
          const copy = [...m]
          copy[copy.length-1] = { role:'assistant', content: copy[copy.length-1].content + chunk }
          return copy
        })
      }
    } catch {
      setMessages(m => { const c=[...m]; c[c.length-1]={role:'assistant',content:'Connection lost. Please try again.'}; return c })
    } finally { setStr(false) }
  }

  const filtered = SKILLS.filter(s => cat==='all' || s.category===cat)

  function openSkill(s: Skill) { setActive(s); setView('skill-detail') }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={()=>setView('home')}>
          <div className="nav-logo-mark">XS</div>
          XenoGen Skills
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
          <button className="nav-arbi" onClick={()=>setArbiOpen(true)}>
            <div className="nav-arbi-dot"/>
            Talk to ARBI
          </button>
        </div>
      </nav>

      <div className="shell">

        {/* PATHWAY */}
        <div className="pathway">
          {PATHWAY_NODES.map(n=>(
            <div key={n.id}
              className={`pathway-node ${n.status==='current'?'current':''} ${n.status==='locked'?'locked':''}`}
              onClick={()=>{ if(n.url!=='#') window.open(n.url,'_blank') }}
              title={n.status==='locked'?'Complete earlier stages first':`Go to ${n.name}`}>
              <div className="pn-icon">{n.icon}</div>
              <div className="pn-name">{n.name}</div>
              <div className="pn-status">{n.status}</div>
            </div>
          ))}
        </div>

        <main className="main">

          {/* ── HOME ── */}
          {view==='home' && <>
            <div className="hero">
              <div className="hero-bg"/>
              <div className="hero-inner">
                <div className="hero-label">
                  <div className="hero-label-line"/>
                  XenoGenesis · Layer 3 · Education & Skills
                </div>
                <h1 className="hero-title">
                  From zero<br/>to <em>verified</em><br/>capability.
                </h1>
                <p className="hero-sub">
                  Every skill you complete builds your credential. Every credential
                  unlocks the next stage. ARBI walks with you — wherever you're starting from.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={()=>setView('skills')}>Browse Skills</button>
                  <button className="btn-outline" onClick={()=>setView('tracks')}>View Learning Tracks</button>
                  <button className="btn-outline" onClick={()=>setArbiOpen(true)}>Talk to ARBI First</button>
                </div>
              </div>
            </div>

            <div className="stats">
              {[
                [PLATFORM_STATS.learnersEnrolled.toLocaleString(), 'Learners Enrolled'],
                [PLATFORM_STATS.credentialsIssued.toLocaleString(), 'Credentials Issued'],
                [PLATFORM_STATS.skillsAvailable, 'Skills Available'],
                [PLATFORM_STATS.completionRate+'%', 'Completion Rate'],
                [PLATFORM_STATS.workshopsRunning, 'Free Workshops'],
              ].map(([n,l])=>(
                <div key={String(l)} className="stat">
                  <div className="stat-n">{n}</div>
                  <div className="stat-l">{l}</div>
                </div>
              ))}
            </div>

            <div className="section">
              <div className="section-inner">
                <div className="section-top">
                  <div>
                    <div className="section-label">Learning Tracks</div>
                    <h2 className="section-title">Structured paths to real outcomes</h2>
                    <p className="section-sub">Each track takes you from where you are to a verified outcome. ARBI guides every step.</p>
                  </div>
                  <button className="view-all" onClick={()=>setView('tracks')}>All tracks →</button>
                </div>
                <div className="grid-2">
                  {SKILL_TRACKS.slice(0,4).map(t=><TrackCard key={t.id} track={t}/>)}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-inner">
                <div className="section-top">
                  <div>
                    <div className="section-label">Workshops</div>
                    <h2 className="section-title">Free. In Gauteng and online.</h2>
                  </div>
                  <button className="view-all" onClick={()=>setView('workshops')}>All workshops →</button>
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
                <div className="section-top">
                  <div>
                    <div className="section-label">Skill Library</div>
                    <h2 className="section-title">Every skill you need</h2>
                    <p className="section-sub">From literacy foundations to advanced trade skills. Each one earns a verified credential.</p>
                  </div>
                </div>
                <div className="filters">
                  {CATS.map(c=>(
                    <button key={c.id} className={`filter ${cat===c.id?'on':''}`} onClick={()=>setCat(c.id)}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="grid-3">
                  {filtered.map(s=><SkillCard key={s.id} skill={s} onClick={()=>openSkill(s)}/>)}
                </div>
              </div>
            </div>
          )}

          {/* ── TRACKS ── */}
          {view==='tracks' && (
            <div className="section">
              <div className="section-inner">
                <div className="section-top">
                  <div>
                    <div className="section-label">Learning Tracks</div>
                    <h2 className="section-title">Structured pathways to outcomes</h2>
                    <p className="section-sub">Tracks combine skills into a guided journey. Start one and ARBI walks you through every step.</p>
                  </div>
                </div>
                <div className="grid-2">
                  {SKILL_TRACKS.map(t=><TrackCard key={t.id} track={t}/>)}
                </div>
              </div>
            </div>
          )}

          {/* ── WORKSHOPS ── */}
          {view==='workshops' && (
            <div className="section">
              <div className="section-inner">
                <div className="section-top">
                  <div>
                    <div className="section-label">Workshops & Programmes</div>
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
            <SkillDetail skill={activeSkill} onBack={()=>setView('skills')} onARBI={()=>setArbiOpen(true)}/>
          )}

        </main>
      </div>

      {/* ARBI DRAWER */}
      {arbiOpen && (
        <>
          <div className="arbi-overlay" onClick={()=>setArbiOpen(false)}/>
          <div className="arbi-drawer">
            <div className="arbi-head">
              <div className="arbi-avatar">◈</div>
              <div className="arbi-head-text">
                <div className="arbi-head-name">ARBI</div>
                <div className="arbi-head-sub">SKILLS PLATFORM GUIDE · XENOGENESIS</div>
              </div>
              <button className="arbi-close" onClick={()=>setArbiOpen(false)}>✕</button>
            </div>
            <div className="arbi-msgs">
              {messages.map((m,i)=>(
                <div key={i} className={`msg ${m.role==='user'?'msg-u':''}`}>
                  <div className={`msg-av ${m.role==='assistant'?'msg-av-a':'msg-av-u'}`}>
                    {m.role==='assistant'?'◈':'○'}
                  </div>
                  {m.role==='assistant'&&streaming&&i===messages.length-1&&m.content===''
                    ? <div className="msg-typing"><div className="tdot"/><div className="tdot"/><div className="tdot"/></div>
                    : <div className={`msg-bub ${m.role==='assistant'?'msg-bub-a':'msg-bub-u'}`}>{m.content}</div>
                  }
                </div>
              ))}
              <div ref={endRef}/>
            </div>
            <div className="arbi-input-wrap">
              <div className="arbi-input-row">
                <textarea
                  className="arbi-input" rows={2} value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
                  placeholder="Ask ARBI about your learning journey..."
                />
                <button className="arbi-send" onClick={send} disabled={streaming||!input.trim()}>→</button>
              </div>
              <div className="arbi-hint">ENTER to send · SHIFT+ENTER new line</div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ── SKILL CARD ────────────────────────────────────────────────────
function SkillCard({ skill, onClick }: { skill: Skill; onClick: ()=>void }) {
  return (
    <div className="skill-card" onClick={onClick}
      style={{'--card-accent': skill.color} as React.CSSProperties}>
      <div className="sc-top">
        <div className="sc-icon" style={{borderColor: skill.color+'33', color: skill.color}}>{skill.icon}</div>
        <div className="sc-tags">
          {skill.enrolled   && <span className="tag tag-green">Enrolled</span>}
          {skill.status==='coming-soon' && <span className="tag tag-warn">Soon</span>}
          {skill.outputsCredential && <span className="tag tag-purple">Credential</span>}
          <span className="tag">{skill.hours}h</span>
        </div>
      </div>
      <div className="sc-title">{skill.title}</div>
      <div className="sc-desc">{skill.description}</div>
      {skill.progress!==undefined && (
        <div className="sc-progress">
          <div className="sc-progress-fill" style={{width:`${skill.progress}%`}}/>
        </div>
      )}
      <div className="sc-foot">
        <div className="sc-meta">{skill.modules.length} modules · {skill.level}</div>
        <div className="sc-outputs">
          {skill.outputsToProfile && <div className="output-pip" title="Updates Profile" style={{background:'#b47eff'}}/>}
          {skill.outputsToMarket  && <div className="output-pip" title="Lists on Guuz"    style={{background:'#ffca28'}}/>}
          {skill.outputsCredential&& <div className="output-pip" title="Issues Credential" style={{background: skill.color}}/>}
        </div>
      </div>
    </div>
  )
}

// ── TRACK CARD ────────────────────────────────────────────────────
function TrackCard({ track }: { track: SkillTrack }) {
  return (
    <div className="track-card">
      <div className="track-accent-bar" style={{background: track.color}}/>
      <div className="track-head">
        <div className="track-icon" style={{borderColor: track.color+'33', color: track.color}}>{track.icon}</div>
        <div className="track-title">{track.title}</div>
      </div>
      <div className="track-desc">{track.description}</div>
      <div className="track-outcome-block">
        <div className="track-outcome-label">Outcome</div>
        <div className="track-outcome-text">{track.outcome}</div>
      </div>
      <div className="track-foot">
        <span>{track.totalHours}h total</span>
        <span>{track.skills.length} skills</span>
      </div>
    </div>
  )
}

// ── WORKSHOP CARD ─────────────────────────────────────────────────
function WorkshopCard({ ws }: { ws: Workshop }) {
  return (
    <div className="ws-card">
      <div className={`ws-type ${ws.type==='online'?'online':''}`}>{ws.type}</div>
      <div className="ws-title">{ws.title}</div>
      <div className="ws-desc">{ws.description}</div>
      <div className="ws-details">
        {ws.location && <div className="ws-detail"><div className="ws-detail-dot"/>{ws.location}</div>}
        {ws.date     && <div className="ws-detail"><div className="ws-detail-dot"/>{ws.date}</div>}
        <div className="ws-detail"><div className="ws-detail-dot"/>{ws.duration} · {ws.provider}</div>
      </div>
      <div className="ws-foot">
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <span className="free-tag">FREE</span>
          {ws.spotsLeft && ws.spotsLeft < 10 && <span className="spots">{ws.spotsLeft} spots left</span>}
        </div>
        <button className="ws-apply">Apply →</button>
      </div>
    </div>
  )
}

// ── SKILL DETAIL ──────────────────────────────────────────────────
function SkillDetail({ skill, onBack, onARBI }: { skill: Skill; onBack:()=>void; onARBI:()=>void }) {
  return (
    <div className="detail">
      <button className="detail-back" onClick={onBack}>← Back to Skills</button>
      <div className="detail-head">
        <div>
          <div className="detail-eyebrow">
            <div className="section-label" style={{marginBottom:0}}>{skill.category.replace('-',' ')}</div>
          </div>
          <h1 className="detail-title">{skill.title}</h1>
          <p className="detail-desc">{skill.description}</p>
        </div>
        <div className="detail-actions">
          <button className="btn-primary" style={{background: skill.color}}>Enrol Now</button>
          <button className="btn-outline" onClick={onARBI}>Ask ARBI →</button>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <div className="modules-head">Modules — {skill.modules.length} total</div>
          {skill.modules.length > 0 ? (
            <div className="module-list">
              {skill.modules.map((mod,i)=>(
                <div key={mod.id} className="module-row">
                  <div className={`mod-num ${mod.completed?'done':''}`}>{mod.completed?'✓':i+1}</div>
                  <div className="mod-info">
                    <div className="mod-title">{mod.title}</div>
                    <div className="mod-meta">{mod.duration}</div>
                  </div>
                  <div className="mod-type-badge">{mod.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{padding:'32px', border:'1px solid var(--border)', textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem'}}>
              Modules being finalised — check back soon.
            </div>
          )}
        </div>
        <div className="detail-side">
          <div className="side-block">
            <div className="side-label">Details</div>
            {[
              ['Level',      skill.level],
              ['Duration',   `${skill.hours} hours`],
              ['Modules',    `${skill.modules.length}`],
              ['Credential', skill.outputsCredential?'Issued on completion':'Not included'],
              ['Marketplace',skill.outputsToMarket?'Listed on Guuz':'Not listed'],
              ['Profile',    skill.outputsToProfile?'Updates XenoGen Profile':'Not included'],
            ].map(([k,v])=>(
              <div key={k} className="meta-row">
                <span className="meta-key">{k}</span>
                <span className="meta-val">{v}</span>
              </div>
            ))}
          </div>
          {skill.prerequisites.length>0 && (
            <div className="side-block">
              <div className="side-label">Prerequisites</div>
              {skill.prerequisites.map(p=>(
                <div key={p} style={{padding:'7px 12px', border:'1px solid var(--border)', fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:4}}>
                  {p}
                </div>
              ))}
            </div>
          )}
          <div className="side-block">
            <div className="arbi-nudge">
              <div className="arbi-nudge-title">Not sure this is right?</div>
              <div className="arbi-nudge-text">Ask ARBI and she'll tell you honestly whether this skill fits where you are and where you're going.</div>
              <button className="btn-outline" onClick={onARBI} style={{width:'100%', textAlign:'center'}}>Open ARBI →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
