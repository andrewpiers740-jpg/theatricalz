'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { SITE, SHOP } from '@/config/site';

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  itemCount: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem(SITE.cartKey || 'theatricalz-cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(SITE.wishlistKey || 'theatricalz-wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (err) {
      console.warn('LocalStorage access error', err);
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SITE.cartKey || 'theatricalz-cart', JSON.stringify(items));
      } catch (e) {}
    }
  };

  const addToCart = (product, quantity = 1) => {
    if (product.price == null) return; // price-on-request items are quoted, not carted
    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [
          ...prev,
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.images?.[0] || '',
            sku: product.sku || '',
            quantity,
          },
        ];
      }
      saveCart(updated);
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (slug) => {
    const updated = cartItems.filter((item) => item.slug !== slug);
    saveCart(updated);
  };

  const updateQuantity = (slug, delta) => {
    const updated = cartItems
      .map((item) => {
        if (item.slug === slug) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleWishlist = (slug) => {
    setWishlist((prev) => {
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SITE.wishlistKey || 'theatricalz-wishlist', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  const isWishlisted = (slug) => wishlist.includes(slug);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: mounted ? cartItems : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: mounted ? subtotal : 0,
        itemCount: mounted ? itemCount : 0,
        isCartOpen,
        setIsCartOpen,
        wishlist: mounted ? wishlist : [],
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
