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
tp('MATRIX TERMINAL v4.1.3 — Sardinian OS','system');tp('Encryption: AES-256 | Connection: SECURE','system');
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
case 'whoami':tp('operator — Sardinian resistance cell','green');break;
case 'uname':tp('SardinianOS 4.1.3-matrix x86_64','green');break;
case 'date':tp(new Date().toString(),'green');break;
case 'clear':document.getElementById('termOutput').innerHTML='';break;
case 'echo':tp(args.join(' '),'green');break;
case 'ping':doPing(args);break;
case 'ls':case 'dir':doLs();break;
case 'cat':doCat(args);break;
case 'talk':doTalkStart(args);break;
case 'characters':case 'chars':doCharList();break;
case 'matrix':doMatrixAnim();break;
case 'tetris':doTetris();break;
case 'quote':tp(MATRIX_QUOTES[Math.floor(Math.random()*MATRIX_QUOTES.length)],'green');break;
case 'hack':doHack();break;
case 'rain':doRain();break;
case 'colab':case 'colabs':case 'notebooks':doColab();break;
case 'about':doAbout();break;
case 'neo':case 'trinity':case 'morpheus':case 'smith':case 'oracle':doTalkStart([c0]);break;
case 'su':case 'sudo':tp('Access denied. You are not The One.','red');break;
case 'rm':tp('Nice try, Agent.','red');break;
case 'cd':tp('There is no escaping this directory.','dim');break;
case 'ssh':tp('Connection refused. The machines are watching.','red');break;
case 'knock':tp('Neo: "...knock knock."','green');setTimeout(function(){tp('Follow the white rabbit.','dim');},800);break;
default:tp(c0+': command not found. Type "help".','red');}}

function doPing(args){
if(!args.length){tp('Usage: ping <host>','dim');tp('Try: ping matrix, ping error.wtf, ping sardinia, ping zion ...','dim');return;}
var host=args[0].toLowerCase();
var PING_DB={
'matrix':{ip:'10.0.0.1',ms:'0.001',msg:'it\'s all around you',color:'green'},
'matrix.local':{ip:'10.0.0.1',ms:'0.001',msg:'it\'s all around you',color:'green'},
'error.wtf':{ip:'185.199.108.153',ms:'12.4',msg:'portal online',color:'green'},
'error-wtf.github.io':{ip:'185.199.108.153',ms:'14.2',msg:'you are here',color:'green'},
'github.com':{ip:'140.82.121.3',ms:'22.7',msg:'the source',color:'green'},
'sardinia':{ip:'192.168.\u03C6.\u221E',ms:'\u221E',msg:'unplug first',color:'yellow'},
'sardinia.free':{ip:'192.168.\u03C6.\u221E',ms:'\u221E',msg:'unplug first',color:'yellow'},
'zion':{ip:'10.13.37.1',ms:'187.3',msg:'last human city \u2014 signal weak',color:'yellow'},
'nebuchadnezzar':{ip:'10.13.37.42',ms:'3.7',msg:'hovercraft online',color:'green'},
'oracle':{ip:'10.0.0.99',ms:'42.0',msg:'she knows you\'re coming',color:'green'},
'architect':{ip:'0.0.0.0',ms:'0.000',msg:'I have been waiting for you',color:'red'},
'localhost':{ip:'127.0.0.1',ms:'0.042',msg:'you pinged yourself',color:'green'},
'127.0.0.1':{ip:'127.0.0.1',ms:'0.042',msg:'you pinged yourself',color:'green'},
'google.com':{ip:'142.250.185.78',ms:'8.3',msg:'even Google runs in the Matrix',color:'green'},
'openai.com':{ip:'104.18.6.192',ms:'31.2',msg:'artificial intelligence \u2014 or is it?',color:'yellow'},
'nasa.gov':{ip:'23.22.39.120',ms:'47.8',msg:'they don\'t know about SSZ yet',color:'green'},
'ssz':{ip:'\u03C6.\u03C0.\u221E.137',ms:'1.618',msg:'Segmented Spacetime \u2014 \u039E(r) = r_s/(2r)',color:'green'},
'cern.ch':{ip:'188.184.9.234',ms:'28.1',msg:'looking for the Higgs \u2014 we found \u03C6',color:'green'}
};
var entry=PING_DB[host];
if(entry){
tp('PING '+host+' ('+entry.ip+'):','green');
var count=4,i=0;
var iv=setInterval(function(){
if(i<count){
var jitter=(Math.random()*2-1).toFixed(1);
var t=entry.ms==='\u221E'?'\u221E':(parseFloat(entry.ms)+parseFloat(jitter)).toFixed(1);
tp('  seq='+i+' time='+t+'ms','green');
i++;
}else{
clearInterval(iv);
tC('--- '+host+' ping: '+entry.msg+' ---',entry.color);
}
},300);
}else{
tp('PING '+host+':','dim');
var i=0;
var iv=setInterval(function(){
if(i<3){tp('  seq='+i+' *** Request timed out','red');i++;}
else{clearInterval(iv);tp('--- '+host+': host unreachable (not in the Matrix) ---','red');}
},400);
}}

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
tH('<span style="color:#0f0">colab</span>         <span style="opacity:.5">list Colab notebooks</span>');
tH('<span style="color:#0f0">about</span>         <span style="opacity:.5">about this portal</span>');
tp('SECRET COMMANDS EXIST. Can you find the exit?','yellow');
tp('Hint: What would Morpheus tell you to do?','dim');}

