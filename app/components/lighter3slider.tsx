'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './HowToSlider.css';
import { useLanguage } from '../context/LanguageContext';

const Lighter3Slider = () => {
  const { getImagePath } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: getImagePath('images.lighter.4.1' as const),
    },
    {
      image: getImagePath('images.lighter.4.2' as const),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="image-wrapper">
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              width={1920}
              height={1080}
              priority={index === 0}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      ))}
      <div className="slider-controls">
        <button onClick={prevSlide} className="slider-button prev">
          ←
        </button>
        <button onClick={nextSlide} className="slider-button next">
          →
        </button>
      </div>
    </div>
  );
};

export default Lighter3Slider; 