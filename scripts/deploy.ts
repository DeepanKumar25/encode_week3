import { ethers } from "hardhat";

async function main() {

  const myTokenFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenFactory.deploy();
  await myTokenContract.waitForDeployment();

  const address = await myTokenContract.getAddress();
  console.log(`MyToken Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});