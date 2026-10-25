'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { CONTACT, SITE } from '@/config/site';

export default function ProductActionBox({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const variants = product.variants || [];
  const [variantIdx, setVariantIdx] = useState(0);
  const variant = variants[variantIdx];

  // A chosen size becomes its own cart line (own key, price and SKU) that still links back to this product.
  const cartProduct = variant
    ? {
        ...product,
        slug: `${product.slug}--${variant.stacks}`,
        productSlug: product.slug,
        name: `${product.name} — ${variant.label}`,
        price: variant.price,
        sku: `${product.sku || product.slug}-${variant.stacks}`,
      }
    : product;

  const handleAddToCart = () => {
    addToCart(cartProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceOnRequest = product.price == null;
  const money = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleWhatsAppOrder = () => {
    const total = ((cartProduct.price || 0) * quantity).toFixed(2);
    const greeting = `Hi ${SITE.name},`;
    const message = priceOnRequest ? [
      greeting,
      ``,
      `Could you please send me a quote and lead time for:`,
      `• *${cartProduct.name}* (Qty: ${quantity})`,
      `*SKU:* ${cartProduct.sku || product.slug}`,
    ].join('\n') : [
      greeting,
      ``,
      `I would like to order the following equipment:`,
      `• *${cartProduct.name}* (Qty: ${quantity})`,
      `*Total:* $${total} AUD (inc. GST)`,
      `*SKU:* ${cartProduct.sku || product.slug}`,
      ``,
      `Please confirm stock allocation and send payment instructions.`,
    ].join('\n');

    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-2 space-y-3">
      {/* Stack-size options — more stacks, lower price per stack */}
      {variants.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Choose size <span className="normal-case font-normal text-slate-500">({product.variantNote})</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {variants.map((v, i) => (
              <label
                key={v.stacks}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition ${
                  i === variantIdx ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="variant"
                    className="accent-amber-500"
                    checked={i === variantIdx}
                    onChange={() => setVariantIdx(i)}
                  />
                  <span className="text-sm font-semibold text-white">{v.label}</span>
                  {v.saving > 0 && (
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">Save {v.saving}%</span>
                  )}
                </span>
                <span className="text-right">
                  <span className="block text-sm font-mono font-bold text-white">${money(v.price)}</span>
                  <span className="block text-[11px] text-slate-400">${money(v.perUnit)} / {product.variantUnit}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

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
              ? 'bg-emerald-700 text-white'
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
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition duration-150 flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{priceOnRequest ? 'Ask for a Quote on WhatsApp' : 'Order via WhatsApp Direct Desk'}</span>
      </button>
    </div>
  );
}
