"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/shared/ToastProvider";

interface PaymentProofUploadProps {
  onFileSelect: (file: File | null) => void;
}

export function PaymentProofUpload({ onFileSelect }: PaymentProofUploadProps) {
  const { error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      error("Harap unggah file gambar (JPG, PNG, WebP)");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error("Ukuran file maksimal 5MB");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-8 text-center cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-950/20"
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/40 text-purple-400 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold text-white">Unggah Bukti Transfer / Resi</p>
          <p className="text-xs text-white/45 mt-1">Klik untuk memilih file foto bukti pembayaran (JPG, PNG, max 5MB)</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0e0e18] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 shrink-0">
              <Image src={preview} alt="Bukti Transfer" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[200px]">{fileName}</p>
              <p className="text-[11px] text-white/50">{fileSize}</p>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                Siap Dikirim
              </span>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-rose-500/20 hover:text-rose-300 transition"
            title="Hapus file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
export default PaymentProofUpload;