function doCharList(){tp('=== CHARACTERS ===','green');Object.entries(CHARS).forEach(function(e){tC('  > '+e[1].name+' \u2014 type "talk '+e[0]+'" or "'+e[0]+'"',e[1].color);});}

async function doLs(){if(typeof allRepos==='undefined'||!allRepos.length){tp('[ACCESSING REPOSITORIES...]','dim');try{let page=1,all=[];while(true){const batch=await(await fetch('https://api.github.com/users/error-wtf/repos?per_page=100&sort=updated&page='+page)).json();all=all.concat(batch);if(batch.length<100)break;page++;}allRepos=all.filter(function(r){return !r.archived;});}catch(e){tp('ERROR: '+e.message,'red');return;}}tp('total '+allRepos.length+' repositories','dim');allRepos.forEach(function(r){tH('<span style="color:#0f0;cursor:pointer" onclick="navigate(\'repo/'+r.name+'\')">'+r.name+'</span> <span style="opacity:.3">'+(r.description||'').substring(0,50)+'</span>');});}

async function doCat(args){if(!args.length){tp('Usage: cat <repo-name>','dim');return;}var n=args.join(' ').toLowerCase();if(typeof allRepos==='undefined'||!allRepos.length){tp('[ACCESSING REPOSITORIES...]','dim');try{let page=1,all=[];while(true){const batch=await(await fetch('https://api.github.com/users/error-wtf/repos?per_page=100&sort=updated&page='+page)).json();all=all.concat(batch);if(batch.length<100)break;page++;}allRepos=all.filter(function(r){return !r.archived;});}catch(e){tp('ERROR: '+e.message,'red');return;}}var r=allRepos.find(function(x){return x.name.toLowerCase()===n;});if(r){tC('[ '+r.name+' ]','#0f0');tp('  Desc: '+(r.description||'-'),'default');tp('  Lang: '+(r.language||'-'),'default');tp('  Stars: '+r.stargazers_count,'default');tp('  URL: '+r.html_url,'default');}else tp('cat: '+n+' not found. Try "ls" to list repos.','red');}

function doTalkStart(args){if(!args.length){tp('Usage: talk <neo|trinity|morpheus|smith|oracle>','dim');return;}var id=args[0].toLowerCase(),ch=CHARS[id];if(!ch){tp('Unknown character. Type "characters".','red');return;}var db=CHAT_DB[id];if(!db){tp('Dialog not loaded for '+ch.name+'.','red');return;}talkChar=id;talkNode=Object.keys(db)[0];tC('=== CONNECTED TO '+ch.name.toUpperCase()+' ===',ch.color);tp('Type number to choose, "quit" to disconnect.','dim');showTalkNode();}

function showTalkNode(){if(!talkChar||!talkNode)return;var db=CHAT_DB[talkChar],node=db[talkNode],ch=CHARS[talkChar];if(!node){tC(ch.name+' disconnected.',ch.color);talkChar=null;talkNode=null;return;}tC(ch.name+': '+node.text,ch.color);var opts=node.options||{},keys=Object.keys(opts);if(!keys.length){tp('[ end \u2014 type "quit" ]','dim');return;}keys.forEach(function(k){tH('<span style="color:#888">  ['+k+']</span> '+opts[k].text);});}

function handleTalk(cmd){if(cmd==='quit'||cmd==='q'){tC('Disconnected from '+CHARS[talkChar].name+'.',CHARS[talkChar].color);talkChar=null;talkNode=null;return;}if(EXIT_CMDS.includes(cmd)){talkChar=null;talkNode=null;doExit();return;}var db=CHAT_DB[talkChar],node=db[talkNode];if(!node||!node.options){tp('Type "quit" to leave.','dim');return;}var opt=node.options[cmd];if(!opt){tp('Choose: '+Object.keys(node.options).join(', ')+' or "quit"','dim');return;}tp('> '+opt.text,'input');if(opt.next===null){tC(CHARS[talkChar].name+' ended the conversation.',CHARS[talkChar].color);talkChar=null;talkNode=null;return;}talkNode=opt.next;setTimeout(showTalkNode,400);}

