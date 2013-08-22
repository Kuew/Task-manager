define(["require","./normalize"],function(e,t){function i(e){if("undefined"!=typeof process&&process.versions&&process.versions.node&&require.nodeRequire)try{var t=require.nodeRequire("csso"),i=e.length;return e=t.justDoIt(e),r("Compressed CSS output to "+Math.round(100*(e.length/i))+"%."),e}catch(n){return r('Compression module not installed. Use "npm install csso -g" to enable.'),e}return r("Compression not supported outside of nodejs environments."),e}function n(e){if("undefined"!=typeof process&&process.versions&&process.versions.node&&require.nodeRequire){var t=require.nodeRequire("fs"),i=t.readFileSync(e,"utf8");return 0===i.indexOf("﻿")?i.substring(1):i}var n,o,i=new java.io.File(e),a=java.lang.System.getProperty("line.separator"),r=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(i),"utf-8"));try{for(n=new java.lang.StringBuffer,o=r.readLine(),o&&o.length()&&65279===o.charAt(0)&&(o=o.substring(1)),n.append(o);null!==(o=r.readLine());)n.append(a).append(o);return String(n.toString())}finally{r.close()}}function o(e,t){if("undefined"!=typeof process&&process.versions&&process.versions.node&&require.nodeRequire){var i=require.nodeRequire("fs");i.writeFileSync(e,t,"utf8")}else{var n=new java.lang.String(t),o=new java.io.BufferedWriter(new java.io.OutputStreamWriter(new java.io.FileOutputStream(e),"utf-8"));try{o.write(n,0,n.length()),o.flush()}finally{o.close()}}}function a(e){return e.replace(/(["'\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")}var r=function(){};requirejs.tools&&requirejs.tools.useLib(function(e){e(["node/print"],function(e){r=e},function(){})});var s,l,u,d={},c=/@import\s*(url)?\s*(('([^']*)'|"([^"]*)")|\(('([^']*)'|"([^"]*)"|([^\)]*))\))\s*;?/g,p=function(e){var i=n(e);i=t(i,e,s);for(var o,a=[],r=[],u=[];o=c.exec(i);){var d=o[4]||o[5]||o[7]||o[8]||o[9];".less"!=d.substr(d.length-5,5)&&".css"!=d.substr(d.length-4,4)&&(d+=".css"),d.match(/:\/\//)||(d="/"==d.substr(0,1)?l+d:s+d,a.push(d),r.push(c.lastIndex-o[0].length),u.push(o[0].length))}for(var h=0;h<a.length;h++)!function(e){var t=p(a[e]);i=i.substr(0,r[e])+t+i.substr(r[e]+u[e]);for(var n=t.length-u[e],o=e+1;o<a.length;o++)r[o]+=n}(h);return i};d.load=function(e,t,i,n,o){if(s||(s=n.baseUrl),l||(l=n.cssBase||n.appDir||s,"/"!=l.substr(l.length-1,1)&&(l+="/")),n.modules)for(var a=0;a<n.modules.length;a++)if(void 0===n.modules[a].layer){u=a;break}d.config=d.config||n,e+=o?".less":".css";var r=t.toUrl(e);"http://"!=r.substr(0,7)&&"https://"!=r.substr(0,8)&&(f[e]=p(r),o&&(f[e]=o(f[e])),i())},d.normalize=function(e,t){return".css"==e.substr(e.length-4,4)&&(e=e.substr(0,e.length-4)),t(e)};var h=[],f=[];return d.write=function(e,t,i,n){if("http://"!=t.substr(0,7)&&"https://"!=t.substr(0,8)){var o=t+(n?".less":".css");h.push(f[o]);var a=!1;d.config.separateCSS&&(a=!0),"number"==typeof u&&void 0!==d.config.modules[u].separateCSS&&(a=d.config.modules[u].separateCSS),a?i.asModule(e+"!"+t,"define(function(){})"):i("requirejs.s.contexts._.nextTick = function(f){f()}; require(['css'], function(css) { css.addBuffer('"+o+"'); }); requirejs.s.contexts._.nextTick = requirejs.nextTick;")}},d.onLayerEnd=function(e,n,l){firstWrite=!0;var c=!1;d.config.separateCSS&&(c=!0),"number"==typeof u&&void 0!==d.config.modules[u].separateCSS&&(c=d.config.modules[u].separateCSS),u=null;var p=h.join("");if(c){r("Writing CSS! file: "+n.name+"\n");var f=this.config.appDir?this.config.baseUrl+n.name+".css":d.config.out.replace(/\.js$/,".css"),m=i(t(p,s,f));o(f,m)}else{if(""==p)return;p=a(i(p)),e("requirejs.s.contexts._.nextTick = function(f){f()}; require(['css'], function(css) { css.setBuffer('"+p+(l?"', true":"'")+"); }); requirejs.s.contexts._.nextTick = requirejs.nextTick; ")}h=[]},d});