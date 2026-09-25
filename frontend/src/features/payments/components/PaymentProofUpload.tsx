"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { useToast } from "@/components/shared/ToastProvider";

interface PaymentProofUploadProps {
  onFileSelect: (file: File | null) => void;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);

export function PaymentProofUpload({ onFileSelect }: PaymentProofUploadProps) {
  const { error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const extension = file.name.toLowerCase().split(".").pop();
    const isAllowed = ALLOWED_TYPES.has(file.type) || extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "pdf";

    if (!isAllowed) {
      error("Gunakan file JPG, PNG, atau PDF");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      error("Ukuran file maksimal 2MB");
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    if (file.type === "application/pdf" || extension === "pdf") {
      setPreview(null);
    } else {
      const reader = new FileReader();
      reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasFile = Boolean(fileName);
  const isPdf = fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={handleChange} className="hidden" />

      {!hasFile ? (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 text-[#2563eb] transition group-hover:scale-105"><UploadCloud className="h-7 w-7" /></span>
          <span className="text-sm font-semibold text-[#17457f]">Unggah bukti pembayaran</span>
          <span className="mt-1 text-xs text-[#8aa4c1]">JPG, PNG, atau PDF · maksimal 2MB</span>
        </button>
      ) : (
        <div className="relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-blue-200 bg-white p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
              {isPdf || !preview ? <FileText className="h-7 w-7 text-[#d6b879]" /> : <Image src={preview} alt="Bukti pembayaran" fill className="object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#17457f]">{fileName}</p>
              <p className="mt-1 text-[11px] text-[#8aa4c1]">{fileSize}</p>
              <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-300"><CheckCircle2 className="h-3 w-3" />Siap dikirim</span>
            </div>
          </div>
          <button type="button" onClick={handleRemove} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100 hover:text-rose-600" title="Hapus file"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

export default PaymentProofUpload;
