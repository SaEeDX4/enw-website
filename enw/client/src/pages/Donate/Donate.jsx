import React from 'react';
import Hero from '../../components/ui/Hero/Hero';
import FeatureList from '../../components/ui/FeatureList/FeatureList';
import CTASection from '../../components/ui/CTASection/CTASection';

function Donate() {
  const supportTypes = [
    {
      icon: '💝',
      title: 'Individual Donations',
      description: 'One-time or recurring—fund programs and outreach.',
    },
    {
      icon: '🏢',
      title: 'Corporate Sponsorship',
      description: 'CSR partnerships supporting elderly care.',
    },
    {
      icon: '📋',
      title: 'Grant Funding',
      description: 'Government, EU, and private foundations.',
    },
    {
      icon: '🎁',
      title: 'In-Kind Contributions',
      description: 'Space, software, equipment, and services.',
    },
  ];
  const impact = [
    {
      icon: '👥',
      title: 'Volunteer Training',
      description: 'Background checks, safety and coordinator support.',
    },
    {
      icon: '💻',
      title: 'Technology Platform',
      description: 'Matching seniors and volunteers efficiently.',
    },
    {
      icon: '📢',
      title: 'Community Outreach',
      description: 'Awareness campaigns and education.',
    },
  ];
  return (
    <div>
      <Hero
        title="Support Our Mission"
        description="Help us keep community care free and accessible for seniors."
        primaryAction={{
          text: 'Donate Now',
          href: '/contact',
          ariaLabel: 'Donate',
        }}
        secondaryAction={{
          text: 'Learn About Impact',
          href: '/about',
          ariaLabel: 'Impact',
        }}
      />
      <FeatureList
        title="Ways to Support"
        features={supportTypes}
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
            Your Impact
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
            {impact.map((a, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-6)',
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div
                  style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}
                >
                  {a.icon}
                </div>
                <h3
                  style={{
                    color: 'var(--brand-700)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  {a.title}
                </h3>
                <p
                  style={{
                    color: 'var(--ink-700)',
                    margin: 0,
                    lineHeight: 'var(--leading-normal)',
                  }}
                >
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title="Make a Difference Today"
        description="Every contribution strengthens neighbor-to-neighbor care."
        primaryAction={{
          text: 'Support Us',
          href: '/contact',
          ariaLabel: 'Support us',
        }}
        variant="primary"
      />
    </div>
  );
}
export default Donate;
