"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Building2, Check, Copy, QrCode, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";

interface PaymentMethod {
  id: string;
  name: string;
  type: "qris" | "va" | "ewallet";
  accountNumber?: string;
  accountName?: string;
  icon: ReactNode;
  instructions: string[];
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const METHODS: PaymentMethod[] = [
  {
    id: "QRIS",
    name: "QRIS instan",
    type: "qris",
    icon: <QrCode className="h-4 w-4" />,
    instructions: [
      "Buka aplikasi mobile banking atau e-wallet pilihanmu (BCA, Mandiri, GoPay, OVO, ShopeePay, DANA).",
      "Pindai kode QRIS yang tampil di layar.",
      "Periksa nominal pembayaran lalu selesaikan transaksi.",
      "Simpan tangkapan layar sebagai bukti pembayaran.",
    ],
  },
  {
    id: "BCA_VA",
    name: "BCA virtual account",
    type: "va",
    accountNumber: "8801928391823901",
    accountName: "CONCERTIX INDONESIA",
    icon: <Building2 className="h-4 w-4" />,
    instructions: [
      "Buka BCA Mobile, KlikBCA, atau ATM BCA.",
      "Pilih menu Transfer lalu Virtual Account.",
      "Masukkan nomor virtual account di atas.",
      "Konfirmasi tagihan dan selesaikan pembayaran.",
    ],
  },
  {
    id: "MANDIRI_VA",
    name: "Mandiri virtual account",
    type: "va",
    accountNumber: "8932819283019283",
    accountName: "CONCERTIX INDONESIA",
    icon: <Building2 className="h-4 w-4" />,
    instructions: [
      "Buka aplikasi Livin' by Mandiri.",
      "Pilih menu Bayar lalu Multipayment.",
      "Masukkan kode perusahaan atau virtual account di atas.",
      "Selesaikan transaksi dan simpan resi transfer.",
    ],
  },
  {
    id: "GOPAY_OVO",
    name: "GoPay / OVO / DANA",
    type: "ewallet",
    accountNumber: "081298765432",
    accountName: "CONCERTIX INDONESIA",
    icon: <Wallet className="h-4 w-4" />,
    instructions: [
      "Buka aplikasi e-wallet pilihanmu.",
      "Lakukan transfer ke nomor telepon tujuan di atas.",
      "Sertakan catatan nomor pesanan pada catatan transfer.",
      "Unggah tangkapan layar bukti transfer.",
    ],
  },
];

const TYPE_LABEL: Record<PaymentMethod["type"], string> = {
  qris: "QRIS",
  va: "Virtual account",
  ewallet: "E-wallet",
};

export function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
  const { success } = useToast();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const activeMethod = METHODS.find((method) => method.id === selectedMethod) || METHODS[0];

  const handleCopy = (account: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      success("Nomor rekening / VA berhasil disalin!");
      window.setTimeout(() => setCopiedAccount(null), 3000);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-400 ${
                isSelected
                  ? "border-primary/45 bg-accent/60 shadow-[0_14px_30px_-22px_rgba(27,69,199,.7)]"
                  : "border-border bg-white hover:border-primary/25 hover:bg-muted/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                    isSelected ? "border-primary/25 bg-white text-primary" : "border-border bg-muted/60 text-muted-foreground"
                  }`}
                >
                  {method.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{method.name}</span>
                  <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {TYPE_LABEL[method.type]}
                  </span>
                </span>
              </span>

              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isSelected ? "border-primary bg-primary text-white" : "border-border"
                }`}
              >
                {isSelected ? <Check className="h-3 w-3" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <Reveal className="rounded-2xl border border-border bg-muted/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <h3 className="font-display text-lg text-ink">Instruksi: {activeMethod.name}</h3>
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Transaksi terenkripsi
          </Badge>
        </div>

        {activeMethod.type === "qris" ? (
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative h-48 w-48 rounded-2xl border border-border bg-white p-3 shadow-[0_20px_50px_-32px_rgba(13,38,84,.7)]">
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126570014ID.LINKAJA.WWW011893600911002160000002030005104000053033605802ID5919CONCERTIX+INDONESIA6007JAKARTA62070703A016304620C"
                alt="QRIS pembayaran"
                fill
                sizes="192px"
                className="object-contain p-1"
              />
              <span className="scan-line top-1/2" />
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">Pindai dengan aplikasi apa saja</p>
            <p className="mt-1 text-xs text-muted-foreground">BCA, Mandiri, BRI, GoPay, OVO, DANA, ShopeePay</p>
          </div>
        ) : null}

        {activeMethod.accountNumber ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5">
            <div className="min-w-0">
              <p className="meta-label">Nomor rekening / virtual account</p>
              <p className="mt-1.5 font-mono text-lg font-semibold tracking-[0.06em] text-ink">
                {activeMethod.accountNumber}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">a.n {activeMethod.accountName}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(activeMethod.accountNumber!)}
              className="press inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent/60 px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-accent"
            >
              {copiedAccount === activeMethod.accountNumber ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Salin
                </>
              )}
            </button>
          </div>
        ) : null}

        <ol className="mt-6 space-y-2.5">
          {activeMethod.instructions.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6 text-muted-foreground">
              <span className="numeral flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[0.65rem] text-ink">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

export default PaymentMethodSelector;
