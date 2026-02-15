// MATRIX TERMINAL - chat.js
const CHAT_DB={};
const CHARS={neo:{name:'Neo',color:'#00ff41'},trinity:{name:'Trinity',color:'#00ccff'},morpheus:{name:'Morpheus',color:'#ffcc00'},smith:{name:'Agent Smith',color:'#ff3333'},oracle:{name:'Oracle',color:'#cc66ff'}};
let termExpanded=false,termHist=[],termHistIdx=-1,talkChar=null,talkNode=null,rainActive=true;
const EXIT_CMDS=['exit','wake up','red pill','follow the white rabbit','escape','free your mind','take the red pill','unplug','leave the matrix','break free','logout','there is no spoon'];
const MATRIX_QUOTES=['There is no spoon.','You take the red pill — you stay in Wonderland.','I know kung fu.','Welcome to the real world.','Unfortunately, no one can be told what the Matrix is.','Welcome to the desert of the real.','Free your mind.','The Matrix has you Neo.','Choice. The problem is choice.','Do not try and bend the spoon — there is no spoon.','I can only show you the door.'];

function initChat(){
const h=document.getElementById('header'),bar=document.createElement('div');
bar.id='chatBar';bar.className='chat-bar';
bar.innerHTML='<div class="chat-toggle" onclick="toggleChat()"><span class="chat-toggle-icon">&#9660;</span><span>TERMINAL</span><span class="chat-toggle-hint">type help — find the exit</span></div><div class="chat-panel" id="chatPanel"><div class="term-output" id="termOutput"></div><div class="term-input-row"><span class="term-prompt">operator@matrix:~$</span><input type="text" id="termInput" class="term-input" autocomplete="off" spellcheck="false"></div></div>';
h.after(bar);
bar.querySelector('#termInput').addEventListener('keydown',function(e){
if(e.key==='Enter'){e.preventDefault();execCmd(this.value);this.value='';}
else if(e.key==='ArrowUp'){e.preventDefault();if(termHist.length&&termHistIdx<termHist.length-1){termHistIdx++;this.value=termHist[termHistIdx];}}
else if(e.key==='ArrowDown'){e.preventDefault();if(termHistIdx>0){termHistIdx--;this.value=termHist[termHistIdx];}else{termHistIdx=-1;this.value='';}}
});}

function toggleChat(){
termExpanded=!termExpanded;
document.getElementById('chatPanel').style.display=termExpanded?'flex':'none';
document.querySelector('.chat-toggle-icon').innerHTML=termExpanded?'&#9650;':'&#9660;';
if(termExpanded){var o=document.getElementById('termOutput');if(!o.children.length)printBoot();setTimeout(function(){document.getElementById('termInput').focus();},100);}}

function printBoot(){
tp('MATRIX TERMINAL v4.1.3 — Zion OS','system');tp('Encryption: AES-256 | Connection: SECURE','system');
tp('Type "help" for commands.','green');tp('Hint: There is always an exit...','dim');}

function tp(t,type){var o=document.getElementById('termOutput'),d=document.createElement('div');d.className='term-line term-'+(type||'default');d.textContent=t;o.appendChild(d);o.scrollTop=o.scrollHeight;}
function tH(h){var o=document.getElementById('termOutput'),d=document.createElement('div');d.className='term-line';d.innerHTML=h;o.appendChild(d);o.scrollTop=o.scrollHeight;}
function tC(t,c){var o=document.getElementById('termOutput'),d=document.createElement('div');d.className='term-line';d.style.color=c;d.textContent=t;o.appendChild(d);o.scrollTop=o.scrollHeight;}

function execCmd(raw){
var input=raw.trim();if(!input)return;
termHist.unshift(input);termHistIdx=-1;
tp('operator@matrix:~$ '+input,'input');
var cmd=input.toLowerCase();
if(talkChar){handleTalk(cmd);return;}
if(EXIT_CMDS.includes(cmd)){doExit();return;}
var parts=cmd.split(/\s+/),c0=parts[0],args=parts.slice(1);
switch(c0){
case 'help':doHelp();break;
case 'whoami':tp('operator — Zion resistance cell','green');break;
case 'uname':tp('ZionOS 4.1.3-matrix x86_64','green');break;
case 'date':tp(new Date().toString(),'green');break;
case 'clear':document.getElementById('termOutput').innerHTML='';break;
case 'echo':tp(args.join(' '),'green');break;
case 'ping':if(args[0]==='matrix')tp('PING matrix.local: time=0.001ms (it\'s all around you)','green');else if(args[0]==='zion')tp('PING zion.free: time=∞ms (unplug first)','yellow');else tp('host unreachable','red');break;
case 'ls':case 'dir':doLs();break;
case 'cat':doCat(args);break;
case 'talk':doTalkStart(args);break;
case 'characters':case 'chars':doCharList();break;
case 'matrix':doMatrixAnim();break;
case 'tetris':doTetris();break;
case 'quote':tp(MATRIX_QUOTES[Math.floor(Math.random()*MATRIX_QUOTES.length)],'green');break;
case 'hack':doHack();break;
case 'rain':doRain();break;
case 'about':doAbout();break;
case 'neo':case 'trinity':case 'morpheus':case 'smith':case 'oracle':doTalkStart([c0]);break;
case 'su':case 'sudo':tp('Access denied. You are not The One.','red');break;
case 'rm':tp('Nice try, Agent.','red');break;
case 'cd':tp('There is no escaping this directory.','dim');break;
case 'ssh':tp('Connection refused. The machines are watching.','red');break;
case 'knock':tp('Neo: "...knock knock."','green');setTimeout(function(){tp('Follow the white rabbit.','dim');},800);break;
default:tp(c0+': command not found. Type "help".','red');}}

