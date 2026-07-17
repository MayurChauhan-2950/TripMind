"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, LogOut, Menu, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/context";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/planner", label: "Planner" },
  { href: "/budget", label: "Budget" },
  { href: "/compare", label: "Compare" },
  { href: "/discover", label: "Discover" },
  { href: "/trips", label: "Trips" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-navy text-paper shadow-[0_2px_8px_rgba(11,21,42,0.4)]">
      <nav className="mx-auto flex max-w-[1200px] items-center px-6 py-4 lg:px-16">
        {/* Left region — logo. flex-1 mirrors the right region so the center */}
        {/* links block below is mathematically centered regardless of how */}
        {/* wide the user-actions block on the right ends up being. */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex shrink-0 items-center gap-2 font-display text-display-md"
          >
            <Compass className="size-6 text-gold" strokeWidth={1.75} />
            TripMind
          </Link>
        </div>

        {/* Center nav links (desktop) */}
        <ul className="hidden shrink-0 items-center gap-1 font-body text-body-sm md:flex">
          {LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-tag px-3 py-1.5 transition-colors duration-150 ${
                    isActive
                      ? "bg-paper/10 text-paper border-b-2 border-gold"
                      : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right region — user actions (desktop) + hamburger (mobile) */}
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden items-center gap-3 font-body text-body-sm md:flex">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 rounded-pill border border-paper/30 px-3 py-1.5 text-paper/80 transition-colors duration-150 hover:border-gold hover:text-paper"
                >
                  <User className="size-4" strokeWidth={1.75} />
                  {user.username}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-pill border border-paper/30 px-3 py-1.5 text-paper/80 transition-colors duration-150 hover:border-rust hover:text-rust"
                  title="Log out"
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-pill border border-transparent px-3 py-1.5 text-paper/80 transition-colors duration-150 hover:border-paper/30 hover:text-paper"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-pill border border-gold bg-gold/10 px-4 py-1.5 text-gold transition-colors duration-150 hover:bg-gold hover:text-navy"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-paper md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="size-6" strokeWidth={1.75} />
            ) : (
              <Menu className="size-6" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer with animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-paper/10 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4 font-body text-body-md">
              {LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-tag px-3 py-2.5 transition-colors duration-150 ${
                        isActive ? "text-gold" : "text-paper/80 hover:text-paper"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-paper/10 pt-2">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-tag px-3 py-2.5 text-paper/80 hover:text-paper"
                    >
                      <User className="size-4" strokeWidth={1.75} />
                      {user.username}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-tag px-3 py-2.5 text-left text-paper/80 hover:text-rust"
                    >
                      <LogOut className="size-4" strokeWidth={1.75} />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-tag px-3 py-2.5 text-paper/80 hover:text-paper"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-tag px-3 py-2.5 text-gold"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
