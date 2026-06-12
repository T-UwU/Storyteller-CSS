// ==UserScript==
// @name         StoryPagina 2.6
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Script para mejorar la pagina de registro de horas de Storytellers (alumno y líder)
// @author       Isra
// @match        https://enginyti.com/storytellers/alumno/ver_pendientes.php
// @match        https://enginyti.com/storytellers/alumno/ver_actividades.php
// @match        https://enginyti.com/storytellers/alumno/*
// @match        https://enginyti.com/storytellers/lider/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(() => {
'use strict';

// ==================== CONFIGURACIÓN ====================
const cfg = {
    css: 'https://raw.githubusercontent.com/T-UwU/Storyteller-CSS/refs/heads/main/storyteller.css',
    cssLider: 'https://raw.githubusercontent.com/T-UwU/Storyteller-CSS/refs/heads/main/storyteller-lider.css',
    fallback: `.tm-ctrl{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:16px 0;display:flex;gap:12px}.header{display:none!important}.modern-header{background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:50}.modern-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;margin:20px auto;max-width:1200px}.modern-table{width:100%;border-collapse:collapse}.tm-dark-toggle{padding:.5rem}html.tm-dark body{background:#0f172a}html.tm-dark .modern-header,html.tm-dark .modern-card,html.tm-dark .modern-form-container{background:#1e293b;border-color:#334155}html.tm-dark .modern-title,html.tm-dark .modern-td,html.tm-dark .modern-info-value{color:#e2e8f0}html.tm-dark .modern-th{background:#273449;color:#94a3b8}html.tm-dark .modern-nav-item{color:#cbd5e1}html.tm-dark .modern-input,html.tm-dark .modern-select,html.tm-dark .modern-textarea,html.tm-dark .tm-ctrl select,html.tm-dark .tm-ctrl input[type=date]{background:#0f172a;border-color:#334155;color:#e2e8f0}.tm-clone-banner{background:#fef3c7;border:1px solid #fcd34d;color:#92400e;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:14px;line-height:1.4}html.tm-dark .tm-clone-banner{background:#422006;border-color:#854d0e;color:#fcd34d}`,
    liderFallback: `.header{display:none!important}body.bg-amarillo,body.bg-verde{background:#f8fafc}.modern-header{background:#fff;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.1);position:sticky;top:0;z-index:50}.modern-header-container{max-width:1200px;margin:0 auto;display:flex;height:4rem;align-items:center;justify-content:space-between;padding:0 1rem}.modern-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);margin:20px auto;max-width:1200px}.modern-card-header{padding:24px 24px 16px;border-bottom:1px solid #f3f4f6}.modern-title{font-size:24px;font-weight:600;color:#111827;margin:0}.modern-card-content{padding:24px}.modern-table{width:100%;border-collapse:collapse;font-size:14px}.modern-th{padding:14px 10px;text-align:center;font-weight:600;color:#374151;font-size:12px;text-transform:uppercase;background:#f9fafb}.modern-td{padding:14px 10px;text-align:center;color:#374151}.modern-row{border-bottom:1px solid #f3f4f6}.modern-row:hover{background:#f9fafb}.modern-badge{display:inline-flex;align-items:center;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:600;color:#fff;text-decoration:none}.modern-badge-primary{background:#3b82f6}.modern-badge-success{background:#10b981}.modern-badge-warning{background:#f59e0b}.modern-badge-default{background:#6b7280}.lider-campus-section{margin-bottom:28px}.lider-campus-title{font-size:16px;color:#111827;margin:0 0 10px}.lider-campus-label{color:#3b82f6;font-weight:700}.lider-activity{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.06)}.lider-activity-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:12px 0}.lider-grade-row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;margin-top:8px}.lider-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.modern-form-btn{padding:10px 18px;border:none;border-radius:8px;color:#fff;font-weight:600;cursor:pointer;display:inline-flex;gap:6px;align-items:center}.lider-btn-ok{background:#10b981}.lider-btn-no{background:#f59e0b}.lider-btn-del{background:#dc2626}.tm-dark-toggle{padding:.5rem}.tm-count{font-size:13px;color:#6b7280;background:#f3f4f6;padding:6px 12px;border-radius:20px}.lider-summary{margin-bottom:16px}.lider-summary-label{display:block;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:8px}.lider-chips{display:flex;flex-wrap:wrap;gap:8px}.lider-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:20px;background:#fff;color:#374151;font-size:13px;cursor:pointer}.lider-chip.active{background:#3b82f6;border-color:#3b82f6;color:#fff}.lider-chip-count{min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;background:#f59e0b;color:#fff;font-size:11px;font-weight:700}.tm-ctrl{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:12px 16px;margin-bottom:16px}.tm-search{position:relative;display:flex;align-items:center;flex:1 1 220px}.tm-search svg{position:absolute;left:10px;width:16px;height:16px;color:#9ca3af}.tm-ctrl .tm-search input{width:100%;padding:9px 12px 9px 36px}.tm-ctrl input,.tm-ctrl select{font-size:13px;border:1px solid #d1d5db;border-radius:8px;background:#fff;padding:9px 12px}.tm-ctrl select{min-width:160px}.tm-btn{padding:9px 16px;border:none;border-radius:8px;color:#fff;font-weight:600;cursor:pointer}.tm-btn-s{background:#4b5563}html.tm-dark body,html.tm-dark body.bg-amarillo,html.tm-dark body.bg-verde{background:#0f172a}html.tm-dark .modern-header,html.tm-dark .modern-card,html.tm-dark .lider-activity{background:#1e293b;border-color:#334155}html.tm-dark .modern-title,html.tm-dark .lider-value,html.tm-dark .modern-td,html.tm-dark .lider-activity-title{color:#e2e8f0}html.tm-dark .modern-th{background:#273449;color:#94a3b8}html.tm-dark .modern-nav-item{color:#cbd5e1}html.tm-dark .modern-select,html.tm-dark .modern-textarea,html.tm-dark .tm-ctrl input,html.tm-dark .tm-ctrl select{background:#0f172a;border-color:#334155;color:#e2e8f0}html.tm-dark .tm-count,html.tm-dark .lider-chip{background:#273449;border-color:#334155;color:#cbd5e1}.alumno-dropdown{min-width:18rem;padding:.5rem;background:#fff;border:1px solid #e5e7eb;border-radius:.375rem;box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.alumno-search-wrap{position:relative;display:flex;align-items:center;margin-bottom:.5rem}.alumno-search-wrap svg{position:absolute;left:.6rem;width:16px;height:16px;color:#9ca3af}.alumno-search{width:100%;padding:.5rem .6rem .5rem 2rem;border:1px solid #e5e7eb;border-radius:.375rem;font-size:.875rem;outline:none}.alumno-list{max-height:18rem;overflow-y:auto}.alumno-campus-head{padding:.4rem .5rem .25rem;font-size:.7rem;font-weight:700;text-transform:uppercase;color:#9ca3af}.alumno-item{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.55rem .6rem;border-radius:.375rem;text-decoration:none}.alumno-item:hover{background:#eef2ff}.alumno-name{font-size:.875rem;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alumno-right{display:flex;align-items:center;gap:.4rem;flex-shrink:0}.alumno-mat{font-size:.7rem;font-weight:600;color:#4f46e5;background:#eef2ff;padding:.15rem .4rem;border-radius:.25rem}.alumno-count{min-width:1.25rem;height:1.25rem;display:inline-flex;align-items:center;justify-content:center;padding:0 .3rem;border-radius:.625rem;background:#f59e0b;color:#fff;font-size:.7rem;font-weight:700}html.tm-dark .alumno-dropdown{background:#1e293b;border-color:#334155}html.tm-dark .alumno-search{background:#0f172a;border-color:#334155;color:#e2e8f0}html.tm-dark .alumno-name{color:#e2e8f0}html.tm-dark .alumno-item:hover{background:#334155}html.tm-dark .alumno-mat{color:#c7d2fe;background:#312e81}`,
    months: {ENE:0,FEB:1,MAR:2,ABR:3,MAY:4,JUN:5,JUL:6,AGO:7,SEP:8,OCT:9,NOV:10,DIC:11},
    pages: ['ver_actividades.php', 'ver_pendientes.php', 'ver_validadas.php']
};

// Rol actual según la URL (.../alumno/... o .../lider/...)
const isLider = location.pathname.includes('/lider/');

const icons = {
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    register: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 18v-6"/>',
    commitments: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    activities: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
};

