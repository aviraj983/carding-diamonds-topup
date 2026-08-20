export type CurrencyCode = 'INR' | 'USD' | 'BDT' | 'IDR' | 'BRL' | 'PKR' | 'EUR' | 'MYR' | 'PHP';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // multiplier against USD
  flag: string;
}

export type RegionCode = 'IND' | 'ID' | 'BR' | 'SG' | 'VN' | 'TH' | 'ME' | 'NA' | 'EU';

export interface ServerRegion {
  code: RegionCode;
  name: string;
  flag: string;
  defaultCurrency: CurrencyCode;
}

export type ProductCategory = 'diamonds' | 'memberships' | 'level_up' | 'evo_tokens' | 'special_offers';

export interface TopupProduct {
  id: string;
  category: ProductCategory;
  title: string;
  diamonds: number;
  bonusDiamonds: number;
  basePriceUSD: number;
  inrPrice?: number;
  tag?: string;
  tagColor?: 'amber' | 'cyan' | 'red' | 'emerald' | 'purple';
  description?: string;
  benefits?: string[];
  iconType: 'diamond' | 'crate' | 'weekly_card' | 'monthly_card' | 'evo_gun' | 'level_pass' | 'special';
  badgeIcon?: string;
  popular?: boolean;
}

export interface PlayerProfile {
  uid: string;
  ign: string;
  level: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Heroic' | 'Master' | 'Grandmaster';
  avatarUrl: string;
  region: string;
  guild?: string;
  likes: number;
  verified: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'upi' | 'wallet' | 'card' | 'netbanking' | 'crypto' | 'voucher';
  icon: string;
  discountPercent?: number;
  instantBonusText?: string;
  feeText?: string;
  popular?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscountUSD: number;
  bonusDiamonds: number;
  description: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  uid: string;
  ign: string;
  product: TopupProduct;
  quantity: number;
  totalDiamonds: number;
  currency: CurrencyCode;
  amountPaid: number;
  paymentMethod: string;
  status: 'processing' | 'completed' | 'failed';
  timestamp: string;
  region: string;
}

export interface SpinPrize {
  id: number;
  name: string;
  type: 'diamonds' | 'discount' | 'bonus' | 'tokens';
  value: number;
  color: string;
  textColor: string;
  probability: number;
  code?: string;
}