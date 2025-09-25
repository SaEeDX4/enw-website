// client/src/pages/volunteers/JoinUs.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/ui/Hero/Hero';
import FormField from '../../components/ui/FormField/FormField';
import Button from '../../components/ui/Button/Button';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';
import { useAppContext } from '../../context/AppContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function JoinUs() {
  const navigate = useNavigate();
  const { actions } = useAppContext();

  // ✅ include all fields required by Volunteer model
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    occupation: '',
    skills: '', // single select → mapped to array on submit
    availability: '', // single select → mapped to array on submit
    experience: '',
    motivation: '',
    references: '',
    emergencyContact: '',
    emergencyPhone: '',
    backgroundCheck: false, // model allows false but we’ll require opt-in here
    consent: false, // required true
  };

  const rules = {
    firstName: [validationRules.required, validationRules.minLength(2)],
    lastName: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    age: [validationRules.required, validationRules.age],
    address: [validationRules.required, validationRules.minLength(10)],
    // skills must be one of enum; keep simple min length
    skills: [validationRules.required, validationRules.minLength(3)],
    availability: [validationRules.required],
    motivation: [validationRules.required, validationRules.minLength(20)],
    emergencyContact: [validationRules.required, validationRules.minLength(2)],
    emergencyPhone: [validationRules.required, validationRules.phone],
    backgroundCheck: [
      (v) => v === true || 'You must consent to a background check',
    ],
    consent: [(v) => v === true || 'You must agree to the terms'],
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
  } = useForm(initialValues, rules);

  // ✅ skills enum must match backend model
  const skillOptions = [
    { value: 'SHOPPING', label: 'Shopping assistance' },
    { value: 'TRANSPORTATION', label: 'Transportation / driving' },
    { value: 'COMPANIONSHIP', label: 'Companionship & conversation' },
    { value: 'HOUSEWORK', label: 'Light housework' },
    { value: 'MEDICATION', label: 'Medication pickup' },
    { value: 'TECHNOLOGY', label: 'Technology support' },
    { value: 'OTHER', label: 'Other' },
  ];

  const availabilityOptions = [
    { value: 'morning', label: 'Morning (8–12)' },
    { value: 'afternoon', label: 'Afternoon (12–5)' },
    { value: 'evening', label: 'Evening (5–8)' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'flexible', label: 'Flexible' },
  ];

  const onSubmit = async (data) => {
    try {
      // map single selects → arrays to satisfy schema
      const payload = {
        firstName: (data.firstName || '').trim(),
        lastName: (data.lastName || '').trim(),
        email: (data.email || '').trim(),
        phone: (data.phone || '').trim(),
        age: data.age ? Number(data.age) : undefined,
        address: (data.address || '').trim(),
        occupation: (data.occupation || '').trim(),
        // skills enum string → array of enum strings
        skills: data.skills ? [data.skills] : [],
        availability: data.availability ? [data.availability] : [],
        experience: (data.experience || '').trim(),
        motivation: (data.motivation || '').trim(),
        references: (data.references || '').trim(),
        emergencyContact: (data.emergencyContact || '').trim(),
        emergencyPhone: (data.emergencyPhone || '').trim(),
        backgroundCheck: !!data.backgroundCheck,
        consent: !!data.consent,
      };

      const res = await fetch(`${API_BASE}/api/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('❌ Volunteer submit failed:', res.status, body);
        throw new Error(`HTTP ${res.status}`);
      }

      actions.addNotification({
        type: 'success',
        title: 'Application Submitted',
        message: 'Thanks for volunteering! We’ll be in touch shortly.',
      });

      reset();
      navigate('/volunteers');
    } catch (e) {
      console.error('❌ Submit error:', e);
      actions.addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'There was an error submitting your application.',
      });
    }
  };

  return (
    <div>
      <Hero
        title="Volunteer Application"
        description="Tell us about yourself so we can match you with the right opportunities."
        variant="compact"
      />

      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div
            style={{
              background: 'var(--white)',
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--ink-100)',
            }}
          >
            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              Join Us
            </h2>

            {/* ✅ Correct wiring: handleSubmit returns a function that receives the event */}
            <form onSubmit={handleSubmit(onSubmit)}>
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
                  label="Email"
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
                  label="Phone"
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
                label="Primary Skill"
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
                placeholder="Provide contact information for 2–3 references"
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
                  onClick={() => navigate('/volunteers')}
                >
                  Cancel
                </Button>
                {/* ✅ native form submit is enough */}
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  // FIX: Fallback in case <Button> doesn't forward `type="submit"` to a real <button>
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
