import React from 'react';
import Hero from '../../components/ui/Hero/Hero';
import StatCard from '../../components/ui/StatCard/StatCard';
import CTASection from '../../components/ui/CTASection/CTASection';

function About() {
  return (
    <div>
      <Hero
        title="About Elderly Neighbour Watch"
        description="Empowering elderly communities through volunteer-driven support and real neighborhood connections."
        variant="compact"
      />
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div
          className="container"
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-8)',
              color: 'var(--ink-900)',
            }}
          >
            Our Mission
          </h2>
          <div
            style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-loose)',
              color: 'var(--ink-700)',
            }}
          >
            <p>
              We respond to the demographic shift toward an aging society by
              ensuring free, volunteer-driven assistance that keeps seniors
              connected and independent.
            </p>
            <p>
              Inspired by Neighborhood Watch, we adapted the model to focus on
              practical and emotional needs—regular check-ins, errands, and
              shared activities.
            </p>
          </div>
        </div>
      </section>
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
            Community Impact
          </h2>
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-8)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              marginBottom: 'var(--space-12)',
            }}
          >
            <StatCard
              number="100+"
              label="Seniors Served"
              description="Receiving regular support"
            />
            <StatCard
              number="50+"
              label="Active Volunteers"
              description="Caring neighbors helping"
            />
            <StatCard
              number="500+"
              label="Tasks Completed"
              description="Errands, visits & support"
            />
          </div>
        </div>
      </section>
      <CTASection
        title="Be Part of Our Mission"
        description="Join us in creating caring communities where elderly neighbors get the support they deserve."
        primaryAction={{
          text: 'Get Involved',
          href: '/volunteers',
          ariaLabel: 'Get involved',
        }}
        secondaryAction={{
          text: 'Support Our Work',
          href: '/support-us',
          ariaLabel: 'Support us',
        }}
      />
    </div>
  );
}
export default About;
