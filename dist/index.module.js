import{P2PKH as t,LockingScript as n,Utils as r,fromUtxo as e,SatoshisPerKilobyte as o,Transaction as i}from"@bsv/sdk";import{Sigma as s}from"sigma-protocol";function a(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=Array(n);r<n;r++)e[r]=t[r];return e}function u(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return a(t,n);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var e=0;return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(){return c=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var e in r)({}).hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t},c.apply(null,arguments)}function d(t,n){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},d(t,n)}var f=function(t){return Buffer.from(t).toString("hex")},l=/*#__PURE__*/function(r){function e(){return r.apply(this,arguments)||this}var o,i;return i=r,(o=e).prototype=Object.create(i.prototype),o.prototype.constructor=o,d(o,i),e.prototype.lock=function(r,e,o,i){var s="";if(void 0!==e&&void 0!==o){var a=f("ord"),u=Buffer.from(e,"base64").toString("hex").trim();if(!u)throw new Error("Invalid file data");var c=f(o);if(!c)throw new Error("Invalid media type");s="OP_0 OP_IF "+a+" OP_1 "+c+" OP_0 "+u+" OP_ENDIF"}var d=(s?s+" ":"")+(new t).lock(r).toASM();if(i&&(!i.app||!i.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=i&&i.app&&null!=i&&i.type){d=d+" OP_RETURN "+f("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+f("SET");for(var l=0,h=Object.entries(i);l<h.length;l++){var p=h[l],v=p[0],m=p[1];"cmd"!==v&&(d=d+" "+f(v)+" "+f(m))}}return n.fromASM(d)},e}(t),h=r.fromBase58Check,p=function(t,n){var r=e(c({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),n);return r.sourceTXID=t.txid,r},v=function(n){try{var r="https://ordinals.gorillapool.io/api/txos/address/"+n+"/unspent?bsv20=false";return console.log({payUrl:r}),Promise.resolve(fetch(r)).then(function(r){if(!r.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(r.json()).then(function(r){r=r.filter(function(t){return 1!==t.satoshis});var e=h(n),o=(new t).lock(e.data);return r.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(o.toBinary()).toString("base64")}})})})}catch(t){return Promise.reject(t)}},m=function(t,n){try{var r,e=function(t){if(r)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},o=null==n?void 0:n.idKey,i=null==n?void 0:n.keyHost;if(o){var a=new s(t).sign(o);return Promise.resolve(a.signedTx)}var u=function(){if(i){var e=null==n?void 0:n.authToken,o=new s(t);return function(t,n){try{var s=Promise.resolve(o.remoteSign(i,e)).then(function(t){return r=1,t.signedTx})}catch(t){return n(t)}return s&&s.then?s.then(void 0,n):s}(0,function(t){throw console.log(t),new Error("Remote signing to "+i+" failed")})}}();return Promise.resolve(u&&u.then?u.then(e):e(u))}catch(t){return Promise.reject(t)}},g=function(n){try{for(var r,e=n.utxos,s=n.destinations,a=n.paymentPk,c=n.changeAddress,d=n.satsPerKb,f=n.metaData,h=n.signer,v=n.additionalPayments,g=void 0===v?[]:v,y=new o(void 0===d?10:d),w=new i,P=u(e);!(r=P()).done;){var b=p(r.value,(new t).unlock(a));w.addInput(b)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var S,x=u(s);!(S=x()).done;){var k=S.value;if(!k.inscription)throw new Error("Inscription is required for all destinations");w.addOutput({satoshis:1,lockingScript:(new l).lock(k.address,k.inscription.dataB64,k.inscription.contentType,f)})}for(var O,B=u(g);!(O=B()).done;){var I=O.value;w.addOutput({satoshis:I.amount,lockingScript:(new t).lock(I.to)})}var A=e.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),E=w.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(y.computeFee(w)).then(function(n){function r(){return Promise.resolve(w.fee(y)).then(function(){return Promise.resolve(w.sign()).then(function(){return o&&(o.satoshis=w.outputs[w.outputs.length-1].satoshis,o.txid=w.hash("hex")),{tx:w,spentOutpoints:e.map(function(t){return t.txid+"_"+t.vout}),payChange:o}})})}var o;if(A>E+BigInt(n)){var i=(new t).lock(c||a.toAddress().toString()),s={lockingScript:i,change:!0};o={txid:"",vout:w.outputs.length,satoshis:0,script:Buffer.from(i.toHex(),"hex").toString("base64")},w.addOutput(s)}var u=function(){if(h)return Promise.resolve(m(w,h)).then(function(t){w=t})}();return u&&u.then?u.then(r):r()})}catch(t){return Promise.reject(t)}},y=function(n){try{n.satsPerKb||(n.satsPerKb=10),n.additionalPayments||(n.additionalPayments=[]),void 0===n.enforceUniformSend&&(n.enforceUniformSend=!0);for(var r,e=new o(n.satsPerKb),s=new i,a=[],c=u(n.ordinals);!(r=c()).done;){var d=r.value;if(1!==d.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var f=p(d,(new l).unlock(n.ordPk));a.push(d.txid+"_"+d.vout),s.addInput(f)}if(n.enforceUniformSend&&n.destinations.length!==n.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var h,v=u(n.destinations);!(h=v()).done;){var g,y,w,P=h.value;w=null!=(g=P.inscription)&&g.dataB64&&null!=(y=P.inscription)&&y.contentType?(new l).lock(P.address,P.inscription.dataB64,P.inscription.contentType,n.metaData):(new t).lock(P.address),s.addOutput({satoshis:1,lockingScript:w})}for(var b,S=u(n.additionalPayments);!(b=S()).done;){var x=b.value;console.log("Additional payment",x),s.addOutput({satoshis:x.amount,lockingScript:(new t).lock(x.to)})}for(var k,O=u(n.paymentUtxos);!(k=O()).done;){var B=k.value,I=p(B,(new t).unlock(n.paymentPk));a.push(B.txid+"_"+B.vout),s.addInput(I)}return Promise.resolve(e.computeFee(s)).then(function(r){function o(){return Promise.resolve(s.fee(e)).then(function(){return Promise.resolve(s.sign()).then(function(){return i&&(i.satoshis=s.outputs[s.outputs.length-1].satoshis,i.txid=s.hash("hex")),{tx:s,spentOutpoints:a,payChange:i}})})}var i,u=n.paymentUtxos.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),c=s.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0);if(u<c)throw new Error("Not enough ordinals to send");if(u>c+r){var d=(new t).lock(n.changeAddress||n.paymentPk.toAddress().toString()),f={lockingScript:d,change:!0};i={txid:"",vout:s.outputs.length,satoshis:0,script:Buffer.from(d.toHex(),"hex").toString("base64")},s.addOutput(f)}var l=function(){if(n.signer)return Promise.resolve(m(s,n.signer)).then(function(t){s=t})}();return l&&l.then?l.then(o):o()})}catch(t){return Promise.reject(t)}};const w="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function P(t,n,r){if(!t.s){if(r instanceof b){if(!r.s)return void(r.o=P.bind(null,t,n));1&n&&(n=r.s),r=r.v}if(r&&r.then)return void r.then(P.bind(null,t,n),P.bind(null,t,2));t.s=n,t.v=r;var e=t.o;e&&e(t)}}var b=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,r){var e=new t,o=this.s;if(o){var i=1&o?n:r;if(i){try{P(e,1,i(this.v))}catch(t){P(e,2,t)}return e}return this}return this.o=function(t){try{var o=t.v;1&t.s?P(e,1,n?n(o):o):r?P(e,1,r(o)):P(e,2,o)}catch(t){P(e,2,t)}},e},t}();function S(t){return t instanceof b&&1&t.s}var x,k=function(n){try{for(var r,e,s=function(){if(O<B+I)throw new Error("Not enough funds to send. Total sats in: "+O+", Total sats out: "+B+", Fee: "+I);var n;if(O>B+I){var r=(new t).lock(v),e={lockingScript:r,change:!0};n={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(r.toHex(),"hex").toString("base64")},g.addOutput(e)}else O<B+I&&console.log("No change needed");return Promise.resolve(g.fee(m)).then(function(){return Promise.resolve(g.sign()).then(function(){return n&&(n.satoshis=g.outputs[g.outputs.length-1].satoshis,n.txid=g.hash("hex")),{tx:g,spentOutpoints:a.map(function(t){return t.txid+"_"+t.vout}),payChange:n}})})},a=n.utxos,c=n.paymentPk,d=n.payments,f=n.satsPerKb,l=void 0===f?10:f,h=n.changeAddress,v=void 0===h?c.toAddress().toString():h,m=new o(l),g=new i,y=u(d);!(e=y()).done;){var x=e.value,k={satoshis:x.amount,lockingScript:(new t).lock(x.to)};g.addOutput(k)}var O=0n,B=g.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),I=0,A=function(t,n,r){if("function"==typeof t[w]){var e,o,i,s=t[w]();if(function t(a){try{for(;!((e=s.next()).done||r&&r());)if((a=n(e.value))&&a.then){if(!S(a))return void a.then(t,i||(i=P.bind(null,o=new b,2)));a=a.v}o?P(o,1,a):o=a}catch(t){P(o||(o=new b),2,t)}}(),s.return){var a=function(t){try{e.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,n,r){var e,o,i=-1;return function s(a){try{for(;++i<t.length&&(!r||!r());)if((a=n(i))&&a.then){if(!S(a))return void a.then(s,o||(o=P.bind(null,e=new b,2)));a=a.v}e?P(e,1,a):e=a}catch(t){P(e||(e=new b),2,t)}}(),e}(u,function(t){return n(u[t])},r)}(a,function(n){var e=p(n,(new t).unlock(c));return g.addInput(e),O+=BigInt(n.satoshis),Promise.resolve(m.computeFee(g)).then(function(t){O>=B+(I=t)&&(r=1)})},function(){return r});return Promise.resolve(A&&A.then?A.then(s):s())}catch(t){return Promise.reject(t)}};!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(x||(x={}));var O=function(t){try{var n=t.protocol,r=t.tokenID,e=t.utxos,o=t.inputTokens,i=t.distributions,s=t.paymentPk,a=t.ordPk,d=t.changeAddress,f=t.tokenChangeAddress,l=t.satsPerKb,h=void 0===l?10:l,p=t.metaData,v=t.signer,m=t.additionalPayments,g=void 0===m?[]:m,w=0n,P=0n,b=0n;if(!o.every(function(t){return t.id===r}))throw new Error("Input tokens do not match the provided tokenID");for(var S,k=u(o);!(S=k()).done;)P+=BigInt(S.value.amt);for(var O,B=u(i);!(O=B()).done;)b+=BigInt(O.value.amt);if(P<b)throw new Error("Not enough tokens to send");if((w=P-b)>0n){var I={address:f||a.toAddress().toString(),amt:w.toString()};i.push(I)}var A=i.map(function(t){var e,o={p:"bsv-20",op:"transfer",amt:t.amt};if(n===x.BSV20)e=c({},o,{tick:r});else{if(n!==x.BSV21)throw new Error("Invalid protocol");e=c({},o,{id:r})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(e)).toString("base64"),contentType:"application/bsv-20"}}}),E={paymentUtxos:e,ordinals:o,paymentPk:s,ordPk:a,destinations:A,changeAddress:d||s.toAddress().toString(),satsPerKb:h,metaData:p,signer:v,additionalPayments:g,enforceUniformSend:!1};return Promise.resolve(y(E)).then(function(t){var n,e=t.tx,o=t.spentOutpoints,i=t.payChange,s=A.findIndex(function(t){return t.address===(f||a.toAddress().toString())});return-1!==s&&(n={id:r,amt:w.toString(),satoshis:1,txid:e.id("hex"),vout:s,script:Buffer.from(e.outputs[s].lockingScript.toHex(),"hex").toString("base64")}),{tx:e,spentOutpoints:o,payChange:i,tokenChange:n}})}catch(t){return Promise.reject(t)}};export{x as TokenType,g as createOrdinals,v as fetchPayUtxos,y as sendOrdinals,k as sendUtxos,O as transferOrdTokens};
//# sourceMappingURL=index.module.js.map
