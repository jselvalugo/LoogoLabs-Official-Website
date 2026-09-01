import React from 'react';

export default function Terms({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-100)' }}>

      {/* Header */}
      <div className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(48px,7vw,88px) 32px clamp(40px,5vw,64px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 20 }}>
            Loogo Labs · Legal
          </div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--paper-100)' }}>
            Terms of Service
          </h1>
          <p style={{ margin: '20px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.06em' }}>
            Last updated: September 1, 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 32px clamp(64px,8vw,96px)' }}>

        <Section title="1. Acceptance of Terms">
          <P>By accessing or using the website loogolabs.com or any services provided by Loogo Labs LLC ("Loogo Labs," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our website or services.</P>
          <P>These terms apply to all visitors, leads, clients, and anyone who interacts with our website or engages with our services.</P>
        </Section>

        <Section title="2. Services">
          <P>Loogo Labs provides fully managed marketing automation and business platform services to small and mid-size businesses. This includes platform setup, ongoing management, automation builds, and related consulting services as described on our website and in any separate service agreement signed between Loogo Labs and the client.</P>
          <P>Details of the specific services, pricing, and deliverables for paying clients are governed by a separate written agreement. These Terms of Service govern general use of our website and any interaction prior to a signed service agreement.</P>
        </Section>

        <Section title="3. Website Use">
          <P>You may use our website for lawful purposes only. You agree not to:</P>
          <UL items={[
            'Use the site in any way that violates applicable laws or regulations',
            'Attempt to gain unauthorized access to any part of the website or its underlying infrastructure',
            'Transmit any unsolicited commercial communications through our contact forms',
            'Introduce malware, viruses, or any other harmful code',
            'Scrape, crawl, or copy content from the site without written permission',
            'Impersonate Loogo Labs or any of its team members',
          ]} />
        </Section>

        <Section title="4. Intellectual Property">
          <P>All original content published on loogolabs.com — including blog posts, copy, design, and branding — is created by Loogo Labs. While we do not restrict sharing or referencing our content, we ask that you credit us when quoting or linking to it.</P>
          <P>The Loogo Labs name, logo, and brand marks are owned by Loogo Labs LLC. You may not use them without prior written consent.</P>
          <P>We do not reproduce or distribute content owned by third parties without authorization. If you believe any content on our site infringes your intellectual property rights, contact us at <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a> and we will investigate promptly.</P>
        </Section>

        <Section title="5. Disclaimer of Warranties">
          <P>Our website and its content are provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</P>
          <P>Results described on our website — such as lead conversion improvements, no-show reductions, or time savings — reflect our experience with clients and are not guarantees. Individual results will vary based on your business, industry, market, and how you use the platform.</P>
        </Section>

        <Section title="6. Limitation of Liability">
          <P>To the fullest extent permitted by law, Loogo Labs and its owners, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, our website or services.</P>
          <P>Our total liability to you for any claim arising from use of our website or services shall not exceed the amount you paid to Loogo Labs in the 30 days preceding the claim, or $100, whichever is greater.</P>
        </Section>

        <Section title="7. Third-Party Links and Services">
          <P>Our website may contain links to third-party websites, booking tools, or services. We are not responsible for the content, privacy practices, or terms of those sites. Clicking a third-party link does not constitute an endorsement.</P>
          <P>We use third-party service providers to operate our platform (hosting, CRM, payment processing, calendar booking). Your use of those services is subject to their own terms and privacy policies.</P>
        </Section>

        <Section title="8. Payments and Refunds">
          <P>Pricing for our managed services is as listed on our website or as agreed in a signed service agreement. All fees are due as specified. We do not offer refunds for services already rendered.</P>
          <P>If you have a billing dispute, contact us within 14 days of the charge at <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a> and we will work to resolve it in good faith.</P>
        </Section>

        <Section title="9. Termination">
          <P>Either party may terminate a service engagement with 30 days written notice unless otherwise stated in a signed service agreement. Loogo Labs reserves the right to suspend or terminate access to our services immediately if a client violates these terms or engages in conduct that is harmful to our business or reputation.</P>
        </Section>

        <Section title="10. Governing Law">
          <P>These Terms of Service are governed by the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Miami-Dade County, Florida, and you consent to personal jurisdiction in that venue.</P>
        </Section>

        <Section title="11. Changes to These Terms">
          <P>We may update these Terms of Service at any time. When we do, we will update the "Last updated" date above. Material changes will be communicated where reasonably possible. Continued use of our website after changes are posted constitutes your acceptance of the updated terms.</P>
        </Section>

        <Section title="12. Contact">
          <P>For questions about these terms, contact us at:</P>
          <P><strong>Loogo Labs LLC</strong><br />
          <a href="mailto:david@loogolabs.com" style={linkStyle}>david@loogolabs.com</a></P>
        </Section>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--border-hair)' }}>
          <button onClick={() => onNavigate('Privacy')} style={navBtn}>← Read our Privacy Policy</button>
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
