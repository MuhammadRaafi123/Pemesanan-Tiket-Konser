"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export function ImagePreview({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[16/9]",
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 ${aspectRatio} ${className}`}
      >
        <Image
          src={src || "/globe.svg"}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white">
            <Maximize2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative aspect-[16/9] w-full max-h-[75vh] overflow-hidden rounded-2xl">
          <Image
            src={src || "/globe.svg"}
            alt={alt}
            fill
            className="object-contain"
          />
        </div>
      </Dialog>
    </>
  );
}
export default ImagePreview;
