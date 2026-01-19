'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';

const images = [
  '/images/shop/Artboard 2.png',
  '/images/shop/Artboard 2 copy.png',
  '/images/shop/Artboard 2 copy 2.png',
  '/images/shop/Artboard 2 copy 3.png',
  '/images/shop/Artboard 2 copy 4.png',
  '/images/shop/Artboard 2 copy 5.png',
  '/images/shop/Artboard 2 copy 6.png',
  '/images/shop/Artboard 2 copy 7.png',
  '/images/shop/Artboard 2 copy 8.png',
  '/images/shop/Artboard 2 copy 9.png',
  '/images/shop/Artboard 2 copy 10.png',
  '/images/shop/Artboard 2 copy 11.png',
  '/images/shop/Artboard 2 copy 12.png',
  '/images/shop/Artboard 2 copy 13.png',
];

function getIndex(idx: number, length: number): number {
  return ((idx % length) + length) % length;
}

export default function ShopPage() {
  const { t, language } = useLanguage();
  const [view, setView] = useState<'selection' | 'catalogue'>('selection');
  const [customerType, setCustomerType] = useState<'wholesale' | 'retail' | null>(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const handleSelect = (type: 'wholesale' | 'retail') => {
    setCustomerType(type);
    setView('catalogue');
  };

  const prevImage = () => {
    setDirection('left');
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setAnimating(false);
    }, 300);
  };
  const nextImage = () => {
    setDirection('right');
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setAnimating(false);
    }, 300);
  };

  // Indices for previews
  const prev2 = getIndex(current - 2, images.length);
  const prev1 = getIndex(current - 1, images.length);
  const next1 = getIndex(current + 1, images.length);
  const next2 = getIndex(current + 2, images.length);

  if (view === 'selection') {
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
            <button
              onClick={() => handleSelect('wholesale')}
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
            </button>

            {/* Retail Card */}
            <button
              onClick={() => handleSelect('retail')}
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
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FFD600] py-20 px-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <button
        onClick={() => setView('selection')}
        className="fixed top-24 left-8 z-30 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black uppercase text-sm shadow-xl hover:scale-110 active:scale-95 transition-all"
      >
        <ArrowLeft size={20} />
        {language === 'th' ? 'ย้อนกลับ' : 'Back'}
      </button>

      <div className="relative z-10 w-full max-w-7xl text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter">
          {customerType === 'wholesale' ? t('shop.wholesale') : t('shop.retail')} COLLECTION
        </h2>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-6xl h-[600px] mb-8">
        {/* Vibrant pop-art style background */}
        <div className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-pink-400 via-yellow-300 to-blue-400 opacity-60 blur-lg" />
        {/* Carousel with previews */}
        <div className="relative z-10 flex items-center justify-center w-full h-full transition-transform duration-300">
          {/* Previous 2 */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-4">
            <div className="carousel-preview-image opacity-30 scale-75 blur-[2px]">
              <Image
                src={images[prev2]}
                alt={`Clipper Product Preview ${prev2 + 1}`}
                width={180}
                height={120}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
            <div className="carousel-preview-image opacity-60 scale-90 blur-[1px]">
              <Image
                src={images[prev1]}
                alt={`Clipper Product Preview ${prev1 + 1}`}
                width={220}
                height={160}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
          </div>
          {/* Main image */}
          <div
            className={`mx-8 border-[10px] border-black rounded-[40px] shadow-[12px_12px_0_0_#fff,24px_24px_0_0_#000] bg-white overflow-hidden transition-all duration-300 hover:scale-105 relative flex items-center justify-center"
            style={{ width: 1300, maxWidth: '90vw', height: 600 }} ${animating ? (direction === 'right' ? 'animate-slide-left' : 'animate-slide-right') : ''
              }`}
          >
            <Image
              src={images[current]}
              alt={`Clipper Product ${current + 1}`}
              width={1300}
              height={600}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              priority
              draggable={false}
            />
          </div>
          {/* Next 2 */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-4">
            <div className="carousel-preview-image opacity-60 scale-90 blur-[1px]">
              <Image
                src={images[next1]}
                alt={`Clipper Product Preview ${next1 + 1}`}
                width={220}
                height={160}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
            <div className="carousel-preview-image opacity-30 scale-75 blur-[2px]">
              <Image
                src={images[next2]}
                alt={`Clipper Product Preview ${next2 + 1}`}
                width={180}
                height={120}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 md:-inset-x-12 z-20 flex justify-between pointer-events-none">
          <button
            aria-label="Previous"
            onClick={prevImage}
            className="pointer-events-auto bg-white border-4 border-black text-4xl w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-100 hover:scale-110 active:scale-95 transition-all"
          >
            &#8592;
          </button>
          <button
            aria-label="Next"
            onClick={nextImage}
            className="pointer-events-auto bg-white border-4 border-black text-4xl w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-100 hover:scale-110 active:scale-95 transition-all"
          >
            &#8594;
          </button>
        </div>

        {/* Image counter */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-2 rounded-full text-xl font-black italic shadow-2xl z-20">
          {current + 1} / {images.length}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-16">
        <a
          href={customerType === 'wholesale' ? "https://uptowntrading.co.th/product-category/brand/clipper/" : "https://highsostore.com/product-category/brands/1-0-clipper/"}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white text-black px-12 py-6 rounded-2xl text-2xl font-black shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all border-4 border-black overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ShoppingBag size={32} />
          <span className="relative z-10">{language === 'th' ? 'สั่งซื้อเลย' : 'SHOP NOW'}</span>
        </a>
      </div>
      {/* Custom animation keyframes for sliding */}
      <style jsx global>{`
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-80px); opacity: 0.7; }
        }
        @keyframes slide-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(80px); opacity: 0.7; }
        }
        .animate-slide-left {
          animation: slide-left 0.3s;
        }
        .animate-slide-right {
          animation: slide-right 0.3s;
        }
      `}</style>
    </div>
  );
} 