// ==================== UTILIDADES ====================
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const svg = (name, cls = '') => `<svg ${cls ? `class="${cls}"` : ''} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const debounce = (fn, ms) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
};

const parseDate = text => {
    try {
        if (!text) return null;
        const [day, month] = text.trim().toUpperCase().split('|');
        const m = cfg.months[month?.trim()];
        if (!day || m === undefined) return null;
        const year = new Date().getFullYear() - (m >= 7 ? 1 : 0);
        return new Date(year, m, parseInt(day.trim()));
    } catch { return null; }
};

// ==================== FUNCIONES DE PERSISTENCIA ====================

// Guardar valor genérico
const saveValue = (key, value) => {
    if (typeof GM_setValue !== 'undefined') {
        GM_setValue(key, value);
    } else {
        localStorage.setItem('storytellers_' + key, JSON.stringify(value));
    }
};

// Obtener valor genérico
const getValue = (key, defaultValue = null) => {
    if (typeof GM_getValue !== 'undefined') {
        return GM_getValue(key, defaultValue);
    } else {
        const stored = localStorage.getItem('storytellers_' + key);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    }
};

// Guardar la última fecha utilizada
const saveLastActivityDate = (dateValue) => {
    if (typeof GM_setValue !== 'undefined') {
        GM_setValue('lastActivityDate', dateValue);
        GM_setValue('lastActivityTimestamp', new Date().getTime());
    } else {
        localStorage.setItem('storytellers_lastActivityDate', dateValue);
        localStorage.setItem('storytellers_lastActivityTimestamp', new Date().getTime());
    }
};

// Obtener la última fecha utilizada
const getLastActivityDate = () => {
    let lastDate, lastTimestamp;

    if (typeof GM_getValue !== 'undefined') {
        lastDate = GM_getValue('lastActivityDate', null);
        lastTimestamp = GM_getValue('lastActivityTimestamp', 0);
    } else {
        lastDate = localStorage.getItem('storytellers_lastActivityDate');
        lastTimestamp = parseInt(localStorage.getItem('storytellers_lastActivityTimestamp') || '0');
    }

    if (!lastDate) return null;

    // Verificar que la fecha guardada no sea muy antigua (más de 30 días)
    const thirtyDaysAgo = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
    if (lastTimestamp < thirtyDaysAgo) {
        return null;
    }

    return lastDate;
};

// Guardar configuración de controles de tabla
const saveTableControls = (pageName, controls) => {
    saveValue(`tableControls_${pageName}`, {
        ...controls,
        timestamp: new Date().getTime()
    });
};

// Obtener configuración de controles de tabla
const getTableControls = (pageName) => {
    const controls = getValue(`tableControls_${pageName}`, null);

    if (!controls) return null;

    // Verificar que la configuración no sea muy antigua (más de 7 días)
    const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    if (controls.timestamp < sevenDaysAgo) {
        return null;
    }

    return controls;
};

// Obtener la fecha más reciente de la tabla de actividades
const getMostRecentActivityDate = () => {
    const tables = $$('.modern-table, .table-striped');
    let mostRecentDate = null;

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // Buscar en la segunda columna que generalmente tiene la fecha
            const dateCell = row.cells[1];
            if (dateCell) {
                const dateText = dateCell.textContent.trim();
                const parsedDate = parseDate(dateText);
                if (parsedDate && (!mostRecentDate || parsedDate > mostRecentDate)) {
                    mostRecentDate = parsedDate;
                }
            }
        });
    });

    if (mostRecentDate) {
        // Convertir a formato YYYY-MM-DD para el input date
        const year = mostRecentDate.getFullYear();
        const month = (mostRecentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = mostRecentDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return null;
};

// ==================== CSS Y HEADER ====================
const CSS_CACHE_KEY = isLider ? 'cssCache_lider' : 'cssCache_alumno';

// Inyecta (o reemplaza) el <style> del script
const injectCSS = css => {
    let style = document.getElementById('tmStyle');
    if (!style) {
        style = document.createElement('style');
        style.id = 'tmStyle';
        (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = css;
};

const getUserInfo = () => {
    const alumno = $('.info-box.alumno');
    const responsable = $('.info-box.responsable');
    const userName = alumno?.querySelector('p b')?.textContent?.trim() || 'Usuario';

    const extractInfo = (box, mappings) => {
        box?.querySelectorAll('h5').forEach(h5 => {
            const value = h5.nextElementSibling?.querySelector('b')?.textContent?.trim() || '';
            const label = h5.textContent.trim();
            if (mappings[label]) mappings[label](value);
        });
    };

    let grado = '', campus = '', lider = '', email = '';
    extractInfo(alumno, {'Grado': v => grado = v, 'Campus': v => campus = v});
    extractInfo(responsable, {'Líder': v => lider = v, 'E-mail': v => email = v});

    return {userName, userInitial: userName.charAt(0).toUpperCase(), grado, campus, lider, email};
};

const setupDropdowns = () => {
    document.addEventListener('click', e => $$('.dropdown-menu').forEach(d => !d.closest('.dropdown-container').contains(e.target) && d.classList.remove('show')));
    ['activities', 'user', 'porAlumno'].forEach(type => {
        const btn = $(`#${type}Dropdown`), menu = $(`#${type}Menu`);
        if (btn && menu) btn.onclick = e => {
            e.stopPropagation();
            $$('.dropdown-menu').forEach(m => m !== menu && m.classList.remove('show'));
            menu.classList.toggle('show');
        };
    });
};

// ---- Modo oscuro (ambos roles) ----
const applyDark = on => document.documentElement.classList.toggle('tm-dark', !!on);

const addDarkToggle = () => {
    const container = $('.modern-header-container');
    if (!container || $('#tmDarkToggle')) return;
    const btn = document.createElement('button');
    btn.id = 'tmDarkToggle';
    btn.className = 'modern-nav-item tm-dark-toggle';
    const render = () => {
        const dark = document.documentElement.classList.contains('tm-dark');
        btn.title = dark ? 'Modo claro' : 'Modo oscuro';
        btn.innerHTML = dark ? svg('sun') : svg('moon');
    };
    render();
    btn.onclick = () => {
        const on = !document.documentElement.classList.contains('tm-dark');
        applyDark(on);
        saveValue('darkMode', on);
        render();
    };
    const userMenu = container.querySelector(':scope > .dropdown-container');
    if (userMenu) container.insertBefore(btn, userMenu);
    else container.appendChild(btn);
};

// ---- Header del LÍDER ----
const getLeaderInfo = () => {
    const box = $('.info-box.alumno');
    const userName = box?.querySelector('p b')?.textContent?.trim() || 'Líder';
    let tipo = '';
    box?.querySelectorAll('h5').forEach(h5 => {
        if (h5.textContent.trim() === 'Tipo') tipo = h5.nextElementSibling?.querySelector('b')?.textContent?.trim() || '';
    });
    return {userName, userInitial: userName.charAt(0).toUpperCase(), tipo};
};

// Rellena el menú desplegable "Por Alumno" con los alumnos cacheados
const buildPorAlumnoMenu = () => {
    const list = $('#alumnoList');
    const btn = $('#porAlumnoDropdown');
    if (!list || !btn) return;
    const students = getValue('leaderStudents', []) || [];

    // Sin cache aún: el botón lleva a la lista completa
    if (!students.length) {
        const menu = $('#porAlumnoMenu');
        if (menu) menu.classList.remove('show');
        btn.onclick = e => { e.stopPropagation(); location.href = 'elige_alumno.php'; };
        list.innerHTML = `<a href="elige_alumno.php" class="dropdown-item alumno-empty">Abrir lista de alumnos…</a>`;
        return;
    }

    // Agrupar por campus, ordenar por nombre
    const byCampus = new Map();
    students.forEach(s => {
        if (!byCampus.has(s.campus)) byCampus.set(s.campus, []);
        byCampus.get(s.campus).push(s);
    });

    list.innerHTML = '';
    [...byCampus.keys()].sort().forEach(campus => {
        if (campus) {
            const head = document.createElement('div');
            head.className = 'alumno-campus-head';
            head.textContent = campus;
            list.appendChild(head);
        }
        byCampus.get(campus)
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .forEach(s => {
                const a = document.createElement('a');
                a.href = `ver_actividades_alumno_calificar.php?matricula=${encodeURIComponent(s.matricula)}`;
                a.className = 'dropdown-item alumno-item';
                a.dataset.search = `${s.nombre} ${s.matricula}`.toLowerCase();
                const name = document.createElement('span');
                name.className = 'alumno-name';
                name.textContent = s.nombre;
                const right = document.createElement('span');
                right.className = 'alumno-right';
                if (s.pendientes > 0) {
                    const cnt = document.createElement('span');
                    cnt.className = 'alumno-count';
                    cnt.textContent = s.pendientes;
                    cnt.title = `${s.pendientes} por revisar`;
                    right.appendChild(cnt);
                }
                const mat = document.createElement('span');
                mat.className = 'alumno-mat';
                mat.textContent = s.matricula;
                right.appendChild(mat);
                a.appendChild(name);
                a.appendChild(right);
                list.appendChild(a);
            });
    });

    // Búsqueda dentro del menú
    const search = $('#alumnoSearch');
    if (search && !search.dataset.wired) {
        search.dataset.wired = '1';
        search.addEventListener('click', e => e.stopPropagation());
        search.addEventListener('input', () => {
            const q = search.value.trim().toLowerCase();
            list.querySelectorAll('.alumno-item').forEach(it => {
                it.style.display = it.dataset.search.includes(q) ? '' : 'none';
            });
            list.querySelectorAll('.alumno-campus-head').forEach(h => {
                let next = h.nextElementSibling, any = false;
                while (next && !next.classList.contains('alumno-campus-head')) {
                    if (next.classList.contains('alumno-item') && next.style.display !== 'none') { any = true; break; }
                    next = next.nextElementSibling;
                }
                h.style.display = any ? '' : 'none';
            });
        });
    }
};