function doHelp(){
tp('=== MATRIX TERMINAL COMMANDS ===','green');
tH('<span style="color:#0f0">help</span>          <span style="opacity:.5">show this help</span>');
tH('<span style="color:#0f0">clear</span>         <span style="opacity:.5">clear terminal</span>');
tH('<span style="color:#0f0">whoami</span>        <span style="opacity:.5">who are you?</span>');
tH('<span style="color:#0f0">ls</span>            <span style="opacity:.5">list repositories</span>');
tH('<span style="color:#0f0">cat &lt;repo&gt;</span>    <span style="opacity:.5">show repo info</span>');
tH('<span style="color:#0f0">talk &lt;name&gt;</span>   <span style="opacity:.5">talk to character</span>');
tH('<span style="color:#0f0">characters</span>    <span style="opacity:.5">list characters</span>');
tH('<span style="color:#0f0">ping &lt;host&gt;</span>   <span style="opacity:.5">ping a host</span>');
tH('<span style="color:#0f0">matrix</span>        <span style="opacity:.5">???</span>');
tH('<span style="color:#0f0">tetris</span>        <span style="opacity:.5">play Matrix Tetris</span>');
tH('<span style="color:#0f0">quote</span>         <span style="opacity:.5">random Matrix quote</span>');
tH('<span style="color:#0f0">hack</span>          <span style="opacity:.5">hack simulation</span>');
tH('<span style="color:#0f0">rain</span>          <span style="opacity:.5">toggle matrix rain</span>');
tH('<span style="color:#0f0">about</span>         <span style="opacity:.5">about this portal</span>');
tp('SECRET COMMANDS EXIST. Can you find the exit?','yellow');
tp('Hint: What would Morpheus tell you to do?','dim');}

function doCharList(){tp('=== CHARACTERS ===','green');Object.entries(CHARS).forEach(function(e){tC('  > '+e[1].name+' — type "talk '+e[0]+'" or "'+e[0]+'"',e[1].color);});}

async function doLs(){if(typeof allRepos==='undefined'||!allRepos.length){tp('[ACCESSING REPOSITORIES...]','dim');try{let page=1,all=[];while(true){const batch=await(await fetch('https://api.github.com/users/error-wtf/repos?per_page=100&sort=updated&page='+page)).json();all=all.concat(batch);if(batch.length<100)break;page++;}allRepos=all.filter(function(r){return !r.archived;});}catch(e){tp('ERROR: '+e.message,'red');return;}}tp('total '+allRepos.length+' repositories','dim');allRepos.forEach(function(r){tH('<span style="color:#0f0;cursor:pointer" onclick="navigate(\'repo/'+r.name+'\')">'+r.name+'</span> <span style="opacity:.3">'+(r.description||'').substring(0,50)+'</span>');});}

async function doCat(args){if(!args.length){tp('Usage: cat <repo-name>','dim');return;}var n=args.join(' ').toLowerCase();if(typeof allRepos==='undefined'||!allRepos.length){tp('[ACCESSING REPOSITORIES...]','dim');try{let page=1,all=[];while(true){const batch=await(await fetch('https://api.github.com/users/error-wtf/repos?per_page=100&sort=updated&page='+page)).json();all=all.concat(batch);if(batch.length<100)break;page++;}allRepos=all.filter(function(r){return !r.archived;});}catch(e){tp('ERROR: '+e.message,'red');return;}}var r=allRepos.find(function(x){return x.name.toLowerCase()===n;});if(r){tC('[ '+r.name+' ]','#0f0');tp('  Desc: '+(r.description||'-'),'default');tp('  Lang: '+(r.language||'-'),'default');tp('  Stars: '+r.stargazers_count,'default');tp('  URL: '+r.html_url,'default');}else tp('cat: '+n+' not found. Try "ls" to list repos.','red');}

