"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Sparkles,
  Heart,
  Phone,
  Mail,
  ChevronRight,
  User,
  LayoutDashboard,
  FileText,
  Repeat,
  LogOut,
} from "lucide-react";
import { NavItem, assistanceNavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  assistanceItem?: NavItem;
}

export function MobileNav({
  isOpen,
  onClose,
  navItems,
  assistanceItem = assistanceNavItem,
}: MobileNavProps) {
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);
  const { user, isAuthenticated, logout } = useAuth();

  // Close only when pathname actually changes
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1F3D]/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer animate-fadeIn"
        onClick={onClose}
        aria-label="Tutup Menu"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[101] w-[85vw] max-w-xs bg-white shadow-2xl flex flex-col border-l border-[#E9E5DD] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9E5DD] bg-[#FBFAF7]">
          <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-amanahzakat.png"
              alt="Amanah Zakat"
              className="h-8 w-auto object-contain mix-blend-multiply"
            />

            <span className="text-[9px] tracking-[1px] uppercase text-[#9A9086] font-extrabold self-end pb-0.5">
              PEDULI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E564E] hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* User Auth Section in Mobile */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EAE5DC] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-8 h-8 rounded-xl text-white flex items-center justify-center text-xs font-bold shrink-0 ${
                    user.role === "MUSTAHIK" ? "bg-[#0F9D6E]" : "bg-[#14509C]"
                  }`}
                >
                  {user.nama
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#1A1613] truncate">{user.nama}</div>
                  <div className="text-[10px] text-[#8B8177] truncate flex items-center gap-1.5">
                    <span>{user.memberId}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        user.role === "MUSTAHIK"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "MUSTAHIK" ? "Mustahik" : "Muzakki"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE5DC] flex flex-col gap-1 text-xs font-semibold">
                {user.role === "MUSTAHIK" ? (
                  <>
                    <Link
                      href="/mustahik"
                      onClick={onClose}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#0F9D6E] hover:bg-[#E8F5E9]"
                    >
                      <span className="flex items-center gap-1.5">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>Portal Mustahik</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/mustahik"
                      onClick={onClose}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#0F9D6E] hover:bg-[#E8F5E9]"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Pengajuan Bantuan</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/muzakki"
                      onClick={onClose}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#14509C] hover:bg-[#EEF3FB]"
                    >
                      <span className="flex items-center gap-1.5">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>Dashboard Muzakki</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/muzakki?tab=sbmz"
                      onClick={onClose}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#14509C] hover:bg-[#EEF3FB]"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Bukti Potong (SBMZ)</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/masuk"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-[#EEF3FB] border border-[#BCD3EE] text-[#0E3B74] text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#14509C]" />
                <span>Masuk / Daftar Akun</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}

          {/* Main Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/" || pathname.startsWith("/kampanye")
                  : pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#EEF3FB] text-[#14509C] font-extrabold"
                      : "text-[#3D352E] hover:bg-black/5"
                  )}
                >
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* Assistance Highlight Box */}
          {assistanceItem && (
            <div className="pt-1">
              <Link
                href={assistanceItem.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FDF6EA] border border-[#EEDBBA] text-[#8C5D09] font-bold text-xs hover:bg-[#FCEFD5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>{assistanceItem.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-600" />
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-[#E9E5DD] bg-[#FAF8F4] space-y-3">
          <Link href="/donasi" onClick={onClose} className="block w-full">
            <Button variant="primary" className="w-full justify-center shadow-md py-3 font-bold">
              <Heart className="h-4 w-4 fill-white mr-1.5" />
              Donasi Sekarang
            </Button>
          </Link>
          <div className="text-xs text-[#8C827A] flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{siteConfig.support.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>{siteConfig.support.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
