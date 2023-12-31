
import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const parameter = process.argv.slice(2);
    const contractAddress = parameter[0];
    const receiverAddress = parameter[1];
    const amount = parameter[2];

    const amountBN = ethers.parseUnits(amount, "ether");

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    console.log(`Using wallet address ${wallet.address}`);
    const balanceBN = await provider.getBalance(wallet.address);
    const balance = Number(ethers.formatUnits(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
      throw new Error("Not enough ether");
    }

    const myTokenContractFactory = new MyToken__factory(wallet);
    const myTokenContract = myTokenContractFactory.attach(contractAddress) as MyToken;

    const mintTx = await myTokenContract.connect(wallet).mint(receiverAddress, amountBN);
    await mintTx.wait();

    const newBalanceBN = await myTokenContract.balanceOf(receiverAddress);
    const newBalance = Number(ethers.formatUnits(newBalanceBN));
    console.log("Receiver new balance:", newBalance);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});