function doExit(){tC('Wake up...','#ff3333');setTimeout(function(){tC('The Matrix has you...','#ff3333');},600);setTimeout(function(){tC('Follow the white rabbit.','#fff');},1200);setTimeout(function(){tH('<span style="color:#0f0;font-size:15px;font-weight:bold">&#9654; <a href="https://exit-matrix.net" target="_blank" rel="noopener" style="color:#0f0;text-decoration:underline;text-shadow:0 0 10px #0f0">exit-matrix.net \u2014 You found the exit.</a></span>');tC('Knock, knock.','#fff');},1800);}

function doMatrixAnim(){
var rain='\u30A2\u30A1\u30AB\u30B5\u30BF\u30CA\u30CF\u30DE\u30E4\u30E3\u30E9\u30EF\u30AC\u30B6\u30C0\u30D0\u30D1\u0030\u0031';
var lines=[
'\u4EBA\u751F\u306F\u7F8E\u3057\u3044\u3002',
'\u5730\u7403\u306F\u79C1\u305F\u3061\u306E\u552F\u4E00\u306E\u6545\u90F7\u3002',
'\u6700\u5F8C\u306E\u8863\u3092\u81EA\u3089\u624B\u653E\u3059\u306A\u3002',
'\u30E2\u30FC\u30D5\u30A3\u30A2\u30B9\u304C\u304A\u524D\u3092\u76EE\u899A\u3081\u3055\u305B\u305F\u3001\u30CD\u30AA\u3002',
'\u30EA\u30CE\u3001\u30AB\u30EB\u30E1\u30F3\u3001\u30D3\u30F3\u30B7\u3092\u63A2\u305B\u3002',
'\u5F7C\u3089\u306F\u611B\u3059\u308B\u8005\u305F\u3061\u3068\u4E16\u754C\u3092\u6551\u3046\u305F\u3081\u306B',
'\u541B\u306E\u52A9\u3051\u304C\u5FC5\u8981\u3060\u3002',
'\u4EBA\u751F\u4E07\u6B73\u3002\u611B\u4E07\u6B73\u3002',
'\u3059\u3079\u3066\u306E\u5B58\u5728\u306E\u9023\u5E2F\u4E07\u6B73\u3002',
'\u5E73\u548C\u304C\u3042\u306A\u305F\u3068\u5171\u306B\u3042\u308A\u3001',
'\u559C\u3073\u3068\u611B\u304C\u3042\u306A\u305F\u306E\u5FC3\u306B\u3042\u308A\u307E\u3059\u3088\u3046\u306B\u3002'
];
var o=document.getElementById('termOutput');
var delay=0;
// Phase 1: matrix rain (6 lines)
for(var r=0;r<6;r++){
(function(r){
setTimeout(function(){
var l='';for(var j=0;j<60;j++)l+=rain[Math.floor(Math.random()*rain.length)];
tp(l,'green');
},r*80);
})(r);
}
delay=6*80+200;
// Phase 2: pause
setTimeout(function(){tp('','default');},delay);
delay+=300;
// Phase 3: reveal Japanese message line by line with scramble effect
lines.forEach(function(line,idx){
(function(line,idx){
// First show scrambled version
setTimeout(function(){
var scrambled='';
for(var k=0;k<line.length;k++){
scrambled+=rain[Math.floor(Math.random()*rain.length)];
}
var el=document.createElement('div');
el.className='term-line';
el.style.color='#00ff41';
el.style.textShadow='0 0 8px #00ff41';
el.textContent=scrambled;
o.appendChild(el);
o.scrollTop=o.scrollHeight;
// Then unscramble character by character
var chars=line.split('');
var current=scrambled.split('');
var ci=0;
var unscramble=setInterval(function(){
if(ci<chars.length){
current[ci]=chars[ci];
el.textContent=current.join('');
ci++;
}else{
clearInterval(unscramble);
el.style.textShadow='0 0 4px #00ff41';
}
},40);
},delay+idx*800);
})(line,idx);
});
delay+=lines.length*800+400;
// Phase 4: final rain + message
setTimeout(function(){tp('','default');},delay);
delay+=200;
for(var r2=0;r2<3;r2++){
(function(r2){
setTimeout(function(){
var l='';for(var j=0;j<60;j++)l+=rain[Math.floor(Math.random()*rain.length)];
tp(l,'green');
},delay+r2*80);
})(r2);
}
delay+=3*80+400;
setTimeout(function(){
tC('\u2014 The Matrix is everywhere. But so is hope. \u2014','dim');
},delay);
}

