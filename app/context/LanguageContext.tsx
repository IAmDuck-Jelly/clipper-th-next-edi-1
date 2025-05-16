'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

const baseEn: Record<string, string> = {
  'nav.reusable': 'Reusable',
  'nav.about': 'About Clipper',
  'nav.lighters': 'Our Lighters',
  'footer.contact': 'Contact Us',
  'footer.distributor': 'Distributed by Uptown Trading Co.,Ltd.',
  'footer.official': 'Clipper Lighter Official Distributer in Thailand',
  'footer.copyright': '© Clipper Thailand - All rights reserved',
  'footer.privacy': 'Privacy Policy',
  'footer.legal': 'Legal',
  'footer.notice': 'Notice',
  'footer.cookies': 'Cookies Policy',
  'footer.contact.link': 'Contact',
  'form.name': 'Your Name',
  'form.email': 'Your Email',
  'form.message': 'Your Message',
  'form.send': 'Send Message',
  'images.about.1': '/images/en/clipper-lighter-about-1.webp',
  'images.about.2': '/images/en/clipper-lighter-about-2.webp',
  'images.about.3': '/images/en/clipper-lighter-about-3.webp',
  'images.reusable.1': '/images/en/clipper-lighter-reusable-1.webp',
  'images.reusable.2': '/images/en/clipper-lighter-reusable-2.webp',
  'images.reusable.3': '/images/en/clipper-lighter-reusable-3.webp',
  'images.lighter.product': '/images/en/clipper-lighter-product-2.webp',
  'images.lighter.1.1': '/images/en/clipper-lighter-product-1-1.webp',
  'images.lighter.1.2': '/images/en/clipper-lighter-product-1-2.webp',
  'images.lighter.1.3': '/images/en/clipper-lighter-product-1-3.webp',
  'images.lighter.1.4': '/images/en/clipper-lighter-product-1-4.webp',
  'images.lighter.3.1': '/images/en/clipper-lighter-product-3-1.webp',
  'images.lighter.3.2': '/images/en/clipper-lighter-product-3-2.webp',
  'images.lighter.3.3': '/images/en/clipper-lighter-product-3-3.webp',
  'images.lighter.4.1': '/images/en/clipper-lighter-product-4-1.webp',
  'images.lighter.4.2': '/images/en/clipper-lighter-product-4-2.webp',
  'images.home.2': '/images/en/clipper-lighter-home-2.webp',
  'images.home.3': '/images/en/clipper-lighter-home-3.webp',
  'images.slider.1': '/images/en/clipper-lighter-home-slider1-1.webp',
  'images.slider.2': '/images/en/clipper-lighter-home-slider1-2.webp',
  'images.slider.3': '/images/en/clipper-lighter-home-slider1-3.webp',
  'images.slider.4': '/images/en/clipper-lighter-home-slider1-4.webp',
} as const;

const translations: Record<Language, Record<string, string>> = {
  en: baseEn,
  th: {
    'nav.reusable': 'นำกลับมาใช้ใหม่',
    'nav.about': 'เกี่ยวกับ Clipper',
    'nav.lighters': 'ไฟแช็คของเรา',
    'footer.contact': 'ติดต่อเรา',
    'footer.distributor': 'จัดจำหน่ายโดย บริษัท อัพทาวน์ เทรดดิ้ง จำกัด',
    'footer.official': 'ผู้จัดจำหน่ายไฟแช็ค Clipper อย่างเป็นทางการในประเทศไทย',
    'footer.copyright': '© Clipper Thailand - สงวนลิขสิทธิ์',
    'footer.privacy': 'นโยบายความเป็นส่วนตัว',
    'footer.legal': 'กฎหมาย',
    'footer.notice': 'ประกาศ',
    'footer.cookies': 'นโยบายคุกกี้',
    'footer.contact.link': 'ติดต่อ',
    'form.name': 'ชื่อของคุณ',
    'form.email': 'อีเมลของคุณ',
    'form.message': 'ข้อความของคุณ',
    'form.send': 'ส่งข้อความ',
    'images.about.1': '/images/th/clipper-banner-about-1-th.jpg',
    'images.about.2': '/images/th/clipper-banner-about-2-th.jpg',
    'images.about.3': '/images/th/clipper-banner-about-3-th.jpg',
    'images.reusable.1': '/images/th/clipper-banner-reusable-1-th.jpg',
    'images.reusable.2': '/images/th/clipper-banner-reusable-2-th.jpg',
    'images.reusable.3': '/images/th/clipper-banner-reusable-3-th.jpg',
    'images.lighter.product': '/images/th/clipper-lighter-product-2.webp',
    'images.lighter.1.1': '/images/th/clipper-lighter-product-1-1.webp',
    'images.lighter.1.2': '/images/th/clipper-lighter-product-1-2.webp',
    'images.lighter.1.3': '/images/th/clipper-lighter-product-1-3.webp',
    'images.lighter.1.4': '/images/th/clipper-lighter-product-1-4.webp',
    'images.lighter.3.1': '/images/th/clipper-lighter-product-3-1.webp',
    'images.lighter.3.2': '/images/th/clipper-lighter-product-3-2.webp',
    'images.lighter.3.3': '/images/th/clipper-lighter-product-3-3.webp',
    'images.lighter.4.1': '/images/th/clipper-lighter-product-4-1.webp',
    'images.lighter.4.2': '/images/th/clipper-lighter-product-4-2.webp',
    'images.home.2': '/images/th/clipper-banner-home-2-th.jpg',
    'images.home.3': '/images/th/clipper-banner-home-3-th.jpg',
    'images.slider.1': '/images/th/clipper-banner-home-1-1-th.jpg',
    'images.slider.2': '/images/th/clipper-banner-home-1-2-th.jpg',
    'images.slider.3': '/images/th/clipper-banner-home-1-3-th.jpg',
    'images.slider.4': '/images/th/clipper-banner-home-1-4-th.jpg',
  } as const,
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getImagePath: (key: string) => string;
} | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'th')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const getImagePath = (key: string): string => {
    return translations[language][key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, getImagePath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { translations }; 