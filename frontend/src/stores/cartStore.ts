"use client";

import { create } from "zustand";

export interface CartItem {
  ticketCategoryId: number | string;
  categoryName: string;
  price: number;
  qty: number;
  eventId: number | string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventPoster?: string;
  artistName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (ticketCategoryId: number | string, qty: number) => void;
  removeItem: (ticketCategoryId: number | string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (newItem, qty = 1) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.ticketCategoryId === newItem.ticketCategoryId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.ticketCategoryId === newItem.ticketCategoryId
              ? { ...i, qty: i.qty + qty }
              : i
          ),
        };
      }

      return {
        items: [...state.items, { ...newItem, qty }],
      };
    });
  },

  updateQty: (ticketCategoryId, qty) => {
    if (qty <= 0) {
      get().removeItem(ticketCategoryId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.ticketCategoryId === ticketCategoryId ? { ...i, qty } : i
      ),
    }));
  },

  removeItem: (ticketCategoryId) => {
    set((state) => ({
      items: state.items.filter((i) => i.ticketCategoryId !== ticketCategoryId),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.qty, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.qty, 0);
  },
}));
