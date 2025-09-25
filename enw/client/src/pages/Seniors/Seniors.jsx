import React from 'react';
import Hero from '../../components/ui/Hero/Hero';
import FeatureList from '../../components/ui/FeatureList/FeatureList';
import CTASection from '../../components/ui/CTASection/CTASection';
import TestimonialCard from '../../components/ui/TestimonialCard/TestimonialCard';

function Seniors() {
  const services = [
    {
      icon: '🛒',
      title: 'Shopping Assistance',
      description:
        'Help with groceries, medication pickup, and essential errands.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Healthcare Support',
      description: 'Escorts to appointments and assistance during illness.',
    },
    {
      icon: '🏠',
      title: 'Home Care Help',
      description:
        'Light housekeeping, paperwork, and basic maintenance support.',
    },
    {
      icon: '💝',
      title: 'Companionship',
      description: 'Regular check-ins, conversation, and social activities.',
    },
  ];
  return (
    <div>
      <Hero
        title="Support for Seniors"
        description="Get help with daily tasks, companionship, and staying connected to your community."
        primaryAction={{
          text: 'Get Support',
          href: '/seniors/get-support', // Updated link
          ariaLabel: 'Contact us to get support',
        }}
        secondaryAction={{
          text: 'Learn How It Works',
          href: '/how-it-works',
          ariaLabel: 'How it works',
        }}
      />
      <FeatureList
        title="Services We Provide"
        features={services}
        columns={2}
      />
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-8)',
              color: 'var(--ink-900)',
            }}
          >
            What Our Seniors Say
          </h2>
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-6)',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            <TestimonialCard
              quote="Having Maria help me with grocery shopping has been wonderful. She's become like family to me."
              author="Elena K."
              location="Vilnius"
            />
            <TestimonialCard
              quote="The volunteers are so kind and patient. I feel safer knowing someone checks on me regularly."
              author="Petras J."
              location="Vilnius"
            />
            <TestimonialCard
              quote="This service helped me stay independent in my home. I'm grateful for the support."
              author="Anna M."
              location="Vilnius"
            />
          </div>
        </div>
      </section>
      <CTASection
        title="Get the Support You Deserve"
        description="Join our community and receive help from caring neighbors. Registration is simple and free."
        primaryAction={{
          text: 'Get Support Today',
          href: '/seniors/get-support', // Updated link
          ariaLabel: 'Contact us to start receiving support',
        }}
        variant="primary"
      />
    </div>
  );
}
export default Seniors;
