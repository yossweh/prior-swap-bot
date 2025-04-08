# 🌀 PRIOR Swap Bot (Base Sepolia)

Bot otomatis untuk melakukan swap token PRIOR ke USDT/USDC di jaringan **Base Sepolia Testnet**.  
Didesain untuk keperluan testnet & farming airdrop dengan dukungan multi-wallet dan randomization.

---

## 🚀 Fitur

- ✅ Swap otomatis PRIOR → USDT/USDC
- 🔁 Multi-wallet support (`PRIVATE_KEY_1`, `PRIVATE_KEY_2`, dst.)
- 🎲 Jumlah swap dan token tujuan di-random
- ⏱ Delay otomatis antar transaksi
- 🔐 Private key tersimpan aman di `.env`
- 📦 Ringan & mudah dijalankan (Node.js)

---

## 📦 Instalasi

1. **Clone repo:**

   ```bash
   git clone https://github.com/yossweh/prior-swap-bot.git
   cd prior-swap-bot
 
2. **Install dependencies:**
    
   ```bash
   npm install

3. **Siapkan file `.env`:**

   Buat file `.env`dan isi seperti berikut:
   ```bash
   PRIVATE_KEY_1=your_private_key_here
   PRIVATE_KEY_2=another_private_key_if_needed

5. **⚙️ Menjalankan Bot:**
   ```
   node swap.js
  Kamu akan ditanya berapa kali swap yang ingin dilakukan per wallet. Bot akan menjalankan proses secara otomatis. 

## 📄 Contoh Output
   ```
   💳 Wallet 1 (0x123...abcd):
   💎 ETH: 0.321
   🔶 PRIOR: 120.00
   💵 USDT: 3.42
   💰 USDC: 2.17

   🔄 Wallet 1 | Swap 1/5: 0.001321 PRIOR for USDC
   ⌛ Waiting for 10 seconds...
   ✅ Wallet 1 | Swap confirmed in block 12345678
