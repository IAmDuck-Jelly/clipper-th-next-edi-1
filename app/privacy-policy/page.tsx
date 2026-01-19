'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-8 uppercase text-[#FFD600]">{t('footer.privacy' as const)}</h1>
            <div className="prose lg:prose-xl text-gray-800">
                <p><strong>Effective Date:</strong> January 1, 2025</p>

                <p>
                    <strong>Uptown Trading Co., Ltd.</strong> ("we", "our", or "us"), as the official distributor of Clipper products in Thailand,
                    is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information
                    when you visit our website.
                </p>

                <h3>1. Information We Collect</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                    <li>Fill out a contact form (Name, Email Address).</li>
                    <li>Communicate with us via email.</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Respond to your inquiries and provide customer support.</li>
                    <li>Improve our website and services.</li>
                    <li>Comply with legal obligations.</li>
                </ul>

                <h3>3. Data Protection</h3>
                <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration,
                    disclosure, or destruction. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                </p>

                <h3>4. Your Rights</h3>
                <p>
                    Under applicable laws, you may have the right to access, correct, or request deletion of your personal data.
                    To exercise these rights, please contact us through the methods provided on our website.
                </p>

                <h3>5. Contact Us</h3>
                <p>
                    If you have questions about this Privacy Policy, please contact us at:<br />
                    <strong>Uptown Trading Co., Ltd.</strong><br />
                    Bangkok, Thailand
                </p>
            </div>
        </div>
    );
}
