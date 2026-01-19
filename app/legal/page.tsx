'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Legal() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-8 uppercase text-[#FFD600]">{t('footer.legal' as const)}</h1>
            <div className="prose lg:prose-xl text-gray-800">
                <h3>1. Intellectual Property</h3>
                <p>
                    The content on this website, including but not limited to text, graphics, logos, images, and software, is the property of
                    <strong>Uptown Trading Co., Ltd.</strong> or its licensors, including <strong>Flamagas S.A.</strong> (owner of the Clipper brand).
                    It is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create
                    derivative works from this content without express written permission.
                </p>

                <h3>2. Terms of Use</h3>
                <p>
                    By ensuring access to this website, you agree to comply with all applicable laws and regulations. You agree not to use the website
                    for any unlawful purpose or in a way that could damage, disable, or impair the site.
                </p>

                <h3>3. Limitation of Liability</h3>
                <p>
                    Uptown Trading Co., Ltd. allows access to this website on an &quot;as is&quot; basis. We make no warranties, expressed or implied,
                    regarding the accuracy, reliability, or availability of the website. In no event shall we be liable for any damages arising
                    out of the use or inability to use the materials on this website.
                </p>

                <h3>4. Governing Law</h3>
                <p>
                    These legal terms are governed by the laws of the Kingdom of Thailand. Any disputes relating to these terms shall be subject
                    to the exclusive jurisdiction of the courts of Thailand.
                </p>
            </div>
        </div>
    );
}
