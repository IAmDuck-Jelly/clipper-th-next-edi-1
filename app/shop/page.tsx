'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFD600] py-8">
      <div className="relative flex items-center justify-center w-full max-w-6xl h-[600px] mb-8">
        {/* Vibrant pop-art style background */}
        <div className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-pink-400 via-yellow-300 to-blue-400 opacity-60 blur-lg" />
        {/* Carousel with previews */}
        <div className="relative z-10 flex items-center justify-center w-full h-full transition-transform duration-300">
          {/* Previous 2 */}
          <div className="flex flex-col items-center justify-center">
            <div className="carousel-preview-image left-2">
              <Image
                src={images[prev2]}
                alt="Preview 2"
                width={180}
                height={120}
                style={{ objectFit: 'contain', width: 180, height: 120 }}
                className="opacity-30 scale-75 blur-[2px]"
                draggable={false}
              />
            </div>
            <div className="carousel-preview-image left-1 mt-4">
              <Image
                src={images[prev1]}
                alt="Preview 1"
                width={220}
                height={160}
                style={{ objectFit: 'contain', width: 220, height: 160 }}
                className="opacity-60 scale-90 blur-[1px]"
                draggable={false}
              />
            </div>
          </div>
          {/* Main image */}
          <div
            className={`mx-8 border-[10px] border-black rounded-3xl shadow-[12px_12px_0_0_#fff,24px_24px_0_0_#000] bg-white overflow-hidden transition-transform duration-300 hover:scale-105 relative flex items-center justify-center"
            style={{ width: 1300, height: 600 }} ${
              animating ? (direction === 'right' ? 'animate-slide-left' : 'animate-slide-right') : ''
            }`}
          >
            <Image
              src={images[current]}
              alt={`Clipper Product ${current + 1}`}
              width={1300}
              height={600}
              style={{ objectFit: 'contain', width: 1300, height: 600 }}
              priority
              draggable={false}
            />
          </div>
          {/* Next 2 */}
          <div className="flex flex-col items-center justify-center">
            <div className="carousel-preview-image right-1 mb-4">
              <Image
                src={images[next1]}
                alt="Preview 1"
                width={220}
                height={160}
                style={{ objectFit: 'contain', width: 220, height: 160 }}
                className="opacity-60 scale-90 blur-[1px]"
                draggable={false}
              />
            </div>
            <div className="carousel-preview-image right-2">
              <Image
                src={images[next2]}
                alt="Preview 2"
                width={180}
                height={120}
                style={{ objectFit: 'contain', width: 180, height: 120 }}
                className="opacity-30 scale-75 blur-[2px]"
                draggable={false}
              />
            </div>
          </div>
        </div>
        {/* Left Arrow */}
        <button
          aria-label="Previous"
          onClick={prevImage}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border-4 border-black text-5xl w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-200 hover:scale-110 transition-all z-20"
        >
          &#8592;
        </button>
        {/* Right Arrow */}
        <button
          aria-label="Next"
          onClick={nextImage}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-4 border-black text-5xl w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-200 hover:scale-110 transition-all z-20"
        >
          &#8594;
        </button>
        {/* Image counter */}
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-lg font-bold shadow z-20">
          {current + 1} / {images.length}
        </span>
      </div>
      <div className="flex gap-8 mt-16">
        <a
          href="https://uptowntrading.co.th/product-category/brand/clipper/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-8 py-4 rounded-lg text-xl font-extrabold shadow hover:bg-pink-100 hover:scale-105 transition-all border-4 border-black"
        >
          Wholesale Customers
        </a>
        <a
          href="https://highsostore.com/product-category/brands/1-0-clipper/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-8 py-4 rounded-lg text-xl font-extrabold shadow hover:bg-blue-100 hover:scale-105 transition-all border-4 border-black"
        >
          Retail Customers
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