import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import './TrainingProgramForm.css';

const TrainingProgramForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goalType: '',
    timeAvailability: '',
    trainingExperience: '',
    formExpertise: '',
    additionalGoals: []
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdditionalGoalsChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      additionalGoals: checked
        ? [...prev.additionalGoals, value]
        : prev.additionalGoals.filter(goal => goal !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Validate required fields
    const missingFields = [];
    if (!formData.goalType) missingFields.push('Primary Training Goal');
    if (!formData.timeAvailability) missingFields.push('Time Availability');
    if (!formData.trainingExperience) missingFields.push('Training Experience');
    if (!formData.formExpertise) missingFields.push('Expertise in Form & Technique');

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    const requestData = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('/api/training-program', requestData);

      // Redirect to the program display page
      if (response.data && response.data.program && response.data.program.id) {
        navigate(`/training-program/${response.data.program.id}`);
      } else {
        setSuccessMessage('Training program created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/training-program');
        }, 2000);
      }

    } catch (err) {
      console.error('Error submitting training program form:', err);
      setError(err.response?.data?.message || 'Failed to submit training program preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-program-container">
      <div className="form-header">
        <h2>Personalized Training Program</h2>
        <p>Tell us about your fitness goals and experience to get a customized workout program</p>
      </div>

      <form onSubmit={handleSubmit} className="training-program-form">
        {/* Goal Type */}
        <div className="form-group">
          <label htmlFor="goalType">Primary Training Goal *</label>
          <select
            id="goalType"
            name="goalType"
            value={formData.goalType}
            onChange={handleChange}
            required
          >
            <option value="">Select your primary goal</option>
            <option value="strength">Strength Training</option>
            <option value="muscle-size">Increase Muscle Size (Hypertrophy)</option>
          </select>
        </div>

        {/* Time Availability */}
        <div className="form-group">
          <label htmlFor="timeAvailability">Time Availability *</label>
          <select
            id="timeAvailability"
            name="timeAvailability"
            value={formData.timeAvailability}
            onChange={handleChange}
            required
          >
            <option value="">How many days per week can you train?</option>
            <option value="3-times">3 times a week</option>
            <option value="4-times">4 times a week</option>
            <option value="6-days">6 days a week</option>
          </select>
        </div>

        {/* Training Experience */}
        <div className="form-group">
          <label htmlFor="trainingExperience">Training Experience *</label>
          <select
            id="trainingExperience"
            name="trainingExperience"
            value={formData.trainingExperience}
            onChange={handleChange}
            required
          >
            <option value="">Select your training experience</option>
            <option value="beginner">Less than 6 months</option>
            <option value="intermediate">1 year or more</option>
            <option value="advanced">2 years or more</option>
          </select>
        </div>

        {/* Form & Technique Expertise */}
        <div className="form-group">
          <label htmlFor="formExpertise">Expertise in Form & Technique *</label>
          <select
            id="formExpertise"
            name="formExpertise"
            value={formData.formExpertise}
            onChange={handleChange}
            required
          >
            <option value="">Rate your form and technique knowledge</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Additional Goals */}
        <div className="form-group">
          <label>Additional Learning Goals (Optional)</label>
          <p className="form-description">Select any specific exercises you'd like to learn or improve:</p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="deadlift"
                checked={formData.additionalGoals.includes('deadlift')}
                onChange={handleAdditionalGoalsChange}
              />
              Learn Deadlift
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="squat"
                checked={formData.additionalGoals.includes('squat')}
                onChange={handleAdditionalGoalsChange}
              />
              Learn Squat
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="bench-press"
                checked={formData.additionalGoals.includes('bench-press')}
                onChange={handleAdditionalGoalsChange}
              />
              Learn Bench Press
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="olympic-weightlifting"
                checked={formData.additionalGoals.includes('olympic-weightlifting')}
                onChange={handleAdditionalGoalsChange}
              />
              Olympic Weightlifting
            </label>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}



        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Generating Program...' : 'Create My Training Program'}
          </button>
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingProgramForm; 