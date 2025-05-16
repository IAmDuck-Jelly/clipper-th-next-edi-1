'use client';
import Lighter1Slider from '../components/lighter1slider';
import Lighter2Slider from '../components/lighter2slider';
import Lighter3Slider from '../components/lighter3slider';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function LighterPage() {
  const { getImagePath } = useLanguage();
  
  return (
    <main className="pt-[72px]">
      <Lighter1Slider />
      <div className="w-full">
        <Image
          src={getImagePath('images.lighter.product' as const)}
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
      <Lighter2Slider />
      <Lighter3Slider />
    </main>
  );
}
