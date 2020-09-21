import SHA256 from "crypto-js/sha256.js";
/**
 * Conceitos de BlockChain abordados
 * 
 *  - Bloco Genesis
 *  - Geração de hash com conteúdo do bloco
 *  - Encadeamento de blocos através do hash do bloco anterior
 *  - Validação de adulteração da cadeia
 *  - Implementando mecanismo de proof-of-work a fim de mitigar a 
 *    possibilidade geração massiva de blocos e adulteração e recálculo de massivo de hashs 
 */
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.data)
    ).toString();
  }

  
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2017", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

}

let myCoin = new Blockchain();

console.log("Minerado bloco 1");
myCoin.addBlock(new Block(1, "01/01/2017", { amount: 14 }));

console.log("Minerado bloco 2");
myCoin.addBlock(new Block(2, "01/01/2018", { amount: 46 }));

console.log(JSON.stringify(myCoin, null, 4));
console.log("Is Chain Valid = " + myCoin.isChainValid());
