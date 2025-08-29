"use client";
import React, { useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  Plus,
  X,
  Check,
  CreditCard,
  Wallet,
  Coins,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../withAuth";

type CryptoToken = {
  id: string;
  name: string;
  mint: string;
  monthlySubscription: string;
  yearlySubscription: string;
  oneTimeSubscription: string;
};

function App() {
  const [receivingAddress, setReceivingAddress] = useState(
    "YOUR_FIXED_WALLET_ADDRESS_HERE"
  );
  const [activeCryptos, setActiveCryptos] = useState<CryptoToken[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [oneTimePrice, setOneTimePrice] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Combined fetch logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const premium = await fetch("/api/address");
        if (premium.ok) {
          const premiumData = await premium.json();
          setReceivingAddress(premiumData.address || "");
          setActiveCryptos(premiumData.tokens || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const updateData = async () => {
    try {
      const res = await fetch("/api/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receivingAddress,
          tokens: activeCryptos,
        }),
      });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      console.log("Updated successfully:", data);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Failed to update");
    }
  };

  const addCrypto = () => {
    if (
      !tokenName ||
      !mintAddress ||
      !monthlyPrice ||
      !yearlyPrice ||
      !oneTimePrice
    )
      return;
    setActiveCryptos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: tokenName,
        mint: mintAddress,
        monthlySubscription: monthlyPrice,
        yearlySubscription: yearlyPrice,
        oneTimeSubscription: oneTimePrice,
      },
    ]);
    setTokenName("");
    setMintAddress("");
    setMonthlyPrice("");
    setYearlyPrice("");
    setOneTimePrice("");
  };

  const removeCrypto = (mint: string) => {
    alert("removed");
    return setActiveCryptos((prev) =>
      prev.filter((active) => active.mint !== mint)
    );
  };
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-black text-white ml-0 md:ml-[50px]">
        <div className="bg-[#171717] px-[24px] py-[32px]">
          <div className="max-w-[1152px] mx-auto">
            <h1 className="text-[30px] font-[700] mb-[8px]">
              Premium Moderation Management
            </h1>
            <p className="text-[#9ca3af] text-[18px]">
              Manage token-based subscription plans.
            </p>
          </div>
        </div>

        <div className="max-w-[1152px] mx-auto px-[24px] py-[32px]">
          <div className="bg-[#171717] rounded-[12px] p-[24px]">
            <h2 className="text-[20px] font-[600] mb-[24px] flex items-center">
              <Wallet className="w-[20px] h-[20px] mr-[8px] text-[#4ade80]" />{" "}
              Crypto Payments
            </h2>

            <div className="mb-[24px]">
              <p className="text-sm text-gray-400">Send all payments to:</p>
              {isEditingAddress && (
                <p className="text-lg text-[#dd486f] my-4">
                  Note: it should be a base address
                </p>
              )}
              {isEditingAddress ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={receivingAddress}
                    onChange={(e) => setReceivingAddress(e.target.value)}
                    className="px-3 py-2 bg-black text-white rounded w-full"
                  />
                  <button
                    onClick={() => (
                      setIsEditingAddress(false),
                      updateData(),
                      alert("Address updated successfully!")
                    )}
                    className="px-5 py-2 bg-[#dd486f] text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="px-5 py-2 bg-gray-700 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold break-all">
                    {receivingAddress}
                  </p>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="px-5 py-2 bg-[#dd486f] text-white rounded"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[14px] font-[500] text-[#d1d5db] mb-[12px]">
                  Accepted Tokens
                </h3>
                {activeCryptos.length > 0 ? (
                  <div className="space-y-[8px]">
                    {activeCryptos.map((crypto) => (
                      <div
                        key={crypto.mint}
                        className="flex items-center justify-between bg-black rounded-[8px] px-[16px] py-[12px]"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Check className="w-[16px] h-[16px] text-[#4ade80] mr-[8px]" />
                            <Coins className="w-[16px] h-[16px] text-[#9ca3af] mr-[8px]" />
                            <span className="text-white">{crypto.name}</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            Mint: {crypto.mint} | Monthly: $
                            {crypto.monthlySubscription} | Yearly: $
                            {crypto.yearlySubscription} | One-time: $
                            {crypto.oneTimeSubscription}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCrypto(crypto.mint)}
                          className="text-[#f87171] hover:text-[#fca5a5] text-[14px] font-[500] flex items-center"
                        >
                          <X className="w-[16px] h-[16px] mr-[4px]" /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div> No active token</div>
                )}

                <h3 className="text-[14px] font-[500] text-[#d1d5db] mb-[12px] mt-[24px]">
                  Add New Token
                </h3>
                <div className="flex flex-col gap-[12px]">
                  <input
                    type="text"
                    placeholder="Token name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="bg-black rounded-[8px] px-[12px] py-[8px] text-white"
                  />
                  <input
                    type="text"
                    placeholder="Mint address"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    className="bg-black rounded-[8px] px-[12px] py-[8px] text-white"
                  />
                  <input
                    type="number"
                    placeholder="Monthly price"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    className="bg-black rounded-[8px] px-[12px] py-[8px] text-white"
                  />
                  <input
                    type="number"
                    placeholder="Yearly price"
                    value={yearlyPrice}
                    onChange={(e) => setYearlyPrice(e.target.value)}
                    className="bg-black rounded-[8px] px-[12px] py-[8px] text-white"
                  />
                  <input
                    type="number"
                    placeholder="One-time price"
                    value={oneTimePrice}
                    onChange={(e) => setOneTimePrice(e.target.value)}
                    className="bg-black rounded-[8px] px-[12px] py-[8px] text-white"
                  />
                  <button
                    onClick={addCrypto}
                    disabled={
                      !tokenName ||
                      !mintAddress ||
                      !monthlyPrice ||
                      !yearlyPrice ||
                      !oneTimePrice
                    }
                    className="bg-[#dd486f] hover:bg-[#dd486f]/40 disabled:bg-[#dd486f]/10 text-white px-[16px] py-[8px] rounded-[8px] flex items-center justify-center"
                  >
                    <Plus className="w-[16px] h-[16px] mr-[4px]" /> Add Token
                  </button>
                </div>
              </div>
              <button
                onClick={updateData}
                className="w-full bg-[#dd486f] hover:bg-[#dd486f]/60 text-white px-[16px] py-[12px] rounded-[8px] flex items-center justify-center mt-[24px]"
              >
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(App);
