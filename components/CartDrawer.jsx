'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Coins,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { SHOP, SITE, CONTACT } from '@/config/site';
import { money, generateOrderRef } from '@/lib/order';
import { waOrderLink } from '@/lib/whatsapp';
import CryptoPayModal from '@/components/CryptoPayModal';
import PaymentMethodPicker from '@/components/PaymentMethodPicker';
import Honeypot from '@/components/Honeypot';
import { getToken, getNetwork } from '@/config/wallets';

export default function CartDrawer() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, isCartOpen, setIsCartOpen } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(null); // 'form' | 'whatsapp' | null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pay, setPay] = useState({ type: 'bank-transfer', token: '', network: '' });
  const [honeypot, setHoneypot] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  useEffect(() => {
    if (checkoutMode) setStartedAt(Date.now());
  }, [checkoutMode]);
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [cryptoChannel, setCryptoChannel] = useState('email');
  const [cryptoRef, setCryptoRef] = useState('');

  // Form Fields (Required email regardless of channel!)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'VIC',
    postcode: '',
    notes: '',
  });

  if (!isCartOpen) return null;

  const freeShippingMet = subtotal >= SHOP.freeShippingThreshold;
  const shippingRemaining = Math.max(0, SHOP.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / SHOP.freeShippingThreshold) * 100));

  const isCrypto = pay.type === 'crypto';
  const paymentMethod = isCrypto ? `crypto-${pay.token}` : pay.type;
  const cryptoToken = isCrypto ? getToken(pay.token) : null;
  const cryptoNetwork = isCrypto && pay.token ? getNetwork(pay.token, pay.network) : null;
  const discountRate = isCrypto ? SHOP.cryptoDiscount : 0;
  const discountAmount = isCrypto ? (subtotal * discountRate) / 100 : 0;
  const finalTotal = subtotal - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formIsComplete = () =>
    formData.name.trim() && formData.email.trim() && formData.phone.trim() && formData.address.trim();

  const openCryptoPopup = (channel = 'email') => {
    setCryptoChannel(channel);
    setCryptoRef((prev) => prev || generateOrderRef('TH'));
    setError('');
    setCryptoOpen(true);
  };

  // Crypto orders open the wallet / QR popup; the order is only placed from "I have paid".
  const startCheckout = (channel) => {
    if (!formIsComplete()) {
      setError('Please fill in your name, email, phone number, and delivery address.');
      return;
    }
    setError('');
    if (isCrypto) {
      if (!cryptoToken || !cryptoNetwork) {
        setError('Please choose a crypto token and network to pay with.');
        return;
      }
      openCryptoPopup(channel);
      return;
    }
    handleProcessCheckout(channel);
  };

  const handleProcessCheckout = async (channel, opts = {}) => {
    if (!formIsComplete()) {
      setError('Please fill in your name, email, phone number, and delivery address.');
      return;
    }

    setLoading(true);
    setError('');

    const orderRef = opts.ref || generateOrderRef('TH');
    const orderPayload = {
      id: orderRef,
      ref: orderRef,
      items: cartItems,
      subtotal,
      discountAmount,
      total: finalTotal,
      totalFormatted: money(finalTotal),
      paymentMethod,
      ...(opts.crypto && cryptoNetwork ? { cryptoNetwork: cryptoNetwork.label } : {}),
      channel,
      status: 'pending',
    };

    const customerPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state,
      postcode: formData.postcode.trim(),
      notes: [formData.notes.trim(), opts.crypto && cryptoNetwork ? `Crypto payment: ${cryptoToken.symbol} on ${cryptoNetwork.label}` : '']
        .filter(Boolean)
        .join('\n'),
    };

    // If WhatsApp checkout, open window synchronously BEFORE await to avoid browser popup blockers!
    let waWindow = null;
    if (channel === 'whatsapp') {
      const waUrl = waOrderLink(orderPayload, customerPayload);
      waWindow = window.open(waUrl, '_blank');
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'order',
          order: orderPayload,
          customer: customerPayload,
          channel,
customer: customerPayload,
          _hp: honeypot,
customer: customerPayload,
          _t: startedAt,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const finalRef = result.ref || orderRef;
        clearCart();
        setIsCartOpen(false);
        setCheckoutMode(null);
        setCryptoOpen(false);
        router.push(
          opts.crypto
            ? `/order/confirm-payment/?id=${encodeURIComponent(finalRef)}&token=${encodeURIComponent(result.token || '')}`
            : `/thank-you-order/?id=${encodeURIComponent(finalRef)}`
        );
      } else {
        setError(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error', err);
      // Even if background API throws network error, the WhatsApp window was opened
      if (channel === 'whatsapp') {
        clearCart();
        setIsCartOpen(false);
        setCryptoOpen(false);
        router.push(
          opts.crypto
            ? `/order/confirm-payment/?id=${encodeURIComponent(orderRef)}`
            : `/thank-you-order/?id=${encodeURIComponent(orderRef)}`
        );
      } else {
        setError('Network error. Please verify connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-slate-900 border-l border-amber-500/20 text-white flex flex-col shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Your Gear Cart</h2>
              <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-950/60 p-3 sm:px-6 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {freeShippingMet ? (
                  <span className="text-emerald-400 font-bold">Free StarTrack Express Unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-400">{money(shippingRemaining)}</strong> for Free Express Freight
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  freeShippingMet ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  Explore our selection of cinema cameras, high-output lighting, and broadcast audio.
                </p>
                <Link
                  href="/shop/"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition"
                >
                  <span>Browse Pro Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : checkoutMode ? (
              /* Checkout Form View (Both Email and WhatsApp use this same full form!) */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Delivery & Payment Information</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(null)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    &larr; Back to Cart
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Lachlan Murdoch"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Email Address * (Invoice & Tracking)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="pro@production.com.au"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Phone (Mobile for Courier SMS) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0489 989 442"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Street Address (Studio / Production / Home) *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Studio 4, 3 Kirks Lane"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">City / Suburb</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Melbourne"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      >
                        <option value="VIC">VIC</option>
                        <option value="NSW">NSW</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="ACT">ACT</option>
                        <option value="NT">NT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Postcode</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="3000"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      />
                    </div>
                  </div>

                  <Honeypot value={honeypot} onChange={setHoneypot} />
                  <PaymentMethodPicker
                    pay={pay}
                    onChange={setPay}
                    onReady={() => openCryptoPopup(cryptoChannel)}
                    selectClassName="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                  />
                  {isCrypto && cryptoToken && cryptoNetwork ? (
                    <button
                      type="button"
                      onClick={() => openCryptoPopup(cryptoChannel)}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold transition"
                    >
                      Show {cryptoToken.symbol} payment details ({cryptoNetwork.label})
                    </button>
                  ) : null}

                  {isCrypto && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Coins className="w-4 h-4" />
                        10% Crypto Discount Applied!
                      </span>
                      <span className="font-mono font-bold">-{money(discountAmount)}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Production Notes / Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Leave at front reception with signature, shoot starts Friday."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => startCheckout('email')}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    <span>{loading ? 'Processing Order...' : `Place Order — ${money(finalTotal)} AUD`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => startCheckout('whatsapp')}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp (Instant Gear Desk Chat)</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Both options log your order into our dispatch queue and automatically email you a confirmed Australian tax invoice.
                  </p>
                </div>
              </div>
            ) : (
              /* Regular Items List */
              cartItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-900 overflow-hidden relative shrink-0 border border-slate-800">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.category}/${item.productSlug || item.slug}/`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm font-semibold text-white hover:text-amber-400 line-clamp-1 transition"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                      {money(item.price)} AUD
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, -1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.slug)}
                        className="text-slate-500 hover:text-red-400 p-1 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout Trigger */}
          {cartItems.length > 0 && !checkoutMode && (
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal (AUD inc. 10% GST)</span>
                  <span className="text-white font-mono font-semibold">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>StarTrack Express Freight</span>
                  <span className="text-white font-mono">
                    {freeShippingMet ? <span className="text-emerald-400 font-bold">FREE</span> : `$${SHOP.shippingFee}.00 AUD`}
                  </span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    Crypto Payment (10% Discount)
                  </span>
                  <span className="font-mono font-semibold">
                    Pay {money(subtotal * 0.9)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                  <span>Total Payable</span>
                  <span className="text-amber-400 font-mono text-lg">{money(subtotal)} AUD</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('form')}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shadow-amber-500/10 text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutMode('whatsapp')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 text-xs border border-slate-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Australian Stock
                </span>
                <span>·</span>
                <span>StarTrack Express</span>
                <span>·</span>
                <span>Bank Transfer / PayID / Crypto</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <CryptoPayModal
        open={cryptoOpen && !!cryptoToken && !!cryptoNetwork}
        token={cryptoToken}
        network={cryptoNetwork}
        totalLabel={money(finalTotal)}
        amountAud={finalTotal}
        orderRef={cryptoRef}
        loading={loading}
        error={error}
        onClose={() => setCryptoOpen(false)}
        onPaid={() => handleProcessCheckout(cryptoChannel, { ref: cryptoRef, crypto: true })}
      />
    </div>
  );
}
