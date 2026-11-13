"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LoaderCircle, RefreshCw, Search, Users } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/components/shared/ToastProvider";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatEventDate } from "@/lib/format";
import type { User } from "@/features/auth/types";
import type { ApiResponse } from "@/types/api";

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-[#11110f] pl-9 pr-3 text-sm text-[#f5f0e5] outline-none transition placeholder:text-white/30 focus:border-[#c9a85e]";

export default function AdminUsersPage() {
  const { error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const response = await api.get<ApiResponse<User[]>>("/users");
        setUsers(response.data.data ?? []);
      } catch (err) {
        error(getApiErrorMessage(err, "Data pengguna tidak dapat dimuat."));
      } finally {
        setLoading(false);
      }
    },
    [error],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadUsers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    if (!query) return users;
    return users.filter((user) =>
      [user.name, user.email, user.phone, user.role]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("id").includes(query)),
    );
  }, [search, users]);

  const customerCount = users.filter((user) => user.role === "customer").length;
  const adminCount = users.length - customerCount;

  return (
    <div className="min-h-full px-5 py-8 text-[#f5f0e5] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-[rgba(201,168,94,0.12)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]/70">
              Admin · Pengguna
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Data Pengguna
            </h1>
            <p className="mt-1 text-sm text-[#817a6a]">
              Lihat akun pelanggan dan admin yang terdaftar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[rgba(201,168,94,0.2)] bg-white/[0.03] px-3.5 text-xs font-semibold text-[#c9a85e] transition hover:bg-[#c9a85e]/10 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Muat ulang
          </button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total pengguna", value: users.length },
            { label: "Pelanggan", value: customerCount },
            { label: "Admin", value: adminCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410] p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#817a6a]">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410]">
          <div className="border-b border-white/[0.07] p-4 sm:p-5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#817a6a]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, email, atau nomor telepon..."
                aria-label="Cari pengguna"
                className={field}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#817a6a]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#c9a85e]" />
              Memuat data pengguna...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#c9a85e]">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold">
                {users.length === 0 ? "Belum ada pengguna" : "Pengguna tidak ditemukan"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#817a6a]">
                Ubah kata kunci pencarian untuk melihat pengguna.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817a6a]">
                      <th className="px-5 py-3">Pengguna</th>
                      <th className="px-4 py-3">Kontak</th>
                      <th className="px-4 py-3">Peran</th>
                      <th className="px-5 py-3">Bergabung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c9a85e]/15 text-xs font-bold uppercase text-[#dfc786]">
                              {user.name.slice(0, 1)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold">{user.name}</p>
                              <p className="mt-1 truncate text-[11px] text-[#817a6a]">
                                ID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-[#d8d1c1]">{user.email}</p>
                          <p className="mt-1 text-[11px] text-[#817a6a]">
                            {user.phone || "Nomor telepon belum diisi"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                              user.role === "admin"
                                ? "border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#dfc786]"
                                : "border-white/10 bg-white/[0.04] text-[#aaa69b]"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Pelanggan"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-[#d8d1c1]">
                          {user.created_at
                            ? formatEventDate(user.created_at, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-white/[0.06] md:hidden">
                {filteredUsers.map((user) => (
                  <article key={user.id} className="flex items-start gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a85e]/15 text-xs font-bold uppercase text-[#dfc786]">
                      {user.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="mt-1 truncate text-xs text-[#817a6a]">{user.email}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold ${
                            user.role === "admin"
                              ? "border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#dfc786]"
                              : "border-white/10 bg-white/[0.04] text-[#aaa69b]"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Pelanggan"}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-[#817a6a]">
                        {user.phone || "Nomor telepon belum diisi"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#817a6a]">
                        {user.created_at
                          ? `Bergabung ${formatEventDate(user.created_at, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}`
                          : `ID #${user.id}`}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-[#817a6a]">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </p>
            </>
          )}
        </section>

        <p className="mt-4 text-[11px] leading-5 text-[#817a6a]">
          Halaman ini menyediakan akses lihat data pengguna. Perubahan data akun dikelola oleh
          pengguna melalui profil masing-masing.
        </p>
      </div>
    </div>
  );
}
