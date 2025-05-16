'use client';

import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { getImagePath } = useLanguage();
  
  return (
    <main className="pt-[72px]">
      <div className="w-full">
        <Image
          src={getImagePath('images.about.1' as const)}
          alt="Clipper Lighter Features"
          width={1920}
          height={1080}
          priority
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
      <div className="w-full">
        <Image
          src={getImagePath('images.about.2' as const)}
          alt="Clipper Lighter Features"
          width={1920}
          height={1080}
          priority
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
      <div className="w-full">
        <Image
          src={getImagePath('images.about.3' as const)}
          alt="Clipper Lighter Features"
          width={1920}
          height={1080}
          priority
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    </main>
  );
}
