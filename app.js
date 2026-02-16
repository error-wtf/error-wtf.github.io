// ============================================
// MATRIX PORTAL - app.js
// error-wtf.github.io
// ============================================

const OWNER = 'error-wtf';
const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';

// --- Matrix Rain ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const RAIN_CHARS = 'アァカサタナハマヤャラワガザダバパ0123456789ABCDEF';
const FS = 14;
let cols, drops;
function initRain() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FS);
    drops = Array.from({length: cols}, () => Math.random() * canvas.height / FS);
}
function drawRain() {
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
        const bright = Math.random() > 0.9 ? '#fff' : (Math.random() > 0.5 ? '#0F0' : '#00cc33');
        ctx.fillStyle = bright;
        ctx.font = FS + 'px monospace';
        ctx.fillText(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)], i * FS, drops[i] * FS);
        if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5 + Math.random() * 0.5;
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initRain(); setInterval(drawRain, 33); });
} else {
    initRain(); setInterval(drawRain, 33);
}
window.addEventListener('resize', initRain);

// --- State ---
let allRepos = [];
let currentRepo = null;
let currentTree = null;
let currentPath = '';

// --- Router ---
function getHash() { return decodeURIComponent(location.hash.slice(1) || ''); }

function navigate(path) {
    location.hash = '#' + encodeURIComponent(path);
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);

function route() {
    const hash = getHash();
    const content = document.getElementById('content');
    const bc = document.getElementById('breadcrumb');
    
    if (!hash || hash === '/') {
        bc.innerHTML = '<span>repositories</span>';
        showRepoList(content);
    } else if (hash.startsWith('repo/')) {
        const parts = hash.split('/');
        const repoName = parts[1];
        const filePath = parts.slice(2).join('/');
        
        let bcHtml = '<span onclick="navigate(\'\')">repos</span> / ';
        bcHtml += '<span onclick="navigate(\'repo/' + repoName + '\')">' + repoName + '</span>';
        if (filePath) {
            const segs = filePath.split('/');
            let built = '';
            segs.forEach((s, i) => {
                built += (built ? '/' : '') + s;
                bcHtml += ' / <span onclick="navigate(\'repo/' + repoName + '/' + built + '\')">' + s + '</span>';
            });
        }
        bc.innerHTML = bcHtml;
        showRepo(content, repoName, filePath);
    }
}

// --- Fetch helpers ---
async function apiFetch(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
    return r.json();
}

async function rawFetch(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    return r.text();
}

// --- REPO LIST ---
async function showRepoList(el) {
    el.innerHTML = '<div class="loading">ACCESSING REPOSITORIES...</div>';
    try {
        if (!allRepos.length) {
            let page = 1; let all = [];
            while (true) {
                const batch = await apiFetch(API + '/users/' + OWNER + '/repos?per_page=100&sort=updated&direction=desc&page=' + page);
                all = all.concat(batch);
                if (batch.length < 100) break;
                page++;
            }
            // Show ALL public repos including archived — no filtering
            allRepos = all;
        }
        document.getElementById('headerStats').textContent = allRepos.length + ' REPOSITORIES';
        renderRepoList(el, allRepos);
    } catch (e) {
        el.innerHTML = '<div class="loading" style="color:#f44">ERROR: ' + e.message + '</div>';
    }
}

// --- Language colors ---
const LANG_COLORS = {Python:'#3572A5',JavaScript:'#f1e05a',HTML:'#e34c26',CSS:'#563d7c',Shell:'#89e051',Jupyter:'#DA5B0B',TeX:'#3D6117',Markdown:'#083fa1',TypeScript:'#2b7489',Ruby:'#701516','C++':'#f34b7d',SCSS:'#c6538c'};

