/*
  Retrieve signals for messages from the blockchain. Displays the subject
  of each message.

  1. Get encryption data from the wallet.
  2. Get transaction history for the messaging address.
  3. Walk through the transactions, looking for an OP_RETURN in the TX.
  4. If OP_RETURN matches the MSG format, display the subject.
*/

"use strict"

const IPFS_GATEWAY = `https://gateway.temporal.cloud`

const Table = require("cli-table")

const AppUtils = require("../util")
const GetKey = require("./get-key")

const config = require("../../config")

// Mainnet by default.
const bchjs = new config.BCHLIB({
  restURL: config.MAINNET_REST,
  apiToken: config.JWT
})

const { Command, flags } = require("@oclif/command")

let _this

class CheckMessages extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.bchjs = bchjs

    this.appUtils = new AppUtils()
    this.getKey = new GetKey(argv, config)

    _this = this
  }

  async run() {
    try {
      const { flags } = this.parse(CheckMessages)

      // Validate input flags
      this.validateFlags(flags)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (flags.testnet) {
        this.bchjs = new config.BCHLIB({
          restURL: config.TESTNET_REST,
          apiToken: config.JWT
        })
      }

      await this.checkMessages(flags)
    } catch (err) {
      if (err.message) console.log(err.message)
      else console.log(`Error in DecryptMessages.run: `, err)
    }
  }

  // Primary function that orchestrates the other subfunctions.
  async checkMessages(flags) {
    try {
      // Get the keypair used for encrypted messaging.
      const encryptionInfo = this.getKey.getKey(flags)
      // console.log(`encryptionInfo: ${JSON.stringify(encryptionInfo, null, 2)}`)

      // Get indexer data for the address uses for encrypted messaging.
      const balance = await this.bchjs.Blockbook.balance(encryptionInfo.bchAddr)
      // console.log(`balance: ${JSON.stringify(balance, null, 2)}`)

      // Get a list of TXIDs associated with that address.
      const txids = balance.txids

      // Search the list of transactions for the first signal of an encrypted message.
      const msgSignal = await this.findMsgSignal(txids)
      // console.log(`msgSignal: ${JSON.stringify(msgSignal, null, 2)}`)

      if (msgSignal.length === 0)
        console.log(`No messages found for ${encryptionInfo.bchAddr}`)

      this.displayMsg(msgSignal)
    } catch (err) {
      console.error(`Error in getAndDecryptMessages()`)
      throw err
    }
  }

  // Expects an array of signal objects. Displays them on the console.
  displayMsg(sigAry) {
    try {
      var table = new Table({
        head: ["Number", "Subject"]
        // colWidths: [6, 35]
      })

      // Loop through each signal in the array.
      for (let i = 0; i < sigAry.length; i++) {
        const tempAry = [i, sigAry[i].subject, ""]
        table.push(tempAry)
      }

      console.log(table.toString())
    } catch (err) {
      console.error(`Error in displayMsg()`)
      throw err
    }
  }

  // Given a list of TXIDs, search for a transaction with an OP_RETURN that
  // matches the encrypted messaging signal.
  async findMsgSignal(txids) {
    const retAry = []

    try {
      // Loop through each transaction and look for an encrypted message.
      for (let i = 0; i < txids.length; i++) {
        const thisTxid = txids[i]

        const txData = await this.bchjs.RawTransactions.getRawTransaction(
          thisTxid,
          true
        )

        let script = []

        // Loop through each output of the transaction.
        for (let j = 0; j < txData.vout.length; j++) {
          const thisVout = txData.vout[j]

          // Decode the hex into normal text.
          script = this.bchjs.Script.toASM(
            Buffer.from(thisVout.scriptPubKey.hex, "hex")
          ).split(" ")
          // console.log(`script: ${JSON.stringify(script, null, 2)}`);

          // Exit the loop if OP_RETURN is found.
          if (script[0] === "OP_RETURN") break
        }

        // Skip if no OP_RETURN was found
        if (script[0] !== "OP_RETURN") continue

        const msg = Buffer.from(script[2], "hex").toString("ascii")
        // console.log(`Message encoded in the OP_RETURN: ${msg}`)

        // Return the IPFS hash for the message.
        const msgChunks = msg.split(" ")
        // console.log(`msgChunks: ${JSON.stringify(msgChunks, null, 2)}`)

        // Continuing looping if the first part of the OP_RETURN does not match
        // the specification.
        if (msgChunks[0] !== "MSG") continue

        // Generate a return object to capture the metadata in the signal.
        const retObj = {
          medium: "IPFS"
        }

        // IPFS used as a medium for transmitting files.
        if (msgChunks[1] === "IPFS") {
          retObj.medium = "IPFS"
          retObj.pointer = msgChunks[2]

          const subjectAry = msgChunks.slice(3, msgChunks.length)
          retObj.subject = subjectAry.join(" ")

          retAry.push(retObj)

          // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)
        }
      }

      return retAry
    } catch (err) {
      // The error is due to rate limits, display the message.
      if (err.error) {
        console.error(`Error in findMsgSignal(): `, err.error)
        return retAry
      }

      // Otherwise throw the error
      console.error(`Error in findMsgSignal()`)
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    return true
  }
  writeFile(fileName, buffer) {
    return new Promise(function(resolve, reject) {
      try {
        // Generate a random filename.
        const path = `${__dirname}/../../packaged-files/${fileName}`
        _this.fs.writeFile(path, buffer, function(err) {
          if (err) {
            console.error(`Error while trying to write ${fileName} file.`)
            return reject(err)
          }
          // console.log(`${fileName} written successfully!`)
          return resolve(fileName)
        })
      } catch (err) {
        console.error(
          `Error trying to write out ${fileName} file in writeObject.`
        )
        return reject(err)
      }
    })
  }
}

CheckMessages.description = `Check for messages on the blockchain

This command walks the BCH blockchain for the address set with the set-key command.
If it finds transactions that match the protocol, it will display the subject.

This command does the following:

1. Get encryption data from the wallet.
2. Get transaction history for the messaging address.
3. Walk through the transactions, looking for an OP_RETURN in the TX.
4. If OP_RETURN matches the MSG format, display the subject


It only does this for the first message found, then exists.

This is just a prototype.
`

CheckMessages.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),

  check: flags.string({
    char: "c",
    description: "Number of messages to check (default is 2)"
  })
}

module.exports = CheckMessages
