function renderMarkdown(md) {
    var cb = [];
    md = md.replace(/```(\w*)\n([\s\S]*?)```/g, function(m, l, c) {
        cb.push('<pre><code>' + escapeHtml(c) + '</code></pre>');
        return '\nCBLK' + (cb.length - 1) + 'CBLK\n';
    });
    var lines = md.split('\n'), out = '', i = 0;
    while (i < lines.length) {
        var L = lines[i];
        var cm = L.match(/^CBLK(\d+)CBLK$/);
        if (cm) { out += cb[parseInt(cm[1])]; i++; continue; }
        if (L.trim() === '') { i++; continue; }
        if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(L.trim())) { out += '<hr>'; i++; continue; }
        var hm = L.match(/^(#{1,6})\s+(.+)$/);
        if (hm) { out += '<h'+hm[1].length+'>'+inl(hm[2])+'</h'+hm[1].length+'>'; i++; continue; }
        if (L.includes('|') && i+1<lines.length && /^\s*\|?[\s:\-]+\|/.test(lines[i+1])) {
            var hdr=L.trim().replace(/^\||\|$/g,'').split('|').map(function(c){return c.trim()});
            i+=2; var rows=[];
            while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()!==''){
                rows.push(lines[i].trim().replace(/^\||\|$/g,'').split('|').map(function(c){return c.trim()}));i++;
            }
            out+='<table><thead><tr>'+hdr.map(function(h){return '<th>'+inl(h)+'</th>'}).join('')+'</tr></thead><tbody>';
            rows.forEach(function(r){out+='<tr>'+r.map(function(c){return '<td>'+inl(c)+'</td>'}).join('')+'</tr>'});
            out+='</tbody></table>'; continue;
        }
        if (/^>\s?/.test(L)) {
            var bq=[];while(i<lines.length&&/^>\s?/.test(lines[i])){bq.push(lines[i].replace(/^>\s?/,''));i++;}
            out+='<blockquote>'+renderMarkdown(bq.join('\n'))+'</blockquote>'; continue;
        }
        if (/^\s*[-*+]\s/.test(L)) {
            out+='<ul>';while(i<lines.length&&/^\s*[-*+]\s/.test(lines[i])){
                var li=lines[i].replace(/^\s*[-*+]\s/,'');
                var ck=li.match(/^\[([ xX])\]\s*(.*)/);
                if(ck){var ch=ck[1]!=' '?' checked':'';li='<input type="checkbox" disabled'+ch+'> '+inl(ck[2]);}else{li=inl(li);}
                out+='<li>'+li+'</li>';i++;
            }out+='</ul>'; continue;
        }
        if (/^\s*\d+\.\s/.test(L)) {
            out+='<ol>';while(i<lines.length&&/^\s*\d+\.\s/.test(lines[i])){
                out+='<li>'+inl(lines[i].replace(/^\s*\d+\.\s/,''))+'</li>';i++;
            }out+='</ol>'; continue;
        }
        out+='<p>'+inl(L)+'</p>'; i++;
    }
    return out;
}
function inl(s) {
    s = escapeHtml(s);
    var ph = [];
    function hold(h) { ph.push(h); return '\x00P'+( ph.length-1)+'P\x00'; }
    s = s.replace(/`([^`]+)`/g, function(_,t){ return hold('<code>'+t+'</code>'); });
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(_,a,u){ return hold('<img alt="'+a+'" src="'+u+'" style="max-width:100%">'); });
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_,t,u){ return hold('<a href="'+u+'" target="_blank">'+t+'</a>'); });
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
    s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');
    s = s.replace(/\x00P(\d+)P\x00/g, function(_,i){ return ph[+i]; });
    return s;
}
