import { pubToAddress } from 'ethereumjs-util';
import { HDPrivateKey, HDPublicKey } from 'bitcore-lib';
import assert from 'assert';
var ec = require('elliptic').ec('secp256k1');

function padTo32(msg) {
  if (msg.length === 31) {
    msg = Buffer.concat([new Buffer([0]), msg]);
  }
  if (msg.length !== 32) {
    throw new Error('invalid key length');
  }
  return msg;
}

export default class EthereumBIP44 {

    static fromPublicSeed(seed) {
        return new EthereumBIP44(new HDPublicKey(seed));
    }

    static fromPrivateSeed(seed) {
        return new EthereumBIP44(new HDPrivateKey(seed));
    }

    static bip32PublicToEthereumPublic(pubKey) {
        let key = ec.keyFromPublic(pubKey).getPublic().toJSON();
        return Buffer.concat([padTo32(new Buffer(key[0].toArray())), padTo32(new Buffer(key[1].toArray()))]);
    }

    constructor(hdKey) {

        this.parts = [
            `44'`, // bip 44
            `60'`,  // coin
            `0'`,  // wallet
            `0`    // 0 - public, 1 = private
            // index
        ];

        assert(hdKey);

        this.key = hdKey;
    }

    derive(path) {
        return this.key.derive(path);
    }

    getAddress(index) {

        let path = this.parts.slice(this.key.depth);
        let derived = this.key.derive('m/' + (path.length > 0 ? path.join('/') + '/' : "") + index);
        let address = pubToAddress(
            EthereumBIP44.bip32PublicToEthereumPublic(
                derived.publicKey.toBuffer()
            )
        );
        return `0x${address.toString('hex')}`;
    }

    getPrivateKey(index) {
      let path = this.parts.slice(this.key.depth);
      let derived = this.key.derive('m/' + (path.length > 0 ? path.join('/') + '/' : "") + index);
      return padTo32(derived.privateKey);
    }
}
