const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  // Basic Information
  basicInfo: {
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
      max: 300
    },
    height: {
      type: Number,
      required: true,
      min: 50,
      max: 250
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female']
    },
    activityLevel: {
      type: String,
      required: true,
      enum: ['sedentary', 'light', 'moderate', 'active', 'extra']
    },
    goal: {
      type: String,
      required: true,
      enum: ['maintain', 'lose', 'gain']
    }
  },
  // Nutrition Preferences
  nutrition: {
    dietaryPreference: {
      type: String,
      required: true,
      enum: ['none', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'lowCarb', 'highProtein']
    },
    foodAllergies: [{
      type: String,
      enum: ['Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame']
    }],
    mealFrequency: {
      type: String,
      enum: ['3meals', '4meals', '5meals', '6meals']
    }
  },
  // Workout Preferences
  workout: {
    fitnessLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    workoutFrequency: {
      type: String,
      required: true,
      enum: ['2-3times', '4-5times', '6-7times', 'daily']
    },
    workoutDuration: {
      type: String,
      required: true,
      enum: ['15-30min', '30-45min', '45-60min', '60-90min', '90min+']
    },
    workoutTypes: [{
      type: String,
      enum: ['Cardio', 'Strength Training', 'Yoga', 'Pilates', 'HIIT', 'Swimming', 'Running', 'Cycling', 'Dancing', 'Martial Arts']
    }],
    availableEquipment: [{
      type: String,
      enum: ['Dumbbells', 'Resistance Bands', 'Yoga Mat', 'Treadmill', 'Stationary Bike', 'Pull-up Bar', 'Kettlebells', 'Barbell', 'No Equipment']
    }]
  },
  // Calculated Results
  results: {
    bmi: Number,
    bmiCategory: String,
    bmr: Number,
    tdee: Number,
    dailyCalories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    idealWeightMin: Number,
    idealWeightMax: Number,
    waterIntake: Number
  },
  // Generated Plans
  plans: {
    nutritionPlan: {
      mealPlan: {
        breakfast: String,
        lunch: String,
        dinner: String,
        snacks: String
      },
      tips: [String]
    },
    workoutPlan: {
      weeklySchedule: String,
      sessionDuration: String,
      exercises: {
        cardio: String,
        strength: String,
        flexibility: String
      },
      tips: [String]
    }
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Create index for faster queries
healthProfileSchema.index({ userId: 1, createdAt: -1 });

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

module.exports = HealthProfile; 