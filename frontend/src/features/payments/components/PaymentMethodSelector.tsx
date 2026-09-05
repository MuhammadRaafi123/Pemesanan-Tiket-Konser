"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  QrCode, 
  CreditCard, 
  Building2, 
  Wallet, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck 
} from "lucide-react";
import { useToast } from "@/components/shared/ToastProvider";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "qris" | "va" | "ewallet";
  accountNumber?: string;
  accountName?: string;
  icon: React.ReactNode;
  instructions: string[];
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const { success } = useToast();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const methods: PaymentMethod[] = [
    {
      id: "QRIS",
      name: "QRIS Instan (Semua Bank & E-Wallet)",
      type: "qris",
      icon: <QrCode className="h-5 w-5 text-cyan-400" />,
      instructions: [
        "Buka aplikasi mobile banking atau e-wallet pilihanmu (BCA, Mandiri, GoPay, OVO, ShopeePay, DANA).",
        "Pindai QRIS code yang tampil di layar.",
        "Periksa nominal pembayaran dan selesaikan transaksi.",
        "Simpan tangkapan layar (screenshot) bukti pembayaran.",
      ],
    },
    {
      id: "BCA_VA",
      name: "BCA Virtual Account",
      type: "va",
      accountNumber: "8801928391823901",
      accountName: "CONCERTIX INDONESIA",
      icon: <Building2 className="h-5 w-5 text-purple-400" />,
      instructions: [
        "Buka BCA Mobile / KlikBCA / ATM BCA.",
        "Pilih menu Transfer > Virtual Account.",
        "Masukkan nomor Virtual Account di atas.",
        "Konfirmasi tagihan dan selesaikan pembayaran.",
      ],
    },
    {
      id: "MANDIRI_VA",
      name: "Mandiri Virtual Account",
      type: "va",
      accountNumber: "8932819283019283",
      accountName: "CONCERTIX INDONESIA",
      icon: <Building2 className="h-5 w-5 text-amber-400" />,
      instructions: [
        "Buka aplikasi Livin' by Mandiri.",
        "Pilih menu Bayar > Multipayment.",
        "Masukkan kode perusahaan / Virtual Account di atas.",
        "Selesaikan transaksi dan simpan resi bukti transfer.",
      ],
    },
    {
      id: "GOPAY_OVO",
      name: "GoPay / OVO / DANA Direct",
      type: "ewallet",
      accountNumber: "081298765432",
      accountName: "CONCERTIX INDONESIA",
      icon: <Wallet className="h-5 w-5 text-pink-400" />,
      instructions: [
        "Buka aplikasi E-Wallet pilihanmu.",
        "Lakukan transfer ke nomor telepon tujuan di atas.",
        "Sertakan catatan nomor pesanan.",
        "Upload tangkapan layar bukti transfer.",
      ],
    },
  ];

  const handleCopy = (acc: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(acc);
      setCopiedAccount(acc);
      success("Nomor rekening / VA berhasil disalin!");
      setTimeout(() => setCopiedAccount(null), 3000);
    }
  };

  const activeMethod = methods.find((m) => m.id === selectedMethod) || methods[0];

  return (
    <div className="space-y-6">
      
      {/* Methods List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center justify-between ${
                isSelected
                  ? "border-purple-500 bg-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {method.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{method.name}</p>
                  <p className="text-[10px] text-white/40 uppercase mt-0.5">{method.type.toUpperCase()}</p>
                </div>
              </div>

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-600 text-white shadow-md"
                    : "border-white/20"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Method Details Box */}
      <div className="rounded-2xl border border-purple-500/20 bg-[#0b0b14] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Detail Instruksi: {activeMethod.name}
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enkripsi Aman
          </span>
        </div>

        {/* QR Code display if QRIS */}
        {activeMethod.type === "qris" && (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-white/[0.02] rounded-xl border border-white/5">
            <div className="relative h-48 w-48 bg-white p-2 rounded-xl shadow-lg border border-purple-500/40">
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126570014ID.LINKAJA.WWW011893600911002160000002030005104000053033605802ID5919CONCERTIX+INDONESIA6007JAKARTA62070703A016304620C"
                alt="QRIS Payment"
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs text-purple-300 font-semibold mt-3">Scan dengan aplikasi bank / e-wallet apa saja</p>
          </div>
        )}

        {/* Account Number Box if VA / E-Wallet */}
        {activeMethod.accountNumber && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-semibold">Nomor Rekening / Virtual Account</p>
              <p className="font-mono text-lg font-black text-purple-300">{activeMethod.accountNumber}</p>
              <p className="text-[11px] text-white/60">a.n {activeMethod.accountName}</p>
            </div>
            <button
              onClick={() => handleCopy(activeMethod.accountNumber!)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/50 px-3.5 py-2 text-xs font-bold text-purple-200 hover:bg-purple-900 transition"
            >
              {copiedAccount === activeMethod.accountNumber ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Salin
                </>
              )}
            </button>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-white/80">Langkah Pembayaran:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-white/60">
            {activeMethod.instructions.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  );
}
export default PaymentMethodSelector;
