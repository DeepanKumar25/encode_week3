import { ethers } from "hardhat";
import {
  TokenizedBallot,
  MyToken,
  TokenizedBallot__factory,
  MyToken__factory,
} from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();
async function main() {
  const parameter = process.argv.slice(2);
  const tokenContractAddress = parameter[0];
  const ballotContractAddress = parameter[1];
  const proposal = parameter[2];
  const _amount = parameter[3];

  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider);

  const tokenFactory = new MyToken__factory(wallet);
  const tokenContract = tokenFactory.attach(tokenContractAddress) as MyToken;

  const walletAddress = wallet.address;
  const votingPower = await tokenContract.getVotes(walletAddress);
  console.log(
    `Using wallet address ${walletAddress} which has ${votingPower} units of voting`
  );

  const tokenBallotFactory = new TokenizedBallot__factory(wallet);
  const ballotContract = tokenBallotFactory.attach(
    ballotContractAddress
  ) as TokenizedBallot;
  const amount = ethers.parseUnits(_amount, "ether");
  const tx = await ballotContract.vote(proposal, amount);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
