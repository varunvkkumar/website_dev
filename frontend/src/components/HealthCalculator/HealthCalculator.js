import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../services/api';
import './HealthCalculator.css';

function HealthCalculator() {
  const { user } = useContext(AuthContext);
  const [healthData, setHealthData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: '',
    // Nutrition preferences
    dietaryPreference: '',
    foodAllergies: [],
    mealFrequency: '',
    nutritionGoal: '',
    waterIntakeGoal: '',
    // Workout preferences
    workoutTypes: [],
    fitnessLevel: '',
    workoutFrequency: '',
    workoutDuration: '',
    availableEquipment: []
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load existing health profile on component mount
  useEffect(() => {
    if (user) {
      loadHealthProfile();
    }
  }, [user]);

  const loadHealthProfile = async () => {
    try {
      const response = await axios.get('/api/health/profile');
      const profile = response.data;
      
      // Populate form with existing data
      setHealthData({
        age: profile.basicInfo.age || '',
        weight: profile.basicInfo.weight || '',
        height: profile.basicInfo.height || '',
        gender: profile.basicInfo.gender || '',
        activityLevel: profile.basicInfo.activityLevel || '',
        goal: profile.basicInfo.goal || '',
        dietaryPreference: profile.nutrition.dietaryPreference || '',
        foodAllergies: profile.nutrition.foodAllergies || [],
        mealFrequency: profile.nutrition.mealFrequency || '',
        nutritionGoal: '',
        waterIntakeGoal: '',
        workoutTypes: profile.workout.workoutTypes || [],
        fitnessLevel: profile.workout.fitnessLevel || '',
        workoutFrequency: profile.workout.workoutFrequency || '',
        workoutDuration: profile.workout.workoutDuration || '',
        availableEquipment: profile.workout.availableEquipment || []
      });
      
      // Set results if available
      if (profile.results && profile.plans) {
        setResults({
          ...profile.results,
          nutritionPlan: profile.plans.nutritionPlan,
          workoutPlan: profile.plans.workoutPlan
        });
      }
      
      setSavedProfileId(profile._id);
    } catch (error) {
      // If no profile exists, that's okay - user will create a new one
      console.log('No existing health profile found');
    }
  };

  const saveHealthProfile = async (healthResults) => {
    if (!user) return;
    
    setSuccessMessage('');
    
    try {
      const profileData = {
        basicInfo: {
          age: parseInt(healthData.age),
          weight: parseFloat(healthData.weight),
          height: parseFloat(healthData.height),
          gender: healthData.gender,
          activityLevel: healthData.activityLevel,
          goal: healthData.goal
        },
        nutrition: {
          dietaryPreference: healthData.dietaryPreference,
          foodAllergies: healthData.foodAllergies,
          mealFrequency: healthData.mealFrequency
        },
        workout: {
          fitnessLevel: healthData.fitnessLevel,
          workoutFrequency: healthData.workoutFrequency,
          workoutDuration: healthData.workoutDuration,
          workoutTypes: healthData.workoutTypes,
          availableEquipment: healthData.availableEquipment
        },
        results: {
          bmi: parseFloat(healthResults.bmi),
          bmiCategory: healthResults.bmiCategory,
          bmr: healthResults.bmr,
          tdee: healthResults.tdee,
          dailyCalories: healthResults.dailyCalories,
          protein: healthResults.protein,
          carbs: healthResults.carbs,
          fat: healthResults.fat,
          idealWeightMin: parseFloat(healthResults.idealWeightMin),
          idealWeightMax: parseFloat(healthResults.idealWeightMax),
          waterIntake: parseFloat(healthResults.waterIntake)
        },
        plans: {
          nutritionPlan: healthResults.nutritionPlan,
          workoutPlan: healthResults.workoutPlan
        }
      };

      let response;
      if (savedProfileId) {
        // Update existing profile
        response = await axios.put(`/api/health/profile/${savedProfileId}`, profileData);
      } else {
        // Create new profile
        response = await axios.post('/api/health/profile', profileData);
        setSavedProfileId(response.data.profile._id);
      }
      
      setSuccessMessage('Health profile saved successfully! 🎉');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving health profile:', error);
      setSuccessMessage('Error saving profile. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const activityLevels = {
    sedentary: { label: 'Sedentary (little/no exercise)', multiplier: 1.2 },
    light: { label: 'Light activity (light exercise 1-3 days/week)', multiplier: 1.375 },
    moderate: { label: 'Moderate activity (moderate exercise 3-5 days/week)', multiplier: 1.55 },
    active: { label: 'Active (hard exercise 6-7 days/week)', multiplier: 1.725 },
    extra: { label: 'Extra active (very hard exercise, physical job)', multiplier: 1.9 }
  };

  const goals = {
    maintain: { label: 'Maintain current weight', adjustment: 0 },
    lose: { label: 'Lose weight (0.5-1 kg/week)', adjustment: -500 },
    gain: { label: 'Gain weight (0.5-1 kg/week)', adjustment: 500 }
  };

  const dietaryPreferences = {
    none: 'No specific preference',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    keto: 'Ketogenic',
    paleo: 'Paleo',
    mediterranean: 'Mediterranean',
    lowCarb: 'Low Carb',
    highProtein: 'High Protein'
  };

  const foodAllergies = [
    'Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'
  ];

  const workoutTypes = [
    'Cardio', 'Strength Training', 'Yoga', 'Pilates', 'HIIT', 'Swimming', 'Running', 'Cycling', 'Dancing', 'Martial Arts'
  ];

  const equipmentOptions = [
    'Dumbbells', 'Resistance Bands', 'Yoga Mat', 'Treadmill', 'Stationary Bike', 'Pull-up Bar', 'Kettlebells', 'Barbell', 'No Equipment'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setHealthData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const generateNutritionPlan = (results, healthData) => {
    const { dietaryPreference } = healthData;
    const { dailyCalories, protein, carbs, fat } = results;
    
    // Generate meal suggestions based on dietary preference
    const mealSuggestions = {
      none: {
        breakfast: 'Oatmeal with berries and nuts, Greek yogurt with honey',
        lunch: 'Grilled chicken salad with quinoa and mixed vegetables',
        dinner: 'Salmon with roasted vegetables and brown rice or sweet potato',
        snacks: 'Apple with almond butter, Greek yogurt, or mixed nuts'
      },
      vegetarian: {
        breakfast: 'Avocado toast with eggs, smoothie bowl with fruits and nuts',
        lunch: 'Lentil soup with whole grain bread and mixed green salad',
        dinner: 'Vegetable stir-fry with tofu and brown rice or quinoa',
        snacks: 'Hummus with vegetables, mixed nuts, or fruit smoothie'
      },
      vegan: {
        breakfast: 'Chia pudding with fruits, oat smoothie with plant-based milk',
        lunch: 'Buddha bowl with chickpeas, tahini dressing, and quinoa',
        dinner: 'Lentil curry with quinoa and steamed vegetables',
        snacks: 'Energy balls, fresh fruit, or nuts and seeds'
      },
      keto: {
        breakfast: 'Eggs with avocado and bacon, bulletproof coffee',
        lunch: 'Cobb salad with olive oil dressing and extra cheese',
        dinner: 'Grilled steak with asparagus and butter sauce',
        snacks: 'Cheese and olives, macadamia nuts, or avocado'
      }
    };

    const selectedMeals = mealSuggestions[dietaryPreference] || mealSuggestions.none;
    
    return {
      dailyCalories,
      macros: { protein, carbs, fat },
      mealPlan: selectedMeals,
      waterGoal: results.waterIntake,
      tips: [
        'Eat protein with every meal to maintain muscle mass and keep you full',
        'Include colorful vegetables in your diet for essential vitamins and minerals',
        'Stay hydrated throughout the day - aim for at least 8 glasses of water',
        'Plan your meals in advance to avoid unhealthy food choices'
      ]
    };
  };

  const generateWorkoutPlan = (healthData) => {
    const { workoutTypes, fitnessLevel, workoutFrequency, workoutDuration } = healthData;
    
    const workoutPlans = {
      beginner: {
        cardio: '20-30 minutes of walking or light jogging at a comfortable pace',
        strength: '2-3 sets of 8-12 repetitions with light weights, focusing on form',
        flexibility: '10-15 minutes of stretching or beginner yoga poses'
      },
      intermediate: {
        cardio: '30-45 minutes of moderate intensity cardio exercises like running or cycling',
        strength: '3-4 sets of 8-12 repetitions with moderate weights, increase intensity gradually',
        flexibility: '15-20 minutes of yoga or dynamic stretching routines'
      },
      advanced: {
        cardio: '45-60 minutes of high intensity cardio including HIIT or interval training',
        strength: '4-5 sets of 6-10 repetitions with heavy weights, focus on compound movements',
        flexibility: '20-30 minutes of advanced yoga or mobility work for recovery'
      }
    };

    const selectedPlan = workoutPlans[fitnessLevel] || workoutPlans.beginner;
    
    return {
      weeklySchedule: workoutFrequency,
      sessionDuration: workoutDuration,
      exercises: selectedPlan,
      preferredTypes: workoutTypes,
      tips: [
        'Start with a proper 5-10 minute warm-up to prepare your muscles and prevent injury',
        'Focus on maintaining correct form over lifting heavy weights to avoid injury',
        'Include at least 1-2 rest days per week for muscle recovery and growth',
        'Progress gradually over time - increase weight, reps, or duration by 10% each week'
      ]
    };
  };

  const calculateHealth = async () => {
    setLoading(true);
    setSuccessMessage('');
    
    const { age, weight, height, gender, activityLevel, goal } = healthData;
    
    // Convert to numbers
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    // Calculate BMI
    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevels[activityLevel].multiplier;
    
    // Calculate daily calorie needs based on goal
    const dailyCalories = tdee + goals[goal].adjustment;
    
    // Calculate macronutrient distribution (example: 40% carbs, 30% protein, 30% fat)
    const protein = (dailyCalories * 0.30) / 4; // 4 calories per gram
    const carbs = (dailyCalories * 0.40) / 4; // 4 calories per gram
    const fat = (dailyCalories * 0.30) / 9; // 9 calories per gram
    
    // Calculate ideal weight range (BMI 18.5-24.9)
    const idealWeightMin = 18.5 * heightInMeters * heightInMeters;
    const idealWeightMax = 24.9 * heightInMeters * heightInMeters;
    
    // Calculate water intake (basic formula: 35ml per kg body weight)
    const waterIntake = weightNum * 35 / 1000; // in liters
    
    // BMI categories
    let bmiCategory = '';
    let bmiColor = '';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = '#3498db';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = '#27ae60';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = '#f39c12';
    } else {
      bmiCategory = 'Obese';
      bmiColor = '#e74c3c';
    }
    
    const calculatedResults = {
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiColor,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      idealWeightMin: idealWeightMin.toFixed(1),
      idealWeightMax: idealWeightMax.toFixed(1),
      waterIntake: waterIntake.toFixed(1)
    };
    
    // Generate personalized nutrition and workout plans
    const nutritionPlan = generateNutritionPlan(calculatedResults, healthData);
    const workoutPlan = generateWorkoutPlan(healthData);
    
    const finalResults = {
      ...calculatedResults,
      nutritionPlan,
      workoutPlan
    };
    
    // Simulate calculation delay
    setTimeout(async () => {
      setResults(finalResults);
      setLoading(false);
      
      // Auto-save the profile
      await saveHealthProfile(finalResults);
    }, 1500);
  };

  const resetForm = () => {
    setHealthData({
      age: '',
      weight: '',
      height: '',
      gender: '',
      activityLevel: '',
      goal: '',
      dietaryPreference: '',
      foodAllergies: [],
      mealFrequency: '',
      nutritionGoal: '',
      waterIntakeGoal: '',
      workoutTypes: [],
      fitnessLevel: '',
      workoutFrequency: '',
      workoutDuration: '',
      availableEquipment: []
    });
    setResults(null);
    setSavedProfileId(null);
    setSuccessMessage('');
  };

  const isFormValid = () => {
    return healthData.age && healthData.weight && healthData.height && 
           healthData.gender && healthData.activityLevel && healthData.goal &&
           healthData.dietaryPreference && healthData.fitnessLevel &&
           healthData.workoutFrequency && healthData.workoutDuration;
  };

  return (
    <div className="health-calculator">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="calculator-card">
              <h2 className="calculator-title">Personal Health Calculator</h2>
              {user && (
                <div className="welcome-message">
                  <p>Welcome, {user.displayName || user.email}!</p>
                  {savedProfileId && (
                    <p className="text-muted">💾 Your health profile is automatically saved</p>
                  )}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success text-center" role="alert">
                  {successMessage}
                </div>
              )}
              
              <form className="health-form">
                {/* Basic Information */}
                <div className="form-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Age (years)</label>
                        <input
                          type="number"
                          className="calculator-input"
                          name="age"
                          value={healthData.age}
                          onChange={handleInputChange}
                          placeholder="Enter your age"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Weight (kg)</label>
                        <input
                          type="number"
                          className="calculator-input"
                          name="weight"
                          value={healthData.weight}
                          onChange={handleInputChange}
                          placeholder="Enter your weight"
                          min="1"
                          max="300"
                          step="0.1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Height (cm)</label>
                        <input
                          type="number"
                          className="calculator-input"
                          name="height"
                          value={healthData.height}
                          onChange={handleInputChange}
                          placeholder="Enter your height"
                          min="50"
                          max="250"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Gender</label>
                        <select
                          className="calculator-input"
                          name="gender"
                          value={healthData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Activity Level</label>
                        <select
                          className="calculator-input"
                          name="activityLevel"
                          value={healthData.activityLevel}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select activity level</option>
                          {Object.entries(activityLevels).map(([key, level]) => (
                            <option key={key} value={key}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Health Goal</label>
                        <select
                          className="calculator-input"
                          name="goal"
                          value={healthData.goal}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select your goal</option>
                          {Object.entries(goals).map(([key, goal]) => (
                            <option key={key} value={key}>{goal.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Section */}
                <div className="form-section">
                  <h3 className="section-title">Nutrition Preferences</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Dietary Preference</label>
                        <select
                          className="calculator-input"
                          name="dietaryPreference"
                          value={healthData.dietaryPreference}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select dietary preference</option>
                          {Object.entries(dietaryPreferences).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Meal Frequency</label>
                        <select
                          className="calculator-input"
                          name="mealFrequency"
                          value={healthData.mealFrequency}
                          onChange={handleInputChange}
                        >
                          <option value="">Select meal frequency</option>
                          <option value="3meals">3 meals per day</option>
                          <option value="4meals">4 meals per day</option>
                          <option value="5meals">5 small meals per day</option>
                          <option value="6meals">6 small meals per day</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="calculator-label">Food Allergies/Restrictions</label>
                    <div className="checkbox-group">
                      {foodAllergies.map((allergy) => (
                        <label key={allergy} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={allergy}
                            checked={healthData.foodAllergies.includes(allergy)}
                            onChange={(e) => handleCheckboxChange(e, 'foodAllergies')}
                          />
                          {allergy}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workout Section */}
                <div className="form-section">
                  <h3 className="section-title">Workout Preferences</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Fitness Level</label>
                        <select
                          className="calculator-input"
                          name="fitnessLevel"
                          value={healthData.fitnessLevel}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select fitness level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="calculator-label">Workout Frequency</label>
                        <select
                          className="calculator-input"
                          name="workoutFrequency"
                          value={healthData.workoutFrequency}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select workout frequency</option>
                          <option value="2-3times">2-3 times per week</option>
                          <option value="4-5times">4-5 times per week</option>
                          <option value="6-7times">6-7 times per week</option>
                          <option value="daily">Daily</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="calculator-label">Workout Duration per Session</label>
                    <select
                      className="calculator-input"
                      name="workoutDuration"
                      value={healthData.workoutDuration}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select workout duration</option>
                      <option value="15-30min">15-30 minutes</option>
                      <option value="30-45min">30-45 minutes</option>
                      <option value="45-60min">45-60 minutes</option>
                      <option value="60-90min">60-90 minutes</option>
                      <option value="90min+">90+ minutes</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="calculator-label">Preferred Workout Types</label>
                    <div className="checkbox-group">
                      {workoutTypes.map((type) => (
                        <label key={type} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={type}
                            checked={healthData.workoutTypes.includes(type)}
                            onChange={(e) => handleCheckboxChange(e, 'workoutTypes')}
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="calculator-label">Available Equipment</label>
                    <div className="checkbox-group">
                      {equipmentOptions.map((equipment) => (
                        <label key={equipment} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={equipment}
                            checked={healthData.availableEquipment.includes(equipment)}
                            onChange={(e) => handleCheckboxChange(e, 'availableEquipment')}
                          />
                          {equipment}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="calculator-button"
                    onClick={calculateHealth}
                    disabled={loading || !isFormValid()}
                  >
                    {loading ? 'Calculating...' : 'Calculate Health Metrics'}
                  </button>
                  <button
                    type="button"
                    className="calculator-button secondary"
                    onClick={resetForm}
                    style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}
                  >
                    Reset
                  </button>
                </div>
              </form>

              {results && (
                <div className="result-container">
                  <h3 className="result-title">Your Personalized Health Plan</h3>
                  
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Body Mass Index (BMI)</h4>
                      <div className="bmi-result">
                        <span className="bmi-value" style={{ color: results.bmiColor }}>
                          {results.bmi}
                        </span>
                        <span className="bmi-category" style={{ color: results.bmiColor }}>
                          {results.bmiCategory}
                        </span>
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Metabolism</h4>
                      <div className="result-item">
                        <strong>BMR:</strong> {results.bmr} calories/day
                      </div>
                      <div className="result-item">
                        <strong>TDEE:</strong> {results.tdee} calories/day
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Daily Calorie Goal</h4>
                      <div className="calorie-goal">
                        {results.dailyCalories} calories/day
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Macronutrient Distribution</h4>
                      <div className="result-item">
                        <strong>Protein:</strong> {results.protein}g/day
                      </div>
                      <div className="result-item">
                        <strong>Carbohydrates:</strong> {results.carbs}g/day
                      </div>
                      <div className="result-item">
                        <strong>Fat:</strong> {results.fat}g/day
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Ideal Weight Range</h4>
                      <div className="result-item">
                        {results.idealWeightMin} - {results.idealWeightMax} kg
                      </div>
                    </div>

                    <div className="result-card">
                      <h4>Daily Water Intake</h4>
                      <div className="result-item">
                        {results.waterIntake} liters/day
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Plan */}
                  <div className="nutrition-plan">
                    <h4>Personalized Nutrition Plan</h4>
                    <div className="meal-plan">
                      <div className="meal-item">
                        <strong>Breakfast:</strong>
                        <div className="meal-content">{results.nutritionPlan.mealPlan.breakfast}</div>
                      </div>
                      <div className="meal-item">
                        <strong>Lunch:</strong>
                        <div className="meal-content">{results.nutritionPlan.mealPlan.lunch}</div>
                      </div>
                      <div className="meal-item">
                        <strong>Dinner:</strong>
                        <div className="meal-content">{results.nutritionPlan.mealPlan.dinner}</div>
                      </div>
                      <div className="meal-item">
                        <strong>Snacks:</strong>
                        <div className="meal-content">{results.nutritionPlan.mealPlan.snacks}</div>
                      </div>
                    </div>
                  </div>

                  {/* Workout Plan */}
                  <div className="workout-plan">
                    <h4>Personalized Workout Plan</h4>
                    <div className="workout-details">
                      <div className="workout-item">
                        <strong>Frequency:</strong>
                        <div className="workout-content">{results.workoutPlan.weeklySchedule}</div>
                      </div>
                      <div className="workout-item">
                        <strong>Duration:</strong>
                        <div className="workout-content">{results.workoutPlan.sessionDuration}</div>
                      </div>
                      <div className="workout-item">
                        <strong>Cardio:</strong>
                        <div className="workout-content">{results.workoutPlan.exercises.cardio}</div>
                      </div>
                      <div className="workout-item">
                        <strong>Strength:</strong>
                        <div className="workout-content">{results.workoutPlan.exercises.strength}</div>
                      </div>
                      <div className="workout-item">
                        <strong>Flexibility:</strong>
                        <div className="workout-content">{results.workoutPlan.exercises.flexibility}</div>
                      </div>
                    </div>
                  </div>

                  <div className="health-tips">
                    <h4>Health Tips</h4>
                    <div className="tips-grid">
                      <div className="tips-section">
                        <h5>Nutrition Tips</h5>
                        <ul>
                          {results.nutritionPlan.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="tips-section">
                        <h5>Workout Tips</h5>
                        <ul>
                          {results.workoutPlan.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCalculator;
