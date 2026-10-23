'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Coins,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { money, generateOrderRef } from '@/lib/order';
import { SHOP, SITE, CONTACT } from '@/config/site';
import { waOrderLink } from '@/lib/whatsapp';
import CryptoPayModal from '@/components/CryptoPayModal';
import PaymentMethodPicker from '@/components/PaymentMethodPicker';
import { getToken, getNetwork } from '@/config/wallets';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [pay, setPay] = useState({ type: 'bank-transfer', token: '', network: '' });
  const [cryptoChannel, setCryptoChannel] = useState('email');
  const [cryptoRef, setCryptoRef] = useState('');

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

  const freeShippingMet = subtotal >= SHOP.freeShippingThreshold;
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

  // Crypto orders open the wallet / QR popup first; the order is only placed from "I have paid".
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

  const openCryptoPopup = (channel = 'email') => {
    setCryptoChannel(channel);
    setCryptoRef((prev) => prev || generateOrderRef('TH'));
    setError('');
    setCryptoOpen(true);
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

    if (channel === 'whatsapp') {
      const waUrl = waOrderLink(orderPayload, customerPayload);
      window.open(waUrl, '_blank');
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
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        clearCart();
        setCryptoOpen(false);
        router.push(
          opts.crypto
            ? `/order/confirm-payment/?id=${encodeURIComponent(orderRef)}`
            : `/thank-you-order/?id=${encodeURIComponent(orderRef)}`
        );
      } else {
        setError(result.error || 'Failed to place order.');
      }
    } catch (err) {
      if (channel === 'whatsapp') {
        clearCart();
        setCryptoOpen(false);
        router.push(
          opts.crypto
            ? `/order/confirm-payment/?id=${encodeURIComponent(orderRef)}`
            : `/thank-you-order/?id=${encodeURIComponent(orderRef)}`
        );
      } else {
        setError('Network failure. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Cart & Checkout</span>
      </nav>

      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Your Equipment Cart & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review gear quantities, calculate your 10% cryptocurrency discount, and submit your delivery details.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-lg font-bold text-white">Your cart is empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Ready to gear up for your next production? Browse pro cameras, audio, and studio lighting.
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition"
          >
            <span>Browse Pro Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 divide-y divide-slate-800">
              {cartItems.map((item) => (
                <div key={item.slug} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white p-2 relative overflow-hidden shrink-0 border border-slate-800">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.category}/${item.productSlug || item.slug}/`}
                      className="font-bold text-white hover:text-amber-400 text-sm line-clamp-1 transition"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                      {money(item.price)} AUD
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, -1)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 font-mono text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, 1)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.slug)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout & Delivery Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-black/30">
              <h3 className="text-base font-bold text-white uppercase tracking-tight pb-2 border-b border-slate-800">
                Delivery & Payment Details
              </h3>

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Lachlan Murdoch"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email * (Invoicing)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@production.com.au"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone * (Courier SMS)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0489 989 442"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Studio / Production Address"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Melbourne"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <PaymentMethodPicker
                  pay={pay}
                  onChange={setPay}
                  onReady={() => openCryptoPopup(cryptoChannel)}
                />
                {isCrypto && cryptoToken && cryptoNetwork ? (
                  <button
                    type="button"
                    onClick={() => openCryptoPopup(cryptoChannel)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold transition"
                  >
                    Show {cryptoToken.symbol} payment details ({cryptoNetwork.label})
                  </button>
                ) : null}
              </div>

              {/* Totals Summary */}
              <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal (AUD inc. GST)</span>
                  <span className="text-white font-mono">{money(subtotal)}</span>
                </div>
                {isCrypto && (
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>10% Crypto Discount</span>
                    <span className="font-mono">-{money(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>StarTrack Express Freight</span>
                  <span className="text-emerald-400 font-bold">
                    {freeShippingMet ? 'FREE' : `$${SHOP.shippingFee}.00 AUD`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                  <span>Total Payable:</span>
                  <span className="text-amber-400 font-mono text-xl">{money(finalTotal)} AUD</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => startCheckout('email')}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <span>{loading ? 'Processing Order...' : `Place Order — ${money(finalTotal)} AUD`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => startCheckout('whatsapp')}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp (Instant Gear Desk Notification)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