const createLeaderHeader = () => {
    const {userName, userInitial, tipo} = getLeaderInfo();
    const header = document.createElement('div');
    header.className = 'modern-header';
    header.innerHTML = `
        <div class="modern-header-container">
            <div class="modern-header-left">
                <a href="index.php" class="modern-logo"><img src="../img/Logo_ST.svg" alt="StoryTellers Logo"></a>
                <a href="https://www.instagram.com/storytellers.tec" target="_blank" class="modern-instagram">${svg('instagram')}<span>@storytellers.tec</span></a>
            </div>
            <nav class="modern-nav">
                <a href="index.php" class="modern-nav-item">${svg('home')}<span>Inicio</span></a>
                <a href="ver_actividades.php" class="modern-nav-item">${svg('activities')}<span>Actividades</span></a>
                <a href="ver_pendientes.php" class="modern-nav-item">${svg('clock')}<span>Pendientes</span></a>
                <a href="ver_validadas.php" class="modern-nav-item">${svg('check')}<span>Validadas</span></a>
                <div class="dropdown-container" id="porAlumnoContainer">
                    <button class="modern-nav-item" id="porAlumnoDropdown">${svg('users')}<span>Por Alumno</span>${svg('chevron', 'chevron')}</button>
                    <div class="dropdown-menu alumno-dropdown" id="porAlumnoMenu">
                        <div class="alumno-search-wrap">${svg('search')}<input type="text" class="alumno-search" id="alumnoSearch" placeholder="Buscar alumno..."></div>
                        <div class="alumno-list" id="alumnoList"></div>
                    </div>
                </div>
            </nav>
            <div class="dropdown-container">
                <button class="modern-user-menu" id="userDropdown">
                    <span class="modern-avatar">${userInitial}</span>
                    <span class="modern-username">${userName.split(' ')[0]}</span>
                    ${svg('chevron', 'chevron')}
                </button>
                <div class="dropdown-menu user-dropdown" id="userMenu">
                    <div class="user-info"><div class="user-details"><p class="user-name">${userName}</p><p class="user-campus">${tipo}</p></div></div>
                    <div class="dropdown-divider"></div>
                    <a href="../index.php" class="dropdown-item logout-item">${svg('logout')}Salir</a>
                </div>
            </div>
        </div>`;
    document.body.insertBefore(header, document.body.firstChild);
    setupDropdowns();
    buildPorAlumnoMenu();
};

const createHeader = () => {
    if (!$('.header') || $('.modern-header')) return;
    if (isLider) return createLeaderHeader();
    {
        const {userName, userInitial, grado, campus, lider, email} = getUserInfo();
        const header = document.createElement('div');
        header.className = 'modern-header';
        header.innerHTML = `
            <div class="modern-header-container">
                <div class="modern-header-left">
                    <a href="index.php" class="modern-logo"><img src="../img/Logo_ST.svg" alt="StoryTellers Logo"></a>
                    <a href="https://www.instagram.com/storytellers.tec" target="_blank" class="modern-instagram">${svg('instagram')}<span>@storytellers.tec</span></a>
                </div>
                <nav class="modern-nav">
                    <a href="reporte_general.php" class="modern-nav-item">${svg('home')}<span>Inicio</span></a>
                    <a href="formulario_actividad.php" class="modern-nav-item">${svg('register')}<span>Registrar</span></a>
                    <a href="compromiso.php" class="modern-nav-item">${svg('commitments')}<span>Compromisos</span></a>
                    <div class="dropdown-container">
                        <button class="modern-nav-item" id="activitiesDropdown">${svg('activities')}<span>Actividades</span>${svg('chevron', 'chevron')}</button>
                        <div class="dropdown-menu activities-dropdown" id="activitiesMenu">
                            <a href="ver_actividades.php" class="dropdown-item">Mis Actividades</a>
                            <a href="ver_borradores.php" class="dropdown-item">Mis Borradores</a>
                            <a href="ver_pendientes.php" class="dropdown-item">Por Validar</a>
                            <a href="ver_validadas.php" class="dropdown-item">Actividades Validadas</a>
                        </div>
                    </div>
                </nav>
                <div class="dropdown-container">
                    <button class="modern-user-menu" id="userDropdown">
                        <span class="modern-avatar">${userInitial}</span>
                        <span class="modern-username">${userName.split(' ')[0]}</span>
                        ${svg('chevron', 'chevron')}
                    </button>
                    <div class="dropdown-menu user-dropdown" id="userMenu">
                        <div class="user-info"><div class="user-details"><p class="user-name">${userName}</p><p class="user-campus">${campus} - ${grado}</p></div></div>
                        <div class="dropdown-divider"></div>
                        <div class="leader-info"><span class="leader-label">Líder</span><div class="leader-details"><p class="leader-name">${lider}</p><p class="leader-email">${email}</p></div></div>
                        <div class="dropdown-divider"></div>
                        <a href="../index.php" class="dropdown-item logout-item">${svg('logout')}Salir</a>
                    </div>
                </div>
            </div>`;

        document.body.insertBefore(header, document.body.firstChild);
        setupDropdowns();
    }
};

// ==================== TABLA Y CONTENIDO ====================
const modernizeTable = table => {
    if (!table || table.classList.contains('modernized')) return;
    table.className = 'modern-table modernized';

    // Setup structure
    let thead = table.querySelector('thead');
    if (!thead) {
        thead = document.createElement('thead');
        const firstRow = table.querySelector('tr');
        if (firstRow?.querySelector('th')) {
            table.insertBefore(thead, table.firstChild);
            thead.appendChild(firstRow);
        }
    }
    thead.className = 'modern-thead';

    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        Array.from(table.querySelectorAll('tr')).slice(1).forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
    }
    tbody.className = 'modern-tbody';

    // Modernize content
    thead.querySelectorAll('tr').forEach(row => {
        row.className = 'modern-header-row';
        row.querySelectorAll('th').forEach(th => th.className = 'modern-th');
    });

    tbody.querySelectorAll('tr').forEach(row => {
        row.className = 'modern-row';
        row.querySelectorAll('td').forEach(td => {
            td.className = 'modern-td';

            // Fix buttons
            td.querySelectorAll('.btn, input[type="submit"]').forEach(btn => {
                if (btn.classList.contains('btn')) {
                    const type = btn.classList.contains('btn-success') ? 'success' :
                                btn.classList.contains('btn-primary') ? 'primary' :
                                btn.classList.contains('btn-warning') ? 'warning' :
                                btn.classList.contains('btn-danger') ? 'warning' : 'default';
                    const badge = document.createElement('span');
                    badge.className = `modern-badge modern-badge-${type}`;
                    badge.textContent = btn.textContent;

                    if (btn.href) {
                        const link = document.createElement('a');
                        link.href = btn.href;
                        link.style.textDecoration = 'none';
                        link.appendChild(badge);
                        btn.parentNode.replaceChild(link, btn);
                    } else {
                        btn.parentNode.replaceChild(badge, btn);
                    }
                } else if (btn.tagName === 'INPUT' && btn.type === 'submit') {
                    btn.className = btn.className.replace(/boton\d+/g, '');
                    const isDel = btn.value.toLowerCase().includes('borrar');
                    btn.className += isDel ? ' modern-form-btn modern-form-btn-secondary' : ' modern-form-btn modern-form-btn-primary';
                    if (isDel) btn.style.cssText += 'background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important; color: white !important;';

                    const onclick = btn.getAttribute('onclick');
                    if (onclick?.includes('form.action')) {
                        const url = onclick.match(/this\.form\.action\s*=\s*['"]([^'"]+)['"]/)?.[1];
                        if (url) {
                            btn.removeAttribute('onclick');
                            btn.addEventListener('click', e => {
                                e.preventDefault();
                                if (isDel && !confirm('¿Estás seguro de que deseas borrar esta actividad?')) return;
                                window.location.href = url;
                            });
                        }
                    }
                }
            });
        });
    });
};

const modernizeContent = () => {
    const main = $('main.content');
    if (main && !main.classList.contains('modernized')) {
        main.classList.add('modernized');
        const h3 = main.querySelector('h3');
        const title = h3?.textContent || 'Reporte General';
        if (h3) h3.remove();
        const table = main.querySelector('table');

        main.innerHTML = `<div class="modern-card"><div class="modern-card-header"><h2 class="modern-title">${title}</h2></div><div class="modern-card-content"><div class="modern-table-container"></div></div></div>`;

        if (table) {
            modernizeTable(table);
            $('.modern-table-container').appendChild(table);
        }
    }
};

