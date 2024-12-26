import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const { ethers } = require("ethers");
import { Wallet } from "ethers";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    pkey: "",
  });
  const router = useRouter();

  async function setupWallet() {
    try {
      // Set up the provider
      const provider = ethers.getDefaultProvider("sepolia", {
        alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      });

      const walletInstance = Wallet.createRandom(provider);
      // Fetch the wallet address and balance
      const address = walletInstance.address;
      const balance = await provider.getBalance(address);
      console.log("new wallet address=", walletInstance.address);
      console.log("new wallet balance=", balance);
      return walletInstance;
    } catch (error) {
      console.error("Error setting up wallet:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newwallet = await setupWallet();
      const mypkey = await newwallet.privateKey;
      console.log("new wallet pkey from handle submit=", newwallet.privateKey);

      // Include the private key in the formData
      const updatedFormData = { ...formData, role: "client", pkey: mypkey };
      console.log("Updated form data:", updatedFormData);

      setFormData(updatedFormData);
      console.log("format before add pkey", formData);
      await axios.post(
        "https://walletinterne-back-mainnet-mdb.onrender.com/account/addaccount",
        updatedFormData
      );
      alert("Signup successful. Please log in.");
      router.push("/auth/login");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <br />
      <br />
      <button class="button" type="submit">
        Sign Up
      </button>
    </form>
  );
}
