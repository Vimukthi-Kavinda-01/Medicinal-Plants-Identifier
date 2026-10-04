import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  EnvelopeSimple,
  Lock,
  User,
  Eye,
  EyeSlash,
  CircleNotch,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
        active
          ? 'bg-herb-700 text-white shadow'
          : 'text-gray-500 hover:text-herb-700'
      }`}
    >
      {label}
    </button>
  );
}

// ── Labelled input ─────────────────────────────────────────────────────────────
function Field({ label, id, type = 'text', value, onChange, autoComplete, icon: Icon, rightSlot, error, placeholder }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Icon size={17} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-gray-50 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-herb-500/40 ${
            Icon ? 'pl-9' : 'pl-3.5'
          } ${rightSlot ? 'pr-10' : 'pr-3.5'} ${
            error ? 'border-red-400' : 'border-gray-200 focus:border-herb-500'
          }`}
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Sign In form ──────────────────────────────────────────────────────────────
function SignInForm({ onSuccess }) {
  const { login } = useAuth();
  const [loginStr, setLoginStr] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!loginStr.trim()) e.loginStr = 'Email or username is required';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(loginStr.trim(), password);
      onSuccess();
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field
        label="Email or Username"
        id="si-login"
        type="text"
        value={loginStr}
        onChange={(e) => setLoginStr(e.target.value)}
        autoComplete="username"
        icon={EnvelopeSimple}
        error={errors.loginStr}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        id="si-password"
        type={showPw ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        icon={Lock}
        error={errors.password}
        placeholder="••••••••"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-gray-400 hover:text-herb-700 transition-colors"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash size={17} /> : <Eye size={17} />}
          </button>
        }
      />

      {globalError && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {globalError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-herb-700 py-3 text-sm font-bold text-white shadow hover:bg-herb-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <CircleNotch size={18} className="animate-spin" /> : null}
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (username.trim().length < 3) e.username = 'Minimum 3 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (!confirmPw) e.confirmPw = 'Please confirm your password';
    else if (confirmPw !== password) e.confirmPw = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      onSuccess();
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field
        label="Full Name (optional)"
        id="reg-name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
        icon={User}
        placeholder="Jane Doe"
      />
      <Field
        label="Username *"
        id="reg-username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        icon={User}
        error={errors.username}
        placeholder="herbexplorer"
      />
      <Field
        label="Email *"
        id="reg-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        icon={EnvelopeSimple}
        error={errors.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password *"
        id="reg-password"
        type={showPw ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        icon={Lock}
        error={errors.password}
        placeholder="••••••••"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-gray-400 hover:text-herb-700 transition-colors"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash size={17} /> : <Eye size={17} />}
          </button>
        }
      />
      <Field
        label="Confirm Password *"
        id="reg-confirm"
        type={showCpw ? 'text' : 'password'}
        value={confirmPw}
        onChange={(e) => setConfirmPw(e.target.value)}
        autoComplete="new-password"
        icon={Lock}
        error={errors.confirmPw}
        placeholder="••••••••"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowCpw((v) => !v)}
            className="text-gray-400 hover:text-herb-700 transition-colors"
            aria-label={showCpw ? 'Hide password' : 'Show password'}
          >
            {showCpw ? <EyeSlash size={17} /> : <Eye size={17} />}
          </button>
        }
      />

      {globalError && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {globalError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-herb-700 py-3 text-sm font-bold text-white shadow hover:bg-herb-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <CircleNotch size={18} className="animate-spin" /> : null}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Modal shell ────────────────────────────────────────────────────────────────
export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('signin');
  const overlayRef = useRef(null);

  // Reset to sign-in tab whenever modal reopens
  useEffect(() => {
    if (isOpen) setTab('signin');
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
      aria-label={tab === 'signin' ? 'Sign in dialog' : 'Create account dialog'}
    >
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[95dvh] sm:max-h-[90vh]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="px-6 pt-8 pb-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1 pr-6">
            <h2 className="text-xl font-bold text-gray-900">
              {tab === 'signin' ? 'Welcome back 👋' : 'Create your account 🌿'}
            </h2>
            <p className="text-xs text-gray-500">
              {tab === 'signin'
                ? 'Sign in to access your scan history'
                : 'Join HerbSense and track your plant discoveries'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
            <Tab label="Sign In" active={tab === 'signin'} onClick={() => setTab('signin')} />
            <Tab label="Create Account" active={tab === 'register'} onClick={() => setTab('register')} />
          </div>

          {/* Forms */}
          {tab === 'signin' ? (
            <SignInForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}

          {/* Switch hint */}
          <p className="text-center text-xs text-gray-500">
            {tab === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-bold text-herb-700 hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('signin')} className="font-bold text-herb-700 hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