// ==================== EDITAR ACTIVIDAD (clonar + borrar) ====================
// El portal no permite editar una actividad "POR REVISAR" (solo borradores via
// formulario_editar.php). Solución: leer los datos de ver_actividad.php, crear una
// actividad nueva en formulario_actividad.php con esos datos y borrar la original.

const SPANISH_MONTHS = {enero:1, febrero:2, marzo:3, abril:4, mayo:5, junio:6, julio:7, agosto:8, septiembre:9, setiembre:9, octubre:10, noviembre:11, diciembre:12};

// "22 de junio de 2026" -> "2026-06-22"
const parseSpanishDate = txt => {
    const m = (txt || '').toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/);
    if (!m) return '';
    const mes = SPANISH_MONTHS[m[2]];
    if (!mes) return '';
    return `${m[3]}-${String(mes).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
};

// Lee los campos de la tabla de ver_actividad.php (ya modernizada) por etiqueta
const scrapeActivityDetail = () => {
    const fields = {};
    let evid = 0;
    $$('main.content .modern-table tr').forEach(tr => {
        const cells = tr.cells;
        if (!cells || cells.length < 2) return;
        const label = (cells[0].textContent || '').toLowerCase().trim();
        const valCell = cells[1];
        const text = (valCell.textContent || '').trim();
        if (label.includes('fecha de la actividad')) fields.cuando = parseSpanishDate(text);
        else if (label.includes('tipo de actividad')) fields.tipo = text;
        else if (label.includes('módulo') || label.includes('modulo')) fields.modulo_aprendizaje = text;
        else if (label.includes('categoría') || label.includes('categoria')) fields.categoria = text;
        else if (label.includes('nombre del evento')) fields.nombre_evento = text;
        else if (label.includes('descripción') || label.includes('descripcion')) fields.descripcion = text;
        else if (label.includes('ubicación') || label.includes('ubicacion')) fields.ubicacion_evento = text;
        else if (label.includes('tiempo invertido')) { const n = parseFloat(text); if (!isNaN(n)) fields.horas_realizadas = n.toFixed(2); }
        else if (label.includes('publicó') || label.includes('publico')) fields.publicacion_tec = /^s/i.test(text) ? '1' : '0';
        else if (label.includes('evidencia')) {
            evid++;
            const a = valCell.querySelector('a');
            fields['evidencia_' + evid] = (a ? (a.textContent.trim() || a.getAttribute('href') || '') : text).trim();
        }
    });
    return fields;
};

// Agrega el botón "Editar" en ver_actividad.php (solo si aún es borrable / POR REVISAR)
const addEditToActivityDetail = () => {
    if (!location.pathname.includes('ver_actividad.php')) return;
    const borrar = $('main.content input[name="Borrar"]');
    if (!borrar || $('#tmEditActivity')) return;

    const titleTxt = $('main.content .modern-title')?.textContent || '';
    const oldId = titleTxt.match(/\((\d+)\)/)?.[1];
    if (!oldId) return;

    // URL de borrado: del onclick original (antes de que fixButtons lo limpie) o reconstruida
    const onclick = borrar.getAttribute('onclick') || '';
    const deleteUrl = onclick.match(/this\.form\.action\s*=\s*['"]([^'"]+)['"]/)?.[1]
        || `eliminar_actividad.php?id_actividad=${oldId}`;

    const btn = document.createElement('button');
    btn.id = 'tmEditActivity';
    btn.type = 'button';
    btn.className = 'modern-form-btn modern-form-btn-primary';
    btn.innerHTML = `${svg('register')}Editar`;
    btn.onclick = () => {
        const fields = scrapeActivityDetail();
        saveValue('editClone', {oldId, deleteUrl, fields, ts: Date.now()});
        window.location.href = 'formulario_actividad.php';
    };
    // Los .modern-form-btn son display:flex (bloque): para que Editar y Borrar
    // queden lado a lado y centrados, los envuelvo en una fila flex.
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap';
    borrar.parentNode.insertBefore(row, borrar);
    row.appendChild(btn);
    row.appendChild(borrar);
    // El CSS le pone `margin:0 auto` al Borrar; dentro del flex ese auto se come el
    // espacio libre y empuja a Editar. Lo anulamos.
    borrar.style.margin = '0';
};

// Tras crear la copia, ofrece borrar la original (en una página que NO sea el formulario)
const processPendingDelete = () => {
    const pd = getValue('pendingDelete', null);
    if (!pd) return;
    // No borrar si seguimos en un formulario (p. ej. el alta rebotó con errores de validación)
    if ($('main.content_agregar')) return;
    // Expira a los 15 min por seguridad
    if (!pd.ts || Date.now() - pd.ts > 15 * 60 * 1000) { saveValue('pendingDelete', null); return; }
    saveValue('pendingDelete', null); // consumir antes de navegar (evita repetir)
    if (confirm(`Se creó la actividad corregida. ¿Borrar ahora la actividad original (#${pd.oldId})?`)) {
        window.location.href = pd.deleteUrl;
    }
};

