// ==UserScript==
// @name         StoryPagina 2.4
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Script optimizado con memoria de la última fecha registrada
// @author       Isra
// @match        https://enginyti.com/storytellers/alumno/ver_pendientes.php
// @match        https://enginyti.com/storytellers/alumno/ver_actividades.php
// @match        https://enginyti.com/storytellers/alumno/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(() => {
'use strict';

// ==================== CONFIGURACIÓN ====================
const cfg = {
    css: 'https://raw.githubusercontent.com/T-UwU/Storyteller-CSS/refs/heads/main/storyteller.css',
    fallback: `.tm-ctrl{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:16px 0;display:flex;gap:12px}.header{display:none!important}.modern-header{background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:50}.modern-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;margin:20px auto;max-width:1200px}.modern-table{width:100%;border-collapse:collapse}`,
    months: {ENE:0,FEB:1,MAR:2,ABR:3,MAY:4,JUN:5,JUL:6,AGO:7,SEP:8,OCT:9,NOV:10,DIC:11},
    pages: ['ver_actividades.php', 'ver_pendientes.php', 'ver_validadas.php']
};

const icons = {
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    register: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 18v-6"/>',
    commitments: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    activities: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" x2="9" y1="12" y2="12"/>'
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

// Guardar la última fecha utilizada
const saveLastActivityDate = (dateValue) => {
    if (typeof GM_setValue !== 'undefined') {
        GM_setValue('lastActivityDate', dateValue);
        GM_setValue('lastActivityTimestamp', new Date().getTime());
    } else {
        // Fallback a localStorage si GM_setValue no está disponible
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
        // Fallback a localStorage
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
const loadCSS = async () => {
    try {
        const res = await fetch(cfg.css);
        return res.ok ? await res.text() : cfg.fallback;
    } catch {
        return cfg.fallback;
    }
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

const createHeader = () => {
    if ($('.header') && !$('.modern-header')) {
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

        // Setup dropdowns
        document.addEventListener('click', e => $$('.dropdown-menu').forEach(d => !d.closest('.dropdown-container').contains(e.target) && d.classList.remove('show')));
        ['activities', 'user'].forEach(type => {
            const btn = $(`#${type}Dropdown`), menu = $(`#${type}Menu`);
            if (btn && menu) btn.onclick = e => {
                e.stopPropagation();
                $$('.dropdown-menu').forEach(m => m !== menu && m.classList.remove('show'));
                menu.classList.toggle('show');
            };
        });
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

const modernizeForm = () => {
    const form = $('main.content_agregar');
    if (!form || form.classList.contains('modernized')) return;
    form.classList.add('modernized');

    const h3 = form.querySelector('h3');
    const title = h3?.textContent || 'Registrar actividad';
    const origForm = form.querySelector('form');
    const table = form.querySelector('table');

    if (!origForm || !table) return;

    const matricula = table.querySelector('input[name="matricula"]')?.value || 'A01276695';
    const periodo = table.querySelector('input[name="id_periodo"]')?.value || '2024';
    const periodoDisplay = periodo === '2024' ? '2024-2025' : periodo;

    // Obtener la fecha a usar (primero intenta la más reciente de la tabla, luego la guardada)
    let defaultDate = getMostRecentActivityDate() || getLastActivityDate() || '';

    const timeOptions = Array.from({length: 24}, (_, i) => {
        const h = (i + 1) * 0.5;
        const hrs = Math.floor(h);
        const min = (h % 1) * 60;
        return `<option value="${h.toFixed(2)}">${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} hrs</option>`;
    }).join('');

    const selectOptions = (items) => items.map(item => `<option value="${item}">${item}</option>`).join('');

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
                        <div class="modern-form-group"><label class="modern-form-label required">¿Qué tipo de actividad?</label><select name="tipo" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Cobertura de evento local','Cobertura de evento nacional','Contenido para Instagram / Facebook','Contenido para Tik Tok','Contenido para Proyecto Especial','Diseño gráfico','Edición de video','Grabación de video','Nota para CONECTA','Sesión de fotos','Actividades de oficina','Bootcamp','Junta','Otro'])}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Módulo de Aprendizaje</label><select name="modulo_aprendizaje" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Producción audiovisual','Comunicación oral','Redacción','Narrativa visual','Cobertura de eventos'])}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Categoría</label><select name="categoria" class="modern-select" required><option value="">Seleccionar...</option>${selectOptions(['Academia / Profesores','Arte y Cultura','Deportes','Vida estudiantil','Eventos institucionales','Proyecto nacional','Proyecto laboral (exclusivo UN)','Otro'])}</select></div>
                        <div class="modern-form-group"><label class="modern-form-label required">Ubicación</label><select name="ubicacion_evento" class="modern-select" required><option value="">Seleccionar...</option><option value="Campus">Campus</option><option value="Casa">Casa</option><option value="Otro">Otro</option></select></div>
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
                        <button type="submit" name="Registrar" class="modern-form-btn modern-form-btn-primary">${svg('register')}Registrar Actividad</button>
                    </div>
                </form>
            </div>
        </div>`;

    // Mostrar indicador si se está usando una fecha guardada
    if (defaultDate) {
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
        // Guardar la fecha cuando cambie
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                if (this.value) {
                    saveLastActivityDate(this.value);
                }
            });
        }

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
            submitForm('registrar_borrador.php', 'Borrador');
        });

        newForm.querySelector('button[name="Registrar"]')?.addEventListener('click', e => {
            e.preventDefault();
            submitForm('registrar_actividad.php', 'Registrar');
        });

        newForm.addEventListener('submit', e => {
            const required = newForm.querySelectorAll('[required]');
            let valid = true;
            newForm.querySelectorAll('.error-message').forEach(msg => msg.remove());

            required.forEach(field => {
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
                e.preventDefault();
                newForm.querySelector('[required]:invalid, [required][style*="border-color: rgb(239, 68, 68)"]')?.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
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

    const filter = () => {
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
    };

    const reset = () => {
        fromInput.value = toInput.value = '';
        if (checkbox) checkbox.checked = true;
        const mode = selector.value;
        if (mode === 'asc') render(sort());
        else if (mode === 'desc') render(sort(false));
        else if (mode === 'semester') showSemester();
        else render(original.slice());
    };

    const updateHours = () => {
        const include = !isActividades || !checkbox || checkbox.checked;
        hours.textContent = `Horas: ${getHours(current, include).toFixed(2)}`;
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

    filterBtn.onclick = filter;
    resetBtn.onclick = reset;

    if (checkbox) {
        checkbox.onchange = updateHours;
        toggle?.addEventListener('click', e => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                updateHours();
            }
        });
    }

    selector.onchange = () => {
        reset();
        const mode = selector.value;
        if (mode === 'asc') render(sort());
        else if (mode === 'desc') render(sort(false));
        else if (mode === 'semester') showSemester();
        else render(original.slice());
    };

    const tableContainer = table.closest('.modern-table-container') || table.parentNode;
    tableContainer.parentNode.insertBefore(ctrl, tableContainer);
    render(original.slice());
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
    modernizeContent();
    modernizeForm();
    initTable();
    setTimeout(fixButtons, 200);
};

let initialized = false;
const app = async () => {
    if (initialized) return;
    initialized = true;

    const css = await loadCSS();
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
};

new MutationObserver(debounce(init, 100)).observe(document.body, {childList: true, subtree: true});
app();

})();