function renderRepoList(el, repos) {
    let html = '<input class="search-box" id="repoSearch" placeholder="> search repositories..." oninput="filterRepos()">';
    html += '<div class="repo-grid" id="repoGrid">';
    repos.forEach(r => {
        const lang = r.language || '';
        const color = LANG_COLORS[lang] || '#0f0';
        const updated = new Date(r.updated_at).toLocaleDateString();
        const desc = (r.description || 'No description').replace(/</g,'&lt;');
        const topics = (r.topics || []).map(t => '<span class="repo-topic">' + t + '</span>').join('');
        html += '<div class="repo-card" onclick="navigate(\'repo/' + r.name + '\')" data-name="' + r.name.toLowerCase() + '" data-desc="' + desc.toLowerCase() + '">';
        html += '<div class="repo-name">' + r.name;
        if (r.archived) html += ' <span style="color:#ffcc00;font-size:0.7em;opacity:0.85">ARCHIVED</span>';
        html += '</div>';
        html += '<div class="repo-desc">' + desc + '</div>';
        if (topics) html += '<div class="repo-topics">' + topics + '</div>';
        html += '<div class="repo-meta">';
        if (lang) html += '<span><span class="repo-lang" style="background:' + color + '"></span>' + lang + '</span>';
        html += '<span>' + (r.stargazers_count||0) + ' stars</span>';
        html += '<span>updated ' + updated + '</span>';
        html += '</div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    document.getElementById('repoSearch').focus();
}

function filterRepos() {
    const q = document.getElementById('repoSearch').value.toLowerCase();
    document.querySelectorAll('.repo-card').forEach(c => {
        const match = c.dataset.name.includes(q) || c.dataset.desc.includes(q);
        c.style.display = match ? '' : 'none';
    });
}

// --- REPO EXPLORER ---
async function showRepo(el, repoName, filePath) {
    el.innerHTML = '<div class="loading">LOADING ' + repoName + '...</div>';
    try {
        if (!currentRepo || currentRepo.name !== repoName) {
            currentRepo = await apiFetch(API + '/repos/' + OWNER + '/' + repoName);
            const branch = currentRepo.default_branch;
            const branchData = await apiFetch(API + '/repos/' + OWNER + '/' + repoName + '/git/trees/' + branch + '?recursive=1');
            currentTree = branchData.tree || [];
        }
        renderExplorer(el, repoName, filePath);
    } catch (e) {
        el.innerHTML = '<div class="loading" style="color:#f44">ERROR: ' + e.message + '</div>';
    }
}

function buildTreeStructure(tree) {
    const root = {children:{}, type:'tree'};
    tree.forEach(item => {
        const parts = item.path.split('/');
        let node = root;
        parts.forEach((p, i) => {
            if (!node.children[p]) node.children[p] = {children:{}, type: i === parts.length-1 ? item.type : 'tree', size: item.size||0, path: item.path};
            node = node.children[p];
        });
    });
    return root;
}

function renderTreeItems(node, depth, repoName, activePath) {
    let html = '';
    const entries = Object.entries(node.children).sort((a,b) => {
        if (a[1].type === 'tree' && b[1].type !== 'tree') return -1;
        if (a[1].type !== 'tree' && b[1].type === 'tree') return 1;
        return a[0].localeCompare(b[0]);
    });
    entries.forEach(([name, child]) => {
        const indent = '<span class="tree-indent"></span>'.repeat(depth);
        const isDir = child.type === 'tree';
        const icon = isDir ? '&#128193;' : '&#128196;';
        const cls = child.path === activePath ? ' active' : '';
        const dirCls = isDir ? ' tree-dir' : '';
        html += '<div class="tree-item' + cls + dirCls + '" onclick="navigate(\'repo/' + repoName + '/' + child.path + '\')" title="' + child.path + '">';
        html += indent + '<span class="icon">' + icon + '</span>' + name;
        html += '</div>';
        if (isDir && ((activePath||'').startsWith(child.path + '/') || activePath === child.path)) {
            html += renderTreeItems(child, depth + 1, repoName, activePath);
        }
    });
    return html;
}

function renderExplorer(el, repoName, filePath) {
    const r = currentRepo;
    let html = '<div class="repo-header">';
    html += '<h1>' + r.name + (r.archived ? ' <span style="color:#ffcc00;font-size:0.5em">ARCHIVED</span>' : '') + '</h1>';
    html += '<p>' + (r.description || '') + '</p>';
    html += '<div class="repo-actions">';
    html += '<a class="btn" href="' + r.html_url + '" target="_blank" rel="noopener">Open on GitHub</a>';
    html += '<a class="btn" href="' + r.html_url + '/archive/refs/heads/' + r.default_branch + '.zip" target="_blank" rel="noopener">Download ZIP</a>';
    html += '<span class="btn" onclick="copyClone(\'' + r.clone_url + '\')">Clone URL</span>';
    html += '</div></div>';
    
    const treeStruct = buildTreeStructure(currentTree);
    const treeHtml = renderTreeItems(treeStruct, 0, repoName, filePath);
    
    html += '<div class="explorer">';
    html += '<div class="tree-panel">' + treeHtml + '</div>';
    html += '<div class="viewer-panel" id="viewerPanel">';
    if (!filePath) {
        html += '<div class="loading">LOADING README...</div>';
    }
    html += '</div></div>';
    
    el.innerHTML = html;
    if (filePath) {
        loadFile(repoName, filePath);
    } else {
        // Auto-load README.md when entering a repo
        const readme = currentTree.find(t => t.type === 'blob' && /^readme(\.\w+)?$/i.test(t.path));
        if (readme) {
            loadFile(repoName, readme.path);
        } else {
            document.getElementById('viewerPanel').innerHTML = '<div class="viewer-empty">No README found</div>';
        }
    }
}

function copyClone(url) {
    navigator.clipboard.writeText('git clone ' + url);
    alert('Copied: git clone ' + url);
}

// --- FILE VIEWER ---
async function loadFile(repoName, filePath) {
    const vp = document.getElementById('viewerPanel');
    if (!vp) return;
    vp.innerHTML = '<div class="loading">DECRYPTING...</div>';
    
    const item = currentTree.find(t => t.path === filePath);
    if (item && item.type === 'tree') {
        const children = currentTree.filter(t => {
            if (!t.path.startsWith(filePath + '/')) return false;
            const rest = t.path.slice(filePath.length + 1);
            return !rest.includes('/');
        });
        let html = '<div class="viewer-header">' + filePath + '/</div>';
        html += '<div class="viewer-content">';
        children.sort((a,b) => {
            if (a.type==='tree' && b.type!=='tree') return -1;
            if (a.type!=='tree' && b.type==='tree') return 1;
            return a.path.localeCompare(b.path);
        }).forEach(c => {
            const name = c.path.split('/').pop();
            const icon = c.type === 'tree' ? '&#128193;' : '&#128196;';
            html += '<div class="tree-item" onclick="navigate(\'repo/' + repoName + '/' + c.path + '\')">';
            html += '<span class="icon">' + icon + '</span>' + name;
            if (c.size) html += ' <span style="opacity:0.4">(' + formatSize(c.size) + ')</span>';
            html += '</div>';
        });
        html += '</div>';
        vp.innerHTML = html;
        return;
    }
    
    const ext = filePath.split('.').pop().toLowerCase();
    const imgExts = ['png','jpg','jpeg','gif','svg','webp','ico','bmp'];
    if (imgExts.includes(ext)) {
        const url = RAW + '/' + OWNER + '/' + repoName + '/' + currentRepo.default_branch + '/' + filePath;
        vp.innerHTML = '<div class="viewer-header">' + filePath + '</div><div class="viewer-content" style="text-align:center"><img src="' + url + '" style="max-width:100%;border:1px solid var(--bd)"></div>';
        return;
    }
    const binExts = ['pdf','zip','tar','gz','exe','dll','so','bin','whl','pyc','mp3','mp4','wav','avi','mov'];
    if (binExts.includes(ext)) {
        const url = RAW + '/' + OWNER + '/' + repoName + '/' + currentRepo.default_branch + '/' + filePath;
        vp.innerHTML = '<div class="viewer-header">' + filePath + '</div><div class="viewer-empty">Binary file (' + ext + ')<br><br><a class="btn" href="' + url + '" target="_blank" rel="noopener">Download</a></div>';
        return;
    }
    
    try {
        const url = RAW + '/' + OWNER + '/' + repoName + '/' + currentRepo.default_branch + '/' + filePath;
        const text = await rawFetch(url);
        let content;
        if (ext === 'md' || filePath.toLowerCase().endsWith('readme')) {
            const dirPath = filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/') + 1) : '';
            const baseUrl = RAW + '/' + OWNER + '/' + repoName + '/' + currentRepo.default_branch + '/' + dirPath;
            content = '<div class="md-rendered">' + renderMarkdown(text, baseUrl) + '</div>';
        } else {
            content = '<pre><code>' + escapeHtml(text) + '</code></pre>';
        }
        vp.innerHTML = '<div class="viewer-header"><span>' + filePath + '</span><span style="opacity:0.4">' + formatSize(text.length) + '</span></div><div class="viewer-content">' + content + '</div>';
    } catch (e) {
        vp.innerHTML = '<div class="viewer-empty">Could not load file: ' + e.message + '</div>';
    }
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
}

function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// --- Markdown renderer (loaded from md.js) ---
// renderMarkdown is defined in md.js
