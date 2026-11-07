/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CountryCode, CurrencyCode, OrderItem, PaymentMethod, PlayerProfile, PromoCode, TopupProduct } from './types';
import { TOPUP_PRODUCTS, PAYMENT_METHODS_IN, PAYMENT_METHODS_BD, PAYMENT_METHODS_PK } from './data/mockData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CountrySelectorStep } from './components/CountrySelectorStep';
import { PlayerIdStep } from './components/PlayerIdStep';
import { DiamondSelector } from './components/DiamondSelector';
import { PaymentMethodStep } from './components/PaymentMethodStep';
import { CheckoutSummary } from './components/CheckoutSummary';
import { CheckoutModal } from './components/CheckoutModal';
import { LuckySpinModal } from './components/LuckySpinModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { UidGuideModal } from './components/UidGuideModal';
import { FaqSection } from './components/FaqSection';
import { SupportChatWidget } from './components/SupportChatWidget';
import { RecentTransactions } from './components/RecentTransactions';
import { LivePurchasePopup } from './components/LivePurchasePopup';
import { AdsterraBanner } from './components/AdsterraBanner';
import { Footer } from './components/Footer';

export default function App() {
  // State
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('IN');
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('INR');
  
  const [playerUid, setPlayerUid] = useState('');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<TopupProduct | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(PAYMENT_METHODS_IN[0]); // Default UPI for India
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country);
    if (country === 'BD') {
      setCurrentCurrency('BDT');
      setSelectedPayment(PAYMENT_METHODS_BD[0]);
      if (selectedProduct && (selectedProduct.soldOutInBD || selectedProduct.bdtPrice === 490)) {
        setSelectedProduct(null);
      }
    } else if (country === 'PK') {
      setCurrentCurrency('PKR');
      setSelectedPayment(PAYMENT_METHODS_PK[0]);
    } else {
      setCurrentCurrency('INR');
      setSelectedPayment(PAYMENT_METHODS_IN[0]);
    }
  };

  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isUidGuideOpen, setIsUidGuideOpen] = useState(false);

  const handleSaveOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleApplyPrize = (prizePromo: PromoCode) => {
    setAppliedPromo(prizePromo);
  };

  const handleExploreOffers = () => {
    const el = document.getElementById('step-2-select-diamonds');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#E0E0E0] flex justify-center selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      {/* Background Ambient Glow for Desktop / Wide Screen View */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
        <div className="absolute top-10 left-1/2 -translate-x-[400px] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/2 translate-x-[200px] w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      {/* Responsive Container — full width on mobile, capped on desktop */}
      <div className="w-full max-w-[480px] lg:max-w-[480px] min-h-screen bg-[#0D0F14] lg:border-x lg:border-white/5 lg:shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col relative z-10">
        {/* 1. Header Navigation */}
        <Header
          currentCurrency={currentCurrency}
          onCurrencyChange={setCurrentCurrency}
          onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
          onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
          onOpenUidGuide={() => setIsUidGuideOpen(true)}
        />

        {/* 2. Hero Event Banner */}
        <HeroBanner onExploreOffers={handleExploreOffers} />

        {/* 3. Main Top-Up Workflow Layout */}
        <main className="flex-1 px-3.5 sm:px-4 py-5 space-y-5 w-full">
          {/* Step 1: Country Selection */}
          <CountrySelectorStep
            selectedCountry={selectedCountry}
            onSelectCountry={handleCountryChange}
          />

          {/* Step 2: Player ID */}
          <PlayerIdStep
            playerUid={playerUid}
            onUidChange={setPlayerUid}
            playerProfile={playerProfile}
            onProfileVerified={setPlayerProfile}
            onOpenUidGuide={() => setIsUidGuideOpen(true)}
            stepNumber={2}
          />

          {/* Step 3: Diamond Pack Selector */}
          <DiamondSelector
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            currency={currentCurrency}
            stepNumber={3}
          />

          {/* Step 4: Payment Gateway Selector */}
          <PaymentMethodStep
            selectedPayment={selectedPayment}
            onSelectPayment={setSelectedPayment}
            country={selectedCountry}
            stepNumber={4}
          />

          {/* Subtotal & Proceed to Payment */}
          <CheckoutSummary
            playerUid={playerUid}
            playerProfile={playerProfile}
            selectedProduct={selectedProduct}
            selectedPayment={selectedPayment}
            currency={currentCurrency}
            country={selectedCountry}
          />

          {/* FAQ Section */}
          <FaqSection />

          {/* Live Recent Transactions */}
          <RecentTransactions />

          {/* Adsterra Banner 728x90 */}
          <AdsterraBanner />
        </main>

        {/* 4. Footer */}
        <Footer />

        {/* 24/7 AI Support Chat Widget */}
        <SupportChatWidget />

        {/* Live Diamond Purchases Popup */}
        <LivePurchasePopup />
      </div>

      {/* Modals */}
      {selectedProduct && selectedPayment && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          playerUid={playerUid}
          playerProfile={playerProfile}
          product={selectedProduct}
          paymentMethod={selectedPayment}
          currency={currentCurrency}
          promo={appliedPromo}
          onSaveOrder={handleSaveOrder}
        />
      )}

      <LuckySpinModal
        isOpen={isLuckySpinOpen}
        onClose={() => setIsLuckySpinOpen(false)}
        onApplyPrizeCode={handleApplyPrize}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      <UidGuideModal
        isOpen={isUidGuideOpen}
        onClose={() => setIsUidGuideOpen(false)}
      />
    </div>
  );
}
