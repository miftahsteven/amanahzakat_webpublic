"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User,
  ChevronDown,
  LayoutDashboard,
  History,
  FileText,
  Repeat,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { mainNavItems } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleOpenMobile = React.useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const handleCloseMobile = React.useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  React.useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
    router.push("/");
  };

  const userInitials = user?.nama
    ? user.nama
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "MZ";

  const shortName = user?.nama ? user.nama.split(",")[0].trim() : "Muzakki";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-md",
          isScrolled
            ? "bg-[#FBFAF7]/95 border-b border-[#E9E5DD] shadow-sm py-1.5 sm:py-2"
            : "bg-[#FBFAF7]/90 border-b border-[#E9E5DD]/80 py-2 sm:py-2.5"
        )}
      >
        <div className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-amanahzakat.png"
              alt="Amanah Zakat"
              height={48}
              style={{ maxHeight: "48px", width: "auto" }}
              className="h-9 sm:h-11 md:h-12 w-auto object-contain mix-blend-multiply"
            />
            <span className="text-[9px] sm:text-[10px] tracking-[1.4px] uppercase text-[#9A9086] font-extrabold self-end pb-0.5 sm:pb-1.5">
              PEDULI
            </span>

          </Link>


          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0">
            {mainNavItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/" || pathname.startsWith("/kampanye")
                  : pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold whitespace-nowrap transition-colors py-1",
                    isActive
                      ? "text-[#14509C] font-extrabold"
                      : "text-[#3D352E] hover:text-[#14509C]"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Auth Profile + Donasi CTA + Burger */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Muzakki Profile / Login Button */}
            {isAuthenticated && user ? (
              /* Logged In Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-white hover:bg-[#FAF8F4] border border-[#DDD7CD] hover:border-[#14509C] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all shadow-xs cursor-pointer select-none"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#14509C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {userInitials}
                  </span>
                  <span className="hidden md:inline text-xs font-bold text-[#1A1613] max-w-[130px] truncate">
                    {shortName}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-[#6D645B] transition-transform duration-200",
                      isProfileDropdownOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Submenu Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#EAE5DC] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Dropdown Header: User Info */}
                    <div className="p-4 bg-[#FAF8F4] border-b border-[#F0ECE4]">
                      <div className="text-xs font-bold text-[#1A1613] truncate">
                        {user.nama}
                      </div>
                      <div className="text-[11px] text-[#6D645B] truncate mt-0.5">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EEF3FB] text-[#0E3B74] border border-[#BCD3EE]">
                          {user.memberId}
                        </span>
                        {user.role === "MUSTAHIK" ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>Mustahik</span>
                          </span>
                        ) : (user as any).isNpwpVerified ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>NPWP Sah</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
                            <AlertCircle className="h-2.5 w-2.5" />
                            <span>Muzakki</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5 text-xs font-semibold text-[#3D352E]">
                      {user.role === "MUSTAHIK" ? (
                        <>
                          <Link
                            href="/mustahik"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E8F5E9] hover:text-[#0F9D6E] transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-[#0F9D6E]" />
                            <span>Portal Mustahik</span>
                          </Link>

                          <Link
                            href="/mustahik"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E8F5E9] hover:text-[#0F9D6E] transition-colors"
                          >
                            <FileText className="h-4 w-4 text-[#0F9D6E]" />
                            <span>Mengajukan Bantuan</span>
                          </Link>

                          <Link
                            href="/mustahik"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E8F5E9] hover:text-[#0F9D6E] transition-colors"
                          >
                            <History className="h-4 w-4 text-[#0F9D6E]" />
                            <span>Pengajuan Saya (5 Tahap)</span>
                          </Link>

                          <Link
                            href="/mustahik"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E8F5E9] hover:text-[#0F9D6E] transition-colors"
                          >
                            <Settings className="h-4 w-4 text-[#0F9D6E]" />
                            <span>Profil &amp; Rekening Bank</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/muzakki"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EEF3FB] hover:text-[#14509C] transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-[#14509C]" />
                            <span>Dashboard Muzakki</span>
                          </Link>

                          <Link
                            href="/muzakki?tab=riwayat"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EEF3FB] hover:text-[#14509C] transition-colors"
                          >
                            <History className="h-4 w-4 text-[#14509C]" />
                            <span>Riwayat Zakat &amp; Donasi</span>
                          </Link>

                          <Link
                            href="/muzakki?tab=sbmz"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EEF3FB] hover:text-[#14509C] transition-colors"
                          >
                            <FileText className="h-4 w-4 text-[#14509C]" />
                            <span>Bukti Potong Pajak (SBMZ)</span>
                          </Link>

                          <Link
                            href="/muzakki?tab=recurring"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EEF3FB] hover:text-[#14509C] transition-colors"
                          >
                            <Repeat className="h-4 w-4 text-[#14509C]" />
                            <span>Auto Recurring ZIS</span>
                          </Link>

                          <Link
                            href="/muzakki?tab=ringkasan"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EEF3FB] hover:text-[#14509C] transition-colors"
                          >
                            <Settings className="h-4 w-4 text-[#14509C]" />
                            <span>Edit Profil &amp; NPWP</span>
                          </Link>
                        </>
                      )}

                      <div className="pt-1 border-t border-[#F0ECE4]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-bold"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In Button */
              <Link href="/masuk">
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-white hover:bg-[#FAF8F4] active:scale-98 text-[#1A1613] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C] rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <User className="h-4 w-4 text-[#14509C]" />
                  <span>Masuk</span>
                </button>
              </Link>
            )}

            {/* Donasi Sekarang CTA Button */}
            <Link href="/donasi">
              <Button
                variant="primary"
                size="sm"
                className="rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 font-bold text-xs sm:text-sm text-white bg-[#14509C] hover:bg-[#0E3B74] shadow-sm whitespace-nowrap cursor-pointer"
              >
                Donasi Sekarang
              </Button>
            </Link>

            {/* Mobile Burger Menu Button */}
            <button
              type="button"
              onClick={handleOpenMobile}
              className="lg:hidden p-2 rounded-xl text-[#1A1613] hover:bg-black/5 active:scale-95 transition-all border border-[#E9E5DD] bg-white shadow-xs cursor-pointer flex items-center justify-center select-none"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="h-5 w-5 text-[#1A1613]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={handleCloseMobile}
        navItems={mainNavItems}
      />
    </>
  );
}
