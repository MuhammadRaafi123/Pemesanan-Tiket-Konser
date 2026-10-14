"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { useToast } from "@/components/shared/ToastProvider";

interface PaymentProofUploadProps {
  onFileSelect: (file: File | null) => void;
}

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];
const MAX_SIZE = 2 * 1024 * 1024;

export function PaymentProofUpload({ onFileSelect }: PaymentProofUploadProps) {
  const { error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const extension = file.name.toLowerCase().split(".").pop();
    const isAllowed = ALLOWED_EXTENSIONS.includes(extension ?? "");

    if (!isAllowed) {
      error("Gunakan file JPG, PNG, atau PDF");
      return;
    }

    if (file.size > MAX_SIZE) {
      error("Ukuran file maksimal 2MB");
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    if (extension === "pdf") {
      setPreview(null);
    } else {
      const reader = new FileReader();
      reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
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
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {!hasFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-400 ${
            isDragging
              ? "border-primary bg-accent/60"
              : "border-primary/20 bg-muted/40 hover:border-primary/45 hover:bg-accent/40"
          }`}
        >
          <span className="float-slow mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-primary shadow-[0_16px_34px_-24px_rgba(27,69,199,.9)]">
            <UploadCloud className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-ink">Unggah bukti pembayaran</span>
          <span className="mt-1.5 text-xs text-muted-foreground">
            Seret file ke sini atau klik untuk memilih · JPG, PNG, PDF · maksimal 2MB
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/60">
              {isPdf || !preview ? (
                <FileText className="h-6 w-6 text-gold" />
              ) : (
                <Image src={preview} alt="Bukti pembayaran" fill sizes="64px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{fileName}</p>
              <p className="mt-1 text-[0.68rem] text-muted-foreground">{fileSize}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Siap dikirim
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Hapus file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentProofUpload;