const modernizeForm = () => {
    const form = $('main.content_agregar');
    if (!form || form.classList.contains('modernized')) return;
    form.classList.add('modernized');

    const h3 = form.querySelector('h3');
    const title = h3?.textContent || 'Registrar actividad';
    const origForm = form.querySelector('form');
    const table = form.querySelector('table');

    if (!origForm || !table) return;

    // ===== Leer valores ya cargados del formulario original (modo edición) =====
    const fieldValue = name => origForm.querySelector(`[name="${name}"]`)?.value || '';
    const selectValue = name => {
        const sel = origForm.querySelector(`select[name="${name}"]`);
        return sel ? (sel.value || sel.querySelector('option[selected]')?.value || '') : '';
    };

    const idActividad = fieldValue('id_actividad');
    const isEdit = !!idActividad || location.pathname.includes('formulario_editar.php');

    const existing = {
        cuando: fieldValue('cuando'),
        horas_realizadas: selectValue('horas_realizadas'),
        tipo: selectValue('tipo'),
        modulo_aprendizaje: selectValue('modulo_aprendizaje'),
        categoria: selectValue('categoria'),
        ubicacion_evento: selectValue('ubicacion_evento'),
        nombre_evento: fieldValue('nombre_evento'),
        descripcion: origForm.querySelector('textarea[name="descripcion"]')?.value || '',
        publicacion_tec: origForm.querySelector('input[name="publicacion_tec"]:checked')?.value ?? '0',
        evidencia_1: fieldValue('evidencia_1'),
        evidencia_2: fieldValue('evidencia_2'),
        evidencia_3: fieldValue('evidencia_3')
    };

    // Errores de validación que el servidor devuelve junto a cada campo
    // (<font color="red"><b>mensaje</b></font> dentro de la misma celda)
    const errors = {};
    Object.keys(existing).forEach(name => {
        const msg = origForm.querySelector(`[name="${name}"]`)
            ?.closest('td')?.querySelector('font[color="red"] b')?.textContent.trim();
        if (msg) errors[name] = msg;
    });

    // Acciones reales tomadas de los botones originales (registrar_* o editar_*)
    const btnAction = btnName => origForm.querySelector(`input[name="${btnName}"]`)
        ?.getAttribute('onclick')?.match(/this\.form\.action\s*=\s*['"]([^'"]+)['"]/)?.[1];
    const actions = {
        Borrador: btnAction('Borrador') || (isEdit ? 'editar_borrador.php' : 'registrar_borrador.php'),
        Registrar: btnAction('Registrar') || (isEdit ? 'editar_actividad.php' : 'registrar_actividad.php'),
        Borrar: btnAction('Borrar')
    };

    const matricula = fieldValue('matricula');
    const periodo = fieldValue('id_periodo');
    const periodoDisplay = /^\d{4}$/.test(periodo) ? `${periodo}-${+periodo + 1}` : periodo;

    // En edición usa la fecha guardada de la actividad; si no, la más reciente / la recordada
    let defaultDate = existing.cuando || getMostRecentActivityDate() || getLastActivityDate() || '';

    const timeOptions = Array.from({length: 24}, (_, i) => {
        const h = (i + 1) * 0.5;
        const hrs = Math.floor(h);
        const min = (h % 1) * 60;
        const val = h.toFixed(2);
        return `<option value="${val}"${val === existing.horas_realizadas ? ' selected' : ''}>${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} hrs</option>`;
    }).join('');

    const selectOptions = (items, selected) => items.map(item => `<option value="${item}"${item === selected ? ' selected' : ''}>${item}</option>`).join('');

    form.innerHTML = `
        <div class="modern-form-container">
            <div class="modern-form-header">
                <h2 class="modern-form-title">${svg('register')}${title}</h2>
                <div id="dateMemoryIndicator" style="display: none; font-size: 12px; color: #059669; margin-left: auto;">
                    ✓ Usando fecha de actividad reciente
                </div>
            </div>
            <div class="modern-form-content">
                <form method="${origForm.method || 'post'}" action="${origForm.action || ''}" id="modernForm">
                    ${isEdit ? `<input type="hidden" name="id_actividad" value="${idActividad}">` : ''}
                    <div class="modern-info-row">
                        <div class="modern-info-item"><span class="modern-info-label">Matrícula</span><span class="modern-info-value">${matricula}</span><input type="hidden" name="matricula" value="${matricula}"></div>
                        <div class="modern-info-item"><span class="modern-info-label">Periodo</span><span class="modern-info-value">${periodoDisplay}</span><input type="hidden" name="id_periodo" value="${periodo}"></div>
                    </div>
                    <div class="modern-form-grid">
                        <div class="modern-form-group">
                            <label class="modern-form-label required">Fecha de la actividad</label>
                            <input type="date" name="cuando" class="modern-input" id="activityDateInput" value="${defaultDate}" required>
                            <small style="color: #6b7280; font-size: 12px; margin-top: 4px; display: block;">
                                La fecha se recordará para la próxima vez
                            </small>
                        </div>
                        <div class="modern-form-group"><label class="modern-form-label required">Tiempo invertido</label><select name="horas_realizadas" class="modern-select" required><option value="">Seleccionar...</option>${timeOptions}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">¿Qué tipo de actividad?</label><select name="tipo" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Cobertura de evento local','Cobertura de evento nacional','Contenido para Instagram / Facebook','Contenido para Tik Tok','Contenido para Proyecto Especial','Diseño gráfico','Edición de video','Grabación de video','Nota para CONECTA','Sesión de fotos','Actividades de oficina','Bootcamp','Junta','Otro'], existing.tipo)}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Módulo de Aprendizaje</label><select name="modulo_aprendizaje" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Producción audiovisual','Comunicación oral','Redacción','Narrativa visual','Cobertura de eventos'], existing.modulo_aprendizaje)}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Categoría</label><select name="categoria" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Academia / Profesores','Arte y Cultura','Deportes','Vida estudiantil','Eventos institucionales','Proyecto nacional','Proyecto laboral (exclusivo UN)','Otro'], existing.categoria)}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Ubicación</label><select name="ubicacion_evento" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Campus','Casa','Otro'], existing.ubicacion_evento)}</select></div>
                        <div class="modern-form-group full-width"><label class="modern-form-label required">Nombre del evento</label><input type="text" name="nombre_evento" class="modern-input" required></div>
                        <div class="modern-form-group full-width"><label class="modern-form-label required">Descripción del evento</label><textarea name="descripcion" class="modern-textarea" rows="5" required></textarea></div>
                        <div class="modern-form-group full-width">
                            <label class="modern-form-label">¿El contenido se publicó en alguna plataforma digital del Tec?</label>
                            <div class="modern-radio-group">
                                <label class="modern-radio-item"><input type="radio" name="publicacion_tec" value="0" class="modern-radio-input" checked><span class="modern-radio-label">No</span></label>
                                <label class="modern-radio-item"><input type="radio" name="publicacion_tec" value="1" class="modern-radio-input"><span class="modern-radio-label">Sí</span></label>
                            </div>
                        </div>
                        ${Array.from({length: 3}, (_, i) => `<div class="modern-form-group full-width"><label class="modern-form-label">Link de evidencia ${i + 1}</label><input type="text" name="evidencia_${i + 1}" class="modern-input" placeholder="Ingresa URL, enlace o descripción de la evidencia"></div>`).join('')}
                    </div>
                    <div class="modern-form-actions">
                        <button type="submit" name="Borrador" class="modern-form-btn modern-form-btn-secondary">${svg('register')}Guardar Borrador</button>
                        <button type="submit" name="Registrar" class="modern-form-btn modern-form-btn-primary">${svg('register')}${isEdit ? 'Actualizar Actividad' : 'Registrar Actividad'}</button>
                        ${actions.Borrar ? `<button type="submit" name="Borrar" class="modern-form-btn" style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);color:#fff">${svg('register')}Borrar</button>` : ''}
                    </div>
                </form>
            </div>
        </div>`;

    // Mostrar indicador si se está usando una fecha guardada (no aplica al editar)
    if (defaultDate && !isEdit) {
        const indicator = $('#dateMemoryIndicator');
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        }
    }

    // Setup form handlers
    const newForm = $('#modernForm');
    const dateInput = $('#activityDateInput');

    if (newForm) {
        // Rellenar los campos de texto libre con los valores existentes (modo edición).
        // Se asignan por propiedad para no romper el HTML ni arriesgar inyección.
        ['nombre_evento', 'evidencia_1', 'evidencia_2', 'evidencia_3'].forEach(name => {
            const field = newForm.querySelector(`[name="${name}"]`);
            if (field) field.value = existing[name];
        });
        const descripcionField = newForm.querySelector('textarea[name="descripcion"]');
        if (descripcionField) descripcionField.value = existing.descripcion;
        const pubRadio = newForm.querySelector(`input[name="publicacion_tec"][value="${existing.publicacion_tec}"]`);
        if (pubRadio) pubRadio.checked = true;

        // ===== Modo "clonar" (editar una actividad por revisar) =====
        // Si venimos de "Editar" en ver_actividad.php, precargamos los datos de la
        // actividad original. Al registrar se crea una nueva y se borra la vieja.
        let cloneInfo = null;
        const clone = !isEdit ? getValue('editClone', null) : null;
        if (clone && clone.ts && Date.now() - clone.ts < 15 * 60 * 1000) {
            cloneInfo = {oldId: clone.oldId, deleteUrl: clone.deleteUrl};
            saveValue('editClone', null); // consumir una sola vez
            const f = clone.fields || {};
            const setVal = (name, val) => {
                if (val == null) return;
                const el = newForm.querySelector(`[name="${name}"]`);
                if (el) el.value = val;
            };
            ['cuando', 'horas_realizadas', 'tipo', 'modulo_aprendizaje', 'categoria',
             'ubicacion_evento', 'nombre_evento', 'evidencia_1', 'evidencia_2', 'evidencia_3']
                .forEach(name => setVal(name, f[name]));
            const desc = newForm.querySelector('textarea[name="descripcion"]');
            if (desc) desc.value = f.descripcion || '';
            const pr = newForm.querySelector(`input[name="publicacion_tec"][value="${f.publicacion_tec || '0'}"]`);
            if (pr) pr.checked = true;

            // Aviso visible de que estamos editando (clonando + borrando)
            const banner = document.createElement('div');
            banner.className = 'tm-clone-banner';
            banner.textContent = `Editando la actividad original #${clone.oldId}: al guardar se creará la versión corregida y luego se te pedirá borrar la original.`;
            newForm.insertBefore(banner, newForm.firstChild);

            // El botón principal cambia de texto para dejar claro el flujo
            const regBtn = newForm.querySelector('button[name="Registrar"]');
            if (regBtn) regBtn.innerHTML = `${svg('register')}Guardar cambios y borrar original`;
        }

        // Mostrar los errores de validación devueltos por el servidor
        let firstErrorField = null;
        Object.entries(errors).forEach(([name, msg]) => {
            const field = newForm.querySelector(`[name="${name}"]`);
            if (!field) return;
            field.style.borderColor = '#ef4444';
            const group = field.closest('.modern-form-group') || field.parentNode;
            if (!group.querySelector('.error-message')) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = msg;
                group.appendChild(error);
            }
            if (!firstErrorField) firstErrorField = field;
        });
        if (firstErrorField) firstErrorField.scrollIntoView({behavior: 'smooth', block: 'center'});

        // Guardar la fecha cuando cambie
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                if (this.value) {
                    saveLastActivityDate(this.value);
                }
            });
        }

        const validate = () => {
            let valid = true;
            newForm.querySelectorAll('.error-message').forEach(msg => msg.remove());
            newForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#ef4444';
                    const error = document.createElement('span');
                    error.className = 'error-message';
                    error.textContent = 'Este campo es requerido';
                    field.parentNode.appendChild(error);
                } else {
                    field.style.borderColor = '#d1d5db';
                }
            });
            if (!valid) {
                newForm.querySelector('[required]:invalid, [required][style*="border-color: rgb(239, 68, 68)"]')?.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            return valid;
        };

        const submitForm = (action, name) => {
            // Guardar la fecha antes de enviar el formulario
            if (dateInput && dateInput.value) {
                saveLastActivityDate(dateInput.value);
            }

            newForm.action = action;
            const hidden = document.createElement('input');
            Object.assign(hidden, {type: 'hidden', name, value: name});
            newForm.appendChild(hidden);
            newForm.submit();
        };

        newForm.querySelector('button[name="Borrador"]')?.addEventListener('click', e => {
            e.preventDefault();
            submitForm(actions.Borrador, 'Borrador');
        });

        newForm.querySelector('button[name="Registrar"]')?.addEventListener('click', e => {
            e.preventDefault();
            if (!validate()) return;
            // En modo clonar: marca la original para borrarla tras crear la copia
            if (cloneInfo) saveValue('pendingDelete', {oldId: cloneInfo.oldId, deleteUrl: cloneInfo.deleteUrl, ts: Date.now()});
            submitForm(actions.Registrar, 'Registrar');
        });

        newForm.querySelector('button[name="Borrar"]')?.addEventListener('click', e => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que deseas borrar esta actividad?')) submitForm(actions.Borrar, 'Borrar');
        });

        newForm.addEventListener('submit', e => {
            if (!validate()) e.preventDefault();
        });

        newForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '#d1d5db';
                this.parentNode.querySelector('.error-message')?.remove();
            });
        });
    }
};

