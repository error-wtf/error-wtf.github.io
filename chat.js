// ============================================
// MATRIX CHAT - chat.js
// Dialog trees: Neo, Trinity, Morpheus, Smith, Oracle
// ============================================

const CHAT_DB = {};

// Load all dialog DBs via fetch (from same repo)
const CHARACTERS = [
    {id:'neo', name:'Neo', file:'chat_db.json', color:'#00ff41', icon:'N'},
    {id:'trinity', name:'Trinity', file:'chat_db.json', color:'#00ccff', icon:'T'},
    {id:'morpheus', name:'Morpheus', file:'chat_db.json', color:'#ffcc00', icon:'M'},
    {id:'smith', name:'Agent Smith', file:'chat_db.json', color:'#ff3333', icon:'S'},
    {id:'oracle', name:'Oracle', file:'chat_db.json', color:'#cc66ff', icon:'O'}
];

let chatActive = false;
let chatCharacter = null;
let chatCurrentNode = null;
let chatExpanded = false;

function initChat() {
    const header = document.getElementById('header');
    const chatBar = document.createElement('div');
    chatBar.id = 'chatBar';
    chatBar.className = 'chat-bar';
    chatBar.innerHTML = `
        <div class="chat-toggle" onclick="toggleChat()">
            <span class="chat-toggle-icon">&#9660;</span>
            <span>MATRIX CHAT</span>
            <span class="chat-toggle-hint">talk to Neo, Trinity, Morpheus, Smith, Oracle</span>
        </div>
        <div class="chat-panel" id="chatPanel">
            <div class="chat-characters" id="chatCharacters"></div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-welcome">Select a character to begin...</div>
            </div>
            <div class="chat-options" id="chatOptions"></div>
        </div>
    `;
    header.after(chatBar);
    renderCharacterButtons();
}

function toggleChat() {
    chatExpanded = !chatExpanded;
    const panel = document.getElementById('chatPanel');
    const icon = document.querySelector('.chat-toggle-icon');
    panel.style.display = chatExpanded ? 'flex' : 'none';
    icon.innerHTML = chatExpanded ? '&#9650;' : '&#9660;';
}

function renderCharacterButtons() {
    const el = document.getElementById('chatCharacters');
    el.innerHTML = CHARACTERS.map(c =>
        '<button class="chat-char-btn" style="border-color:' + c.color + ';color:' + c.color + '" ' +
        'onclick="startChat(\'' + c.id + '\')" title="Talk to ' + c.name + '">' +
        '<span class="chat-char-icon" style="background:' + c.color + '">' + c.icon + '</span>' +
        c.name + '</button>'
    ).join('');
}

function startChat(charId) {
    const char = CHARACTERS.find(c => c.id === charId);
    if (!char) return;
    chatCharacter = char;
    chatActive = true;
    
    const db = CHAT_DB[charId];
    if (!db) {
        addMessage('system', 'Loading ' + char.name + '...');
        return;
    }
    
    document.getElementById('chatMessages').innerHTML = '';
    chatCurrentNode = Object.keys(db)[0];
    
    // Highlight active character
    document.querySelectorAll('.chat-char-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.chat-char-btn[onclick*="' + charId + '"]').classList.add('active');
    
    stepChat();
}

function stepChat() {
    if (!chatCharacter || !chatCurrentNode) return;
    const db = CHAT_DB[chatCharacter.id];
    const node = db[chatCurrentNode];
    if (!node) {
        addMessage('system', 'End of conversation.');
        document.getElementById('chatOptions').innerHTML = '<button class="chat-opt-btn" onclick="startChat(\'' + chatCharacter.id + '\')">Restart</button>';
        chatActive = false;
        return;
    }
    
    addMessage('npc', node.text, node.speaker);
    
    const opts = node.options || {};
    const keys = Object.keys(opts);
    const optEl = document.getElementById('chatOptions');
    
    if (keys.length === 0) {
        optEl.innerHTML = '<button class="chat-opt-btn" onclick="startChat(\'' + chatCharacter.id + '\')">Restart</button>';
        chatActive = false;
        return;
    }
    
    optEl.innerHTML = keys.map(k => {
        const o = opts[k];
        return '<button class="chat-opt-btn" onclick="chooseOption(\'' + k + '\')">' + o.text + '</button>';
    }).join('');
}

function chooseOption(key) {
    if (!chatCharacter || !chatCurrentNode) return;
    const db = CHAT_DB[chatCharacter.id];
    const node = db[chatCurrentNode];
    const opt = node.options[key];
    if (!opt) return;
    
    addMessage('user', opt.text);
    
    if (opt.next === null) {
        addMessage('system', 'Conversation ended.');
        document.getElementById('chatOptions').innerHTML = '<button class="chat-opt-btn" onclick="startChat(\'' + chatCharacter.id + '\')">Restart</button>';
        chatActive = false;
        return;
    }
    
    chatCurrentNode = opt.next;
    setTimeout(stepChat, 400);
}

function addMessage(type, text, speaker) {
    const el = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-' + type;
    
    if (type === 'npc' && speaker) {
        const color = chatCharacter ? chatCharacter.color : '#0f0';
        msg.innerHTML = '<span class="chat-speaker" style="color:' + color + '">' + speaker + ':</span> ' + text;
    } else if (type === 'user') {
        msg.innerHTML = '<span class="chat-speaker" style="color:#888">You:</span> ' + text;
    } else {
        msg.innerHTML = '<span style="opacity:0.5">' + text + '</span>';
    }
    
    el.appendChild(msg);
    el.scrollTop = el.scrollHeight;
}

// Load DB and init
async function loadChatDB() {
    try {
        const r = await fetch('chat_db.json');
        const data = await r.json();
        Object.assign(CHAT_DB, data);
    } catch(e) {
        console.error('Failed to load chat_db.json:', e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadChatDB();
    initChat();
});
