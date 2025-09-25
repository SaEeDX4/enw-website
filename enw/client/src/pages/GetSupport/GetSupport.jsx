import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';
import { useAppContext } from '../../context/AppContext';
import FormField from '../../components/ui/FormField/FormField';
import Button from '../../components/ui/Button/Button';
import Hero from '../../components/ui/Hero/Hero';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function GetSupport() {
  const navigate = useNavigate();
  const { actions } = useAppContext();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    supportNeeds: '',
    healthConditions: '',
    preferredTimes: '',
    additionalInfo: '',
    consent: false,
  };

  const fieldValidationRules = {
    firstName: [validationRules.required, validationRules.minLength(2)],
    lastName: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    age: [validationRules.required, validationRules.age],
    address: [validationRules.required, validationRules.minLength(10)],
    emergencyContact: [validationRules.required, validationRules.minLength(2)],
    emergencyPhone: [validationRules.required, validationRules.phone],
    supportNeeds: [validationRules.required, validationRules.minLength(10)],
    consent: [
      (value) => value === true || 'You must agree to the terms and conditions',
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

  // 🔧 ADAPTERS: convert browser events to (name, value) for your hook
  const adaptChange = (e) => {
    const { name, type, checked, value } = e.target;
    updateField(name, type === 'checkbox' ? checked : value);
  };
  const adaptBlur = (e) => {
    touchField(e.target.name);
  };

  const supportOptions = [
    {
      value: 'Grocery shopping assistance',
      label: 'Grocery shopping assistance',
    },
    {
      value: 'Transportation to appointments',
      label: 'Transportation to appointments',
    },
    {
      value: 'Regular companionship visits',
      label: 'Regular companionship visits',
    },
    { value: 'Light housework help', label: 'Light housework help' },
    { value: 'Medication pickup', label: 'Medication pickup' },
    { value: 'Technology assistance', label: 'Technology assistance' },
    { value: 'Other (please specify)', label: 'Other (please specify)' },
  ];

  const timeOptions = [
    { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'evening', label: 'Evening (5 PM - 8 PM)' },
    { value: 'flexible', label: 'Flexible / Any time' },
  ];

  const onSubmit = async (data) => {
    try {
      const payload = {
        firstName: (data.firstName || '').trim(),
        lastName: (data.lastName || '').trim(),
        email: (data.email || '').trim(),
        phone: (data.phone || '').trim(),
        age: data.age ? Number(data.age) : undefined,
        address: (data.address || '').trim(),
        emergencyContact: (data.emergencyContact || '').trim(),
        emergencyPhone: (data.emergencyPhone || '').trim(),
        supportNeeds: data.supportNeeds || '',
        healthConditions: data.healthConditions || '',
        preferredTimes: data.preferredTimes || '',
        additionalInfo: data.additionalInfo || '',
        consent: Boolean(data.consent) === true,
      };

      console.log('➡️ POST', `${API_BASE}/seniors/support-requests`, payload);

      const res = await fetch(`${API_BASE}/seniors/support-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('❌ Server error:', res.status, res.statusText, text);
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      console.log('✅ Saved:', result);

      actions.addNotification({
        type: 'success',
        title: 'Request Submitted!',
        message:
          'We have received your support request. Our team will contact you within 24 hours.',
      });

      reset();
      navigate('/');
    } catch (error) {
      console.error('❌ Submission error:', error);
      actions.addNotification({
        type: 'error',
        title: 'Submission Failed',
        message:
          'There was an error submitting your request. Please try again.',
      });
    }
  };

  return (
    <div>
      <Hero
        title="Get Support"
        description="Request assistance from caring volunteers in your community. Fill out this form and we'll match you with a suitable volunteer within 24 hours."
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
                Support Request Form
              </h2>

              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  }}
                >
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.lastName}
                    touched={touched.lastName}
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
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.email}
                    touched={touched.email}
                    required
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.phone}
                    touched={touched.phone}
                    required
                  />
                </div>

                <FormField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.age}
                  touched={touched.age}
                  required
                  min="18"
                  max="120"
                />

                <FormField
                  label="Home Address"
                  name="address"
                  value={formData.address}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.address}
                  touched={touched.address}
                  required
                  placeholder="Street address, city, postal code"
                />

                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  }}
                >
                  <FormField
                    label="Emergency Contact Name"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.emergencyContact}
                    touched={touched.emergencyContact}
                    required
                  />

                  <FormField
                    label="Emergency Contact Phone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={adaptChange}
                    onBlur={adaptBlur}
                    error={errors.emergencyPhone}
                    touched={touched.emergencyPhone}
                    required
                  />
                </div>

                <FormField
                  label="Type of Support Needed"
                  name="supportNeeds"
                  type="select"
                  value={formData.supportNeeds}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.supportNeeds}
                  touched={touched.supportNeeds}
                  required
                  options={supportOptions}
                />

                <FormField
                  label="Health Conditions or Special Needs"
                  name="healthConditions"
                  type="textarea"
                  value={formData.healthConditions}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.healthConditions}
                  touched={touched.healthConditions}
                  placeholder="Please describe any health conditions, mobility issues, or special considerations volunteers should be aware of"
                  rows="3"
                />

                <FormField
                  label="Preferred Times for Visits"
                  name="preferredTimes"
                  type="select"
                  value={formData.preferredTimes}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.preferredTimes}
                  touched={touched.preferredTimes}
                  options={timeOptions}
                />

                <FormField
                  label="Additional Information"
                  name="additionalInfo"
                  type="textarea"
                  value={formData.additionalInfo}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
                  error={errors.additionalInfo}
                  touched={touched.additionalInfo}
                  placeholder="Any other information that would help us match you with the right volunteer"
                  rows="3"
                />

                <FormField
                  label="I agree to the terms and conditions and consent to background verification of assigned volunteers"
                  name="consent"
                  type="checkbox"
                  value={formData.consent}
                  onChange={adaptChange}
                  onBlur={adaptBlur}
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
                  >
                    Submit Request
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

export default GetSupport;
