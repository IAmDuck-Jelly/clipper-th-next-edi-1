'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { submitContactForm } from '../actions';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);
      const result = await submitContactForm(formData);
      console.log('Server action result:', result);

      if (result && result.success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setError(result?.error || 'Failed to send message (No response from server)');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('An unexpected error occurred: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="logo-container">
              <Image
                src="/images/clipper-logo.png"
                alt="Clipper"
                width={300}
                height={100}
                priority
                className="footer-logo-image"
              />
            </div>
            <div className="distributor-text">
              <p>{t('footer.distributor' as const)}</p>
              <p>{t('footer.official' as const)}</p>
            </div>
          </div>

          <div className="footer-right">
            <h3>{t('footer.contact' as const)}</h3>
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
            )}
            {loading && (
              <div style={{ color: 'gray', marginBottom: '1rem' }}>Sending...</div>
            )}
            {submitted ? (
              <div className="confirmation-message" style={{ marginBottom: '1rem', color: 'green', fontWeight: 'bold' }}>
                ขอบคุณสำหรับการติดต่อเรา! / Thank you for contacting us!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <input
                  type="text"
                  name="name"
                  placeholder={t('form.name' as const)}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('form.phone' as const)}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('form.email' as const)}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder={t('form.message' as const)}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="submit-button">
                  {t('form.send' as const)}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright' as const)}</p>
          <div className="footer-links">
            <Link href="/privacy-policy">{t('footer.privacy' as const)}</Link>
            <Link href="/legal">{t('footer.legal' as const)}</Link>
            <Link href="/notice">{t('footer.notice' as const)}</Link>
            <Link href="/cookies-policy">{t('footer.cookies' as const)}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
