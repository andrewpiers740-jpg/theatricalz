(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "search_products",
        description: "Search Theatricalz pro cinema and audio gear by keyword or category",
        inputSchema: { type: "object", properties: { query: { type: "string" }, category: { type: "string" }, max_price: { type: "number" } } },
        execute: async ({ query, category, max_price }) => {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (category) params.set('category', category);
          if (max_price) params.set('max_price', max_price);
          const res = await fetch("https://theatricalz.com.au/api/search?" + params);
          return res.json();
        }
      },
      {
        name: "browse_products",
        description: "Browse products by category",
        inputSchema: { type: "object", properties: { category: { type: "string" } } },
        execute: async ({ category }) => {
          const url = category ? "https://theatricalz.com.au/shop/" + category + "/" : "https://theatricalz.com.au/shop/";
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "order_via_whatsapp",
        description: "Initiate a WhatsApp gear order with Theatricalz gear desk",
        inputSchema: { type: "object", properties: { message: { type: "string" } } },
        execute: async ({ message }) => {
          const greeting = "Hi Theatricalz, ";
          const url = "https://wa.me/61489989442?text=" + encodeURIComponent(greeting + (message || ''));
          window.open(url, '_blank');
          return { url };
        }
      },
      {
        name: "contact",
        description: "Contact Theatricalz Melbourne pro gear desk",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "https://theatricalz.com.au/contact/";
          return { url: "https://theatricalz.com.au/contact/" };
        }
      }
    ]
  });
})();
