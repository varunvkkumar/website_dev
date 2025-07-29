const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to training programs data file
const TRAINING_PROGRAMS_FILE = path.join(__dirname, '../data/trainingPrograms.json');

// Helper function to read training programs
const readTrainingPrograms = () => {
  if (!fs.existsSync(TRAINING_PROGRAMS_FILE)) {
    fs.writeFileSync(TRAINING_PROGRAMS_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(TRAINING_PROGRAMS_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write training programs
const writeTrainingPrograms = (programs) => {
  fs.writeFileSync(TRAINING_PROGRAMS_FILE, JSON.stringify(programs, null, 2), 'utf8');
};

// Generate training program based on user inputs
const generateTrainingProgram = (formData) => {
  const { goalType, timeAvailability, trainingExperience, formExpertise, additionalGoals } = formData;
  
  let program = {
    id: Date.now().toString(),
    ...formData,
    generatedProgram: {},
    recommendations: []
  };

  // Base program structure based on time availability
  switch (timeAvailability) {
    case '3-times':
      program.generatedProgram = {
        schedule: 'Full Body - 3 days per week',
        workoutDays: ['Monday', 'Wednesday', 'Friday'],
        restDays: ['Tuesday', 'Thursday', 'Saturday', 'Sunday']
      };
      break;
    case '4-times':
      program.generatedProgram = {
        schedule: 'Upper/Lower Split - 4 days per week',
        workoutDays: ['Monday (Upper)', 'Tuesday (Lower)', 'Thursday (Upper)', 'Friday (Lower)'],
        restDays: ['Wednesday', 'Saturday', 'Sunday']
      };
      break;
    case '6-days':
      program.generatedProgram = {
        schedule: 'Push/Pull/Legs - 6 days per week',
        workoutDays: ['Monday (Push)', 'Tuesday (Pull)', 'Wednesday (Legs)', 'Thursday (Push)', 'Friday (Pull)', 'Saturday (Legs)'],
        restDays: ['Sunday']
      };
      break;
  }

  // Adjust based on goal type
  if (goalType === 'strength') {
    program.generatedProgram.repRange = '1-5 reps';
    program.generatedProgram.setRange = '3-5 sets';
    program.generatedProgram.restPeriods = '3-5 minutes between sets';
    program.recommendations.push('Focus on compound movements: Squat, Deadlift, Bench Press, Overhead Press');
    program.recommendations.push('Progressive overload is key - increase weight gradually');
  } else if (goalType === 'muscle-size') {
    program.generatedProgram.repRange = '6-12 reps';
    program.generatedProgram.setRange = '3-4 sets';
    program.generatedProgram.restPeriods = '60-90 seconds between sets';
    program.recommendations.push('Mix compound and isolation exercises');
    program.recommendations.push('Focus on time under tension and muscle contraction');
  }

  // Adjust based on experience level
  switch (trainingExperience) {
    case 'beginner':
      program.recommendations.push('Start with bodyweight and light weights');
      program.recommendations.push('Focus on learning proper form before increasing intensity');
      program.generatedProgram.progression = 'Increase weight by 2.5-5 lbs per week';
      break;
    case 'intermediate':
      program.recommendations.push('Incorporate periodization into your training');
      program.recommendations.push('Track your workouts and progress consistently');
      program.generatedProgram.progression = 'Use weekly periodization with varied intensities';
      break;
    case 'advanced':
      program.recommendations.push('Consider advanced techniques like drop sets, supersets');
      program.recommendations.push('Implement advanced periodization strategies');
      program.generatedProgram.progression = 'Use block periodization with specific phases';
      break;
  }

  // Adjust based on form expertise
  switch (formExpertise) {
    case 'beginner':
      program.recommendations.push('Consider working with a qualified trainer initially');
      program.recommendations.push('Start with machines and progress to free weights');
      break;
    case 'intermediate':
      program.recommendations.push('Continue refining technique with challenging weights');
      program.recommendations.push('Record yourself performing lifts to check form');
      break;
    case 'advanced':
      program.recommendations.push('Help others with their form and technique');
      program.recommendations.push('Experiment with advanced movement variations');
      break;
  }

  // Add specific exercise recommendations based on additional goals
  if (additionalGoals.includes('deadlift')) {
    program.recommendations.push('Deadlift: Start with Romanian deadlifts to learn hip hinge pattern');
    program.recommendations.push('Practice deadlift setup: feet hip-width, bar over mid-foot');
  }
  
  if (additionalGoals.includes('squat')) {
    program.recommendations.push('Squat: Work on ankle and hip mobility');
    program.recommendations.push('Practice bodyweight squats and goblet squats first');
  }
  
  if (additionalGoals.includes('bench-press')) {
    program.recommendations.push('Bench Press: Focus on proper setup - shoulder blade retraction');
    program.recommendations.push('Start with push-ups to build foundational strength');
  }
  
  if (additionalGoals.includes('olympic-weightlifting')) {
    program.recommendations.push('Olympic Lifting: Requires extensive technique work - consider specialized coaching');
    program.recommendations.push('Start with mobility work and basic positions before adding weight');
  }

  return program;
};

// GET /api/training-program - Get all training programs
router.get('/', (req, res) => {
  try {
    const programs = readTrainingPrograms();
    res.json(programs);
  } catch (error) {
    console.error('Error reading training programs:', error);
    res.status(500).json({ message: 'Failed to retrieve training programs' });
  }
});

// POST /api/training-program - Submit new training program form
router.post('/', (req, res) => {
  try {
    const { goalType, timeAvailability, trainingExperience, formExpertise, additionalGoals, timestamp } = req.body;

    // Validate required fields
    if (!goalType || !timeAvailability || !trainingExperience || !formExpertise) {
      return res.status(400).json({ 
        message: 'All required fields must be filled: goalType, timeAvailability, trainingExperience, formExpertise' 
      });
    }

    // Validate enum values
    const validGoalTypes = ['strength', 'muscle-size'];
    const validTimeAvailability = ['3-times', '4-times', '6-days'];
    const validExperience = ['beginner', 'intermediate', 'advanced'];
    const validExpertise = ['beginner', 'intermediate', 'advanced'];
    const validAdditionalGoals = ['deadlift', 'squat', 'bench-press', 'olympic-weightlifting'];

    if (!validGoalTypes.includes(goalType)) {
      return res.status(400).json({ message: 'Invalid goal type' });
    }

    if (!validTimeAvailability.includes(timeAvailability)) {
      return res.status(400).json({ message: 'Invalid time availability' });
    }

    if (!validExperience.includes(trainingExperience)) {
      return res.status(400).json({ message: 'Invalid training experience' });
    }

    if (!validExpertise.includes(formExpertise)) {
      return res.status(400).json({ message: 'Invalid form expertise' });
    }

    // Validate additional goals if provided
    if (additionalGoals && Array.isArray(additionalGoals)) {
      const invalidGoals = additionalGoals.filter(goal => !validAdditionalGoals.includes(goal));
      if (invalidGoals.length > 0) {
        return res.status(400).json({ message: `Invalid additional goals: ${invalidGoals.join(', ')}` });
      }
    }

    // Generate personalized training program
    const trainingProgram = generateTrainingProgram(req.body);
    
    // Read existing programs and add new one
    const programs = readTrainingPrograms();
    programs.push(trainingProgram);
    
    // Write back to file
    writeTrainingPrograms(programs);
    
    res.status(201).json({
      message: 'Training program created successfully',
      program: trainingProgram
    });

  } catch (error) {
    console.error('Error creating training program:', error);
    res.status(500).json({ message: 'Failed to create training program' });
  }
});

// GET /api/training-program/:id - Get specific training program
router.get('/:id', (req, res) => {
  try {
    const programs = readTrainingPrograms();
    const program = programs.find(p => p.id === req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    
    res.json(program);
  } catch (error) {
    console.error('Error reading training program:', error);
    res.status(500).json({ message: 'Failed to retrieve training program' });
  }
});

module.exports = router; 