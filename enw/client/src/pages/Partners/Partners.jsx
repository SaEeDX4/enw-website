import React from 'react';
import Hero from '../../components/ui/Hero/Hero';
import FeatureList from '../../components/ui/FeatureList/FeatureList';
import CTASection from '../../components/ui/CTASection/CTASection';

function Partners() {
  const partnerTypes = [
    {
      icon: '🏥',
      title: 'Healthcare Providers',
      description: 'Referrals and coordinated care for elderly patients.',
    },
    {
      icon: '💊',
      title: 'Pharmacies',
      description: 'Medication delivery services and health consultations.',
    },
    {
      icon: '🛒',
      title: 'Grocery Stores',
      description: 'Discounts and services for seniors and volunteers.',
    },
    {
      icon: '🏢',
      title: 'Local Businesses',
      description: 'Sponsorships, employee volunteering, and engagement.',
    },
  ];
  const benefits = [
    {
      icon: '📈',
      title: 'CSR Impact',
      description: 'Demonstrate meaningful community commitment.',
    },
    {
      icon: '🤝',
      title: 'Community Connection',
      description: 'Build trusted relationships with residents.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Explore new service models and tech solutions.',
    },
  ];
  return (
    <div>
      <Hero
        title="Partner With Us"
        description="Join our mission to support elderly community members."
        primaryAction={{
          text: 'Become a Partner',
          href: '/partners/become-partner', // Updated link
          ariaLabel: 'Contact us to become a partner',
        }}
        secondaryAction={{
          text: 'Learn About Impact',
          href: '/about',
          ariaLabel: 'Learn about impact',
        }}
      />
      <FeatureList
        title="Partnership Opportunities"
        features={partnerTypes}
        columns={2}
      />
      <section
        style={{ padding: 'var(--space-12) 0', background: 'var(--ink-50)' }}
      >
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-8)',
              color: 'var(--ink-900)',
            }}
          >
            Partnership Benefits
          </h2>
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-8)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                style={{ textAlign: 'center', padding: 'var(--space-6)' }}
              >
                <div
                  style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}
                >
                  {b.icon}
                </div>
                <h3
                  style={{
                    color: 'var(--brand-700)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    color: 'var(--ink-700)',
                    margin: 0,
                    lineHeight: 'var(--leading-normal)',
                  }}
                >
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div
          className="container"
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2
            style={{ color: 'var(--ink-900)', marginBottom: 'var(--space-6)' }}
          >
            Sustainable & Scalable
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--ink-700)',
              lineHeight: 'var(--leading-loose)',
            }}
          >
            Our program creates savings by reducing formal care loads while
            building a more connected community.
          </p>
        </div>
      </section>
      <CTASection
        title="Ready to Partner With Us?"
        description="Join community partners making a difference in elderly care."
        primaryAction={{
          text: 'Become a Partner',
          href: '/partners/become-partner', // Updated link
          ariaLabel: 'Contact us to discuss partnership opportunities',
        }}
        variant="primary"
      />
    </div>
  );
}
export default Partners;
