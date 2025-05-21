const hre = require("hardhat");

async function main() {
  const factory = await hre.ethers.deployContract("JuntaFactory");

  await factory.waitForDeployment();

  console.log("JuntaFactory desplegado en:", factory.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
