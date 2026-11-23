"use client";

import { Check, ChevronDown, CreditCard, QrCode, WalletCards } from "lucide-react";
import { useState } from "react";
import type { PaymentMethodOption } from "../api";

interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const GROUPS = [
  { id: "bank_transfer", label: "Transfer Bank", icon: CreditCard },
  { id: "virtual_account", label: "Virtual Account", icon: CreditCard },
  { id: "ewallet", label: "E-Wallet", icon: WalletCards },
  { id: "qris", label: "QRIS", icon: QrCode },
] as const;

export function PaymentMethodSelector({ methods, selectedMethod, onSelect }: PaymentMethodSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string> | null>(null);
  const selectedCategory = methods.find((method) => method.id === selectedMethod)?.category;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current ?? (selectedCategory ? [selectedCategory] : []));
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {GROUPS.map((group) => {
        const groupMethods = methods.filter((method) => method.category === group.id);
        if (!groupMethods.length) return null;
        const Icon = group.icon;
        const isOpen = expandedGroups === null ? selectedCategory === group.id : expandedGroups.has(group.id);
        return (
          <section key={group.id} className="overflow-hidden rounded-2xl border border-[#e8e5ef] bg-white">
            <button type="button" aria-expanded={isOpen} onClick={() => toggleGroup(group.id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#faf8ff]">
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#6264b5]" /><span className="text-xs font-bold text-[#3156ad]">{group.label}</span><span className="rounded-full bg-[#f1edff] px-2 py-0.5 text-[10px] font-semibold text-[#6264b5]">{groupMethods.length}</span></span>
              <ChevronDown className={`h-4 w-4 text-[#5c6482] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="grid gap-2 border-t border-[#f0edf6] p-3 sm:grid-cols-2">
              {groupMethods.map((method) => {
                const selected = selectedMethod === method.id;
                const providerMark = method.name.split(" ")[0].slice(0, 3).toUpperCase();
                return (
                  <button key={method.id} type="button" onClick={() => onSelect(method.id)} aria-pressed={selected} className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-[#6264b5] bg-[#e6eefb] ring-2 ring-[#6264b5]/10" : "border-[#e8e5ef] bg-white hover:border-[#c8b7db]"}`}>
                    <span className="flex items-center gap-3"><span aria-hidden="true" className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#eeebf4] px-1 text-[10px] font-extrabold text-[#6264b5]">{group.id === "qris" ? <Icon className="h-4 w-4" /> : providerMark}</span><span className="text-xs font-semibold text-[#071653]">{method.name}</span></span>
                    {selected && <Check className="h-4 w-4 text-[#6264b5]" />}
                  </button>
                );
              })}
            </div>}
          </section>
        );
      })}
    </div>
  );
}

export default PaymentMethodSelector;
