import{P2PKH as t,LockingScript as o,Utils as n,fromUtxo as s,SatoshisPerKilobyte as e,Transaction as i}from"@bsv/sdk";import{Sigma as r}from"sigma-protocol";const a=t=>Buffer.from(t).toString("hex"),c=10,d="https://ordinals.gorillapool.io/api";class u extends t{lock(n,s,e,i){let r="";if(void 0!==s&&void 0!==e){const t=a("ord"),o=Buffer.from(s,"base64").toString("hex").trim();if(!o)throw new Error("Invalid file data");const n=a(e);if(!n)throw new Error("Invalid media type");r=`OP_0 OP_IF ${t} OP_1 ${n} OP_0 ${o} OP_ENDIF`}let c=`${r?`${r} `:""}${(new t).lock(n).toASM()}`;if(i&&(!i.app||!i.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=i&&i.app&&null!=i&&i.type){c=`${c} OP_RETURN ${a("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")} ${a("SET")}`;for(const[t,o]of Object.entries(i))"cmd"!==t&&(c=`${c} ${a(t)} ${a(o)}`)}return o.fromASM(c)}}function p(){return p=Object.assign?Object.assign.bind():function(t){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var s in n)({}).hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},p.apply(null,arguments)}var l;!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(l||(l={}));const{fromBase58Check:f}=n,h=(t,o)=>{const n=s(p({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),o);return n.sourceTXID=t.txid,n},g=async o=>{const n=`${d}/txos/address/${o}/unspent?bsv20=false`;console.log({payUrl:n});const s=await fetch(n);if(!s.ok)throw new Error("Error fetching pay utxos");let e=await s.json();e=e.filter(t=>1!==t.satoshis);const i=f(o),r=(new t).lock(i.data);return e=e.map(t=>({txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(r.toBinary()).toString("base64")})),e},w=async(t,o,n=10,s=0)=>{let e=`${d}/txos/address/${t}/unspent?limit=${n}&offset=${s}&`;o&&(e+=`query=${Buffer.from(JSON.stringify({map:{subTypeData:{collectionId:o}}})).toString("base64")}`),console.log({url:e});const i=await fetch(e);if(!i.ok)throw new Error(`Error fetching NFT utxos for ${t}`);let r=await i.json();r=r.filter(t=>1===t.satoshis&&!t.data.list);const a=r.map(t=>`${t.txid}_${t.vout}`),c=await fetch(`${d}/txos/outpoints`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([...a])});if(!c.ok)throw new Error(`Error fetching NFT scripts for ${t}`);return r=(await c.json()||[]).map(t=>{const n={origin:t.origin.outpoint,script:t.script,vout:t.vout,txid:t.txid,satoshis:1};return o&&(n.collectionId=o),n}),r},m=async(t,o,n)=>{const s=`${d}/bsv20/${n}/${t===l.BSV20?"tick":"id"}/${o}?bsv20=true&listing=false`;console.log({url:s});const e=await fetch(s);if(!e.ok)throw new Error(`Error fetching ${t} utxos`);let i=await e.json();return i=i.map(t=>({amt:t.amt,script:t.script,vout:t.vout,txid:t.txid,id:o,satoshis:1})),i},x=async(t,o)=>{const n=null==o?void 0:o.idKey,s=null==o?void 0:o.keyHost;if(n){const o=new r(t),{signedTx:s}=o.sign(n);return s}if(s){const n=null==o?void 0:o.authToken,e=new r(t);try{const{signedTx:t}=await e.remoteSign(s,n);return t}catch(t){throw console.log(t),new Error(`Remote signing to ${s} failed`)}}throw new Error("Signer must be a LocalSigner or RemoteSigner")},y=async o=>{const{utxos:n,destinations:s,paymentPk:r,changeAddress:a,satsPerKb:d=c,metaData:p,signer:l,additionalPayments:f=[]}=o,g=new e(d);let w=new i;for(const o of n){const n=h(o,(new t).unlock(r));w.addInput(n)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(const t of s){if(!t.inscription)throw new Error("Inscription is required for all destinations");w.addOutput({satoshis:1,lockingScript:(new u).lock(t.address,t.inscription.dataB64,t.inscription.contentType,p)})}for(const o of f)w.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});const m=n.reduce((t,o)=>t+BigInt(o.satoshis),0n),y=w.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n),k=await g.computeFee(w);let S;if(m>y+BigInt(k)){const o=(new t).lock(a||r.toAddress().toString()),n={lockingScript:o,change:!0};S={txid:"",vout:w.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},w.addOutput(n)}return l&&(w=await x(w,l)),await w.fee(g),await w.sign(),S&&(S.satoshis=w.outputs[w.outputs.length-1].satoshis,S.txid=w.id("hex")),{tx:w,spentOutpoints:n.map(t=>`${t.txid}_${t.vout}`),payChange:S}},k=async o=>{o.satsPerKb||(o.satsPerKb=c),o.additionalPayments||(o.additionalPayments=[]),void 0===o.enforceUniformSend&&(o.enforceUniformSend=!0);const n=new e(o.satsPerKb);let s=new i;const r=[];for(const t of o.ordinals){if(1!==t.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");const n=h(t,(new u).unlock(o.ordPk));r.push(`${t.txid}_${t.vout}`),s.addInput(n)}if(o.enforceUniformSend&&o.destinations.length!==o.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(const n of o.destinations){var a,d;let e;e=null!=(a=n.inscription)&&a.dataB64&&null!=(d=n.inscription)&&d.contentType?(new u).lock(n.address,n.inscription.dataB64,n.inscription.contentType,o.metaData):(new t).lock(n.address),s.addOutput({satoshis:1,lockingScript:e})}for(const n of o.additionalPayments)s.addOutput({satoshis:n.amount,lockingScript:(new t).lock(n.to)});let p=0n;const l=s.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let f,g=0;for(const e of o.paymentUtxos){const i=h(e,(new t).unlock(o.paymentPk));if(r.push(`${e.txid}_${e.vout}`),s.addInput(i),p+=BigInt(e.satoshis),g=await n.computeFee(s),p>=l+BigInt(g))break}if(p<l)throw new Error("Not enough ordinals to send");if(p>l+BigInt(g)){const n=(new t).lock(o.changeAddress||o.paymentPk.toAddress().toString()),e={lockingScript:n,change:!0};f={txid:"",vout:s.outputs.length,satoshis:0,script:Buffer.from(n.toHex(),"hex").toString("base64")},s.addOutput(e)}return o.signer&&(s=await x(s,o.signer)),await s.fee(n),await s.sign(),f&&(f.satoshis=s.outputs[s.outputs.length-1].satoshis,f.txid=s.id("hex")),{tx:s,spentOutpoints:r,payChange:f}},S=async o=>{const{utxos:n,paymentPk:s,payments:r,satsPerKb:a=c,changeAddress:d=s.toAddress().toString()}=o,u=new e(a),p=new i;for(const o of r){const n={satoshis:o.amount,lockingScript:(new t).lock(o.to)};p.addOutput(n)}let l=0n;const f=p.outputs.reduce((t,o)=>t+(o.satoshis||0),0);let g,w=0;for(const o of n){const n=h(o,(new t).unlock(s));if(p.addInput(n),l+=BigInt(o.satoshis),w=await u.computeFee(p),l>=f+w)break}if(l<f+w)throw new Error(`Not enough funds to send. Total sats in: ${l}, Total sats out: ${f}, Fee: ${w}`);if(l>f+w){const o=(new t).lock(d),n={lockingScript:o,change:!0};g={txid:"",vout:p.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},p.addOutput(n)}else l<f+w&&console.log("No change needed");return await p.fee(u),await p.sign(),g&&(g.satoshis=p.outputs[p.outputs.length-1].satoshis,g.txid=p.id("hex")),{tx:p,spentOutpoints:n.map(t=>`${t.txid}_${t.vout}`),payChange:g}},$=async t=>{const{protocol:o,tokenID:n,utxos:s,inputTokens:e,distributions:i,paymentPk:r,ordPk:a,changeAddress:d,tokenChangeAddress:u,satsPerKb:f=c,metaData:h,signer:g,additionalPayments:w=[]}=t;let m=0n,x=0n,y=0n;if(!e.every(t=>t.id===n))throw new Error("Input tokens do not match the provided tokenID");for(const t of e)x+=BigInt(t.amt);for(const t of i)y+=BigInt(t.amt);if(x<y)throw new Error("Not enough tokens to send");if(m=x-y,m>0n){const t={address:u||a.toAddress().toString(),amt:m.toString()};i.push(t)}const S=i.map(t=>{const s={p:"bsv-20",op:"transfer",amt:t.amt};let e;if(o===l.BSV20)e=p({},s,{tick:n});else{if(o!==l.BSV21)throw new Error("Invalid protocol");e=p({},s,{id:n})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(e)).toString("base64"),contentType:"application/bsv-20"}}}),$={paymentUtxos:s,ordinals:e,paymentPk:r,ordPk:a,destinations:S,changeAddress:d||r.toAddress().toString(),satsPerKb:f,metaData:h,signer:g,additionalPayments:w,enforceUniformSend:!1},{tx:v,spentOutpoints:b,payChange:P}=await k($),B=S.findIndex(t=>t.address===(u||a.toAddress().toString()));let O;return-1!==B&&(O={id:n,amt:m.toString(),satoshis:1,txid:v.id("hex"),vout:B,script:Buffer.from(v.outputs[B].lockingScript.toHex(),"hex").toString("base64")}),{tx:v,spentOutpoints:b,payChange:P,tokenChange:O}};export{l as TokenType,y as createOrdinals,w as fetchNftUtxos,g as fetchPayUtxos,m as fetchTokenUtxos,k as sendOrdinals,S as sendUtxos,$ as transferOrdTokens};
//# sourceMappingURL=index.modern.js.map
