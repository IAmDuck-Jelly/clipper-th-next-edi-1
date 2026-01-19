'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function ShopPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFD600] px-4 py-20 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-400 opacity-20 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-20 blur-[100px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-5xl text-center">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-4 uppercase tracking-tighter italic">
          CHOOSE YOUR EXPERIENCE
        </h1>
        <p className="text-xl md:text-2xl font-bold text-black/80 mb-12 max-w-2xl mx-auto">
          Select how you&apos;d like to browse the Clipper collection today.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Wholesale Card */}
          <Link
            href="/shop/wholesale"
            className="group relative flex flex-col items-center justify-center p-12 bg-white border-[8px] border-black rounded-[40px] shadow-[16px_16px_0_0_#ED1B24] transition-all hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0"
          >
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-8 border-4 border-black group-hover:bg-pink-500 transition-colors">
              <Package size={48} className="text-black group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-4xl font-black text-black mb-4 uppercase">{t('shop.wholesale')}</h2>
            <p className="text-lg font-bold text-black/60">Large orders, amazing value.</p>
            <div className="mt-8 flex items-center gap-2 text-black font-black uppercase tracking-widest text-sm">
              Enter Shop <ArrowLeft size={20} className="rotate-180" />
            </div>
          </Link>

          {/* Retail Card */}
          <Link
            href="/shop/retail"
            className="group relative flex flex-col items-center justify-center p-12 bg-white border-[8px] border-black rounded-[40px] shadow-[16px_16px_0_0_#2E3192] transition-all hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 border-4 border-black group-hover:bg-blue-600 transition-colors">
              <ShoppingBag size={48} className="text-black group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-4xl font-black text-black mb-4 uppercase">{t('shop.retail')}</h2>
            <p className="text-lg font-bold text-black/60">Individual pieces for your collection.</p>
            <div className="mt-8 flex items-center gap-2 text-black font-black uppercase tracking-widest text-sm">
              Enter Shop <ArrowLeft size={20} className="rotate-180" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}