// config/wallets.js - the ONE place crypto wallet addresses are set.
//
// Each token lists one or more networks. At checkout:
//   - a token with several networks (for example USDT) shows a network dropdown, and the
//     payment popup opens once the customer picks a network;
//   - a token with a single network opens the popup as soon as the token is chosen.
//
// For each network:
//   id      : short key used in the order notes
//   label   : the network name shown to the customer
//   address : the public wallet address customers send to (leave '' to switch that option off)
//   memo    : optional memo / destination tag, if the network needs one
//
// QR codes are generated automatically from the address, so the QR always matches it.
// Live pricing uses `coingeckoId` and `decimals` (see /api/crypto-rate).

export const WALLETS = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    coingeckoId: 'bitcoin',
    decimals: 8,
    networks: [{ id: 'bitcoin', label: 'Bitcoin', address: 'bc1qmk9d29mm2ekf59gkssgd9092p3wjdc3x2de7ju', memo: '' }],
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    coingeckoId: 'tether',
    decimals: 2,
    networks: [
      { id: 'erc20', label: 'Ethereum (ERC20)', address: '0x97F62Cc4874Ea8D0D3cD742E6DED871b7e577812', memo: '' },
      { id: 'trc20', label: 'Tron (TRC20)', address: 'TEEydoxPa4Gntq7jigSB2eYWLEqoQB74qw', memo: '' },
    ],
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    coingeckoId: 'usd-coin',
    decimals: 2,
    networks: [{ id: 'solana', label: 'Solana', address: 'BFHZNjNYgya3g69Ud5H6Rued21YdhE6AKsDy9Red6dFo', memo: '' }],
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    decimals: 6,
    networks: [{ id: 'ethereum', label: 'Ethereum', address: '0x97F62Cc4874Ea8D0D3cD742E6DED871b7e577812', memo: '' }],
  },
  BNB: {
    name: 'BNB',
    symbol: 'BNB',
    coingeckoId: 'binancecoin',
    decimals: 5,
    networks: [{ id: 'bnb', label: 'BNB Smart Chain (BEP20)', address: '0x97F62Cc4874Ea8D0D3cD742E6DED871b7e577812', memo: '' }],
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    coingeckoId: 'solana',
    decimals: 4,
    networks: [{ id: 'solana', label: 'Solana', address: 'BFHZNjNYgya3g69Ud5H6Rued21YdhE6AKsDy9Red6dFo', memo: '' }],
  },
};

export const CRYPTO_TOKENS = Object.keys(WALLETS);

export function getToken(symbol) {
  return WALLETS[symbol] || null;
}

// Networks that are switched on (have an address).
export function getNetworks(symbol) {
  const t = WALLETS[symbol];
  return t ? t.networks.filter((n) => n.address) : [];
}

export function getNetwork(symbol, networkId) {
  return getNetworks(symbol).find((n) => n.id === networkId) || null;
}
