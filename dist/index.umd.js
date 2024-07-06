!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("@bsv/sdk"),require("sigma-protocol")):"function"==typeof define&&define.amd?define(["exports","@bsv/sdk","sigma-protocol"],n):n((t||self).js1SatOrd={},t.bsv,t.sigmaProtocol)}(this,function(t,n,e){function r(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function o(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(e)return(e=e.call(t)).next.bind(e);if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return r(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?r(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function i(){return i=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)({}).hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},i.apply(null,arguments)}function s(t,n){return s=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},s(t,n)}var a=function(t){return Buffer.from(t).toString("hex")},u=/*#__PURE__*/function(t){function e(){return t.apply(this,arguments)||this}var r,o;return o=t,(r=e).prototype=Object.create(o.prototype),r.prototype.constructor=r,s(r,o),e.prototype.lock=function(t,e,r,o){var i="";if(void 0!==e&&void 0!==r){var s=a("ord"),u=Buffer.from(e,"base64").toString("hex").trim();if(!u)throw new Error("Invalid file data");var c=a(r);if(!c)throw new Error("Invalid media type");i="OP_0 OP_IF "+s+" OP_1 "+c+" OP_0 "+u+" OP_ENDIF"}var d=(i?i+" ":"")+(new n.P2PKH).lock(t).toASM();if(o&&(!o.app||!o.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=o&&o.app&&null!=o&&o.type){d=d+" OP_RETURN "+a("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+a("SET");for(var f=0,l=Object.entries(o);f<l.length;f++){var h=l[f],p=h[0],v=h[1];"cmd"!==p&&(d=d+" "+a(p)+" "+a(v))}}return n.LockingScript.fromASM(d)},e}(n.P2PKH),c=n.Utils.fromBase58Check,d=function(t,e){var r=n.fromUtxo(i({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),e);return r.sourceTXID=t.txid,r},f=function(t,n){try{var r,o=function(t){if(r)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},i=null==n?void 0:n.idKey,s=null==n?void 0:n.keyHost;if(i){var a=new e.Sigma(t).sign(i);return Promise.resolve(a.signedTx)}var u=function(){if(s){var o=null==n?void 0:n.authToken,i=new e.Sigma(t);return function(t,n){try{var e=Promise.resolve(i.remoteSign(s,o)).then(function(t){return r=1,t.signedTx})}catch(t){return n(t)}return e&&e.then?e.then(void 0,n):e}(0,function(t){throw console.log(t),new Error("Remote signing to "+s+" failed")})}}();return Promise.resolve(u&&u.then?u.then(o):o(u))}catch(t){return Promise.reject(t)}},l=function(t){try{t.satsPerKb||(t.satsPerKb=10),t.additionalPayments||(t.additionalPayments=[]),void 0===t.enforceUniformSend&&(t.enforceUniformSend=!0);for(var e,r=new n.SatoshisPerKilobyte(t.satsPerKb),i=new n.Transaction,s=[],a=o(t.ordinals);!(e=a()).done;){var c=e.value;if(1!==c.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var l=d(c,(new u).unlock(t.ordPk));s.push(c.txid+"_"+c.vout),i.addInput(l)}if(t.enforceUniformSend&&t.destinations.length!==t.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var h,p=o(t.destinations);!(h=p()).done;){var v,m,g,y=h.value;g=null!=(v=y.inscription)&&v.dataB64&&null!=(m=y.inscription)&&m.contentType?(new u).lock(y.address,y.inscription.dataB64,y.inscription.contentType,t.metaData):(new n.P2PKH).lock(y.address),i.addOutput({satoshis:1,lockingScript:g})}for(var P,b=o(t.additionalPayments);!(P=b()).done;){var w=P.value;console.log("Additional payment",w),i.addOutput({satoshis:w.amount,lockingScript:(new n.P2PKH).lock(w.to)})}for(var S,k=o(t.paymentUtxos);!(S=k()).done;){var x=S.value,O=d(x,(new n.P2PKH).unlock(t.paymentPk));s.push(x.txid+"_"+x.vout),i.addInput(O)}return Promise.resolve(r.computeFee(i)).then(function(e){function o(){return Promise.resolve(i.fee(r)).then(function(){return Promise.resolve(i.sign()).then(function(){return a&&(a.satoshis=i.outputs[i.outputs.length-1].satoshis,a.txid=i.hash("hex")),{tx:i,spentOutpoints:s,payChange:a}})})}var a,u=t.paymentUtxos.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),c=i.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0);if(u<c)throw new Error("Not enough ordinals to send");if(u>c+e){var d=(new n.P2PKH).lock(t.changeAddress||t.paymentPk.toAddress().toString()),l={lockingScript:d,change:!0};a={txid:"",vout:i.outputs.length,satoshis:0,script:Buffer.from(d.toHex(),"hex").toString("base64")},i.addOutput(l)}var h=function(){if(t.signer)return Promise.resolve(f(i,t.signer)).then(function(t){i=t})}();return h&&h.then?h.then(o):o()})}catch(t){return Promise.reject(t)}};const h="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function p(t,n,e){if(!t.s){if(e instanceof m){if(!e.s)return void(e.o=p.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(p.bind(null,t,n),p.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var v,m=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{p(r,1,i(this.v))}catch(t){p(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?p(r,1,n?n(o):o):e?p(r,1,e(o)):p(r,2,o)}catch(t){p(r,2,t)}},r},t}();function g(t){return t instanceof m&&1&t.s}t.TokenType=void 0,(v=t.TokenType||(t.TokenType={})).BSV20="bsv20",v.BSV21="bsv21",t.createOrdinals=function(t){try{for(var e,r=t.utxos,i=t.destinations,s=t.paymentPk,a=t.changeAddress,c=t.satsPerKb,l=t.metaData,h=t.signer,p=t.additionalPayments,v=void 0===p?[]:p,m=new n.SatoshisPerKilobyte(void 0===c?10:c),g=new n.Transaction,y=o(r);!(e=y()).done;){var P=d(e.value,(new n.P2PKH).unlock(s));g.addInput(P)}i.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var b,w=o(i);!(b=w()).done;){var S=b.value;if(!S.inscription)throw new Error("Inscription is required for all destinations");g.addOutput({satoshis:1,lockingScript:(new u).lock(S.address,S.inscription.dataB64,S.inscription.contentType,l)})}for(var k,x=o(v);!(k=x()).done;){var O=k.value;g.addOutput({satoshis:O.amount,lockingScript:(new n.P2PKH).lock(O.to)})}var T=r.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),K=g.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(m.computeFee(g)).then(function(t){function e(){return Promise.resolve(g.fee(m)).then(function(){return Promise.resolve(g.sign()).then(function(){return o&&(o.satoshis=g.outputs[g.outputs.length-1].satoshis,o.txid=g.hash("hex")),{tx:g,spentOutpoints:r.map(function(t){return t.txid+"_"+t.vout}),payChange:o}})})}var o;if(T>K+BigInt(t)){var i=(new n.P2PKH).lock(a||s.toAddress().toString()),u={lockingScript:i,change:!0};o={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(i.toHex(),"hex").toString("base64")},g.addOutput(u)}var c=function(){if(h)return Promise.resolve(f(g,h)).then(function(t){g=t})}();return c&&c.then?c.then(e):e()})}catch(t){return Promise.reject(t)}},t.fetchPayUtxos=function(t){try{var e="https://ordinals.gorillapool.io/api/txos/address/"+t+"/unspent?bsv20=false";return console.log({payUrl:e}),Promise.resolve(fetch(e)).then(function(e){if(!e.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(e.json()).then(function(e){e=e.filter(function(t){return 1!==t.satoshis});var r=c(t),o=(new n.P2PKH).lock(r.data);return e.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(o.toBinary()).toString("base64")}})})})}catch(t){return Promise.reject(t)}},t.sendOrdinals=l,t.sendUtxos=function(t){try{for(var e,r,i=function(){if(k<x+O)throw new Error("Not enough funds to send. Total sats in: "+k+", Total sats out: "+x+", Fee: "+O);var t;if(k>x+O){var e=(new n.P2PKH).lock(v),r={lockingScript:e,change:!0};t={txid:"",vout:P.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},P.addOutput(r)}else k<x+O&&console.log("No change needed");return Promise.resolve(P.fee(y)).then(function(){return Promise.resolve(P.sign()).then(function(){return t&&(t.satoshis=P.outputs[P.outputs.length-1].satoshis,t.txid=P.hash("hex")),{tx:P,spentOutpoints:s.map(function(t){return t.txid+"_"+t.vout}),payChange:t}})})},s=t.utxos,a=t.paymentPk,u=t.payments,c=t.satsPerKb,f=void 0===c?10:c,l=t.changeAddress,v=void 0===l?a.toAddress().toString():l,y=new n.SatoshisPerKilobyte(f),P=new n.Transaction,b=o(u);!(r=b()).done;){var w=r.value,S={satoshis:w.amount,lockingScript:(new n.P2PKH).lock(w.to)};P.addOutput(S)}var k=0n,x=P.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),O=0,T=function(t,n,e){if("function"==typeof t[h]){var r,o,i,s=t[h]();if(function t(a){try{for(;!((r=s.next()).done||e&&e());)if((a=n(r.value))&&a.then){if(!g(a))return void a.then(t,i||(i=p.bind(null,o=new m,2)));a=a.v}o?p(o,1,a):o=a}catch(t){p(o||(o=new m),2,t)}}(),s.return){var a=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(a){try{for(;++i<t.length&&(!e||!e());)if((a=n(i))&&a.then){if(!g(a))return void a.then(s,o||(o=p.bind(null,r=new m,2)));a=a.v}r?p(r,1,a):r=a}catch(t){p(r||(r=new m),2,t)}}(),r}(u,function(t){return n(u[t])},e)}(s,function(t){var r=d(t,(new n.P2PKH).unlock(a));return P.addInput(r),k+=BigInt(t.satoshis),Promise.resolve(y.computeFee(P)).then(function(t){k>=x+(O=t)&&(e=1)})},function(){return e});return Promise.resolve(T&&T.then?T.then(i):i())}catch(t){return Promise.reject(t)}},t.transferOrdTokens=function(n){try{var e=n.protocol,r=n.tokenID,s=n.utxos,a=n.inputTokens,u=n.distributions,c=n.paymentPk,d=n.ordPk,f=n.changeAddress,h=n.tokenChangeAddress,p=n.satsPerKb,v=void 0===p?10:p,m=n.metaData,g=n.signer,y=n.additionalPayments,P=void 0===y?[]:y,b=0n,w=0n,S=0n;if(!a.every(function(t){return t.id===r}))throw new Error("Input tokens do not match the provided tokenID");for(var k,x=o(a);!(k=x()).done;)w+=BigInt(k.value.amt);for(var O,T=o(u);!(O=T()).done;)S+=BigInt(O.value.amt);if(w<S)throw new Error("Not enough tokens to send");if((b=w-S)>0n){var K={address:h||d.toAddress().toString(),amt:b.toString()};u.push(K)}var B=u.map(function(n){var o,s={p:"bsv-20",op:"transfer",amt:n.amt};if(e===t.TokenType.BSV20)o=i({},s,{tick:r});else{if(e!==t.TokenType.BSV21)throw new Error("Invalid protocol");o=i({},s,{id:r})}return{address:n.address,inscription:{dataB64:Buffer.from(JSON.stringify(o)).toString("base64"),contentType:"application/bsv-20"}}}),I={paymentUtxos:s,ordinals:a,paymentPk:c,ordPk:d,destinations:B,changeAddress:f||c.toAddress().toString(),satsPerKb:v,metaData:m,signer:g,additionalPayments:P,enforceUniformSend:!1};return Promise.resolve(l(I)).then(function(t){var n,e=t.tx,o=t.spentOutpoints,i=t.payChange,s=B.findIndex(function(t){return t.address===(h||d.toAddress().toString())});return-1!==s&&(n={id:r,amt:b.toString(),satoshis:1,txid:e.id("hex"),vout:s,script:Buffer.from(e.outputs[s].lockingScript.toHex(),"hex").toString("base64")}),{tx:e,spentOutpoints:o,payChange:i,tokenChange:n}})}catch(t){return Promise.reject(t)}}});
//# sourceMappingURL=index.umd.js.map
