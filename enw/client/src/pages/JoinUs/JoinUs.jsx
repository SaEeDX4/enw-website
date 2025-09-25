import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';
import { useAppContext } from '../../context/AppContext';
import FormField from '../../components/ui/FormField/FormField';
import Button from '../../components/ui/Button/Button';
import Hero from '../../components/ui/Hero/Hero';

function JoinUs() {
  const navigate = useNavigate();
  const { actions } = useAppContext();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    occupation: '',
    skills: '',
    availability: '',
    experience: '',
    motivation: '',
    backgroundCheck: false,
    references: '',
    emergencyContact: '',
    emergencyPhone: '',
    consent: false,
  };

  const fieldValidationRules = {
    firstName: [validationRules.required, validationRules.minLength(2)],
    lastName: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    age: [validationRules.required, validationRules.age],
    address: [validationRules.required, validationRules.minLength(10)],
    skills: [validationRules.required, validationRules.minLength(10)],
    availability: [validationRules.required],
    motivation: [validationRules.required, validationRules.minLength(20)],
    backgroundCheck: [
      (value) => value === true || 'You must consent to a background check',
    ],
    emergencyContact: [validationRules.required, validationRules.minLength(2)],
    emergencyPhone: [validationRules.required, validationRules.phone],
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

  const skillOptions = [
    { value: 'shopping', label: 'Shopping assistance' },
    { value: 'transportation', label: 'Transportation/driving' },
    { value: 'companionship', label: 'Companionship and conversation' },
    { value: 'housework', label: 'Light housework' },
    { value: 'technology', label: 'Technology support' },
    { value: 'healthcare', label: 'Healthcare assistance' },
    { value: 'cooking', label: 'Meal preparation' },
    { value: 'gardening', label: 'Gardening/outdoor tasks' },
    { value: 'other', label: 'Other skills' },
  ];

  const availabilityOptions = [
    { value: 'weekday-morning', label: 'Weekday mornings' },
    { value: 'weekday-afternoon', label: 'Weekday afternoons' },
    { value: 'weekday-evening', label: 'Weekday evenings' },
    { value: 'weekend-morning', label: 'Weekend mornings' },
    { value: 'weekend-afternoon', label: 'Weekend afternoons' },
    { value: 'weekend-evening', label: 'Weekend evenings' },
    { value: 'flexible', label: 'Flexible schedule' },
  ];

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:3000/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      const result = await res.json();
      console.log('Volunteer saved:', result);

      actions.addNotification({
        type: 'success',
        title: 'Application Submitted!',
        message:
          'Thank you for applying to volunteer. We will review your application and contact you within 48 hours.',
      });

      reset();
      navigate('/');
    } catch (error) {
      console.error('Submit error:', error);
      actions.addNotification({
        type: 'error',
        title: 'Submission Failed',
        message:
          'There was an error submitting your application. Please try again.',
      });
    }
  };

  return (
    <div>
      <Hero
        title="Join Our Volunteer Team"
        description="Help make a difference in your community by supporting elderly neighbors. Complete this application to join our network of caring volunteers."
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
                Volunteer Application Form
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit);
                }}
              >
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
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={updateField}
                    onBlur={touchField}
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
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.email}
                    touched={touched.email}
                    required
                  />

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
                </div>

                <FormField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={updateField}
                  onBlur={touchField}
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
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.address}
                  touched={touched.address}
                  required
                  placeholder="Street address, city, postal code"
                />

                <FormField
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.occupation}
                  touched={touched.occupation}
                  placeholder="Current or former occupation"
                />

                <FormField
                  label="Skills and Abilities"
                  name="skills"
                  type="select"
                  value={formData.skills}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.skills}
                  touched={touched.skills}
                  required
                  options={skillOptions}
                />

                <FormField
                  label="Availability"
                  name="availability"
                  type="select"
                  value={formData.availability}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.availability}
                  touched={touched.availability}
                  required
                  options={availabilityOptions}
                />

                <FormField
                  label="Previous Volunteer Experience"
                  name="experience"
                  type="textarea"
                  value={formData.experience}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.experience}
                  touched={touched.experience}
                  placeholder="Describe any previous volunteer work or relevant experience"
                  rows="3"
                />

                <FormField
                  label="Why do you want to volunteer with us?"
                  name="motivation"
                  type="textarea"
                  value={formData.motivation}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.motivation}
                  touched={touched.motivation}
                  required
                  placeholder="Tell us what motivates you to help elderly community members"
                  rows="4"
                />

                <FormField
                  label="References"
                  name="references"
                  type="textarea"
                  value={formData.references}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.references}
                  touched={touched.references}
                  placeholder="Provide contact information for 2-3 references who can speak to your character and reliability"
                  rows="3"
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
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.emergencyContact}
                    touched={touched.emergencyContact}
                    required
                  />

                  <FormField
                    label="Emergency Contact Phone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={updateField}
                    onBlur={touchField}
                    error={errors.emergencyPhone}
                    touched={touched.emergencyPhone}
                    required
                  />
                </div>

                <FormField
                  label="I consent to a background check and verification process"
                  name="backgroundCheck"
                  type="checkbox"
                  value={formData.backgroundCheck}
                  onChange={updateField}
                  onBlur={touchField}
                  error={errors.backgroundCheck}
                  touched={touched.backgroundCheck}
                  required
                />

                <FormField
                  label="I agree to the volunteer terms and conditions and code of conduct"
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

export default JoinUs;
