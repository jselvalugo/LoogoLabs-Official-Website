import React from 'react';
import { BOOKING_URL } from '../lib/booking';
import { SITE } from '../lib/seo';
import '../styles/pages/quiz.css';

export default function Privacy({ onNavigate }) {
  return (
    <div className="lg-page">

      {/* Header */}
      <div className="lg-wrap">
        <div className="lg-head ll-forest ll-bezel--dark">
          <h1 className="lg-title">
            Privacy Policy
          </h1>
          <p className="lg-updated">
            Last updated: October 1, 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="lg-wrap">
      <div className="lg-panel ll-glass">

        <Section title="1. Who We Are">
          <P>David Selva, a sole proprietor doing business as Loogo Labs ("Loogo Labs," "we," "us," or "our") operates the website loogolabs.com and provides marketing automation and business platform services to small and mid-size businesses. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our website or interact with our services.</P>
          <P>If you have questions about this policy, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a>.</P>
        </Section>

        <Section title="2. Information We Collect">
          <P>We collect information you provide directly to us, including:</P>
          <UL items={[
            'Full name and business name',
            'Email address',
            'Type of business or industry',
            'The tools and software you currently use',
            'Business challenges you describe in our contact form',
            'How you heard about us (referral source)',
            'Any notes or messages you send us directly',
          ]} />
          <P>We also collect certain information automatically when you visit our website, including:</P>
          <UL items={[
            'IP address and approximate location (country/region)',
            'Browser type and operating system',
            'Pages visited and time spent on each page',
            'Referring website or link that brought you here',
          ]} />
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use the information we collect to:</P>
          <UL items={[
            'Respond to your inquiry and schedule strategy calls',
            'Provide, manage, and improve our services',
            'Send you relevant information about our platform (only if you have opted in or made an inquiry)',
            'Track and analyze how our website is used so we can improve it',
            'Comply with legal obligations',
          ]} />
          <P>We do not sell your personal information to any third party. We do not use your information for any purpose that is inconsistent with what is described in this policy.</P>
        </Section>

        <Section title="4. How We Share Your Information">
          <P>We share your information only in the following limited circumstances:</P>
          <UL items={[
            'Service providers: We use third-party tools to operate our business, including our CRM and marketing platform, website hosting (Netlify), and calendar booking tools. These providers have access to your information only as necessary to perform their functions and are obligated to protect it.',
            'Legal requirements: We may disclose your information if required by law, court order, or government authority.',
            'Business transfers: If Loogo Labs is acquired or merges with another company, your information may be transferred as part of that transaction. We will notify you if that occurs.',
          ]} />
          <P>We do not share your information with advertisers, data brokers, or unaffiliated third parties for their own marketing purposes.</P>
        </Section>

        <Section title="5. Cookies and Tracking">
          <P>We ask for your consent before using anything beyond what the site needs to run, through the cookie banner shown on your first visit. These are the categories we use:</P>
          <UL items={[
            'Necessary cookies: Required for the website to function — page routing, security, and remembering your cookie choice. Always on, and cannot be disabled.',
            'Analytics cookies: Aggregate, city-level traffic data so we know which pages are read, how long visits last, and how traffic arrives. Visit length is tied to a random per-tab ID that is discarded when the tab closes. If you also submit a quiz or quote request in that visit, we store the same ID with your submission so we can see which pages and traffic sources lead to enquiries; it is not used to track you across visits or other sites. No personal profile is built from it. Only active if you allow it.',
            'Marketing cookies: Power the Meta Pixel, which we use to measure ad performance and show relevant Loogo Labs content on other sites. Only active if you allow it.',
          ]} />
          <P>You can change your choice at any time from the &ldquo;Cookie Preferences&rdquo; link in the site footer, or through your browser settings. Disabling cookies may affect some functionality of the site.</P>
        </Section>

        <Section title="6. Data Retention">
          <P>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy — generally as long as we have an active or potential business relationship with you, or as required by law.</P>
          <P>If you would like us to delete your information, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a> and we will process your request within 30 days.</P>
        </Section>

        <Section title="7. Data Security">
          <P>We take reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, or destruction. Our website is served over HTTPS. Our database is hosted on infrastructure with access controls and encryption at rest.</P>
          <P>No method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we take it seriously and will notify you promptly in the event of a breach that affects your data.</P>
        </Section>

        <Section title="8. Your Rights">
          <P>Depending on where you are located, you may have the right to:</P>
          <UL items={[
            'Access the personal information we hold about you',
            'Request correction of inaccurate information',
            'Request deletion of your information',
            'Opt out of marketing communications at any time by replying "stop" or emailing us',
            'Lodge a complaint with a data protection authority in your jurisdiction',
          ]} />
          <P>To exercise any of these rights, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a>.</P>
        </Section>

        <Section title="9. Children's Privacy">
          <P>Our website and services are not directed to children under 13. We do not knowingly collect personal information from anyone under 13. If we become aware that we have done so, we will delete that information immediately.</P>
        </Section>

        <Section title="10. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. If the changes are material, we will make reasonable efforts to notify you. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.</P>
        </Section>

        <Section title="11. Contact">
          <P>For questions about this policy, email <a href={`mailto:${SITE.email}`} style={linkStyle}>{SITE.email}</a> or write to us:</P>
          <P><strong>David Selva, d/b/a Loogo Labs</strong><br />{SITE.address.streetAddress}<br />{SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />{SITE.address.countryName}</P>
        </Section>

        <div className="lg-foot">
          <button onClick={() => onNavigate('Terms')} className="lg-navbtn">Read our Terms of Service →</button>
        </div>
      </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="lg-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p className="lg-p">{children}</p>;
}

function UL({ items }) {
  return (
    <ul className="lg-ul">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const linkStyle = { color: 'var(--cyan-700)', textDecoration: 'underline' };
