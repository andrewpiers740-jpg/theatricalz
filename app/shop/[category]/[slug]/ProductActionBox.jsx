'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { CONTACT, SITE } from '@/config/site';

export default function ProductActionBox({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceOnRequest = product.price == null;

  const handleWhatsAppOrder = () => {
    const total = ((product.price || 0) * quantity).toFixed(2);
    const greeting = `Hi ${SITE.name},`;
    const message = priceOnRequest ? [
      greeting,
      ``,
      `Could you please send me a quote and lead time for:`,
      `• *${product.name}* (Qty: ${quantity})`,
      `*SKU:* ${product.sku || product.slug}`,
    ].join('\n') : [
      greeting,
      ``,
      `I would like to order the following equipment:`,
      `• *${product.name}* (Qty: ${quantity})`,
      `*Total:* $${total} AUD (inc. GST)`,
      `*SKU:* ${product.sku || product.slug}`,
      ``,
      `Please confirm stock allocation and send payment instructions.`,
    ].join('\n');

    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-2 space-y-3">
      {/* Quantity & Add to Cart Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 p-1 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono font-bold text-white text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {priceOnRequest ? (
          <a
            href={`/contact/?product=${encodeURIComponent(product.name)}`}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition duration-150 flex items-center justify-center gap-2 shadow-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10"
          >
            <span>Request a Quote</span>
          </a>
        ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition duration-150 flex items-center justify-center gap-2 shadow-lg ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        )}
      </div>

      {/* WhatsApp Direct Order Button */}
      <button
        type="button"
        onClick={handleWhatsAppOrder}
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{priceOnRequest ? 'Ask for a Quote on WhatsApp' : 'Order via WhatsApp Direct Desk'}</span>
      </button>
    </div>
  );
}