// ==================== TABLA INTERACTIVA ====================
const initTable = () => {
    const page = location.pathname.split('/').pop();
    if (!cfg.pages.some(p => page.includes(p))) return;

    const table = $('.table-striped') || $('.modern-table');
    const tbody = table?.querySelector('tbody');
    if (!table || !tbody || $('.tm-ctrl')) return;

    // Obtener nombre de página para guardar configuración específica
    const pageName = page.replace('.php', '');

    const rows = Array.from(tbody.querySelectorAll('tr'));
    let headerRow = rows.find(row => row.querySelector('th') || row.classList.contains('bg_morado22'));
    let dataRows = rows.filter(row => row !== headerRow);

    if (!headerRow && rows.length > 0) {
        const firstRow = rows[0];
        const hasData = Array.from(firstRow.cells).some(cell => {
            const text = cell.textContent.trim();
            return /\d+\s*\|\s*(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)/.test(text) || /^\d+(\.\d+)?$/.test(text) || /^\d+,\d+$/.test(text);
        });
        if (hasData) {
            headerRow = null;
            dataRows = rows;
        } else {
            headerRow = firstRow;
            dataRows = rows.slice(1);
        }
    }

    if (dataRows.length === 0) return;

    const original = dataRows.slice();
    let current = original.slice();
    const isActividades = location.pathname.includes('ver_actividades.php');

    const getHours = (rows, includePending) => rows.reduce((sum, row) => {
        if (!includePending && isActividades && row.cells[9]?.querySelector('.modern-badge-warning')) return sum;
        const hoursText = row.cells[2]?.textContent.replace(',', '.');
        return sum + (parseFloat(hoursText) || 0);
    }, 0);

    const render = rows => {
        tbody.innerHTML = '';
        if (headerRow) tbody.appendChild(headerRow);
        tbody.append(...rows.map(r => (r.style.display = '', r)));
        current = rows.slice();
        updateHours();
    };

    const sort = (asc = true) => original.slice().sort((a, b) => {
        const diff = (parseDate(a.cells[1]?.textContent)?.getTime() || 0) - (parseDate(b.cells[1]?.textContent)?.getTime() || 0);
        return asc ? diff : -diff;
    });

    const showSemester = () => {
        const [sem1, sem2] = [[], []];
        original.forEach(r => {
            const date = parseDate(r.cells[1]?.textContent);
            if (date) (date.getMonth() >= 7 ? sem1 : sem2).push(r);
        });

        [sem1, sem2].forEach(sem => sem.sort((a, b) => (parseDate(a.cells[1]?.textContent)?.getTime() || 0) - (parseDate(b.cells[1]?.textContent)?.getTime() || 0)));

        tbody.innerHTML = '';
        if (headerRow) tbody.appendChild(headerRow);

        [['▶ Semestre Agosto-Diciembre', sem1], ['▶ Semestre Enero-Julio', sem2]].forEach(([title, rows]) => {
            const tr = tbody.appendChild(document.createElement('tr'));
            const td = tr.appendChild(document.createElement('td'));
            Object.assign(td, {
                colSpan: headerRow?.children.length || 10,
                textContent: title,
                style: 'font-weight:600;background:#f1f5f9;cursor:pointer;padding:12px;border-radius:6px',
                onclick: () => {
                    const expanded = td.dataset.expanded === 'true';
                    td.dataset.expanded = !expanded;
                    td.textContent = (expanded ? '▶ ' : '▼ ') + title.slice(2);
                    rows.forEach(r => r.style.display = expanded ? 'none' : '');
                }
            });
            td.dataset.expanded = 'false';
            rows.forEach(r => {
                r.style.display = 'none';
                tbody.appendChild(r);
            });
        });

        current = original.slice();
        updateHours();
    };

    const filter = (saveConfig = true) => {
        const from = fromInput.value ? new Date(fromInput.value) : null;
        const to = toInput.value ? new Date(toInput.value) : null;
        const base = selector.value === 'asc' ? sort() : selector.value === 'desc' ? sort(false) : original.slice();
        const filtered = base.filter(row => {
            const date = parseDate(row.cells[1]?.textContent);
            return date && (!from || date >= from) && (!to || date <= to);
        });

        tbody.innerHTML = '';
        if (headerRow) tbody.appendChild(headerRow);
        tbody.append(...filtered.map(r => (r.style.display = '', r)));
        current = filtered.slice();
        updateHours();

        // Guardar configuración después de filtrar
        if (saveConfig) {
            saveCurrentConfig();
        }
    };

    const reset = (saveConfig = true) => {
        fromInput.value = toInput.value = '';
        if (checkbox) checkbox.checked = true;
        const mode = selector.value;
        if (mode === 'asc') render(sort());
        else if (mode === 'desc') render(sort(false));
        else if (mode === 'semester') showSemester();
        else render(original.slice());

        // Guardar configuración después de limpiar
        if (saveConfig) {
            saveCurrentConfig();
        }
    };

    const updateHours = () => {
        const include = !isActividades || !checkbox || checkbox.checked;
        hours.textContent = `Horas: ${getHours(current, include).toFixed(2)}`;
    };

    // Función para guardar la configuración actual
    const saveCurrentConfig = () => {
        const config = {
            viewMode: selector.value,
            fromDate: fromInput.value,
            toDate: toInput.value,
            includePending: checkbox ? checkbox.checked : true
        };
        saveTableControls(pageName, config);
    };

    // Create controls
    const ctrl = document.createElement('div');
    ctrl.className = 'tm-ctrl';
    ctrl.innerHTML = `
        <label for="sel">Ver:</label>
        <select id="sel">
            <option value="default">Layout por defecto</option>
            <option value="asc">Fecha ascendente (Ene → Dic)</option>
            <option value="desc">Fecha descendente (Dic → Ene)</option>
            <option value="semester">Semestre (listas colapsables)</option>
        </select>
        <label>Desde:</label><input type="date" id="from">
        <label>Hasta:</label><input type="date" id="to">
        <button class="tm-btn tm-btn-p">Filtrar</button>
        <button class="tm-btn tm-btn-s">Limpiar</button>
        ${isActividades ? `<div class="tm-tgl"><div class="tm-sw"><input type="checkbox" checked><span class="tm-slider"></span></div><span>Incluir pendientes</span></div>` : ''}
        <span class="tm-hrs"></span>
    `;

    const selector = ctrl.querySelector('#sel');
    const fromInput = ctrl.querySelector('#from');
    const toInput = ctrl.querySelector('#to');
    const filterBtn = ctrl.querySelector('.tm-btn-p');
    const resetBtn = ctrl.querySelector('.tm-btn-s');
    const checkbox = ctrl.querySelector('input[type="checkbox"]');
    const hours = ctrl.querySelector('.tm-hrs');
    const toggle = ctrl.querySelector('.tm-tgl');
    const memoryIndicator = ctrl.querySelector('.tm-memory');

    filterBtn.onclick = () => filter(true);
    resetBtn.onclick = () => reset(true);

    if (checkbox) {
        checkbox.onchange = () => {
            updateHours();
            saveCurrentConfig();
        };
        toggle?.addEventListener('click', e => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                updateHours();
                saveCurrentConfig();
            }
        });
    }

    selector.onchange = () => {
        // No pasar saveConfig a reset porque vamos a guardar después
        reset(false);
        const mode = selector.value;
        if (mode === 'asc') render(sort());
        else if (mode === 'desc') render(sort(false));
        else if (mode === 'semester') showSemester();
        else render(original.slice());

        // Guardar configuración después de cambiar el modo
        saveCurrentConfig();
    };

    // Guardar configuración cuando cambian las fechas
    fromInput.addEventListener('change', saveCurrentConfig);
    toInput.addEventListener('change', saveCurrentConfig);

    const tableContainer = table.closest('.modern-table-container') || table.parentNode;
    tableContainer.parentNode.insertBefore(ctrl, tableContainer);

    // Cargar configuración guardada
    const savedConfig = getTableControls(pageName);

    if (savedConfig) {
        // Restaurar valores guardados
        selector.value = savedConfig.viewMode || 'default';
        fromInput.value = savedConfig.fromDate || '';
        toInput.value = savedConfig.toDate || '';
        if (checkbox) {
            checkbox.checked = savedConfig.includePending !== false;
        }

        // Mostrar indicador de configuración restaurada
        if (memoryIndicator) {
            memoryIndicator.style.display = 'inline';
            setTimeout(() => {
                memoryIndicator.style.display = 'none';
            }, 3000);
        }

        // Aplicar la vista guardada
        const mode = selector.value;
        if (mode === 'asc') render(sort());
        else if (mode === 'desc') render(sort(false));
        else if (mode === 'semester') showSemester();
        else render(original.slice());

        // Si hay fechas guardadas, aplicar el filtro
        if (savedConfig.fromDate || savedConfig.toDate) {
            filter(false); // No guardar de nuevo al restaurar
        }
    } else {
        // Sin configuración guardada, mostrar vista por defecto
        render(original.slice());
    }
};

