# encrypt-msg
This is a command-line application for sending and receiving end-to-end (e2e)
encrypted messages over the Bitcoin Cash (BCH) blockchain. [IPFS](https://ipfs.io) is
used for passing encrypted content, but the BCH blockchain is used for signaling
messages.

- See the [Documentation](docs/README.md) for a list of media and the specification this application aspires implement.

- [This YouTube video demos this software](https://youtu.be/garL1s-NsPY)

- This app is also a fully-fledged HD wallet. It was forked from
[slp-cli-wallet](https://github.com/christroutner/slp-cli-wallet).

## Table of Contents
<!-- toc -->
* [encrypt-msg](#encrypt-msg)
* [Install Dev Environment](#install-dev-environment)
* [How to Use](#how-to-use)
* [Releases](#releases)
* [Command Line Usage](#command-line-usage)
* [Commands](#commands)
<!-- tocstop -->


# Install Dev Environment
While this npm library can be used globally, the intended audience is developers
familiar with the usage of `npm` and `git`. Here is how to set up your own
developer environment:

- Clone this repo with `git clone`.
- Install npm dependencies with `npm install`
- Execute the commands like this: `./bin/run help`

Running the wallet this way, you can edit the behavior of the wallet
by making changes to the code in the [src/commands](src/commands) directory.

# How to Use
There are a few main commands for sending and receiving message.
- create-wallet - to create a wallet.
- set-key - to generate a private/public key pair for encrypting messages.
- packag-file - zip up files and messages into a single file.
- encrypt-send - encrypt the zip file, upload it to IPFS, and signal the BCH address that they have a message.
- check-messages - see if there are any messages for your address.
- decrypt-messages - download file from IPFS and decrypt it.

# Releases

- v1.0.2 via IPFS (code only): https://cloudflare-ipfs.com/ipfs/QmRT3WYi79j1Np7nRwv1U4VKnU2dtS2cc5goNmxEJsxwAx
- v1.0.2 via IPFS (code and dependencies): https://cloudflare-ipfs.com/ipfs/QmXgvqN1HY3qxaCGnVVhda9jHGrAbUyh7oTkwjxxRXnVps

# Command Line Usage
<!-- usage -->
```sh-session
$ npm install -g @chris.troutner/encrypt-msg
$ encrypt-msg COMMAND
running command...
$ encrypt-msg (-v|--version|version)
@chris.troutner/encrypt-msg/1.0.0 linux-x64 node-v12.16.1
$ encrypt-msg --help [COMMAND]
USAGE
  $ encrypt-msg COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`encrypt-msg burn-tokens`](#encrypt-msg-burn-tokens)
* [`encrypt-msg check-messages`](#encrypt-msg-check-messages)
* [`encrypt-msg create-wallet`](#encrypt-msg-create-wallet)
* [`encrypt-msg decrypt-messages`](#encrypt-msg-decrypt-messages)
* [`encrypt-msg derivation`](#encrypt-msg-derivation)
* [`encrypt-msg encrypt-send`](#encrypt-msg-encrypt-send)
* [`encrypt-msg get-address`](#encrypt-msg-get-address)
* [`encrypt-msg get-key`](#encrypt-msg-get-key)
* [`encrypt-msg get-private-key`](#encrypt-msg-get-private-key)
* [`encrypt-msg get-pubkey`](#encrypt-msg-get-pubkey)
* [`encrypt-msg hello`](#encrypt-msg-hello)
* [`encrypt-msg help [COMMAND]`](#encrypt-msg-help-command)
* [`encrypt-msg list-wallets`](#encrypt-msg-list-wallets)
* [`encrypt-msg package-file`](#encrypt-msg-package-file)
* [`encrypt-msg remove-wallet`](#encrypt-msg-remove-wallet)
* [`encrypt-msg send`](#encrypt-msg-send)
* [`encrypt-msg send-all`](#encrypt-msg-send-all)
* [`encrypt-msg send-tokens`](#encrypt-msg-send-tokens)
* [`encrypt-msg set-key`](#encrypt-msg-set-key)
* [`encrypt-msg sign-message`](#encrypt-msg-sign-message)
* [`encrypt-msg sweep`](#encrypt-msg-sweep)
* [`encrypt-msg update-balances`](#encrypt-msg-update-balances)

## `encrypt-msg burn-tokens`

Burn SLP tokens.

```
USAGE
  $ encrypt-msg burn-tokens

OPTIONS
  -n, --name=name        Name of wallet
  -q, --qty=qty
  -t, --tokenId=tokenId  Token ID
```

_See code: [src/commands/burn-tokens.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/burn-tokens.js)_

## `encrypt-msg check-messages`

Check for messages on the blockchain

```
USAGE
  $ encrypt-msg check-messages

OPTIONS
  -c, --check=check  Number of messages to check (default is 2)
  -n, --name=name    Name of wallet

DESCRIPTION
  This command walks the BCH blockchain for the address set with the set-key command.
  If it finds transactions that match the protocol, it will display the subject.

  This command does the following:

  1. Get encryption data from the wallet.
  2. Get transaction history for the messaging address.
  3. Walk through the transactions, looking for an OP_RETURN in the TX.
  4. If OP_RETURN matches the MSG format, display the subject


  It only does this for the first message found, then exists.

  This is just a prototype.
```

_See code: [src/commands/check-messages.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/check-messages.js)_

## `encrypt-msg create-wallet`

Generate a new HD Wallet.

```
USAGE
  $ encrypt-msg create-wallet

OPTIONS
  -n, --name=name  Name of wallet
  -t, --testnet    Create a testnet wallet
```

_See code: [src/commands/create-wallet.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/create-wallet.js)_

## `encrypt-msg decrypt-messages`

Retrieve and display the encrypted message sent to this wallet.

```
USAGE
  $ encrypt-msg decrypt-messages

OPTIONS
  -n, --name=name  Name of wallet

DESCRIPTION
  Prototype command for retrieving, decrypting, and displaying a message using
  the Bitcoin Cash blockchain and IPFS. This command does the following:

  1. Get encryption data from the wallet.
  2. Get transaction history for the messaging address.
  3. Walk through the transactions, looking for an OP_RETURN in the TX.
  4. If OP_RETURN matches the MSG format, download the message from IPFS.
  5. Download, decrypt, and display the message.

  It only does this for the first message found, then exists.

  This is just a prototype.
```

_See code: [src/commands/decrypt-messages.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/decrypt-messages.js)_

## `encrypt-msg derivation`

Display or set the derivation path used by the wallet.

```
USAGE
  $ encrypt-msg derivation

OPTIONS
  -n, --name=name  name to print
  -s, --save=save  save a new derivation path

DESCRIPTION
  This command is used to display the derivation path used by the wallet. The -s
  flag can be used to save a new derivation path.

  Common derivation paths used:
  145 - BIP44 standard path for Bitcoin Cash
  245 - BIP44 standard path for SLP tokens
  0 - Used by common software like the Bitcoin.com wallet and Honest.cash

  Wallets use the 245 derivation path by default.
```

_See code: [src/commands/derivation.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/derivation.js)_

## `encrypt-msg encrypt-send`

Encrypt a message for another BCH address.

```
USAGE
  $ encrypt-msg encrypt-send

OPTIONS
  -a, --address=address  BCH address to find public key for

  -f, --file=file        The file you want to encrypt and send. The file should be placed in the 'packaged-files'
                         directory.

  -n, --name=name        Name of wallet to pay for BCH fees

  -s, --subject=subject  The 'subject' of the message. Can't be too long, and will not be encrypted. Wrap in double
                         quotes.

DESCRIPTION
  Given a BCH address, this command will do the following:
  1. It will search the blockchain for the public key associated with the address.
  2. It will encrypt the message with the public key.
  3. It will upload the encrypted message to IPFS.
  4. It will signal the address with an on-chain message.
  5. It will pay for the IPFS and BCH messages with the address set using set-key.
```

_See code: [src/commands/encrypt-send.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/encrypt-send.js)_

## `encrypt-msg get-address`

Generate a new address to recieve BCH.

```
USAGE
  $ encrypt-msg get-address

OPTIONS
  -n, --name=name  Name of wallet
  -t, --token      Generate a simpledger: token address
```

_See code: [src/commands/get-address.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/get-address.js)_

## `encrypt-msg get-key`

Get the encryption key info for the keypair set with set-key

```
USAGE
  $ encrypt-msg get-key

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-key.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/get-key.js)_

## `encrypt-msg get-private-key`

Generate a new private/public key pair.

```
USAGE
  $ encrypt-msg get-private-key

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-private-key.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/get-private-key.js)_

## `encrypt-msg get-pubkey`

Search the blockchain for a public key associated with an address.

```
USAGE
  $ encrypt-msg get-pubkey

OPTIONS
  -a, --address=address  BCH address to find public key for

DESCRIPTION
  Bitcoin Cash addresses are derived from a public key. If an address has made a
  transaction, then the public key can be retrieved from the blockchain. This
  public key is required in order to encrypt messages and files for that address.
```

_See code: [src/commands/get-pubkey.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/get-pubkey.js)_

## `encrypt-msg hello`

Example command from oclif

```
USAGE
  $ encrypt-msg hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Leaving it here for future reference in development.
```

_See code: [src/commands/hello.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/hello.js)_

## `encrypt-msg help [COMMAND]`

display help for encrypt-msg

```
USAGE
  $ encrypt-msg help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `encrypt-msg list-wallets`

List existing wallets.

```
USAGE
  $ encrypt-msg list-wallets
```

_See code: [src/commands/list-wallets.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/list-wallets.js)_

## `encrypt-msg package-file`

Zips file or directory.

```
USAGE
  $ encrypt-msg package-file

OPTIONS
  -f, --file=file        Path of the file or directory
  -m, --message=message  The message you want to encrypt and send. Wrap in double quotes.

DESCRIPTION
  1-Copies the file or the specified directory
  2-Exports the message in a JSON file
  3-Creates a ZIP file with both contents
```

_See code: [src/commands/package-file.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/package-file.js)_

## `encrypt-msg remove-wallet`

Remove an existing wallet.

```
USAGE
  $ encrypt-msg remove-wallet

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/remove-wallet.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/remove-wallet.js)_

## `encrypt-msg send`

Send an amount of BCH

```
USAGE
  $ encrypt-msg send

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -b, --bch=bch            Quantity in BCH
  -n, --name=name          Name of wallet
```

_See code: [src/commands/send.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/send.js)_

## `encrypt-msg send-all`

Send all BCH in a wallet to another address. **Degrades Privacy**

```
USAGE
  $ encrypt-msg send-all

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -i, --ignoreTokens       Ignore and burn tokens
  -n, --name=name          Name of wallet

DESCRIPTION
  Send all BCH in a wallet to another address.

  This method has a negative impact on privacy by linking all addresses in a
  wallet. If privacy of a concern, CoinJoin should be used.
  This is a good article describing the privacy concerns:
  https://bit.ly/2TnhdVc
```

_See code: [src/commands/send-all.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/send-all.js)_

## `encrypt-msg send-tokens`

Send SLP tokens.

```
USAGE
  $ encrypt-msg send-tokens

OPTIONS
  -a, --sendAddr=sendAddr  Cash or SimpleLedger address to send to
  -n, --name=name          Name of wallet
  -q, --qty=qty
  -t, --tokenId=tokenId    Token ID
```

_See code: [src/commands/send-tokens.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/send-tokens.js)_

## `encrypt-msg set-key`

Generate a new private/public key pair, to use for encryption.

```
USAGE
  $ encrypt-msg set-key

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/set-key.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/set-key.js)_

## `encrypt-msg sign-message`

Sign message

```
USAGE
  $ encrypt-msg sign-message

OPTIONS
  -i, --sendAddrIndex=sendAddrIndex    Adress index
  -n, --name=name                      Name of wallet
  -s, --signTheMessage=signTheMessage  Sign message
```

_See code: [src/commands/sign-message.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/sign-message.js)_

## `encrypt-msg sweep`

Sweep a private key

```
USAGE
  $ encrypt-msg sweep

OPTIONS
  -a, --address=address  Address to sweep funds to.
  -b, --balanceOnly      Balance only, no claim.
  -t, --testnet          Testnet
  -w, --wif=wif          WIF private key

DESCRIPTION
  ...
  Sweeps a private key in WIF format.
  Supports SLP token sweeping, but only one token class at a time. It will throw
  an error if a WIF contains more than one class of token.
```

_See code: [src/commands/sweep.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/sweep.js)_

## `encrypt-msg update-balances`

Poll the network and update the balances of the wallet.

```
USAGE
  $ encrypt-msg update-balances

OPTIONS
  -i, --ignoreTokens  Ignore and burn tokens
  -n, --name=name     Name of wallet
```

_See code: [src/commands/update-balances.js](https://github.com/Permissionless-Software-Foundation/encrypt-msg/blob/v1.0.0/src/commands/update-balances.js)_
<!-- commandsstop -->
