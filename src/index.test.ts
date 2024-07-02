import { PrivateKey, Utils } from "@bsv/sdk";
import { Destination, createOrdinals, sendOrdinals } from ".";
import OrdP2PKH from "./ordP2pkh";

test("test build inscription", () => {
  const b64Data = "";
  const insc = new OrdP2PKH().lock(
    "18qHtzaMU5PxJ2Yfuw8yJvDCbULrv1Xsdx",
    b64Data,
    "text/markdown"
  );
  expect(insc.toASM()).toBe(
    "OP_0 OP_IF 6f7264 OP_1 746578742f6d61726b646f776e OP_0 OP_ENDIF OP_DUP OP_HASH160 55eaf379d85b0ab99cf5bbfc38a583eafee11683 OP_EQUALVERIFY OP_CHECKSIG"
  );
});

test("test build inscription w metadata", () => {
  const b64Data = "";
  const insc = new OrdP2PKH().lock(
    "18qHtzaMU5PxJ2Yfuw8yJvDCbULrv1Xsdx",
    b64Data,
    "text/markdown",
    {
      app: "js-1sat-ord-test",
      type: "test",
    }
  );
  expect(insc.toASM()).toBe(
    "OP_0 OP_IF 6f7264 OP_1 746578742f6d61726b646f776e OP_0 OP_ENDIF OP_DUP OP_HASH160 55eaf379d85b0ab99cf5bbfc38a583eafee11683 OP_EQUALVERIFY OP_CHECKSIG OP_RETURN 3150755161374b36324d694b43747373534c4b79316b683536575755374d74555235 534554 617070 6a732d317361742d6f72642d74657374 74797065 74657374"
  );
});

test("hello world inscription", async () => {
  const paymentPk = PrivateKey.fromWif('KzwfqdfecMRtpg65j2BeRtixboNR37fSCDr8QbndV6ySEPT4xibW');
  const changeAddress = paymentPk.toAddress();
  let utxos = [{ 
    satoshis: 100000, 
    txid: "ecb483eda58f26da1b1f8f15b782b1186abdf9c6399a1c3e63e0d429d5092a41", 
    vout: 0, 
    script: Buffer.from(Utils.fromBase58Check(changeAddress).data).toString("base64")
  }];

  let destinations: Destination[] = [{
    address: changeAddress,
    inscription: {
      dataB64: "hello world",
      contentType: "text/plain"
    }
  }];
  let tx = await createOrdinals(utxos, destinations, paymentPk, changeAddress)
  console.log(tx.toHex());

  utxos = [{
    satoshis: tx.outputs[1].satoshis!,
    txid: tx.id('hex'),
    vout: 1,
    script: Buffer.from(tx.outputs[1].lockingScript.toHex(), 'hex').toString('base64')
  }]

  let ordinals = [{
    satoshis: tx.outputs[0].satoshis!,
    txid: tx.id('hex'),
    vout: 0,
    script: Buffer.from(tx.outputs[0].lockingScript.toHex(), 'hex').toString('base64')
  }]

  destinations = [{
    address: changeAddress,
    inscription: {
      dataB64: "reinscribe",
      contentType: "text/plain"
    }
  }];

  tx = await sendOrdinals(utxos, ordinals, paymentPk, changeAddress, paymentPk, destinations)
  console.log(tx.toHex());

  utxos = [{
    satoshis: tx.outputs[1].satoshis!,
    txid: tx.id('hex'),
    vout: 1,
    script: Buffer.from(tx.outputs[1].lockingScript.toHex(), 'hex').toString('base64')
  }]

  ordinals = [{
    satoshis: tx.outputs[0].satoshis!,
    txid: tx.id('hex'),
    vout: 1,
    script: Buffer.from(tx.outputs[0].lockingScript.toHex(), 'hex').toString('base64')
  }]
  
  destinations = [{
    address: changeAddress,
  }];

  tx = await sendOrdinals(utxos, ordinals, paymentPk, changeAddress, paymentPk, destinations)
  console.log(tx.toHex());
})