// ==================== PÁGINAS DE LÍDER ====================

// Lista de alumnos disponibles (index.php / elige_alumno.php): una tabla por campus
const modernizeLeaderList = () => {
    const main = $('main.content');
    if (!main || main.classList.contains('modernized')) return;
    main.classList.add('modernized');

    const title = main.querySelector('h3')?.textContent?.trim() || 'Alumnos Disponibles';

    const groups = [];
    main.querySelectorAll('h2').forEach(h2 => {
        const campus = h2.textContent.replace(/Campus:/i, '').trim();
        const sib = h2.nextElementSibling;
        const table = sib?.matches?.('table') ? sib : sib?.querySelector?.('table');
        if (table) groups.push({campus, table});
    });

    // Cachear alumnos (matrícula + nombre + campus + nº por revisar) para el menú "Por Alumno"
    const students = [];
    const byMat = new Map();
    const counts = new Map();
    groups.forEach(({campus, table}) => {
        table.querySelectorAll('a[href*="ver_actividades_alumno_calificar"]').forEach(a => {
            const m = (a.getAttribute('href') || '').match(/matricula=([^&]+)/);
            if (!m) return;
            const matricula = decodeURIComponent(m[1]);
            if (/warning/.test(a.className || '')) {
                // El botón amarillo lleva el número de actividades por revisar
                const n = parseInt(a.textContent.trim(), 10);
                if (!isNaN(n)) counts.set(matricula, n);
            } else if (!byMat.has(matricula)) {
                const nombre = a.closest('td')?.nextElementSibling?.textContent?.trim() || matricula;
                const s = {matricula, nombre, campus};
                byMat.set(matricula, s);
                students.push(s);
            }
        });
    });
    students.forEach(s => { s.pendientes = counts.get(s.matricula) || 0; });
    if (students.length) {
        saveValue('leaderStudents', students);
        buildPorAlumnoMenu();
    }

    main.innerHTML = `<div class="modern-card"><div class="modern-card-header"><h2 class="modern-title">${title}</h2></div><div class="modern-card-content" id="leaderGroups"></div></div>`;
    const container = $('#leaderGroups');

    groups.forEach(({campus, table}) => {
        const section = document.createElement('div');
        section.className = 'lider-campus-section';
        const heading = document.createElement('h3');
        heading.className = 'lider-campus-title';
        heading.innerHTML = `<span class="lider-campus-label">Campus:</span> `;
        heading.appendChild(document.createTextNode(campus));
        section.appendChild(heading);
        const wrap = document.createElement('div');
        wrap.className = 'modern-table-container';
        modernizeTable(table);
        wrap.appendChild(table);
        section.appendChild(wrap);
        container.appendChild(section);
    });
};

// Construye una tarjeta de calificación con su propio <form> funcional
const buildGradeCard = (a) => {
    const card = document.createElement('div');
    card.className = 'lider-activity';

    const form = document.createElement('form');
    form.method = 'post';
    form.className = 'lider-activity-form';

    const evid = a.evidenciaHTML.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/g, '').trim();
    const ubicTiempo = [a.ubicacion, a.tiempo].filter(Boolean).join(' · ');

    form.innerHTML = `
        <input type="hidden" name="id_actividad" value="${a.idActividad}">
        <input type="hidden" name="matricula" value="${a.matricula}">
        <div class="lider-activity-head">
            <div class="lider-activity-meta">
                <span class="modern-badge modern-badge-primary">#${a.num}</span>
                <span class="modern-badge modern-badge-default">ID ${a.idActividad}</span>
                <span class="lider-date">${a.fecha}</span>
                <span class="lider-tipo">${a.tipo}</span>
            </div>
            <h3 class="lider-activity-title"></h3>
        </div>
        <div class="lider-activity-grid">
            <div class="lider-field"><span class="lider-label">Módulo</span><span class="lider-value" data-f="modulo"></span></div>
            <div class="lider-field"><span class="lider-label">Categoría</span><span class="lider-value" data-f="categoria"></span></div>
            <div class="lider-field"><span class="lider-label">Ubicación / Tiempo</span><span class="lider-value">${ubicTiempo || '—'}</span></div>
            <div class="lider-field"><span class="lider-label">Evidencia</span><span class="lider-value lider-evid">${evid || '—'}</span></div>
            <div class="lider-field lider-field-wide"><span class="lider-label">Descripción</span><span class="lider-value" data-f="descripcion"></span></div>
        </div>
        <div class="lider-grade-row"></div>
        <div class="lider-actions">
            <button type="submit" name="Registrar" class="modern-form-btn lider-btn-ok">${svg('check')}Validar</button>
            <button type="submit" name="Rechazar" class="modern-form-btn lider-btn-no">${svg('x')}Rechazar</button>
            <button type="submit" name="Eliminar" class="modern-form-btn lider-btn-del">${svg('trash')}Eliminar</button>
        </div>`;

    // Texto libre por propiedad (evita inyección al renderizar)
    form.querySelector('.lider-activity-title').textContent = a.nombre || '(Sin nombre)';
    form.querySelector('[data-f="modulo"]').textContent = a.modulo;
    form.querySelector('[data-f="categoria"]').textContent = a.categoria;
    form.querySelector('[data-f="descripcion"]').textContent = a.descripcion || '—';

    // Mover los controles originales (conservan sus opciones y selección)
    const gradeRow = form.querySelector('.lider-grade-row');
    const mountControl = (labelText, node, cls) => {
        if (!node) return;
        const wrap = document.createElement('label');
        wrap.className = 'lider-control' + (cls ? ' ' + cls : '');
        const lbl = document.createElement('span');
        lbl.className = 'lider-label';
        lbl.textContent = labelText;
        node.classList.add(node.tagName === 'TEXTAREA' ? 'modern-textarea' : 'modern-select');
        wrap.appendChild(lbl);
        wrap.appendChild(node);
        gradeRow.appendChild(wrap);
    };
    mountControl('Tiempo', a.horasSel);
    mountControl('Calificación', a.califSel);
    mountControl('Comentario', a.comenta, 'lider-control-wide');

    // Acciones (envío POST con el nombre del botón en un hidden)
    const submitWith = (action, btnName, confirmMsg) => {
        if (confirmMsg && !confirm(confirmMsg)) return;
        form.action = action;
        const h = document.createElement('input');
        Object.assign(h, {type: 'hidden', name: btnName, value: btnName});
        form.appendChild(h);
        form.submit();
    };
    const elim = a.actElimina || `eliminar_actividad.php?id_actividad=${a.idActividad}&nav=4&matricula=${a.matricula}`;
    form.querySelector('button[name="Registrar"]').addEventListener('click', e => { e.preventDefault(); submitWith(a.actValida, 'Registrar'); });
    form.querySelector('button[name="Rechazar"]').addEventListener('click', e => { e.preventDefault(); submitWith(a.actRechaza, 'Rechazar', '¿Rechazar esta actividad?'); });
    form.querySelector('button[name="Eliminar"]').addEventListener('click', e => { e.preventDefault(); submitWith(elim, 'Eliminar', '¿Eliminar esta actividad? Esta acción no se puede deshacer.'); });

    card.appendChild(form);
    return card;
};