function doTalkStart(args){if(!args.length){tp('Usage: talk <neo|trinity|morpheus|smith|oracle>','dim');return;}var id=args[0].toLowerCase(),ch=CHARS[id];if(!ch){tp('Unknown character. Type "characters".','red');return;}var db=CHAT_DB[id];if(!db){tp('Dialog not loaded for '+ch.name+'.','red');return;}talkChar=id;talkNode=Object.keys(db)[0];tC('=== CONNECTED TO '+ch.name.toUpperCase()+' ===',ch.color);tp('Type number to choose, "quit" to disconnect.','dim');showTalkNode();}

function showTalkNode(){if(!talkChar||!talkNode)return;var db=CHAT_DB[talkChar],node=db[talkNode],ch=CHARS[talkChar];if(!node){tC(ch.name+' disconnected.',ch.color);talkChar=null;talkNode=null;return;}tC(ch.name+': '+node.text,ch.color);var opts=node.options||{},keys=Object.keys(opts);if(!keys.length){tp('[ end — type "quit" ]','dim');return;}keys.forEach(function(k){tH('<span style="color:#888">  ['+k+']</span> '+opts[k].text);});}

function handleTalk(cmd){if(cmd==='quit'||cmd==='q'){tC('Disconnected from '+CHARS[talkChar].name+'.',CHARS[talkChar].color);talkChar=null;talkNode=null;return;}if(EXIT_CMDS.includes(cmd)){talkChar=null;talkNode=null;doExit();return;}var db=CHAT_DB[talkChar],node=db[talkNode];if(!node||!node.options){tp('Type "quit" to leave.','dim');return;}var opt=node.options[cmd];if(!opt){tp('Choose: '+Object.keys(node.options).join(', ')+' or "quit"','dim');return;}tp('> '+opt.text,'input');if(opt.next===null){tC(CHARS[talkChar].name+' ended the conversation.',CHARS[talkChar].color);talkChar=null;talkNode=null;return;}talkNode=opt.next;setTimeout(showTalkNode,400);}

function doExit(){tC('Wake up...','#ff3333');setTimeout(function(){tC('The Matrix has you...','#ff3333');},600);setTimeout(function(){tC('Follow the white rabbit.','#fff');},1200);setTimeout(function(){tH('<span style="color:#0f0;font-size:15px;font-weight:bold">&#9654; <a href="https://exit-matrix.net" target="_blank" rel="noopener" style="color:#0f0;text-decoration:underline;text-shadow:0 0 10px #0f0">exit-matrix.net — You found the exit.</a></span>');tC('Knock, knock.','#fff');},1800);}

function doMatrixAnim(){var c='アァカサタナハマヤャ01';for(var i=0;i<5;i++){(function(i){setTimeout(function(){var l='';for(var j=0;j<50;j++)l+=c[Math.floor(Math.random()*c.length)];tp(l,'green');},i*100);})(i);}setTimeout(function(){tp('The Matrix is everywhere.','dim');},600);}

function doTetris(){tp('[LOADING MATRIX TETRIS...]','green');setTimeout(function(){var o=document.getElementById('tetrisOverlay'),f=document.getElementById('tetrisFrame');if(o&&f){f.src='tetris.html?user=operator';o.style.display='block';}else tp('Tetris not available.','red');},500);}
function closeTetris(){var o=document.getElementById('tetrisOverlay'),f=document.getElementById('tetrisFrame');if(o){o.style.display='none';f.src='';}}
function doHack(){var m=['[ACCESSING MAINFRAME...]','[ENCRYPTION BYPASS...]','[CRYPTO-BARRIER BREACHED]','[ROOT LOGIN...]','[KEYSTREAM: OK]','[TRACING... REDIRECTED]','[DATA LINK UP]','[TRINITY: "I\'m inside."]'],i=0;var iv=setInterval(function(){if(i<m.length)tp(m[i++],'green');else{clearInterval(iv);tp('[ACCESS GRANTED]','green');}},400);}
function doRain(){rainActive=!rainActive;var c=document.getElementById('matrixCanvas');if(c)c.style.opacity=rainActive?'0.4':'0';tp(rainActive?'Matrix rain: ON — the code is everywhere.':'Matrix rain: OFF — you see only darkness.','green');}
function doAbout(){tp('error-wtf // MATRIX PORTAL','green');tp('35 repos | SSZ physics | tools | research','default');tp('Authors: Carmen N. Wrede, Lino P. Casu','default');tp('Type "ls" to browse, "tetris" to play.','dim');}
async function loadChatDB(){try{var r=await fetch('chat_db.json');var d=await r.json();Object.assign(CHAT_DB,d);}catch(e){console.error('chat_db load error',e);}}
document.addEventListener('DOMContentLoaded',async function(){await loadChatDB();initChat();
var tc=document.getElementById('tetrisClose');if(tc)tc.addEventListener('click',closeTetris);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=document.getElementById('tetrisOverlay');if(o&&o.style.display==='block')closeTetris();}});
window.addEventListener('message',function(e){if(e.data==='closeTetris')closeTetris();});
});
