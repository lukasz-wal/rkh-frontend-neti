// @ts-ignore
import FilecoinApp from "@zondax/ledger-filecoin";
import { Wallet } from "@/types/wallet";
import { encode as cborEncode } from "cbor";
import { verifyRaw } from 'iso-filecoin/ledger'
import { AddressSecp256k1 } from 'iso-filecoin/address'

// Import the signer as a dynamic import
const signerPromise = import("@zondax/filecoin-signing-tools/js").then(module => module.transactionSerialize);

interface LedgerAccount {
    address: string;
    pubKey: Buffer;
    index: number;
    path: string;
}

export class LedgerWallet implements Wallet {
    type = "ledger";

    private filecoinApp: FilecoinApp;
    private address: string;
    private pubkey: Buffer;

    constructor(filecoinApp: FilecoinApp, address: string, pubkey: Buffer) {
        this.filecoinApp = filecoinApp;
        this.address = address;
        this.pubkey = pubkey;
    }

    async sign(message: any, indexAccount: number) {
        const transactionSerialize = await signerPromise;
        const serializedMessage = transactionSerialize(this.generateSignableMessage(message));

        const signedMessage = this.handleErrors(
            await this.filecoinApp.sign(`m/44'/461'/0'/0/${indexAccount}`, Buffer.from(serializedMessage, 'hex'))
        );
      
        return await this.generateSignedMessage(message, signedMessage);
    }

    async getAccounts(): Promise<string[]> {
        const accounts: LedgerAccount[] = [];
        for (let i = 0; i < 5; i++) {
            const path = `m/44'/461'/0'/0/${i}`;
            const { addrString, pk } = await this.filecoinApp.getAddressAndPubKey(path);
            console.log(`At index ${i}: ${addrString}`);
            console.log(pk);
            accounts.push({ address: addrString, pubKey: pk, index: i, path });
        }
        
        return accounts.map((account) => account.address);
    }

    async signArbitrary(message: string, indexAccount: number) {
        /* note there's a bit of clone + hack in here but I want
         * to keep this function isolated from the on-chain message
         * functions as the requirement (by Zondax) to form a
         * complete message is a bit of a pain and might go away
         * later. */
        const transactionSerialize = await signerPromise;
        const paramsCBOR = cborEncode(message);
        const paramsBase64 = Buffer.from(paramsCBOR).toString("base64");

        // Note: from, to, and nonce are in part crafted to avoid this
        // ever being mistaken for a valid on-chain message.
        const fakeMessage = {
            To: this.address,
            From: this.address,
            GasLimit: 1,
            GasFeeCap: "1",
            GasPremium: "1",
            Method: 0,
            Nonce: 0,
            Params: paramsBase64,
            Value: "0",
        }
        const serializedMessage = transactionSerialize(fakeMessage);
        const tbs = Uint8Array.from(Buffer.from(serializedMessage, 'hex'));

        const signedMessage = this.handleErrors(
            await this.filecoinApp.sign(`m/44'/461'/0'/0/${indexAccount}`, tbs)
        );

        // TODO remove everything between here and -- END --

        // Test the signature
        console.log("Verifying signature...")
        console.log(signedMessage.signature_compact)
        const signature = new Uint8Array(signedMessage.signature_compact)
        //const tbv = Uint8Array.from(tbs)
        const unpk = Uint8Array.from(this.pubkey)
        console.log(unpk)
        const derivedAddress = AddressSecp256k1.fromPublicKey(
            unpk,
            'mainnet'
          )
        // make sure the public key is right for hte account we chose.
        console.log(derivedAddress.toString())
        const valid = verifyRaw(signature, tbs, unpk)

        if (!valid) {
            console.log("Signature verification failed");
        } else {
            console.log("Signature verification succeeded");
        }

        // -- END -- 

        return JSON.stringify({
            Message: fakeMessage,
            Signature: {
                Data: signedMessage.signature_compact.toString('base64'),
                Type: 1
            },
        });
    }

    getPubKey = () => {
        return this.pubkey;
    }

    private generateSignableMessage = (filecoinMessage: any) => {
        return {
            From: filecoinMessage.from,
            GasLimit: filecoinMessage.gaslimit,
            GasFeeCap: filecoinMessage.gasfeecap,
            GasPremium: filecoinMessage.gaspremium,
            Method: filecoinMessage.method,
            Nonce: filecoinMessage.nonce,
            Params: Buffer.from(filecoinMessage.params, "hex").toString("base64"),
            To: filecoinMessage.to,
            Value: filecoinMessage.value,
        }
    }

    private generateSignedMessage = async (filecoinMessage: any, signedMessage: any) => {
        return JSON.stringify({
            Message: this.generateSignableMessage(filecoinMessage),
            Signature: {
                Data: signedMessage.signature_compact.toString('base64'),
                Type: 1
            },
        });
    }

    private handleErrors = (response: any) => {
        if (response.error_message && response.error_message.toLowerCase().includes('no errors')) {
            return response;
        }
        if (response.error_message && response.error_message.toLowerCase().includes('transporterror: invalild channel')) {
            throw new Error('Lost connection with Ledger. Please unplug and replug device.');
        }
        throw new Error(response.error_message);
    }
}