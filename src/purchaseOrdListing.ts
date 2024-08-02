import { P2PKH, SatoshisPerKilobyte, Script, Transaction } from "@bsv/sdk";
import { DEFAULT_SAT_PER_KB } from "./constants";
import type { PurchaseOrdListingConfig, Utxo } from "./types";
import { inputFromB64Utxo } from "./utils/utxo";
import OrdLock from "./templates/ordLock";

export const purchaseOrdListings = async (config: PurchaseOrdListingConfig) => {
	const {
		utxos,
		paymentPk,
		listingUtxo,
		ordAddress,
		changeAddress,
		additionalPayments = [],
		satsPerKb = DEFAULT_SAT_PER_KB,
	} = config;

	const modelOrFee = new SatoshisPerKilobyte(satsPerKb);
	const tx = new Transaction();
	const spentOutpoints: string[] = [];

	// Inputs
	// Add the locked ordinal we're purchasing
	tx.addInput({
		unlockingScriptTemplate: new OrdLock().purchaseListing(
			1,
			Script.fromHex(Buffer.from(listingUtxo.script, "base64").toString("hex")),
		),
		sourceTXID: listingUtxo.txid,
		sourceOutputIndex: listingUtxo.vout,
		sequence: 0xffffffff,
	});
	spentOutpoints.push(`${listingUtxo.txid}_${listingUtxo.vout}`);

	// Outputs
	// Add the purchased output
	tx.addOutput({
		satoshis: 1,
		lockingScript: new P2PKH().lock(ordAddress),
	});

	// Add additional payments if any
	for (const p of additionalPayments) {
		tx.addOutput({
			satoshis: p.amount,
			lockingScript: new P2PKH().lock(p.to),
		});
	}

	let totalSatsIn = 0n;
	const totalSatsOut = tx.outputs.reduce(
		(total, out) => total + BigInt(out.satoshis || 0),
		0n,
	);
	let fee = 0;
	for (const utxo of utxos) {
		const input = inputFromB64Utxo(utxo, new P2PKH().unlock(paymentPk));
		spentOutpoints.push(`${utxo.txid}_${utxo.vout}`);

		tx.addInput(input);
		// stop adding inputs if the total amount is enough
		totalSatsIn += BigInt(utxo.satoshis);
		fee = await modelOrFee.computeFee(tx);

		if (totalSatsIn >= totalSatsOut + BigInt(fee)) {
			break;
		}
	}

	// add change to the outputs
	let payChange: Utxo | undefined;

	const change = changeAddress || paymentPk.toAddress().toString();
	const changeScript = new P2PKH().lock(change);
	const changeOut = {
		lockingScript: changeScript,
		change: true,
	};
	tx.addOutput(changeOut);

	// estimate the cost of the transaction and assign change value
	await tx.fee(modelOrFee);

	// Sign the transaction
	await tx.sign();

	// check for change
	const payChangeOutIdx = tx.outputs.findIndex((o) => o.change);
	if (payChangeOutIdx !== -1) {
		const changeOutput = tx.outputs[payChangeOutIdx];
		payChange = {
			satoshis: changeOutput.satoshis as number,
			txid: tx.id("hex") as string,
			vout: payChangeOutIdx,
			script: Buffer.from(changeOutput.lockingScript.toBinary()).toString(
				"base64",
			),
		};
	}

	if (payChange) {
		const changeOutput = tx.outputs[tx.outputs.length - 1];
		payChange.satoshis = changeOutput.satoshis as number;
		payChange.txid = tx.id("hex") as string;
	}

	return {
		tx,
		spentOutpoints: utxos.map((utxo) => `${utxo.txid}_${utxo.vout}`),
		payChange,
	};
};