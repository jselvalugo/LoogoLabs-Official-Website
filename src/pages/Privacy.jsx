import React from 'react';

export default function Privacy({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-100)' }}>

      {/* Header */}
      <div className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(48px,7vw,88px) 32px clamp(40px,5vw,64px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 20 }}>
            Loogo Labs · Legal
          </div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--paper-100)' }}>
            Privacy Policy
          </h1>
          <p style={{ margin: '20px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.06em' }}>
            Last updated: September 1, 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 32px clamp(64px,8vw,96px)' }}>

        <Section title="1. Who We Are">
          <P>Loogo Labs LLC ("Loogo Labs," "we," "us," or "our") operates the website loogolabs.com and provides marketing automation and business platform services to small and mid-size businesses. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our website or interact with our services.</P>
          <P>If you have questions about this policy, contact us at <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a>.</P>
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
          <P>Our website uses cookies and similar technologies to remember your preferences and understand how visitors use the site. These include:</P>
          <UL items={[
            'Essential cookies: Required for the website to function. These cannot be disabled.',
            'Analytics cookies: Help us understand which pages are visited and how traffic arrives. We use this data in aggregate form only.',
          ]} />
          <P>You can control cookies through your browser settings. Disabling cookies may affect some functionality of the site.</P>
        </Section>

        <Section title="6. Data Retention">
          <P>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy — generally as long as we have an active or potential business relationship with you, or as required by law.</P>
          <P>If you would like us to delete your information, contact us at <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a> and we will process your request within 30 days.</P>
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
          <P>To exercise any of these rights, contact us at <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a>.</P>
        </Section>

        <Section title="9. Children's Privacy">
          <P>Our website and services are not directed to children under 13. We do not knowingly collect personal information from anyone under 13. If we become aware that we have done so, we will delete that information immediately.</P>
        </Section>

        <Section title="10. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. If the changes are material, we will make reasonable efforts to notify you. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.</P>
        </Section>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--border-hair)' }}>
          <button onClick={() => onNavigate('Terms')} style={navBtn}>Read our Terms of Service →</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--ink-900)', margin: '0 0 14px' }}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ margin: '0 0 14px', fontSize: 16, lineHeight: 1.75, color: 'var(--ink-700)' }}>{children}</p>;
}

function UL({ items }) {
  return (
    <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink-700)', marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

const linkStyle = { color: 'var(--cyan-700)', textDecoration: 'underline' };
const navBtn = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: 0 };
