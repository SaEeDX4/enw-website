import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';
import { useAppContext } from '../../context/AppContext';
import FormField from '../../components/ui/FormField/FormField';
import Button from '../../components/ui/Button/Button';
import Hero from '../../components/ui/Hero/Hero';

// FIX: use same API_BASE pattern as other pages
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function BecomePartner() {
  const navigate = useNavigate();
  const { actions } = useAppContext();

  const initialValues = {
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    address: '',
    partnershipType: '',
    services: '',
    targetAudience: '',
    experience: '',
    goals: '',
    resources: '',
    timeline: '',
    additionalInfo: '',
    consent: false,
  };

  const fieldValidationRules = {
    organizationName: [validationRules.required, validationRules.minLength(2)],
    contactPerson: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    organizationType: [validationRules.required],
    address: [validationRules.required, validationRules.minLength(10)],
    partnershipType: [validationRules.required],
    services: [validationRules.required, validationRules.minLength(20)],
    goals: [validationRules.required, validationRules.minLength(20)],
    consent: [
      (value) => value === true || 'You must agree to the partnership terms',
    ],
  };

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    touchField,
    handleSubmit,
    reset,
  } = useForm(initialValues, fieldValidationRules);

  // FIX: values uppercased to match server enum in Partner schema
  const organizationTypes = [
    { value: 'HEALTHCARE', label: 'Healthcare Provider' },
    { value: 'PHARMACY', label: 'Pharmacy' },
    { value: 'GROCERY', label: 'Grocery Store' },
    { value: 'BUSINESS', label: 'Local Business' },
    { value: 'NONPROFIT', label: 'Non-profit Organization' },
    { value: 'GOVERNMENT', label: 'Government Agency' },
    { value: 'RELIGIOUS', label: 'Religious Organization' },
    { value: 'EDUCATION', label: 'Educational Institution' },
    { value: 'OTHER', label: 'Other' },
  ];

  const partnershipTypes = [
    { value: 'sponsorship', label: 'Financial Sponsorship' },
    { value: 'service', label: 'Service Partnership' },
    { value: 'referral', label: 'Referral Partnership' },
    { value: 'volunteer', label: 'Employee Volunteer Program' },
    { value: 'resource', label: 'Resource Sharing' },
    { value: 'advocacy', label: 'Advocacy Partnership' },
    { value: 'other', label: 'Other Partnership Type' },
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (within 1 month)' },
    { value: 'short', label: 'Short-term (1-3 months)' },
    { value: 'medium', label: 'Medium-term (3-6 months)' },
    { value: 'long', label: 'Long-term (6+ months)' },
    { value: 'ongoing', label: 'Ongoing partnership' },
  ];

  // FIX: real POST to backend (creates collection in Atlas on first success)
  const onSubmit = async (data) => {
    try {
      const payload = {
        organizationName: data.organizationName?.trim(),
        contactPerson: data.contactPerson?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        website: data.website?.trim(),
        organizationType: data.organizationType, // already uppercased from options
        address: data.address?.trim(),
        partnershipType: data.partnershipType,
        services: data.services?.trim(),
        targetAudience: data.targetAudience?.trim(),
        experience: data.experience?.trim(),
        goals: data.goals?.trim(),
        resources: data.resources?.trim(),
        timeline: data.timeline,
        additionalInfo: data.additionalInfo?.trim(),
        consent: !!data.consent,
      };

      const res = await fetch(`${API_BASE}/api/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('❌ Partners submit failed:', res.status, body);
        actions.addNotification({
          type: 'error',
          title: 'Submission Failed',
          message:
            'There was an error submitting your partnership application. Please check the fields and try again.',
        });
        return;
      }

      const json = await res.json().catch(() => ({}));
      console.log('✅ Partnership application submitted:', json);

      actions.addNotification({
        type: 'success',
        title: 'Partnership Application Submitted!',
        message:
          'Thank you for your interest in partnering with us. Our partnerships team will review your application and contact you within 3-5 business days.',
      });

      reset();
      navigate('/partners'); // keep or adjust your redirect
    } catch (error) {
      console.error('❌ Partners submit error:', error);
      actions.addNotification({
        type: 'error',
        title: 'Submission Failed',
        message:
          'There was an unexpected error submitting your partnership application. Please try again.',
      });
    }
  };

  return (
    <div>
      <Hero
        title="Become a Partner"
        description="Join our mission to support elderly community members. Partner with Elderly Neighbour Watch to create stronger, more caring neighborhoods."
        variant="compact"
      />

      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div
              style={{
                background: 'var(--white)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--ink-100)',
              }}
            >
              <h2
                style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}
              >
                Partnership Application Form
              </h2>

              {/* Proper submit wiring + fallback on Button */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  label="Organization Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.organizationName}
                  touched={touched.organizationName}
                  required
                />

                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  }}
                >
                  <FormField
                    label="Contact Person"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.contactPerson}
                    touched={touched.contactPerson}
                    required
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.email}
                    touched={touched.email}
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  }}
                >
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.phone}
                    touched={touched.phone}
                    required
                  />

                  <FormField
                    label="Website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.website}
                    touched={touched.website}
                    placeholder="https://example.com"
                  />
                </div>

                <FormField
                  label="Organization Type"
                  name="organizationType"
                  type="select"
                  value={formData.organizationType}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.organizationType}
                  touched={touched.organizationType}
                  required
                  options={organizationTypes}
                />

                <FormField
                  label="Organization Address"
                  name="address"
                  value={formData.address}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.address}
                  touched={touched.address}
                  required
                  placeholder="Street address, city, postal code"
                />

                <FormField
                  label="Type of Partnership"
                  name="partnershipType"
                  type="select"
                  value={formData.partnershipType}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.partnershipType}
                  touched={touched.partnershipType}
                  required
                  options={partnershipTypes}
                />

                <FormField
                  label="Services or Resources You Can Provide"
                  name="services"
                  type="textarea"
                  value={formData.services}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.services}
                  touched={touched.services}
                  required
                  placeholder="Describe the services, resources, or support your organization can provide to elderly community members"
                  rows="4"
                />

                <FormField
                  label="Target Audience"
                  name="targetAudience"
                  type="textarea"
                  value={formData.targetAudience}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.targetAudience}
                  touched={touched.targetAudience}
                  placeholder="Describe the elderly populations or specific needs your organization is best equipped to serve"
                  rows="3"
                />

                <FormField
                  label="Experience with Elderly Care"
                  name="experience"
                  type="textarea"
                  value={formData.experience}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.experience}
                  touched={touched.experience}
                  placeholder="Describe your organization's experience working with elderly populations"
                  rows="3"
                />

                <FormField
                  label="Partnership Goals"
                  name="goals"
                  type="textarea"
                  value={formData.goals}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.goals}
                  touched={touched.goals}
                  required
                  placeholder="What do you hope to achieve through this partnership? How will it benefit elderly community members?"
                  rows="4"
                />

                <FormField
                  label="Available Resources"
                  name="resources"
                  type="textarea"
                  value={formData.resources}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.resources}
                  touched={touched.resources}
                  placeholder="Describe the human, financial, or material resources you can commit to this partnership"
                  rows="3"
                />

                <FormField
                  label="Preferred Timeline"
                  name="timeline"
                  type="select"
                  value={formData.timeline}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.timeline}
                  touched={touched.timeline}
                  options={timelineOptions}
                />

                <FormField
                  label="Additional Information"
                  name="additionalInfo"
                  type="textarea"
                  value={formData.additionalInfo}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.additionalInfo}
                  touched={touched.additionalInfo}
                  placeholder="Any other information that would help us understand your organization and partnership interests"
                  rows="3"
                />

                <FormField
                  label="I agree to the partnership terms and conditions and authorize Elderly Neighbour Watch to contact our organization"
                  name="consent"
                  type="checkbox"
                  value={formData.consent}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.consent}
                  touched={touched.consent}
                  required
                />

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    justifyContent: 'flex-end',
                    marginTop: 'var(--space-6)',
                  }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)} // fallback to force validation
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BecomePartner;
