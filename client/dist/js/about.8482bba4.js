(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"0d3b":function(e,t,r){var n=r("d039"),i=r("b622"),a=r("c430"),o=i("iterator");e.exports=!n((function(){var e=new URL("b?a=1&b=2&c=3","http://a"),t=e.searchParams,r="";return e.pathname="c%20d",t.forEach((function(e,n){t["delete"]("b"),r+=n+e})),a&&!e.toJSON||!t.sort||"http://a/c%20d?a=1&c=3"!==e.href||"3"!==t.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!t[o]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host}))},"159b":function(e,t,r){var n=r("da84"),i=r("fdbc"),a=r("17c2"),o=r("9112");for(var c in i){var s=n[c],u=s&&s.prototype;if(u&&u.forEach!==a)try{o(u,"forEach",a)}catch(f){u.forEach=a}}},"17c2":function(e,t,r){"use strict";var n=r("b727").forEach,i=r("a640"),a=r("ae40"),o=i("forEach"),c=a("forEach");e.exports=o&&c?[].forEach:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}},"2b3d":function(e,t,r){"use strict";r("3ca3");var n,i=r("23e7"),a=r("83ab"),o=r("0d3b"),c=r("da84"),s=r("37e8"),u=r("6eeb"),f=r("19aa"),l=r("5135"),h=r("60da"),p=r("4df4"),d=r("6547").codeAt,v=r("5fb2"),g=r("d44e"),m=r("9861"),y=r("69f3"),w=c.URL,b=m.URLSearchParams,L=m.getState,S=y.set,R=y.getterFor("URL"),x=Math.floor,k=Math.pow,A="Invalid authority",U="Invalid scheme",E="Invalid host",C="Invalid port",P=/[A-Za-z]/,q=/[\d+\-.A-Za-z]/,O=/\d/,B=/^(0x|0X)/,M=/^[0-7]+$/,j=/^\d+$/,T=/^[\dA-Fa-f]+$/,I=/[\u0000\u0009\u000A\u000D #%/:?@[\\]]/,_=/[\u0000\u0009\u000A\u000D #/:?@[\\]]/,D=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,F=/[\u0009\u000A\u000D]/g,G=function(e,t){var r,n,i;if("["==t.charAt(0)){if("]"!=t.charAt(t.length-1))return E;if(r=V(t.slice(1,-1)),!r)return E;e.host=r}else if(K(e)){if(t=v(t),I.test(t))return E;if(r=N(t),null===r)return E;e.host=r}else{if(_.test(t))return E;for(r="",n=p(t),i=0;i<n.length;i++)r+=Z(n[i],z);e.host=r}},N=function(e){var t,r,n,i,a,o,c,s=e.split(".");if(s.length&&""==s[s.length-1]&&s.pop(),t=s.length,t>4)return e;for(r=[],n=0;n<t;n++){if(i=s[n],""==i)return e;if(a=10,i.length>1&&"0"==i.charAt(0)&&(a=B.test(i)?16:8,i=i.slice(8==a?1:2)),""===i)o=0;else{if(!(10==a?j:8==a?M:T).test(i))return e;o=parseInt(i,a)}r.push(o)}for(n=0;n<t;n++)if(o=r[n],n==t-1){if(o>=k(256,5-t))return null}else if(o>255)return null;for(c=r.pop(),n=0;n<r.length;n++)c+=r[n]*k(256,3-n);return c},V=function(e){var t,r,n,i,a,o,c,s=[0,0,0,0,0,0,0,0],u=0,f=null,l=0,h=function(){return e.charAt(l)};if(":"==h()){if(":"!=e.charAt(1))return;l+=2,u++,f=u}while(h()){if(8==u)return;if(":"!=h()){t=r=0;while(r<4&&T.test(h()))t=16*t+parseInt(h(),16),l++,r++;if("."==h()){if(0==r)return;if(l-=r,u>6)return;n=0;while(h()){if(i=null,n>0){if(!("."==h()&&n<4))return;l++}if(!O.test(h()))return;while(O.test(h())){if(a=parseInt(h(),10),null===i)i=a;else{if(0==i)return;i=10*i+a}if(i>255)return;l++}s[u]=256*s[u]+i,n++,2!=n&&4!=n||u++}if(4!=n)return;break}if(":"==h()){if(l++,!h())return}else if(h())return;s[u++]=t}else{if(null!==f)return;l++,u++,f=u}}if(null!==f){o=u-f,u=7;while(0!=u&&o>0)c=s[u],s[u--]=s[f+o-1],s[f+--o]=c}else if(8!=u)return;return s},H=function(e){for(var t=null,r=1,n=null,i=0,a=0;a<8;a++)0!==e[a]?(i>r&&(t=n,r=i),n=null,i=0):(null===n&&(n=a),++i);return i>r&&(t=n,r=i),t},$=function(e){var t,r,n,i;if("number"==typeof e){for(t=[],r=0;r<4;r++)t.unshift(e%256),e=x(e/256);return t.join(".")}if("object"==typeof e){for(t="",n=H(e),r=0;r<8;r++)i&&0===e[r]||(i&&(i=!1),n===r?(t+=r?":":"::",i=!0):(t+=e[r].toString(16),r<7&&(t+=":")));return"["+t+"]"}return e},z={},J=h({},z,{" ":1,'"':1,"<":1,">":1,"`":1}),W=h({},J,{"#":1,"?":1,"{":1,"}":1}),Y=h({},W,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),Z=function(e,t){var r=d(e,0);return r>32&&r<127&&!l(t,e)?e:encodeURIComponent(e)},X={ftp:21,file:null,http:80,https:443,ws:80,wss:443},K=function(e){return l(X,e.scheme)},Q=function(e){return""!=e.username||""!=e.password},ee=function(e){return!e.host||e.cannotBeABaseURL||"file"==e.scheme},te=function(e,t){var r;return 2==e.length&&P.test(e.charAt(0))&&(":"==(r=e.charAt(1))||!t&&"|"==r)},re=function(e){var t;return e.length>1&&te(e.slice(0,2))&&(2==e.length||"/"===(t=e.charAt(2))||"\\"===t||"?"===t||"#"===t)},ne=function(e){var t=e.path,r=t.length;!r||"file"==e.scheme&&1==r&&te(t[0],!0)||t.pop()},ie=function(e){return"."===e||"%2e"===e.toLowerCase()},ae=function(e){return e=e.toLowerCase(),".."===e||"%2e."===e||".%2e"===e||"%2e%2e"===e},oe={},ce={},se={},ue={},fe={},le={},he={},pe={},de={},ve={},ge={},me={},ye={},we={},be={},Le={},Se={},Re={},xe={},ke={},Ae={},Ue=function(e,t,r,i){var a,o,c,s,u=r||oe,f=0,h="",d=!1,v=!1,g=!1;r||(e.scheme="",e.username="",e.password="",e.host=null,e.port=null,e.path=[],e.query=null,e.fragment=null,e.cannotBeABaseURL=!1,t=t.replace(D,"")),t=t.replace(F,""),a=p(t);while(f<=a.length){switch(o=a[f],u){case oe:if(!o||!P.test(o)){if(r)return U;u=se;continue}h+=o.toLowerCase(),u=ce;break;case ce:if(o&&(q.test(o)||"+"==o||"-"==o||"."==o))h+=o.toLowerCase();else{if(":"!=o){if(r)return U;h="",u=se,f=0;continue}if(r&&(K(e)!=l(X,h)||"file"==h&&(Q(e)||null!==e.port)||"file"==e.scheme&&!e.host))return;if(e.scheme=h,r)return void(K(e)&&X[e.scheme]==e.port&&(e.port=null));h="","file"==e.scheme?u=we:K(e)&&i&&i.scheme==e.scheme?u=ue:K(e)?u=pe:"/"==a[f+1]?(u=fe,f++):(e.cannotBeABaseURL=!0,e.path.push(""),u=xe)}break;case se:if(!i||i.cannotBeABaseURL&&"#"!=o)return U;if(i.cannotBeABaseURL&&"#"==o){e.scheme=i.scheme,e.path=i.path.slice(),e.query=i.query,e.fragment="",e.cannotBeABaseURL=!0,u=Ae;break}u="file"==i.scheme?we:le;continue;case ue:if("/"!=o||"/"!=a[f+1]){u=le;continue}u=de,f++;break;case fe:if("/"==o){u=ve;break}u=Re;continue;case le:if(e.scheme=i.scheme,o==n)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query;else if("/"==o||"\\"==o&&K(e))u=he;else if("?"==o)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query="",u=ke;else{if("#"!=o){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.path.pop(),u=Re;continue}e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query,e.fragment="",u=Ae}break;case he:if(!K(e)||"/"!=o&&"\\"!=o){if("/"!=o){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,u=Re;continue}u=ve}else u=de;break;case pe:if(u=de,"/"!=o||"/"!=h.charAt(f+1))continue;f++;break;case de:if("/"!=o&&"\\"!=o){u=ve;continue}break;case ve:if("@"==o){d&&(h="%40"+h),d=!0,c=p(h);for(var m=0;m<c.length;m++){var y=c[m];if(":"!=y||g){var w=Z(y,Y);g?e.password+=w:e.username+=w}else g=!0}h=""}else if(o==n||"/"==o||"?"==o||"#"==o||"\\"==o&&K(e)){if(d&&""==h)return A;f-=p(h).length+1,h="",u=ge}else h+=o;break;case ge:case me:if(r&&"file"==e.scheme){u=Le;continue}if(":"!=o||v){if(o==n||"/"==o||"?"==o||"#"==o||"\\"==o&&K(e)){if(K(e)&&""==h)return E;if(r&&""==h&&(Q(e)||null!==e.port))return;if(s=G(e,h),s)return s;if(h="",u=Se,r)return;continue}"["==o?v=!0:"]"==o&&(v=!1),h+=o}else{if(""==h)return E;if(s=G(e,h),s)return s;if(h="",u=ye,r==me)return}break;case ye:if(!O.test(o)){if(o==n||"/"==o||"?"==o||"#"==o||"\\"==o&&K(e)||r){if(""!=h){var b=parseInt(h,10);if(b>65535)return C;e.port=K(e)&&b===X[e.scheme]?null:b,h=""}if(r)return;u=Se;continue}return C}h+=o;break;case we:if(e.scheme="file","/"==o||"\\"==o)u=be;else{if(!i||"file"!=i.scheme){u=Re;continue}if(o==n)e.host=i.host,e.path=i.path.slice(),e.query=i.query;else if("?"==o)e.host=i.host,e.path=i.path.slice(),e.query="",u=ke;else{if("#"!=o){re(a.slice(f).join(""))||(e.host=i.host,e.path=i.path.slice(),ne(e)),u=Re;continue}e.host=i.host,e.path=i.path.slice(),e.query=i.query,e.fragment="",u=Ae}}break;case be:if("/"==o||"\\"==o){u=Le;break}i&&"file"==i.scheme&&!re(a.slice(f).join(""))&&(te(i.path[0],!0)?e.path.push(i.path[0]):e.host=i.host),u=Re;continue;case Le:if(o==n||"/"==o||"\\"==o||"?"==o||"#"==o){if(!r&&te(h))u=Re;else if(""==h){if(e.host="",r)return;u=Se}else{if(s=G(e,h),s)return s;if("localhost"==e.host&&(e.host=""),r)return;h="",u=Se}continue}h+=o;break;case Se:if(K(e)){if(u=Re,"/"!=o&&"\\"!=o)continue}else if(r||"?"!=o)if(r||"#"!=o){if(o!=n&&(u=Re,"/"!=o))continue}else e.fragment="",u=Ae;else e.query="",u=ke;break;case Re:if(o==n||"/"==o||"\\"==o&&K(e)||!r&&("?"==o||"#"==o)){if(ae(h)?(ne(e),"/"==o||"\\"==o&&K(e)||e.path.push("")):ie(h)?"/"==o||"\\"==o&&K(e)||e.path.push(""):("file"==e.scheme&&!e.path.length&&te(h)&&(e.host&&(e.host=""),h=h.charAt(0)+":"),e.path.push(h)),h="","file"==e.scheme&&(o==n||"?"==o||"#"==o))while(e.path.length>1&&""===e.path[0])e.path.shift();"?"==o?(e.query="",u=ke):"#"==o&&(e.fragment="",u=Ae)}else h+=Z(o,W);break;case xe:"?"==o?(e.query="",u=ke):"#"==o?(e.fragment="",u=Ae):o!=n&&(e.path[0]+=Z(o,z));break;case ke:r||"#"!=o?o!=n&&("'"==o&&K(e)?e.query+="%27":e.query+="#"==o?"%23":Z(o,z)):(e.fragment="",u=Ae);break;case Ae:o!=n&&(e.fragment+=Z(o,J));break}f++}},Ee=function(e){var t,r,n=f(this,Ee,"URL"),i=arguments.length>1?arguments[1]:void 0,o=String(e),c=S(n,{type:"URL"});if(void 0!==i)if(i instanceof Ee)t=R(i);else if(r=Ue(t={},String(i)),r)throw TypeError(r);if(r=Ue(c,o,null,t),r)throw TypeError(r);var s=c.searchParams=new b,u=L(s);u.updateSearchParams(c.query),u.updateURL=function(){c.query=String(s)||null},a||(n.href=Pe.call(n),n.origin=qe.call(n),n.protocol=Oe.call(n),n.username=Be.call(n),n.password=Me.call(n),n.host=je.call(n),n.hostname=Te.call(n),n.port=Ie.call(n),n.pathname=_e.call(n),n.search=De.call(n),n.searchParams=Fe.call(n),n.hash=Ge.call(n))},Ce=Ee.prototype,Pe=function(){var e=R(this),t=e.scheme,r=e.username,n=e.password,i=e.host,a=e.port,o=e.path,c=e.query,s=e.fragment,u=t+":";return null!==i?(u+="//",Q(e)&&(u+=r+(n?":"+n:"")+"@"),u+=$(i),null!==a&&(u+=":"+a)):"file"==t&&(u+="//"),u+=e.cannotBeABaseURL?o[0]:o.length?"/"+o.join("/"):"",null!==c&&(u+="?"+c),null!==s&&(u+="#"+s),u},qe=function(){var e=R(this),t=e.scheme,r=e.port;if("blob"==t)try{return new URL(t.path[0]).origin}catch(n){return"null"}return"file"!=t&&K(e)?t+"://"+$(e.host)+(null!==r?":"+r:""):"null"},Oe=function(){return R(this).scheme+":"},Be=function(){return R(this).username},Me=function(){return R(this).password},je=function(){var e=R(this),t=e.host,r=e.port;return null===t?"":null===r?$(t):$(t)+":"+r},Te=function(){var e=R(this).host;return null===e?"":$(e)},Ie=function(){var e=R(this).port;return null===e?"":String(e)},_e=function(){var e=R(this),t=e.path;return e.cannotBeABaseURL?t[0]:t.length?"/"+t.join("/"):""},De=function(){var e=R(this).query;return e?"?"+e:""},Fe=function(){return R(this).searchParams},Ge=function(){var e=R(this).fragment;return e?"#"+e:""},Ne=function(e,t){return{get:e,set:t,configurable:!0,enumerable:!0}};if(a&&s(Ce,{href:Ne(Pe,(function(e){var t=R(this),r=String(e),n=Ue(t,r);if(n)throw TypeError(n);L(t.searchParams).updateSearchParams(t.query)})),origin:Ne(qe),protocol:Ne(Oe,(function(e){var t=R(this);Ue(t,String(e)+":",oe)})),username:Ne(Be,(function(e){var t=R(this),r=p(String(e));if(!ee(t)){t.username="";for(var n=0;n<r.length;n++)t.username+=Z(r[n],Y)}})),password:Ne(Me,(function(e){var t=R(this),r=p(String(e));if(!ee(t)){t.password="";for(var n=0;n<r.length;n++)t.password+=Z(r[n],Y)}})),host:Ne(je,(function(e){var t=R(this);t.cannotBeABaseURL||Ue(t,String(e),ge)})),hostname:Ne(Te,(function(e){var t=R(this);t.cannotBeABaseURL||Ue(t,String(e),me)})),port:Ne(Ie,(function(e){var t=R(this);ee(t)||(e=String(e),""==e?t.port=null:Ue(t,e,ye))})),pathname:Ne(_e,(function(e){var t=R(this);t.cannotBeABaseURL||(t.path=[],Ue(t,e+"",Se))})),search:Ne(De,(function(e){var t=R(this);e=String(e),""==e?t.query=null:("?"==e.charAt(0)&&(e=e.slice(1)),t.query="",Ue(t,e,ke)),L(t.searchParams).updateSearchParams(t.query)})),searchParams:Ne(Fe),hash:Ne(Ge,(function(e){var t=R(this);e=String(e),""!=e?("#"==e.charAt(0)&&(e=e.slice(1)),t.fragment="",Ue(t,e,Ae)):t.fragment=null}))}),u(Ce,"toJSON",(function(){return Pe.call(this)}),{enumerable:!0}),u(Ce,"toString",(function(){return Pe.call(this)}),{enumerable:!0}),w){var Ve=w.createObjectURL,He=w.revokeObjectURL;Ve&&u(Ee,"createObjectURL",(function(e){return Ve.apply(w,arguments)})),He&&u(Ee,"revokeObjectURL",(function(e){return He.apply(w,arguments)}))}g(Ee,"URL"),i({global:!0,forced:!o,sham:!a},{URL:Ee})},"3ca3":function(e,t,r){"use strict";var n=r("6547").charAt,i=r("69f3"),a=r("7dd0"),o="String Iterator",c=i.set,s=i.getterFor(o);a(String,"String",(function(e){c(this,{type:o,string:String(e),index:0})}),(function(){var e,t=s(this),r=t.string,i=t.index;return i>=r.length?{value:void 0,done:!0}:(e=n(r,i),t.index+=e.length,{value:e,done:!1})}))},4160:function(e,t,r){"use strict";var n=r("23e7"),i=r("17c2");n({target:"Array",proto:!0,forced:[].forEach!=i},{forEach:i})},4401:function(e,t,r){"use strict";var n=r("75f8"),i=r.n(n);i.a},"4df4":function(e,t,r){"use strict";var n=r("0366"),i=r("7b0b"),a=r("9bdd"),o=r("e95a"),c=r("50c4"),s=r("8418"),u=r("35a1");e.exports=function(e){var t,r,f,l,h,p,d=i(e),v="function"==typeof this?this:Array,g=arguments.length,m=g>1?arguments[1]:void 0,y=void 0!==m,w=u(d),b=0;if(y&&(m=n(m,g>2?arguments[2]:void 0,2)),void 0==w||v==Array&&o(w))for(t=c(d.length),r=new v(t);t>b;b++)p=y?m(d[b],b):d[b],s(r,b,p);else for(l=w.call(d),h=l.next,r=new v;!(f=h.call(l)).done;b++)p=y?a(l,m,[f.value,b],!0):f.value,s(r,b,p);return r.length=b,r}},"5fb2":function(e,t,r){"use strict";var n=2147483647,i=36,a=1,o=26,c=38,s=700,u=72,f=128,l="-",h=/[^\0-\u007E]/,p=/[.\u3002\uFF0E\uFF61]/g,d="Overflow: input needs wider integers to process",v=i-a,g=Math.floor,m=String.fromCharCode,y=function(e){var t=[],r=0,n=e.length;while(r<n){var i=e.charCodeAt(r++);if(i>=55296&&i<=56319&&r<n){var a=e.charCodeAt(r++);56320==(64512&a)?t.push(((1023&i)<<10)+(1023&a)+65536):(t.push(i),r--)}else t.push(i)}return t},w=function(e){return e+22+75*(e<26)},b=function(e,t,r){var n=0;for(e=r?g(e/s):e>>1,e+=g(e/t);e>v*o>>1;n+=i)e=g(e/v);return g(n+(v+1)*e/(e+c))},L=function(e){var t=[];e=y(e);var r,c,s=e.length,h=f,p=0,v=u;for(r=0;r<e.length;r++)c=e[r],c<128&&t.push(m(c));var L=t.length,S=L;L&&t.push(l);while(S<s){var R=n;for(r=0;r<e.length;r++)c=e[r],c>=h&&c<R&&(R=c);var x=S+1;if(R-h>g((n-p)/x))throw RangeError(d);for(p+=(R-h)*x,h=R,r=0;r<e.length;r++){if(c=e[r],c<h&&++p>n)throw RangeError(d);if(c==h){for(var k=p,A=i;;A+=i){var U=A<=v?a:A>=v+o?o:A-v;if(k<U)break;var E=k-U,C=i-U;t.push(m(w(U+E%C))),k=g(E/C)}t.push(m(w(k))),v=b(p,x,S==L),p=0,++S}}++p,++h}return t.join("")};e.exports=function(e){var t,r,n=[],i=e.toLowerCase().replace(p,".").split(".");for(t=0;t<i.length;t++)r=i[t],n.push(h.test(r)?"xn--"+L(r):r);return n.join(".")}},6547:function(e,t,r){var n=r("a691"),i=r("1d80"),a=function(e){return function(t,r){var a,o,c=String(i(t)),s=n(r),u=c.length;return s<0||s>=u?e?"":void 0:(a=c.charCodeAt(s),a<55296||a>56319||s+1===u||(o=c.charCodeAt(s+1))<56320||o>57343?e?c.charAt(s):a:e?c.slice(s,s+2):o-56320+(a-55296<<10)+65536)}};e.exports={codeAt:a(!1),charAt:a(!0)}},"65f0":function(e,t,r){var n=r("861d"),i=r("e8b5"),a=r("b622"),o=a("species");e.exports=function(e,t){var r;return i(e)&&(r=e.constructor,"function"!=typeof r||r!==Array&&!i(r.prototype)?n(r)&&(r=r[o],null===r&&(r=void 0)):r=void 0),new(void 0===r?Array:r)(0===t?0:t)}},"75f8":function(e,t,r){},8418:function(e,t,r){"use strict";var n=r("c04e"),i=r("9bf2"),a=r("5c6c");e.exports=function(e,t,r){var o=n(t);o in e?i.f(e,o,a(0,r)):e[o]=r}},"96cf":function(e,t,r){var n=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,i="function"===typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",o=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function s(e,t,r,n){var i=t&&t.prototype instanceof v?t:v,a=Object.create(i.prototype),o=new E(n||[]);return a._invoke=x(e,r,o),a}function u(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(n){return{type:"throw",arg:n}}}e.wrap=s;var f="suspendedStart",l="suspendedYield",h="executing",p="completed",d={};function v(){}function g(){}function m(){}var y={};y[a]=function(){return this};var w=Object.getPrototypeOf,b=w&&w(w(C([])));b&&b!==r&&n.call(b,a)&&(y=b);var L=m.prototype=v.prototype=Object.create(y);function S(e){["next","throw","return"].forEach((function(t){e[t]=function(e){return this._invoke(t,e)}}))}function R(e,t){function r(i,a,o,c){var s=u(e[i],e,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"===typeof l&&n.call(l,"__await")?t.resolve(l.__await).then((function(e){r("next",e,o,c)}),(function(e){r("throw",e,o,c)})):t.resolve(l).then((function(e){f.value=e,o(f)}),(function(e){return r("throw",e,o,c)}))}c(s.arg)}var i;function a(e,n){function a(){return new t((function(t,i){r(e,n,t,i)}))}return i=i?i.then(a,a):a()}this._invoke=a}function x(e,t,r){var n=f;return function(i,a){if(n===h)throw new Error("Generator is already running");if(n===p){if("throw"===i)throw a;return P()}r.method=i,r.arg=a;while(1){var o=r.delegate;if(o){var c=k(o,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var s=u(e,t,r);if("normal"===s.type){if(n=r.done?p:l,s.arg===d)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n=p,r.method="throw",r.arg=s.arg)}}}function k(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator["return"]&&(r.method="return",r.arg=t,k(e,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var i=u(n,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function A(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function U(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function E(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(A,this),this.reset(!0)}function C(e){if(e){var r=e[a];if(r)return r.call(e);if("function"===typeof e.next)return e;if(!isNaN(e.length)){var i=-1,o=function r(){while(++i<e.length)if(n.call(e,i))return r.value=e[i],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}return{next:P}}function P(){return{value:t,done:!0}}return g.prototype=L.constructor=m,m.constructor=g,m[c]=g.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var t="function"===typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,m):(e.__proto__=m,c in e||(e[c]="GeneratorFunction")),e.prototype=Object.create(L),e},e.awrap=function(e){return{__await:e}},S(R.prototype),R.prototype[o]=function(){return this},e.AsyncIterator=R,e.async=function(t,r,n,i,a){void 0===a&&(a=Promise);var o=new R(s(t,r,n,i),a);return e.isGeneratorFunction(r)?o:o.next().then((function(e){return e.done?e.value:o.next()}))},S(L),L[c]="Generator",L[a]=function(){return this},L.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){while(t.length){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=C,E.prototype={constructor:E,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(U),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0],t=e.completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function i(n,i){return c.type="throw",c.arg=e,r.next=n,i&&(r.method="next",r.arg=t),!!i}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],c=o.completion;if("root"===o.tryLoc)return i("end");if(o.tryLoc<=this.prev){var s=n.call(o,"catchLoc"),u=n.call(o,"finallyLoc");if(s&&u){if(this.prev<o.catchLoc)return i(o.catchLoc,!0);if(this.prev<o.finallyLoc)return i(o.finallyLoc)}else if(s){if(this.prev<o.catchLoc)return i(o.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return i(o.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&n.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var a=i;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=e,o.arg=t,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(o)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),d},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),U(r),d}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var i=n.arg;U(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),d}},e}(e.exports);try{regeneratorRuntime=n}catch(i){Function("r","regeneratorRuntime = r")(n)}},9861:function(e,t,r){"use strict";r("e260");var n=r("23e7"),i=r("d066"),a=r("0d3b"),o=r("6eeb"),c=r("e2cc"),s=r("d44e"),u=r("9ed3"),f=r("69f3"),l=r("19aa"),h=r("5135"),p=r("0366"),d=r("f5df"),v=r("825a"),g=r("861d"),m=r("7c73"),y=r("5c6c"),w=r("9a1f"),b=r("35a1"),L=r("b622"),S=i("fetch"),R=i("Headers"),x=L("iterator"),k="URLSearchParams",A=k+"Iterator",U=f.set,E=f.getterFor(k),C=f.getterFor(A),P=/\+/g,q=Array(4),O=function(e){return q[e-1]||(q[e-1]=RegExp("((?:%[\\da-f]{2}){"+e+"})","gi"))},B=function(e){try{return decodeURIComponent(e)}catch(t){return e}},M=function(e){var t=e.replace(P," "),r=4;try{return decodeURIComponent(t)}catch(n){while(r)t=t.replace(O(r--),B);return t}},j=/[!'()~]|%20/g,T={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},I=function(e){return T[e]},_=function(e){return encodeURIComponent(e).replace(j,I)},D=function(e,t){if(t){var r,n,i=t.split("&"),a=0;while(a<i.length)r=i[a++],r.length&&(n=r.split("="),e.push({key:M(n.shift()),value:M(n.join("="))}))}},F=function(e){this.entries.length=0,D(this.entries,e)},G=function(e,t){if(e<t)throw TypeError("Not enough arguments")},N=u((function(e,t){U(this,{type:A,iterator:w(E(e).entries),kind:t})}),"Iterator",(function(){var e=C(this),t=e.kind,r=e.iterator.next(),n=r.value;return r.done||(r.value="keys"===t?n.key:"values"===t?n.value:[n.key,n.value]),r})),V=function(){l(this,V,k);var e,t,r,n,i,a,o,c,s,u=arguments.length>0?arguments[0]:void 0,f=this,p=[];if(U(f,{type:k,entries:p,updateURL:function(){},updateSearchParams:F}),void 0!==u)if(g(u))if(e=b(u),"function"===typeof e){t=e.call(u),r=t.next;while(!(n=r.call(t)).done){if(i=w(v(n.value)),a=i.next,(o=a.call(i)).done||(c=a.call(i)).done||!a.call(i).done)throw TypeError("Expected sequence with length 2");p.push({key:o.value+"",value:c.value+""})}}else for(s in u)h(u,s)&&p.push({key:s,value:u[s]+""});else D(p,"string"===typeof u?"?"===u.charAt(0)?u.slice(1):u:u+"")},H=V.prototype;c(H,{append:function(e,t){G(arguments.length,2);var r=E(this);r.entries.push({key:e+"",value:t+""}),r.updateURL()},delete:function(e){G(arguments.length,1);var t=E(this),r=t.entries,n=e+"",i=0;while(i<r.length)r[i].key===n?r.splice(i,1):i++;t.updateURL()},get:function(e){G(arguments.length,1);for(var t=E(this).entries,r=e+"",n=0;n<t.length;n++)if(t[n].key===r)return t[n].value;return null},getAll:function(e){G(arguments.length,1);for(var t=E(this).entries,r=e+"",n=[],i=0;i<t.length;i++)t[i].key===r&&n.push(t[i].value);return n},has:function(e){G(arguments.length,1);var t=E(this).entries,r=e+"",n=0;while(n<t.length)if(t[n++].key===r)return!0;return!1},set:function(e,t){G(arguments.length,1);for(var r,n=E(this),i=n.entries,a=!1,o=e+"",c=t+"",s=0;s<i.length;s++)r=i[s],r.key===o&&(a?i.splice(s--,1):(a=!0,r.value=c));a||i.push({key:o,value:c}),n.updateURL()},sort:function(){var e,t,r,n=E(this),i=n.entries,a=i.slice();for(i.length=0,r=0;r<a.length;r++){for(e=a[r],t=0;t<r;t++)if(i[t].key>e.key){i.splice(t,0,e);break}t===r&&i.push(e)}n.updateURL()},forEach:function(e){var t,r=E(this).entries,n=p(e,arguments.length>1?arguments[1]:void 0,3),i=0;while(i<r.length)t=r[i++],n(t.value,t.key,this)},keys:function(){return new N(this,"keys")},values:function(){return new N(this,"values")},entries:function(){return new N(this,"entries")}},{enumerable:!0}),o(H,x,H.entries),o(H,"toString",(function(){var e,t=E(this).entries,r=[],n=0;while(n<t.length)e=t[n++],r.push(_(e.key)+"="+_(e.value));return r.join("&")}),{enumerable:!0}),s(V,k),n({global:!0,forced:!a},{URLSearchParams:V}),a||"function"!=typeof S||"function"!=typeof R||n({global:!0,enumerable:!0,forced:!0},{fetch:function(e){var t,r,n,i=[e];return arguments.length>1&&(t=arguments[1],g(t)&&(r=t.body,d(r)===k&&(n=t.headers?new R(t.headers):new R,n.has("content-type")||n.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),t=m(t,{body:y(0,String(r)),headers:y(0,n)}))),i.push(t)),S.apply(this,i)}}),e.exports={URLSearchParams:V,getState:E}},"9a1f":function(e,t,r){var n=r("825a"),i=r("35a1");e.exports=function(e){var t=i(e);if("function"!=typeof t)throw TypeError(String(e)+" is not iterable");return n(t.call(e))}},a640:function(e,t,r){"use strict";var n=r("d039");e.exports=function(e,t){var r=[][e];return!!r&&n((function(){r.call(null,t||function(){throw 1},1)}))}},ae40:function(e,t,r){var n=r("83ab"),i=r("d039"),a=r("5135"),o=Object.defineProperty,c={},s=function(e){throw e};e.exports=function(e,t){if(a(c,e))return c[e];t||(t={});var r=[][e],u=!!a(t,"ACCESSORS")&&t.ACCESSORS,f=a(t,0)?t[0]:s,l=a(t,1)?t[1]:void 0;return c[e]=!!r&&!i((function(){if(u&&!n)return!0;var e={length:-1};u?o(e,1,{enumerable:!0,get:s}):e[1]=1,r.call(e,f,l)}))}},b0c0:function(e,t,r){var n=r("83ab"),i=r("9bf2").f,a=Function.prototype,o=a.toString,c=/^\s*function ([^ (]*)/,s="name";n&&!(s in a)&&i(a,s,{configurable:!0,get:function(){try{return o.call(this).match(c)[1]}catch(e){return""}}})},b727:function(e,t,r){var n=r("0366"),i=r("44ad"),a=r("7b0b"),o=r("50c4"),c=r("65f0"),s=[].push,u=function(e){var t=1==e,r=2==e,u=3==e,f=4==e,l=6==e,h=5==e||l;return function(p,d,v,g){for(var m,y,w=a(p),b=i(w),L=n(d,v,3),S=o(b.length),R=0,x=g||c,k=t?x(p,S):r?x(p,0):void 0;S>R;R++)if((h||R in b)&&(m=b[R],y=L(m,R,w),e))if(t)k[R]=y;else if(y)switch(e){case 3:return!0;case 5:return m;case 6:return R;case 2:s.call(k,m)}else if(f)return!1;return l?-1:u||f?f:k}};e.exports={forEach:u(0),map:u(1),filter:u(2),some:u(3),every:u(4),find:u(5),findIndex:u(6)}},c0b3:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"camera_outer"},[r("p",[r("button",{attrs:{id:"openMedia"}},[e._v("打开")]),r("button",{attrs:{id:"closeMedia"}},[e._v("关闭")]),r("button",{attrs:{id:"drawMedia"}},[e._v("截取")])]),r("video",{staticClass:"bg",attrs:{id:"video"}}),r("canvas",{attrs:{id:"qr-canvas"}})])}],a=(r("4160"),r("b0c0"),r("d3b7"),r("3ca3"),r("159b"),r("ddb0"),r("2b3d"),{data:function(){return{videoWidth:3e3,videoHeight:300,imgSrc:"",thisCancas:null,thisContext:null,thisVideo:null}},mounted:function(){document.querySelector("#openMedia").click=c,document.querySelector("#closeMedia").click=s,document.querySelector("#drawMedia").click=u;var e,t=document.querySelector("video"),r=document.getElementById("qr-canvas"),n=r.getContext("2d");window.URL=window.URL||window.webkitURL||window.mozURL||window.msURL,void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;return t?new Promise((function(r,n){t.call(navigator,e,r,n)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))});var i={audio:!1,video:!0};function a(r){e=r,t=document.querySelector("video"),"srcObject"in t?t.srcObject=r:t.src=window.URL&&window.URL.createObjectURL(r)||r,t.play()}function o(e){alert(e.name)}function c(){navigator.mediaDevices.getUserMedia(i).then(a).catch(o)}function s(){e.getVideoTracks().forEach((function(e){e.stop(),n.clearRect(0,0,n.width,n.height)}))}function u(){r.setAttribute("width",t.videoWidth),r.setAttribute("height",t.videoHeight),n.drawImage(t,0,0,t.videoWidth,t.videoHeight)}}}),o=a,c=(r("dde4"),r("2877")),s=Object(c["a"])(o,n,i,!1,null,"3ad7a222",null);t["default"]=s.exports},ddb0:function(e,t,r){var n=r("da84"),i=r("fdbc"),a=r("e260"),o=r("9112"),c=r("b622"),s=c("iterator"),u=c("toStringTag"),f=a.values;for(var l in i){var h=n[l],p=h&&h.prototype;if(p){if(p[s]!==f)try{o(p,s,f)}catch(v){p[s]=f}if(p[u]||o(p,u,l),i[l])for(var d in a)if(p[d]!==a[d])try{o(p,d,a[d])}catch(v){p[d]=a[d]}}}},dde4:function(e,t,r){"use strict";var n=r("ff32"),i=r.n(n);i.a},e001:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"video-wrapper"},[r("button",{on:{click:e.getUserMediaStream}},[e._v("点击录像")]),r("video",{ref:"videoA",attrs:{id:"rtcA",src:"",preload:"auto"}}),r("video",{ref:"videoB",attrs:{id:"rtcB",src:"",preload:"auto"}})])},i=[];r("d3b7"),r("3ca3"),r("ddb0"),r("2b3d"),r("96cf"),r("e6cf");function a(e,t,r,n,i,a,o){try{var c=e[a](o),s=c.value}catch(u){return void r(u)}c.done?t(s):Promise.resolve(s).then(n,i)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(n,i){var o=e.apply(t,r);function c(e){a(o,n,i,c,s,"next",e)}function s(e){a(o,n,i,c,s,"throw",e)}c(void 0)}))}}var c={name:"",data:function(){return{peerA:null,peerB:null,offerOption:""}},mounted:function(){},methods:{getUserMediaStream:function(){var e={video:!0,audio:!0};void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.getUserMedia;return t?new Promise((function(r,n){t.call(navigator,e,r,n)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),navigator.mediaDevices.getUserMedia(e).then((function(e){var t=document.querySelector("#rtcA");console.log("stream",e.length,e),t.src=window.URL.createObjectURL(e)||e,t.onloadedmetadata=function(e){console.log("可以播放了"),t.play()}})).catch((function(e){console.error(e)}))},initPeer:function(){var e=this,t=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;console.log("PeerConnection",t),this.peerA=new t(this.getIceServers()),this.peerB=new t(this.getIceServers()),this.peerA.addStream(this.localstream),this.peerA.onicecandidate=function(t){t.candidate&&e.peerB.addIceCandidate(t.candidate),e.call()},this.peerB.onaddstream=function(t){var r=e.$refs.videoB;r.srcObject=t.stream},this.peerB.onicecandidate=function(t){t.candidate&&e.peerA.addIceCandidate(t.candidate)}},call:function(){var e=this;return o(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.peerA.createOffer(e.offerOption);case 2:return r=t.sent,t.next=5,e.onCreateOffer(r);case 5:case"end":return t.stop()}}),t)})))()},onCreateOffer:function(e){var t=this;return o(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,t.peerB.setLocalDescription(e);case 3:return r.next=5,t.peerA.setRemoteDescription(e);case 5:return r.next=7,t.onCreateAnswer();case 7:r.next=12;break;case 9:r.prev=9,r.t0=r["catch"](0),console.error(r.t0);case 12:case"end":return r.stop()}}),r,null,[[0,9]])})))()},onCreateAnswer:function(){var e=this;return o(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.peerA.createAnswer();case 3:return r=t.sent,t.next=6,e.peerA.setLocalDescription(r);case 6:return t.next=8,e.peerB.setRemoteDescription(r);case 8:t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](0),console.error(t.t0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})))()},getIceServers:function(){return{iceServers:[{url:"stun:stun.l.google.com:19302"}]}}}},s=c,u=(r("4401"),r("2877")),f=Object(u["a"])(s,n,i,!1,null,"72d33896",null);t["default"]=f.exports},e8b5:function(e,t,r){var n=r("c6b6");e.exports=Array.isArray||function(e){return"Array"==n(e)}},fdbc:function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},ff32:function(e,t,r){}}]);
//# sourceMappingURL=about.8482bba4.js.map