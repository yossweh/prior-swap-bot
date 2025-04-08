require("dotenv").config();
const { ethers } = require("ethers");
const readline = require("readline");

// RPC langsung di dalam script
const RPC_URL = "https://base-sepolia-rpc.publicnode.com";

// Load Private Key
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY tidak ditemukan di file .env");
  process.exit(1);
}

// Alamat penting
const PRIOR_ADDRESS = "0xc19Ec2EEBB009b2422514C51F9118026f1cD89ba";
const USDT_ADDRESS = "0x014397DaEa96CaC46DbEdcbce50A42D5e0152B2E";
const USDC_ADDRESS = "0x109694D75363A75317A8136D80f50F871E81044e";
const ROUTER_ADDRESS = "0x0f1DADEcc263eB79AE3e4db0d57c49a8b6178B0B";

// Setup Provider & Wallet
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ABI ERC20
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

function getRandomAmount() {
  return (Math.random() * 0.001 + 0.001).toFixed(6); // 0.001 - 0.002
}

function getRandomToken() {
  return Math.random() < 0.5 ? "USDT" : "USDC";
}

async function approveIfNeeded(amountInWei) {
  const prior = new ethers.Contract(PRIOR_ADDRESS, ERC20_ABI, wallet);
  const allowance = await prior.allowance(wallet.address, ROUTER_ADDRESS);

  if (allowance.gte(amountInWei)) {
    console.log("✅ PRIOR sudah di-approve.");
    return;
  }

  console.log("?? Approving PRIOR...");
  const txApprove = await prior.approve(ROUTER_ADDRESS, amountInWei);
  await txApprove.wait();
  console.log("✅ Approve berhasil!");
}

async function swapPrior(amount, token) {
  const amountInWei = ethers.utils.parseUnits(amount, 18);
  await approveIfNeeded(amountInWei);

  let txData;
  if (token === "USDT") {
    txData = "0x03b530a3" + ethers.utils.defaultAbiCoder.encode(["uint256"], [amountInWei]).slice(2);
  } else {
    txData = "0xf3b68002" + ethers.utils.defaultAbiCoder.encode(["uint256"], [amountInWei]).slice(2);
  }

  console.log(`?? Swap ${amount} PRIOR ➡️ ${token}...`);

  const tx = await wallet.sendTransaction({
    to: ROUTER_ADDRESS,
    data: txData,
    gasLimit: 500000,
  });

  const receipt = await tx.wait();
  console.log(`✅ Swap sukses! TX: ${receipt.transactionHash}`);
}

async function checkBalances() {
  const prior = new ethers.Contract(PRIOR_ADDRESS, ERC20_ABI, wallet);
  const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
  const eth = await provider.getBalance(wallet.address);

  console.log(`\n?? Wallet: ${wallet.address}`);
  console.log(`?? ETH: ${ethers.utils.formatEther(eth)}`);
  console.log(`?? PRIOR: ${ethers.utils.formatUnits(await prior.balanceOf(wallet.address), 18)}`);
  console.log(`?? USDT: ${ethers.utils.formatUnits(await usdt.balanceOf(wallet.address), 6)}`);
  console.log(`?? USDC: ${ethers.utils.formatUnits(await usdc.balanceOf(wallet.address), 6)}`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// CLI & Main
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log("?? PRIOR Swap Bot - BASE SEPOLIA");
  await checkBalances();

  rl.question("?? Berapa kali ingin melakukan swap? ", async (answer) => {
    const totalSwaps = parseInt(answer);
    if (isNaN(totalSwaps) || totalSwaps <= 0) {
      console.log("❌ Masukkan angka yang valid.");
      rl.close();
      return;
    }

    for (let i = 1; i <= totalSwaps; i++) {
      const amount = getRandomAmount();
      const token = getRandomToken();
      console.log(`\n➡️ Swap ${i}/${totalSwaps}: ${amount} PRIOR ➡️ ${token}`);
      try {
        await swapPrior(amount, token);
      } catch (e) {
        console.error(`❌ Error swap ke-${i}: ${e.message}`);
      }

      if (i < totalSwaps) {
        console.log("⏳ Tunggu 10 detik sebelum swap berikutnya...");
        await delay(10000);
      }
    }

    console.log("\n✅ Semua swap selesai!");
    await checkBalances();
    rl.close();
  });
}

main();

