import React from 'react';
import Hero from '../../components/ui/Hero/Hero';
import FeatureList from '../../components/ui/FeatureList/FeatureList';
import CTASection from '../../components/ui/CTASection/CTASection';

function HowItWorks() {
  const steps = [
    {
      icon: '👥',
      title: 'Community Registration',
      description:
        'Seniors and volunteers register through our secure platform with background verification for safety and trust.',
    },
    {
      icon: '🗂️',
      title: 'Task Management System',
      description:
        'Seniors submit requests; our system matches tasks with nearby volunteers by skills and availability.',
    },
    {
      icon: '🤝',
      title: 'Neighbor Connections',
      description:
        'Volunteers provide companionship, errands, and assistance—coordinated and monitored for quality and safety.',
    },
  ];
  return (
    <div>
      <Hero
        title="How Elderly Neighbour Watch Works"
        description="Our community-driven platform connects caring volunteers with elderly neighbors who need support."
        variant="compact"
      />
      <FeatureList title="Three Simple Steps" features={steps} columns={3} />
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
            Collaborative, Structured, and Managed Support
          </h2>
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-loose)',
              color: 'var(--ink-700)',
            }}
          >
            <p>
              Each district forms a community with stations or designated homes.
              Elderly volunteers help peers with groceries, escorts, and home
              care.
            </p>
            <p>
              A planning team organizes tasks and volunteers for coverage. Our
              system tracks needs, assignments, and progress for accountability.
            </p>
            <p>
              Emergency protocols are in place for critical health and wellness
              needs, providing peace of mind for families and communities.
            </p>
          </div>
        </div>
      </section>
      <CTASection
        title="Ready to Get Started?"
        description="Join our community of caring neighbors making a difference."
        primaryAction={{
          text: 'Get Support',
          href: '/seniors',
          ariaLabel: 'Get support',
        }}
        secondaryAction={{
          text: 'Become a Volunteer',
          href: '/volunteers',
          ariaLabel: 'Become a volunteer',
        }}
      />
    </div>
  );
}
export default HowItWorks;