// Página de calificar (ver_actividades_alumno_calificar.php)
const modernizeGradingPage = () => {
    const main = $('main.content');
    if (!main || main.classList.contains('modernized')) return;
    main.classList.add('modernized');

    const heading = main.querySelector('h3');
    const titleHTML = heading ? heading.innerHTML : 'Calificar actividades';
    const table = main.querySelector('table');
    if (!table) return;

    // id_actividad / matricula pueden quedar "foster-parented" fuera de las filas;
    // se recogen en orden de documento y se emparejan por índice con las filas.
    const idInputs = Array.from(main.querySelectorAll('input[name="id_actividad"]')).map(i => i.value);
    const matInputs = Array.from(main.querySelectorAll('input[name="matricula"]')).map(i => i.value);
    const matFromUrl = new URLSearchParams(location.search).get('matricula') || '';

    const dataRows = Array.from(table.querySelectorAll('tr')).filter(r => r.querySelector('td') && !r.querySelector('th'));
    const grab = (cell, name) => cell?.querySelector(`button[name="${name}"]`)?.getAttribute('onclick')?.match(/this\.form\.action\s*=\s*['"]([^'"]+)['"]/)?.[1];

    const activities = dataRows.map((tr, i) => {
        const c = tr.cells;
        const meta = (c[0]?.innerHTML || '').split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
        const ubic = (c[6]?.innerHTML || '').split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
        return {
            idActividad: idInputs[i] || meta[1] || '',
            matricula: matInputs[i] || matFromUrl,
            num: meta[0] || String(i + 1),
            fecha: meta[2] || meta[meta.length - 1] || '',
            tipo: c[1]?.textContent.trim() || '',
            modulo: c[2]?.textContent.trim() || '',
            categoria: c[3]?.textContent.trim() || '',
            nombre: c[4]?.textContent.trim() || '',
            descripcion: c[5]?.querySelector('.tooltiptext2')?.textContent.trim() || '',
            ubicacion: ubic[0] || '',
            tiempo: ubic[1] || '',
            evidenciaHTML: ((c[7]?.innerHTML || '') + (c[8]?.innerHTML || '')),
            horasSel: c[10]?.querySelector('select[name="horas_realizadas"]') || null,
            califSel: c[10]?.querySelector('select[name="calificacion"]') || null,
            comenta: c[10]?.querySelector('textarea[name="comenta"]') || null,
            actValida: grab(c[9], 'Registrar') || 'valida_rapido.php',
            actRechaza: grab(c[9], 'Rechazar') || 'rechaza_rapido.php',
            actElimina: grab(c[9], 'Eliminar') || ''
        };
    });

    main.innerHTML = `<div class="modern-card"><div class="modern-card-header"><h2 class="modern-title lider-grade-title">${titleHTML}</h2></div><div class="modern-card-content" id="gradeList"></div></div>`;
    const list = $('#gradeList');
    activities.forEach(a => list.appendChild(buildGradeCard(a)));
};

// Pendientes del líder: tabla + búsqueda/filtros + resumen "por revisar por alumno"
const modernizeLeaderPendientes = () => {
    const main = $('main.content');
    if (!main || main.classList.contains('modernized')) return;
    main.classList.add('modernized');

    const title = main.querySelector('h3')?.textContent?.trim() || 'Actividades pendientes';
    const table = main.querySelector('table');
    if (!table) return;
    modernizeTable(table);

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    // Columnas: 0 #, 1 matrícula, 2 nombre, 3 fecha, 4 horas, 5 tipo, 6 módulo, ...
    const students = new Map(); // matrícula -> {nombre, count}
    const tipos = new Set();
    const modulos = new Set();
    rows.forEach(r => {
        const mat = r.cells[1]?.textContent.trim();
        const nom = r.cells[2]?.textContent.trim();
        const tipo = r.cells[5]?.textContent.trim();
        const mod = r.cells[6]?.textContent.trim();
        if (mat) {
            if (!students.has(mat)) students.set(mat, {nombre: nom, count: 0});
            students.get(mat).count++;
        }
        if (tipo) tipos.add(tipo);
        if (mod) modulos.add(mod);
    });

    const opt = (v, t) => `<option value="${v}">${t}</option>`;
    const studentsByCount = [...students.entries()].sort((a, b) => b[1].count - a[1].count);
    const alumnoOpts = [...students.entries()]
        .sort((a, b) => a[1].nombre.localeCompare(b[1].nombre))
        .map(([mat, s]) => opt(mat, `${s.nombre} (${mat})`)).join('');
    const tipoOpts = [...tipos].sort().map(t => opt(t, t)).join('');
    const moduloOpts = [...modulos].sort().map(m => opt(m, m)).join('');

    main.innerHTML = `
        <div class="modern-card">
            <div class="modern-card-header lider-pend-header">
                <h2 class="modern-title">${title}</h2>
                <span class="tm-count" id="pendCount"></span>
            </div>
            <div class="modern-card-content">
                <div class="lider-summary">
                    <span class="lider-summary-label">Por revisar por alumno</span>
                    <div class="lider-chips" id="pendChips"></div>
                </div>
                <div class="tm-ctrl lider-ctrl">
                    <div class="tm-search">${svg('search')}<input type="search" id="pendSearch" placeholder="Buscar matrícula, nombre, tipo…"></div>
                    <select id="pendAlumno"><option value="">Todos los alumnos</option>${alumnoOpts}</select>
                    <select id="pendTipo"><option value="">Todos los tipos</option>${tipoOpts}</select>
                    <select id="pendModulo"><option value="">Todos los módulos</option>${moduloOpts}</select>
                    <button class="tm-btn tm-btn-s" id="pendClear">Limpiar</button>
                </div>
                <div class="modern-table-container" id="pendTableWrap"></div>
            </div>
        </div>`;
    $('#pendTableWrap').appendChild(table);

    const searchInput = $('#pendSearch');
    const alumnoSel = $('#pendAlumno');
    const tipoSel = $('#pendTipo');
    const moduloSel = $('#pendModulo');
    const countLabel = $('#pendCount');
    const chips = $('#pendChips');

    const applyFilters = () => {
        const q = searchInput.value.trim().toLowerCase();
        const mat = alumnoSel.value, tipo = tipoSel.value, mod = moduloSel.value;
        let visible = 0;
        rows.forEach(r => {
            const show = (!q || r.textContent.toLowerCase().includes(q))
                && (!mat || r.cells[1]?.textContent.trim() === mat)
                && (!tipo || r.cells[5]?.textContent.trim() === tipo)
                && (!mod || r.cells[6]?.textContent.trim() === mod);
            r.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        countLabel.textContent = `${visible} / ${rows.length} por revisar`;
        chips.querySelectorAll('.lider-chip').forEach(c => c.classList.toggle('active', c.dataset.mat === mat));
        saveValue('pendFilters', {q: searchInput.value, mat, tipo, mod});
    };

    // Restaurar filtros guardados (si la opción ya no existe, el value queda vacío)
    const savedFilters = getValue('pendFilters', null);
    if (savedFilters) {
        searchInput.value = savedFilters.q || '';
        alumnoSel.value = savedFilters.mat || '';
        tipoSel.value = savedFilters.tipo || '';
        moduloSel.value = savedFilters.mod || '';
    }

    // Chips por alumno (orden por cantidad de pendientes, desc)
    studentsByCount.forEach(([mat, s]) => {
        const chip = document.createElement('button');
        chip.className = 'lider-chip';
        chip.dataset.mat = mat;
        chip.title = `${s.nombre} (${mat})`;
        chip.innerHTML = `${s.nombre.split(' ')[0]} <span class="lider-chip-count">${s.count}</span>`;
        chip.onclick = () => {
            alumnoSel.value = (alumnoSel.value === mat) ? '' : mat; // alternar
            applyFilters();
        };
        chips.appendChild(chip);
    });

    [searchInput, alumnoSel, tipoSel, moduloSel].forEach(el => el.addEventListener('input', applyFilters));
    $('#pendClear').onclick = () => {
        searchInput.value = ''; alumnoSel.value = ''; tipoSel.value = ''; moduloSel.value = '';
        applyFilters();
    };
    applyFilters();
};

const initLider = () => {
    const page = location.pathname.split('/').pop();
    if (page.includes('ver_actividades_alumno_calificar')) modernizeGradingPage();
    else if (page === '' || page.includes('index') || page.includes('elige_alumno')) modernizeLeaderList();
    else if (page.includes('ver_pendientes')) modernizeLeaderPendientes();
    else modernizeContent(); // validadas, todas las actividades (una sola tabla)
};

// ==================== INICIALIZACIÓN ====================
const fixButtons = () => {
    $$('input[type="submit"][onclick*="form.action"]').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const url = onclick?.match(/this\.form\.action\s*=\s*['"]([^'"]+)['"]/)?.[1];
        if (url) {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', e => {
                e.preventDefault();
                const isDel = btn.value.toLowerCase().includes('borrar');
                if (isDel && !confirm('¿Estás seguro de que deseas borrar esta actividad?')) return;
                window.location.href = url;
            });
        }
    });
};

const init = () => {
    createHeader();
    addDarkToggle();
    if (isLider) {
        initLider();
    } else {
        processPendingDelete();
        modernizeContent();
        addEditToActivityDetail();
        modernizeForm();
        initTable();
    }
    setTimeout(fixButtons, 200);
};

let initialized = false;
const app = async () => {
    if (initialized) return;
    initialized = true;

    const fb = isLider ? cfg.liderFallback : cfg.fallback;
    const cached = getValue(CSS_CACHE_KEY, null);

    // 1) Inyecta al instante el CSS cacheado (o el de respaldo) sin esperar a la red:
    //    así no hay parpadeo de ~1s al cambiar de página.
    injectCSS(cached || fb);

    // Aplicar preferencia de modo oscuro guardada
    applyDark(getValue('darkMode', false));

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 2) En segundo plano refresca el CSS desde el repo y actualiza la cache.
    try {
        const res = await fetch(isLider ? cfg.cssLider : cfg.css);
        if (res.ok) {
            const fresh = await res.text();
            if (fresh && fresh !== cached) {
                injectCSS(fresh);
                saveValue(CSS_CACHE_KEY, fresh);
            }
        }
    } catch { /* sin red: se queda con la cache/respaldo */ }
};

new MutationObserver(debounce(init, 100)).observe(document.body, {childList: true, subtree: true});
app();

})();