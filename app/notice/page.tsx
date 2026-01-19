'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Notice() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-8 uppercase text-[#FFD600]">{t('footer.notice' as const)}</h1>
            <div className="prose lg:prose-xl text-gray-800">
                <h3>Important Safety Information</h3>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
                    <p className="font-bold text-red-700">WARNING: KEEP AWAY FROM CHILDREN</p>
                    <p className="text-red-600">
                        Ignite lighter away from face and clothing. Contain flammable gas under pressure.
                        Never expose to heat above 50°C (122°F) or to prolonged sunlight.
                    </p>
                </div>

                <p>
                    <strong>Clipper Lighters</strong> comply with ISO 9994 safety standards. However, lighters act
                    as a fire source and must be used with extreme caution.
                </p>

                <h3>Product Usage</h3>
                <ul>
                    <li>Ensure the flame is completely extinguished after use.</li>
                    <li>Do not puncture or incinerate.</li>
                    <li>Follow all instructions provided on the product packaging.</li>
                </ul>

                <h3>Counterfeit Warning</h3>
                <p>
                    To ensure safety and quality, please purchase Clipper products only from authorized retailers
                    supplied by Uptown Trading Co., Ltd. Counterfeit products may not meet safety standards
                    and pose significant risks.
                </p>
            </div>
        </div>
    );
}
