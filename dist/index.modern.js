import{P2PKH as t,LockingScript as e,Script as n,Utils as o,fromUtxo as s,SatoshisPerKilobyte as r,Transaction as i,OP as a,BigNumber as c,UnlockingScript as u,TransactionSignature as f}from"@bsv/sdk";import{Sigma as d}from"sigma-protocol";const p=t=>Buffer.from(t).toString("hex"),l=10,g="https://ordinals.gorillapool.io/api";class h extends t{lock(n,o,s,r){let i="";if(void 0!==o&&void 0!==s){const t=p("ord"),e=Buffer.from(o,"base64").toString("hex").trim();if(!e)throw new Error("Invalid file data");const n=p(s);if(!n)throw new Error("Invalid media type");i=`OP_0 OP_IF ${t} OP_1 ${n} OP_0 ${e} OP_ENDIF`}let a=`${i?`${i} `:""}${(new t).lock(n).toASM()}`;if(r&&(!r.app||!r.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=r&&r.app&&null!=r&&r.type){a=`${a} OP_RETURN ${p("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")} ${p("SET")}`;for(const[t,e]of Object.entries(r))"cmd"!==t&&(a=`${a} ${p(t)} ${p(e)}`)}return e.fromASM(a)}}function w(){return w=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)({}).hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},w.apply(null,arguments)}var m,b;!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(m||(m={})),function(t){t.Paymail="paymail",t.Address="address",t.Script="script"}(b||(b={}));const{fromBase58Check:y}=o,x=(t,e)=>{const n=s(w({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),e);return n.sourceTXID=t.txid,n},k=async(e,n="base64")=>{const o=`${g}/txos/address/${e}/unspent?bsv20=false`;console.log({payUrl:o});const s=await fetch(o);if(!s.ok)throw new Error("Error fetching pay utxos");let r=await s.json();r=r.filter(t=>1!==t.satoshis);const i=y(e),a=(new t).lock(i.data);return r=r.map(t=>({txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:"hex"===n||"base64"===n?Buffer.from(a.toBinary()).toString(n):a.toASM()})),r},S=async(t,e,o=10,s=0,r="base64")=>{let i=`${g}/txos/address/${t}/unspent?limit=${o}&offset=${s}&`;e&&(i+=`q=${Buffer.from(JSON.stringify({map:{subTypeData:{collectionId:e}}})).toString("base64")}`);const a=await fetch(i);if(!a.ok)throw new Error(`Error fetching NFT utxos for ${t}`);let c=await a.json();c=c.filter(t=>{var e;return 1===t.satoshis&&!(null!=(e=t.data)&&e.list)});const u=c.map(t=>`${t.txid}_${t.vout}`),f=await fetch(`${g}/txos/outpoints?script=true`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([...u])});if(!f.ok)throw new Error(`Error fetching NFT scripts for ${t}`);return c=(await f.json()||[]).map(t=>{let o=t.script;"hex"===r?o=Buffer.from(o,"base64").toString("hex"):"asm"===r&&(o=n.fromHex(Buffer.from(o,"base64").toString("hex")).toASM());const s={origin:t.origin.outpoint,script:o,vout:t.vout,txid:t.txid,satoshis:1};return e&&(s.collectionId=e),s}),c},I=async(t,e,n)=>{const o=`${g}/bsv20/${n}/${t===m.BSV20?"tick":"id"}/${e}?bsv20=true&listing=false`,s=await fetch(o);if(!s.ok)throw new Error(`Error fetching ${t} utxos`);let r=await s.json();return r=r.map(t=>({amt:t.amt,script:t.script,vout:t.vout,txid:t.txid,id:e,satoshis:1})),r},v=async(t,e)=>{const n=null==e?void 0:e.idKey,o=null==e?void 0:e.keyHost;if(n){const e=new d(t),{signedTx:o}=e.sign(n);return o}if(o){const n=null==e?void 0:e.authToken,s=new d(t);try{const{signedTx:t}=await s.remoteSign(o,n);return t}catch(t){throw console.log(t),new Error(`Remote signing to ${o} failed`)}}throw new Error("Signer must be a LocalSigner or RemoteSigner")},O=t=>{if(!t)return;const e={app:t.app,type:t.type};for(const[n,o]of Object.entries(t))void 0!==o&&(e[n]="string"==typeof o?o:Array.isArray(o)||"object"==typeof o?JSON.stringify(o):String(o));return e},B=async e=>{const{utxos:n,destinations:o,paymentPk:s,changeAddress:a,satsPerKb:c=l,metaData:u,signer:f,additionalPayments:d=[]}=e,p=new r(c);let g=new i;for(const e of n){const n=x(e,(new t).unlock(s));g.addInput(n)}o.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(const t of o){if(!t.inscription)throw new Error("Inscription is required for all destinations");if(u)for(const t of Object.keys(u))void 0===u[t]&&delete u[t];g.addOutput({satoshis:1,lockingScript:(new h).lock(t.address,t.inscription.dataB64,t.inscription.contentType,O(u))})}for(const e of d)g.addOutput({satoshis:e.amount,lockingScript:(new t).lock(e.to)});const w=n.reduce((t,e)=>t+BigInt(e.satoshis),0n),m=g.outputs.reduce((t,e)=>t+BigInt(e.satoshis||0),0n),b=await p.computeFee(g);let y;if(w>m+BigInt(b)){const e=(new t).lock(a||s.toAddress().toString()),n={lockingScript:e,change:!0};y={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},g.addOutput(n)}return f&&(g=await v(g,f)),await g.fee(p),await g.sign(),y&&(y.satoshis=g.outputs[g.outputs.length-1].satoshis,y.txid=g.id("hex")),{tx:g,spentOutpoints:n.map(t=>`${t.txid}_${t.vout}`),payChange:y}},$=async e=>{e.satsPerKb||(e.satsPerKb=l),e.additionalPayments||(e.additionalPayments=[]),void 0===e.enforceUniformSend&&(e.enforceUniformSend=!0);const n=new r(e.satsPerKb);let o=new i;const s=[];for(const t of e.ordinals){if(1!==t.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");const n=x(t,(new h).unlock(e.ordPk));s.push(`${t.txid}_${t.vout}`),o.addInput(n)}if(e.enforceUniformSend&&e.destinations.length!==e.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(const n of e.destinations){var a,c;let s;s=null!=(a=n.inscription)&&a.dataB64&&null!=(c=n.inscription)&&c.contentType?(new h).lock(n.address,n.inscription.dataB64,n.inscription.contentType,O(e.metaData)):(new t).lock(n.address),o.addOutput({satoshis:1,lockingScript:s})}for(const n of e.additionalPayments)o.addOutput({satoshis:n.amount,lockingScript:(new t).lock(n.to)});let u=0n;const f=o.outputs.reduce((t,e)=>t+BigInt(e.satoshis||0),0n);let d,p=0;for(const r of e.paymentUtxos){const i=x(r,(new t).unlock(e.paymentPk));if(s.push(`${r.txid}_${r.vout}`),o.addInput(i),u+=BigInt(r.satoshis),p=await n.computeFee(o),u>=f+BigInt(p))break}if(u<f)throw new Error("Not enough ordinals to send");if(u>f+BigInt(p)){const n=(new t).lock(e.changeAddress||e.paymentPk.toAddress().toString()),s={lockingScript:n,change:!0};d={txid:"",vout:o.outputs.length,satoshis:0,script:Buffer.from(n.toHex(),"hex").toString("base64")},o.addOutput(s)}return e.signer&&(o=await v(o,e.signer)),await o.fee(n),await o.sign(),d&&(d.satoshis=o.outputs[o.outputs.length-1].satoshis,d.txid=o.id("hex")),{tx:o,spentOutpoints:s,payChange:d}},P=async e=>{const{utxos:n,paymentPk:o,payments:s,satsPerKb:a=l,changeAddress:c=o.toAddress().toString()}=e,u=new r(a),f=new i;for(const e of s){const n={satoshis:e.amount,lockingScript:(new t).lock(e.to)};f.addOutput(n)}let d=0n;const p=f.outputs.reduce((t,e)=>t+(e.satoshis||0),0);let g,h=0;for(const e of n){const n=x(e,(new t).unlock(o));if(f.addInput(n),d+=BigInt(e.satoshis),h=await u.computeFee(f),d>=p+h)break}if(d<p+h)throw new Error(`Not enough funds to send. Total sats in: ${d}, Total sats out: ${p}, Fee: ${h}`);if(d>p+h){const e=(new t).lock(c),n={lockingScript:e,change:!0};g={txid:"",vout:f.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},f.addOutput(n)}else d<p+h&&console.log("No change needed");return await f.fee(u),await f.sign(),g&&(g.satoshis=f.outputs[f.outputs.length-1].satoshis,g.txid=f.id("hex")),{tx:f,spentOutpoints:n.map(t=>`${t.txid}_${t.vout}`),payChange:g}},A=async t=>{const{protocol:e,tokenID:n,utxos:o,inputTokens:s,distributions:r,paymentPk:i,ordPk:a,changeAddress:c,tokenChangeAddress:u,satsPerKb:f=l,metaData:d,signer:p,additionalPayments:g=[],burn:h=!1}=t;let b=0n,y=0n,x=0n;if(!s.every(t=>t.id===n))throw new Error("Input tokens do not match the provided tokenID");for(const t of s)y+=BigInt(t.amt);for(const t of r)x+=BigInt(t.amt);if(y<x)throw new Error("Not enough tokens to send");if(b=y-x,b>0n){const t={address:u||a.toAddress().toString(),amt:b.toString()};r.push(t)}const k=r.map(t=>{const o={p:"bsv-20",op:h?"burn":"transfer",amt:t.amt};let s;if(e===m.BSV20)s=w({},o,{tick:n});else{if(e!==m.BSV21)throw new Error("Invalid protocol");s=w({},o,{id:n})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(s)).toString("base64"),contentType:"application/bsv-20"}}}),S={paymentUtxos:o,ordinals:s,paymentPk:i,ordPk:a,destinations:k,changeAddress:c||i.toAddress().toString(),satsPerKb:f,metaData:d,signer:p,additionalPayments:g,enforceUniformSend:!1},{tx:I,spentOutpoints:v,payChange:O}=await $(S),B=k.findIndex(t=>t.address===(u||a.toAddress().toString()));let P;return-1!==B&&(P={id:n,amt:b.toString(),satoshis:1,txid:I.id("hex"),vout:B,script:Buffer.from(I.outputs[B].lockingScript.toHex(),"hex").toString("base64")}),{tx:I,spentOutpoints:v,payChange:O,tokenChange:P}},E=(t,e)=>{try{if("collection"===t){const t=e;if(!t.description)return new Error("Collection description is required");if(!t.quantity)return new Error("Collection quantity is required");if(t.rarityLabels){if(!Array.isArray(t.rarityLabels))return new Error("Rarity labels must be an array");if(!t.rarityLabels.every(t=>Object.values(t).every(t=>"string"==typeof t)))return new Error(`Invalid rarity labels ${t.rarityLabels}`)}if(t.traits){if("object"!=typeof t.traits)return new Error("Collection traits must be an object");if(t.traits&&!Object.keys(t.traits).every(e=>"string"==typeof e&&"object"==typeof t.traits[e]))return new Error("Collection traits must be a valid CollectionTraits object")}}if("collectionItem"===t){const t=e;if(!t.collectionId)return new Error("Collection id is required");if(!t.collectionId.includes("_"))return new Error("Collection id must be a valid outpoint");if(64!==t.collectionId.split("_")[0].length)return new Error("Collection id must contain a valid txid");if(Number.isNaN(Number.parseInt(t.collectionId.split("_")[1])))return new Error("Collection id must contain a valid vout");if(t.mintNumber&&"number"!=typeof t.mintNumber)return new Error("Mint number must be a number");if(t.rank&&"number"!=typeof t.rank)return new Error("Rank must be a number");if(t.rarityLabel&&"string"!=typeof t.rarityLabel)return new Error("Rarity label must be a string");if(t.traits&&"object"!=typeof t.traits)return new Error("Traits must be an object");if(t.attachments&&!Array.isArray(t.attachments))return new Error("Attachments must be an array")}return}catch(t){return new Error("Invalid JSON data")}};class C{lock(e,s,r){const i=o.fromBase58Check(e).data,a=o.fromBase58Check(s).data;return n.fromHex("2097dfd76851bf465e8f715593b217714858bbe9570ff3bd5e33840a34e20ff0262102ba79df5f8ae7604a9830f03c7933028186aede0675a16f025dc4f8be8eec0382201008ce7480da41702918d1ec8e6849ba32b4d65b1e40dc669c31a1e6306b266c0000").writeBin(i).writeBin(C.buildOutput(r,(new t).lock(a).toBinary())).writeScript(n.fromHex("615179547a75537a537a537a0079537a75527a527a7575615579008763567901c161517957795779210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce081059795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169587951797e58797eaa577961007982775179517958947f7551790128947f77517a75517a75618777777777777777777767557951876351795779a9876957795779ac777777777777777767006868"))}cancelListing(e,n="all",o=!1,s,r){const i=(new t).unlock(e,n,o,s,r);return{sign:async function(t,e){return(await i.sign(t,e)).writeOpCode(a.OP_1)},estimateLength:async function(){return 107}}}purchaseListing(t,e){const n={sign:async function(n,s){if(n.outputs.length<2)throw new Error("Malformed transaction");const r=(new u).writeBin(C.buildOutput(n.outputs[0].satoshis||0,n.outputs[0].lockingScript.toBinary()));if(n.outputs.length>2){const t=new o.Writer;for(const e of n.outputs.slice(2))t.write(C.buildOutput(e.satoshis||0,e.lockingScript.toBinary()));r.writeBin(t.toArray())}else r.writeOpCode(a.OP_0);const i=n.inputs[s],c=f.format({sourceTXID:i.sourceTXID||i.sourceTransaction.id("hex"),sourceOutputIndex:i.sourceOutputIndex,sourceSatoshis:t||i.sourceTransaction.outputs[i.sourceOutputIndex].satoshis,transactionVersion:n.version,otherInputs:[],inputIndex:s,outputs:n.outputs,inputSequence:i.sequence,subscript:e||i.sourceTransaction.outputs[i.sourceOutputIndex].lockingScript,lockTime:n.lockTime,scope:f.SIGHASH_ALL|f.SIGHASH_ANYONECANPAY|f.SIGHASH_FORKID});return r.writeBin(c).writeOpCode(a.OP_0)},estimateLength:async function(t,e){return(await n.sign(t,e)).toBinary().length}};return n}static buildOutput(t,e){const n=new o.Writer;return n.writeUInt64LEBn(new c(t)),n.writeVarIntNum(e.length),n.write(e),n.toArray()}}const T=async e=>{const{utxos:n,listings:o,paymentPk:s,changeAddress:a,satsPerKb:c=l,additionalPayments:u=[]}=e,f=new r(c),d=new i;for(const e of n){const n=x(e,(new t).unlock(s));d.addInput(n)}o.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(const t of o)d.addOutput({satoshis:1,lockingScript:(new C).lock(t.payAddress,t.ordAddress,t.price)});for(const e of u)d.addOutput({satoshis:e.amount,lockingScript:(new t).lock(e.to)});const p=n.reduce((t,e)=>t+BigInt(e.satoshis),0n),g=d.outputs.reduce((t,e)=>t+BigInt(e.satoshis||0),0n),h=await f.computeFee(d);let w;if(p>g+BigInt(h)){const e=(new t).lock(a||s.toAddress().toString()),n={lockingScript:e,change:!0};w={txid:"",vout:d.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},d.addOutput(n)}return await d.fee(f),await d.sign(),w&&(w.satoshis=d.outputs[d.outputs.length-1].satoshis,w.txid=d.id("hex")),{tx:d,spentOutpoints:n.map(t=>`${t.txid}_${t.vout}`),payChange:w}},N=async e=>{const{utxos:o,listingUtxos:s,ordPk:a,paymentPk:c,changeAddress:u,satsPerKb:f=l}=e,d=new r(f),p=new i;for(const t of s)p.addInput({unlockingScript:n.fromHex(Buffer.from(t.script,"base64").toString("hex")),unlockingScriptTemplate:(new C).cancelListing(a),sourceOutputIndex:t.vout,sequence:4294967295});for(const e of o){const n=x(e,(new t).unlock(c));p.addInput(n)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(const e of s)p.addOutput({satoshis:1,lockingScript:(new t).lock(a.toAddress().toString())});const g=o.reduce((t,e)=>t+BigInt(e.satoshis),0n),h=p.outputs.reduce((t,e)=>t+BigInt(e.satoshis||0),0n),w=await d.computeFee(p);let m;if(g>h+BigInt(w)){const e=(new t).lock(u||c.toAddress().toString()),n={lockingScript:e,change:!0};m={txid:"",vout:p.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},p.addOutput(n)}return await p.fee(d),await p.sign(),m&&(m.satoshis=p.outputs[p.outputs.length-1].satoshis,m.txid=p.id("hex")),{tx:p,spentOutpoints:o.map(t=>`${t.txid}_${t.vout}`),payChange:m}},_=async e=>{const{utxos:o,paymentPk:s,listingUtxo:a,ordAddress:c,changeAddress:u,additionalPayments:f=[],satsPerKb:d=l}=e,p=new r(d),g=new i;g.addInput({unlockingScript:n.fromHex(Buffer.from(a.script,"base64").toString("hex")),unlockingScriptTemplate:(new C).purchaseListing(),sourceOutputIndex:a.vout,sequence:4294967295});for(const e of o){const n=x(e,(new t).unlock(s));g.addInput(n)}g.addOutput({satoshis:1,lockingScript:(new t).lock(c)});for(const e of f)g.addOutput({satoshis:e.amount,lockingScript:(new t).lock(e.to)});const h=o.reduce((t,e)=>t+BigInt(e.satoshis),0n),w=g.outputs.reduce((t,e)=>t+BigInt(e.satoshis||0),0n),m=await p.computeFee(g);let b;if(h>w+BigInt(m)){const e=(new t).lock(u||s.toAddress().toString()),n={lockingScript:e,change:!0};b={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},g.addOutput(n)}return await g.fee(p),await g.sign(),b&&(b.satoshis=g.outputs[g.outputs.length-1].satoshis,b.txid=g.id("hex")),{tx:g,spentOutpoints:o.map(t=>`${t.txid}_${t.vout}`),payChange:b}};export{C as OrdLock,h as OrdP2PKH,b as RoytaltyType,m as TokenType,N as cancelOrdListings,T as createOrdListings,B as createOrdinals,S as fetchNftUtxos,k as fetchPayUtxos,I as fetchTokenUtxos,_ as purchaseOrdListings,$ as sendOrdinals,P as sendUtxos,O as stringifyMetaData,A as transferOrdTokens,E as validateSubTypeData};
//# sourceMappingURL=index.modern.js.map
