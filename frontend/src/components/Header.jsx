import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Leaf, Sparkle, SignOut, CaretDown } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

// ── User avatar with initials ─────────────────────────────────────────────────
function UserAvatar({ username }) {
  const initials = (username || '?')
    .split(/[\s_-]+/)
    .map((w) => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-herb-700 text-white text-xs font-bold select-none">
      {initials}
    </div>
  );
}

// ── Dropdown menu for logged-in user ─────────────────────────────────────────
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-herb-50 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <UserAvatar username={user.username} />
        <span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[80px] truncate">
          {user.username}
        </span>
        <CaretDown
          size={13}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl border border-gray-100 bg-white shadow-lg py-1.5 z-50">
          <a
            href="#scan-history"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-herb-50 hover:text-herb-800 transition-colors"
          >
            <Leaf size={15} weight="duotone" />
            My Scans
          </a>
          <hr className="my-1 border-gray-100" />
          <button
            type="button"
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <SignOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header({ backendConfigured, onSignInClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3efe6] bg-white/90 text-herb-900 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <a href="#detect" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-herb-700 text-white shadow-[0_7px_16px_rgba(26,92,53,0.22)] transition-colors group-hover:bg-herb-600">
            <Leaf size={22} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-herb-900">HerbSense</span>
              <span className="hidden items-center gap-1 rounded-full bg-herb-50 px-2 py-0.5 text-[11px] font-semibold text-herb-700 sm:inline-flex">
                <Sparkle size={12} weight="fill" /> YOLO11n AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500">Medicinal plant intelligence</p>
          </div>
        </a>

        {/* Navigation + auth */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#detect"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:text-sm"
          >
            Detect
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:text-sm"
          >
            How it Works
          </a>
          <a
            href="#about"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:inline-block sm:text-sm"
          >
            About
          </a>

          {/* Auth control */}
          {user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <button
              type="button"
              onClick={onSignInClick}
              className="ml-1 rounded-xl bg-herb-700 px-4 py-1.5 text-sm font-bold text-white hover:bg-herb-800 transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
