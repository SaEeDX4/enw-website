import React from 'react';

function Privacy() {
  return (
    <div
      className="container"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--space-8) 0',
      }}
    >
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--ink-500)', marginBottom: 'var(--space-6)' }}>
        Last updated: [Date]
      </p>
      <div
        style={{
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--leading-loose)',
          color: 'var(--ink-700)',
        }}
      >
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us (registration,
          requests for assistance, contact).
        </p>
        <h2>How We Use Information</h2>
        <p>
          To provide and improve services, match volunteers, and communicate
          with you.
        </p>
        <h2>Sharing</h2>
        <p>
          No selling of personal data. Limited sharing as described in this
          policy.
        </p>
        <h2>Security</h2>
        <p>
          Appropriate measures protect against unauthorized access and
          disclosure.
        </p>
        <h2>Your Rights</h2>
        <p>
          Access, update, or delete your data:
          privacy@elderlyneighbourwatch.com.
        </p>
        <h2>Contact</h2>
        <p>Questions: contact@elderlyneighbourwatch.com.</p>
      </div>
    </div>
  );
}
export default Privacy;