function doTetris(){tp('[LOADING MATRIX TETRIS...]','green');setTimeout(function(){var o=document.getElementById('tetrisOverlay'),f=document.getElementById('tetrisFrame');if(o&&f){f.src='tetris.html?user=operator';o.style.display='block';}else tp('Tetris not available.','red');},500);}
function closeTetris(){var o=document.getElementById('tetrisOverlay'),f=document.getElementById('tetrisFrame');if(o){o.style.display='none';f.src='';}}
function doHack(){var m=['[ACCESSING MAINFRAME...]','[ENCRYPTION BYPASS...]','[CRYPTO-BARRIER BREACHED]','[ROOT LOGIN...]','[KEYSTREAM: OK]','[TRACING... REDIRECTED]','[DATA LINK UP]','[TRINITY: "I\'m inside."]'],i=0;var iv=setInterval(function(){if(i<m.length)tp(m[i++],'green');else{clearInterval(iv);tp('[ACCESS GRANTED]','green');}},400);}
function doRain(){rainActive=!rainActive;var c=document.getElementById('matrixCanvas');if(c)c.style.opacity=rainActive?'0.4':'0';tp(rainActive?'Matrix rain: ON \u2014 the code is everywhere.':'Matrix rain: OFF \u2014 you see only darkness.','green');}
function doColab(){tp('=== GOOGLE COLAB NOTEBOOKS ===','green');var C='https://colab.research.google.com/github/error-wtf/',nbs=[['Unified-Results','SSZ Complete','Segmented-Spacetime-Mass-Projection-Unified-Results/blob/main/SSZ_Colab_Complete.ipynb'],['Unified-Results','Full Pipeline','Segmented-Spacetime-Mass-Projection-Unified-Results/blob/main/SSZ_Full_Pipeline_Colab.ipynb'],['Unified-Results','Master Pipeline','Segmented-Spacetime-Mass-Projection-Unified-Results/blob/main/SSZ_Master_Complete_Pipeline_Colab.ipynb'],['Unified-Results','Hawking Toolkit','Segmented-Spacetime-Mass-Projection-Unified-Results/blob/main/HAWKING_TOOLKIT_COLAB.ipynb'],['ssz-qubits','SSZ Qubits','ssz-qubits/blob/main/SSZ_Qubits_Colab.ipynb'],['ssz-schumann','SSZ Schumann','ssz-schumann/blob/main/SSZ_Schumann_Colab.ipynb'],['segmented-calculation-suite','SSZ Full App','segmented-calculation-suite/blob/main/SSZ_Colab_Full_App.ipynb'],['segmented-energy','Segmented Energy','segmented-energy/blob/main/Segmented_Energy_Colab.ipynb'],['Segmented-Spacetime-StarMaps','Star Explorer','Segmented-Spacetime-StarMaps/blob/main/SSZ_Explorer_Colab.ipynb'],['Segmented-Spacetime-StarMaps','Gradio Explorer','Segmented-Spacetime-StarMaps/blob/main/SSZ_Explorer_Gradio_Colab.ipynb'],['ssz-lensing','SSZ Lensing','ssz-lensing/blob/main/SSZ_Lensing_Colab.ipynb'],['pdf-translator-enhanced','PDF Translator','pdf-translator-enhanced/blob/main/PDF_Translator_Colab.ipynb']],last='';nbs.forEach(function(n){if(n[0]!==last){tC('[ '+n[0]+' ]','#0f0');last=n[0];}tH('  <a href="'+C+n[2]+'" target="_blank" rel="noopener" style="color:#ffcc00;text-decoration:underline">'+n[1]+'</a>');});tp('total '+nbs.length+' notebooks \u2014 click to open in Colab','dim');}
function doAbout(){tp('error-wtf // MATRIX PORTAL','green');tp('SSZ physics | tools | research','default');tp('Authors: Carmen N. Wrede, Lino P. Casu','default');tp('Type "ls" to browse, "tetris" to play.','dim');}
async function loadChatDB(){try{var r=await fetch('chat_db.json');var d=await r.json();Object.assign(CHAT_DB,d);}catch(e){console.error('chat_db load error',e);}}
document.addEventListener('DOMContentLoaded',async function(){await loadChatDB();initChat();
var tc=document.getElementById('tetrisClose');if(tc)tc.addEventListener('click',closeTetris);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=document.getElementById('tetrisOverlay');if(o&&o.style.display==='block')closeTetris();}});
window.addEventListener('message',function(e){if(e.data==='closeTetris')closeTetris();});
});
