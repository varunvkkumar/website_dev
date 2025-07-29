import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import './TrainingProgramDisplay.css';

const TrainingProgramDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`/api/training-program/${id}`);
        setProgram(response.data);
      } catch (err) {
        console.error('Error fetching training program:', err);
        setError('Failed to load training program');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="program-display-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your personalized training program...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="program-display-container">
        <div className="error-container">
          <h2>⚠️ Program Not Found</h2>
          <p>{error || 'The requested training program could not be found.'}</p>
          <button onClick={() => navigate('/training-program')} className="back-button">
            Create New Program
          </button>
        </div>
      </div>
    );
  }

  const getGoalTypeDisplay = (goalType) => {
    return goalType === 'strength' ? 'Strength Training' : 'Muscle Size (Hypertrophy)';
  };

  const getTimeAvailabilityDisplay = (timeAvailability) => {
    switch (timeAvailability) {
      case '3-times': return '3 times a week';
      case '4-times': return '4 times a week';
      case '6-days': return '6 days a week';
      default: return timeAvailability;
    }
  };

  const getExperienceDisplay = (experience) => {
    switch (experience) {
      case 'beginner': return 'Less than 6 months';
      case 'intermediate': return '1 year or more';
      case 'advanced': return '2 years or more';
      default: return experience;
    }
  };

  const getAdditionalGoalsDisplay = (goals) => {
    const goalMap = {
      'deadlift': 'Learn Deadlift',
      'squat': 'Learn Squat',
      'bench-press': 'Learn Bench Press',
      'olympic-weightlifting': 'Olympic Weightlifting'
    };
    return goals.map(goal => goalMap[goal] || goal);
  };

  return (
    <div className="program-display-container">
      <div className="program-header">
        <h1>🏋️‍♂️ Your Personalized Training Program</h1>
        <p>Created on {new Date(program.timestamp).toLocaleDateString()}</p>
      </div>

      <div className="program-content">
        {/* User Profile Summary */}
        <div className="profile-summary card">
          <h2>📋 Your Profile</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <strong>Primary Goal:</strong>
              <span>{getGoalTypeDisplay(program.goalType)}</span>
            </div>
            <div className="profile-item">
              <strong>Training Schedule:</strong>
              <span>{getTimeAvailabilityDisplay(program.timeAvailability)}</span>
            </div>
            <div className="profile-item">
              <strong>Experience Level:</strong>
              <span>{getExperienceDisplay(program.trainingExperience)}</span>
            </div>
            <div className="profile-item">
              <strong>Form Expertise:</strong>
              <span className="capitalize">{program.formExpertise}</span>
            </div>
            {program.additionalGoals && program.additionalGoals.length > 0 && (
              <div className="profile-item full-width">
                <strong>Additional Goals:</strong>
                <div className="goals-tags">
                  {getAdditionalGoalsDisplay(program.additionalGoals).map((goal, index) => (
                    <span key={index} className="goal-tag">{goal}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Training Schedule */}
        <div className="training-schedule card">
          <h2>📅 Training Schedule</h2>
          <div className="schedule-info">
            <h3>{program.generatedProgram.schedule}</h3>
            <div className="days-container">
              <div className="workout-days">
                <h4>💪 Workout Days</h4>
                <ul>
                  {program.generatedProgram.workoutDays.map((day, index) => (
                    <li key={index} className="workout-day">{day}</li>
                  ))}
                </ul>
              </div>
              <div className="rest-days">
                <h4>😴 Rest Days</h4>
                <ul>
                  {program.generatedProgram.restDays.map((day, index) => (
                    <li key={index} className="rest-day">{day}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Training Parameters */}
        <div className="training-parameters card">
          <h2>🎯 Training Parameters</h2>
          <div className="parameters-grid">
            <div className="parameter-item">
              <div className="parameter-icon">🔢</div>
              <div className="parameter-content">
                <h4>Rep Range</h4>
                <p>{program.generatedProgram.repRange}</p>
              </div>
            </div>
            <div className="parameter-item">
              <div className="parameter-icon">📊</div>
              <div className="parameter-content">
                <h4>Sets</h4>
                <p>{program.generatedProgram.setRange}</p>
              </div>
            </div>
            <div className="parameter-item">
              <div className="parameter-icon">⏱️</div>
              <div className="parameter-content">
                <h4>Rest Periods</h4>
                <p>{program.generatedProgram.restPeriods}</p>
              </div>
            </div>
            <div className="parameter-item">
              <div className="parameter-icon">📈</div>
              <div className="parameter-content">
                <h4>Progression</h4>
                <p>{program.generatedProgram.progression}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="recommendations card">
          <h2>💡 Personalized Recommendations</h2>
          <div className="recommendations-list">
            {program.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-icon">✓</div>
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => window.print()} 
            className="print-button"
          >
            🖨️ Print Program
          </button>
          <button 
            onClick={() => navigate('/training-program')} 
            className="new-program-button"
          >
            📝 Create New Program
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="home-button"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgramDisplay; 