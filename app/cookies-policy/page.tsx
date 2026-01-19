'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CookiesPolicy() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-8 uppercase text-[#FFD600]">{t('footer.cookies' as const)}</h1>
            <div className="prose lg:prose-xl text-gray-800">
                <p>
                    This Cookies Policy explains what cookies are, how we use them, and your choices regarding cookies.
                </p>

                <h3>1. What Are Cookies?</h3>
                <p>
                    Cookies are small text files that are stored on your device (computer or mobile) when you visit a website.
                    They are widely used to make websites work more efficiently and to provide information to the site owners.
                </p>

                <h3>2. How We Use Cookies</h3>
                <p>We use cookies for the following purposes:</p>
                <ul>
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly (e.g., remembering your language preference).</li>
                    <li><strong>Analytical Cookies:</strong> We may use these to understand how visitors interact with our website, helping us improve user experience.</li>
                </ul>

                <h3>3. Managing Cookies</h3>
                <p>
                    Most web browsers automatically accept cookies, but you can usually modify your browser settings
                    to decline cookies if you prefer. Please note that disabling cookies may affect the functionality of this website.
                </p>

                <h3>4. Changes to This Policy</h3>
                <p>
                    We may update our Cookies Policy from time to time. We encourage you to review this page periodically for any changes.
                </p>
            </div>
        </div>
    );
}
