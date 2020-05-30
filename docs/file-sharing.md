# Bitcoin File Sharing Protocol Specification

### Specification version: 0.0
### Date orginally published: May 30, 2020

## Authors
Chris Troutner

## Acknowledgements
- James Cramer created the [Bitcoin Files Specification](https://github.com/simpleledger/slp-specifications/blob/master/bitcoinfiles.md) leveraged by this document.
- The [Memo Protocol](https://memo.cash/protocol) used by [Memo.cash](https://memo.cash) is used here as the base protocol.

## 1. Introduction
The following presents a simple protocol for sharing files both on-chain and off-chain with people using a Bitcoin Cash address as an identity. This specification defines a system that functions very much like email, using Bitcoin Cash addresses in place of an email address. It defines how to pass arbitrary messages and files of any size to the recipient. This content can end-to-end (e2e) encrypted with the recipients public key, which means only the person holding the private key for that Bitcoin Cash address can decrypt the content.

For very small content (less than 10kB), on-chain data can be transmitted via the [Bitcoin Files Protocol](https://github.com/simpleledger/slp-specifications/blob/master/bitcoinfiles.md). Content of any size can be shared off-chain via the [Inter-Planetary File System](https://ipfs.io) (IPFS).

## 2. Protocol

This protocol specification describes the requirements for signaling to a Bitcoin Cash address that another address has sent it a message and how to retrieve the message.

### 2.1 Payload Information
The OP_RETURN of a Bitcoin Cash transaction is used to point to the message payload, and to indicate if that content is stored on-chain or off-chain. This data extends the [Memo Protocol](https://memo.cash/protocol), by using the `0x6d02` prefix to signal a UTF-8 encoded (aka 'clear text') message using the memo protocol.

The message follows this pattern:

`MSG <medium> <pointer> <subject>`

For example, here is a message indicating an off-chain message using IPFS as the content-deliver medium:

- `MSG IPFS QmT17Px3WcydqbZnKGUkKb5tWTM7Ypoz1UJ1MHWngC49xQ A message for you`

The *medium* above is specified as IPFS. The *pointer* is the IPFS hash needed to retrieve the content from the IPFS network. The rest of the signal is a *subject* message, similar to an email subject. The subject can be of any length

Here is another example indicating an on-chain message using the [Bitcoin Files Protocol](https://github.com/simpleledger/slp-specifications/blob/master/bitcoinfiles.md) protocol:

- `MSG BCH bitcoinfile:2f2add68a365da4cae325e4d4a0f6a57ddffd3446a6dc3bf5b32f6ae9f0f48ff Another message`

### 2.2 Message Signaling

An on-chain signal is required to allow wallets to detect that they have a message waiting for them. In addition to the data in the OP_RETURN, a dust output is sent to the recipients address. This will cause the transaction to appear in the transaction history for the address. Wallets can easily crawl their transaction history to find transactions with the above OP_RETURN payload.
