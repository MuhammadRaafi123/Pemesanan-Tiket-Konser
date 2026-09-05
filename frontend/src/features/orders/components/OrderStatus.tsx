import React from "react";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusProps {
  status: "pending" | "paid" | "rejected" | "cancelled" | string;
}

export function OrderStatus({ status }: OrderStatusProps) {
  switch (status) {
    case "paid":
      return (
        <Badge variant="success" className="gap-1.5 py-1 px-3">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          Lunas (Paid)
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="gap-1.5 py-1 px-3">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          Menunggu Verifikasi
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="gap-1.5 py-1 px-3">
          <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
          Ditolak
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="gap-1.5 py-1 px-3">
          <XCircle className="h-3.5 w-3.5 text-white/50" />
          Dibatalkan
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
export default OrderStatus;
