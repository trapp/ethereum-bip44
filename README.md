Ethereum-Bip44
==============

Library to generate Ethereum addresses from a hierarchical deterministic wallet according to the [BIP44 standard](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki).

Internally it uses [bitcore](https://bitcore.io/) for the deterministic private and public keys which allows to use many additional features like deriving Ethereum address from mnemonic backups ([BIP32](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)). 

## Getting Started

```bash
npm install ethereum-bip44
```

Create a new wallet:
```js
var bitcore = require('bitcore');
var EthereumBip44 = require('ethereum-bip44');
// create a new master private key
var key = bitcore.HDPrivateKey();
// create the hd wallet
var wallet = new EthereumBip44(key);
// output the first address
console.log(wallet.getAddress(0));
// output the second address
console.log(wallet.getAddress(1));
```

Initialize from an existing private seed:
```js
var bitcore = require('bitcore');
var EthereumBip44 = require('ethereum-bip44');
// create the hd wallet
var wallet = EthereumBip44.fromPrivateSeed('xprv9s21ZrQH143K4BX2reUURqR54XkNhbNkFhEiRQqFkzu5z7T1dp9eMGozFTgKVu5Bs6R8Wd8BuhcJ3rj3LvzJvkc9uBc5xdhstRfJgcTLsjk');
// output the first address
console.log(wallet.getAddress(0));
// output the second address
console.log(wallet.getAddress(1));
```

Initialize it from a public seed, for example on hot wallets that don't hold private keys:
```js
var bitcore = require('bitcore');
var EthereumBip44 = require('ethereum-bip44');
var key = new bitcore.HDPrivateKey();
var derivedPubKey = key.derive("m/44'/60'/0'/0").hdPublicKey;
// create the hd wallet
var wallet = EthereumBip44.fromPublicSeed(derivedPubKey.toString());
// output the first address
console.log(wallet.getAddress(0));
// output the second address
console.log(wallet.getAddress(1));
```

**Note:** You need to use a derived public key like shown here, otherwise it won't allow to derive hardened keys.

## License

MPL-2.0