import React from 'react';
import Hero from '../../components/ui/Hero/Hero';

function Contact() {
  return (
    <div>
      <Hero
        title="Contact Us"
        description="We’re here to help seniors, volunteers, and partners get started."
        variant="compact"
      />
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gap: 'var(--space-8)',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-8)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            <div
              style={{
                padding: 'var(--space-6)',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                style={{
                  color: 'var(--brand-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Get Support
              </h3>
              <p
                style={{
                  color: 'var(--ink-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                If you’re a senior who needs assistance, we’ll connect you with
                caring volunteers.
              </p>
              <a
                href="mailto:seniors@elderlyneighbourwatch.com"
                style={{
                  color: 'var(--brand-700)',
                  textDecoration: 'none',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                seniors@elderlyneighbourwatch.com
              </a>
            </div>
            <div
              style={{
                padding: 'var(--space-6)',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                style={{
                  color: 'var(--brand-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Become a Volunteer
              </h3>
              <p
                style={{
                  color: 'var(--ink-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Ready to help elderly neighbors with simple tasks and
                companionship?
              </p>
              <a
                href="mailto:volunteers@elderlyneighbourwatch.com"
                style={{
                  color: 'var(--brand-700)',
                  textDecoration: 'none',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                volunteers@elderlyneighbourwatch.com
              </a>
            </div>
            <div
              style={{
                padding: 'var(--space-6)',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                style={{
                  color: 'var(--brand-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Partner With Us
              </h3>
              <p
                style={{
                  color: 'var(--ink-700)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Interested in partnerships, sponsorships, or collaboration?
              </p>
              <a
                href="mailto:partners@elderlyneighbourwatch.com"
                style={{
                  color: 'var(--brand-700)',
                  textDecoration: 'none',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                partners@elderlyneighbourwatch.com
              </a>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              background: 'var(--ink-50)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                color: 'var(--ink-900)',
                marginBottom: 'var(--space-4)',
              }}
            >
              General
            </h3>
            <div
              style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-700)' }}
            >
              <p style={{ marginBottom: 'var(--space-3)' }}>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:contact@elderlyneighbourwatch.com"
                  style={{ color: 'var(--brand-700)' }}
                >
                  contact@elderlyneighbourwatch.com
                </a>
              </p>
              <p style={{ marginBottom: 'var(--space-3)' }}>
                <strong>Phone:</strong>{' '}
                <a
                  href="tel:+37000000000"
                  style={{ color: 'var(--brand-700)' }}
                >
                  (+370) 000 0000
                </a>
              </p>
              <p>
                <strong>Location:</strong> Vilnius, Lithuania
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Contact;
