import React from 'react';

function Terms() {
  return (
    <div
      className="container"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--space-8) 0',
      }}
    >
      <h1>Terms of Service</h1>
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
        <h2>Acceptance</h2>
        <p>
          By using our services, you agree to these terms and our Privacy
          Policy.
        </p>
        <h2>Service</h2>
        <p>
          We connect volunteers with elderly community members for free
          assistance.
        </p>
        <h2>User Responsibilities</h2>
        <p>
          Provide accurate info; volunteers complete required checks and
          training.
        </p>
        <h2>Safety & Conduct</h2>
        <p>Respectful behavior required; unsafe behavior leads to removal.</p>
        <h2>Liability</h2>
        <p>
          We facilitate connections; emergencies go to appropriate authorities.
        </p>
        <h2>Termination</h2>
        <p>We may terminate accounts violating terms or safety.</p>
        <h2>Contact</h2>
        <p>legal@elderlyneighbourwatch.com</p>
      </div>
    </div>
  );
}
export default Terms;
