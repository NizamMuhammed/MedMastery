const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const mongoose = require('mongoose');

// In-memory store for fallback
let memoryQuestions = [
  {
    _id: '1',
    question: 'Regarding the management of acute asthma:',
    options: [
      { text: 'Salbutamol is a beta-blocker', isCorrect: false },
      { text: 'Oxygen should be titrated to maintain saturation 94-98%', isCorrect: true },
      { text: 'Oral prednisolone is indicated in all acute attacks', isCorrect: true },
      { text: 'Magnesium sulfate is the first-line treatment', isCorrect: false },
      { text: 'Peak flow measurement is useful for severity assessment', isCorrect: true }
    ],
    rationale: 'Salbutamol is a beta-agonist. Oxygen targets are 94-98%. Steroids are key. Magnesium is for severe/life-threatening cases not responding to initial therapy.',
    category: 'Respiratory',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:00:00')
  },
  // SBA Questions
  {
    _id: '2',
    question: 'A 65-year-old man presents with crushing chest pain radiating to the left arm. ECG shows ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?',
    options: [
      { text: 'Left Anterior Descending (LAD)', isCorrect: false },
      { text: 'Right Coronary Artery (RCA)', isCorrect: true },
      { text: 'Left Circumflex (LCx)', isCorrect: false },
      { text: 'Left Main Stem', isCorrect: false },
      { text: 'Posterior Descending Artery', isCorrect: false }
    ],
    rationale: 'ST elevation in inferior leads (II, III, aVF) indicates an inferior MI, most commonly caused by RCA occlusion.',
    category: 'Cardiology',
    type: 'SBA',
    createdAt: new Date('2024-01-01T10:05:00')
  },
  {
    _id: '3',
    question: 'Which of the following is the first-line treatment for Type 2 Diabetes Mellitus in an overweight patient with normal renal function?',
    options: [
      { text: 'Gliclazide', isCorrect: false },
      { text: 'Insulin', isCorrect: false },
      { text: 'Metformin', isCorrect: true },
      { text: 'Pioglitazone', isCorrect: false },
      { text: 'Sitagliptin', isCorrect: false }
    ],
    rationale: 'Metformin is the first-line pharmacological therapy for T2DM, especially in overweight patients, provided eGFR is >30.',
    category: 'Endocrinology',
    type: 'SBA',
    createdAt: new Date('2024-01-01T10:10:00')
  },
  {
    _id: '4',
    question: 'A 25-year-old female presents with a "curtain coming down" over her vision. Fundoscopy reveals a grey, elevated retina. What is the most likely diagnosis?',
    options: [
      { text: 'Central Retinal Artery Occlusion', isCorrect: false },
      { text: 'Retinal Detachment', isCorrect: true },
      { text: 'Vitreous Haemorrhage', isCorrect: false },
      { text: 'Acute Angle Closure Glaucoma', isCorrect: false },
      { text: 'Optic Neuritis', isCorrect: false }
    ],
    rationale: 'The description of a "curtain" and elevated grey retina is classic for Retinal Detachment.',
    category: 'Ophthalmology',
    type: 'SBA',
    createdAt: new Date('2024-01-01T10:15:00')
  },
  {
    _id: '5',
    question: 'Which organism is the most common cause of Community Acquired Pneumonia?',
    options: [
      { text: 'Staphylococcus aureus', isCorrect: false },
      { text: 'Haemophilus influenzae', isCorrect: false },
      { text: 'Mycoplasma pneumoniae', isCorrect: false },
      { text: 'Streptococcus pneumoniae', isCorrect: true },
      { text: 'Legionella pneumophila', isCorrect: false }
    ],
    rationale: 'Streptococcus pneumoniae remains the most common cause of CAP worldwide.',
    category: 'Respiratory',
    type: 'SBA',
    createdAt: new Date('2024-01-01T10:20:00')
  },
  {
    _id: '6',
    question: 'A 30-year-old woman presents with weight loss, heat intolerance, and palpitations. TSH is <0.01 mU/L and fT4 is elevated. TSH receptor antibodies are positive. What is the diagnosis?',
    options: [
      { text: 'Toxic Multinodular Goitre', isCorrect: false },
      { text: 'Graves\' Disease', isCorrect: true },
      { text: 'Hashimoto\'s Thyroiditis', isCorrect: false },
      { text: 'De Quervain\'s Thyroiditis', isCorrect: false },
      { text: 'Exogenous Thyroxine intake', isCorrect: false }
    ],
    rationale: 'Positive TSH receptor antibodies (TRAb) are pathognomonic for Graves\' Disease.',
    category: 'Endocrinology',
    type: 'SBA',
    createdAt: new Date('2024-01-01T10:25:00')
  },
  // MTF Questions
  {
    _id: '7',
    question: 'Regarding Hyperkalemia:',
    options: [
      { text: 'Peaked T waves are an early ECG sign', isCorrect: true },
      { text: 'Calcium gluconate lowers serum potassium levels', isCorrect: false },
      { text: 'Insulin/Dextrose shifts potassium into cells', isCorrect: true },
      { text: 'Salbutamol nebs can be used as temporizing measure', isCorrect: true },
      { text: 'Ramipril is a recognized cause', isCorrect: true }
    ],
    rationale: 'Calcium gluconate stabilizes the myocardium but does not lower K+. Insulin/Dextrose and Salbutamol shift K+ into cells. ACE inhibitors cause hyperkalemia.',
    category: 'Renal/Metabolic',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:30:00')
  },
  {
    _id: '8',
    question: 'Concerning Coeliac Disease:',
    options: [
      { text: 'It is T-cell mediated autoimmune disorder', isCorrect: true },
      { text: 'Dermatitis Herpetiformis is an extra-intestinal manifestation', isCorrect: true },
      { text: 'Anti-TTG antibodies are sensitive and specific', isCorrect: true },
      { text: 'Patients must avoid oats initially', isCorrect: true },
      { text: 'Villous atrophy is seen on biopsy', isCorrect: true }
    ],
    rationale: 'All statements are true. Coeliac is autoimmune, associated with DH, diagnosed with Anti-TTG and biopsy showing villous atrophy.',
    category: 'Gastroenterology',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:35:00')
  },
  {
    _id: '9',
    question: 'Regarding Atrial Fibrillation (AF):',
    options: [
      { text: 'It is characterized by "saw-tooth" waves on ECG', isCorrect: false },
      { text: 'Irregularly irregular pulse is a clinical sign', isCorrect: true },
      { text: 'Beta-blockers are used for rate control', isCorrect: true },
      { text: 'CHA2DS2-VASc score assesses bleeding risk', isCorrect: false },
      { text: 'Valvular AF requires warfarin (or equivalent)', isCorrect: true }
    ],
    rationale: 'Saw-tooth waves are Atrial Flutter. CHA2DS2-VASc is for stroke risk; HAS-BLED is for bleeding risk.',
    category: 'Cardiology',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:40:00')
  },
  {
    _id: '10',
    question: 'Features of Parkinson\'s Disease include:',
    options: [
      { text: 'Bradykinesia', isCorrect: true },
      { text: 'Intention tremor', isCorrect: false },
      { text: 'Lead-pipe rigidity', isCorrect: true },
      { text: 'Postural instability', isCorrect: true },
      { text: 'Micrographia', isCorrect: true }
    ],
    rationale: 'Tremor in Parkinson\'s is typically a resting "pill-rolling" tremor, not intention tremor (which suggests cerebellar disease).',
    category: 'Neurology',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:45:00')
  },
  {
    _id: '11',
    question: 'Regarding Vitamin B12 Deficiency:',
    options: [
      { text: 'Causes microcytic anaemia', isCorrect: false },
      { text: 'Can cause subacute combined degeneration of the cord', isCorrect: true },
      { text: 'Metformin long-term use is a risk factor', isCorrect: true },
      { text: 'Parietal cell antibodies are associated with Pernicious Anaemia', isCorrect: true },
      { text: 'Glossitis is a clinical feature', isCorrect: true }
    ],
    rationale: 'B12 deficiency causes MACROcytic anaemia. All other statements are correct.',
    category: 'Haematology',
    type: 'MTF',
    createdAt: new Date('2024-01-01T10:50:00')
  }
];
let idCounter = 12;

const isDBConnected = () => mongoose.connection.readyState === 1;

// Get all questions
router.get('/', async (req, res) => {
  if (isDBConnected()) {
    try {
      const questions = await Question.find().sort({ order: 1, createdAt: -1 });
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    console.log('Serving from memory store');
    res.json(memoryQuestions.sort((a, b) => (a.order || 0) - (b.order || 0) || b.createdAt - a.createdAt));
  }
});

// Update order
router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body;

  if (isDBConnected()) {
    try {
      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { order: index }
        }
      }));
      await Question.bulkWrite(bulkOps);
      res.json({ message: 'Order updated' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    orderedIds.forEach((id, index) => {
      const q = memoryQuestions.find(q => q._id === id);
      if (q) q.order = index;
    });
    res.json({ message: 'Order updated in memory' });
  }
});

// Add a question
router.post('/', async (req, res) => {
  const { question, options, rationale, category, type } = req.body;
  
  if (isDBConnected()) {
    const newQuestion = new Question({
      question,
      options, // Expecting [{ text, isCorrect }]
      rationale,
      category,
      type: type || 'SBA'
    });

    try {
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const newQuestion = {
      _id: String(idCounter++),
      question,
      options,
      rationale,
      category,
      type: type || 'SBA',
      createdAt: new Date()
    };
    memoryQuestions.push(newQuestion);
    res.status(201).json(newQuestion);
  }
});

// Update a question
router.put('/:id', async (req, res) => {
  const { question, options, rationale, category, type } = req.body;
  
  if (isDBConnected()) {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        { question, options, rationale, category, type },
        { new: true }
      );
      res.json(updatedQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const index = memoryQuestions.findIndex(q => q._id === req.params.id);
    if (index !== -1) {
      memoryQuestions[index] = {
        ...memoryQuestions[index],
        question,
        options,
        rationale,
        category,
        type: type || memoryQuestions[index].type
      };
      res.json(memoryQuestions[index]);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
    if (isDBConnected()) {
        try {
            await Question.findByIdAndDelete(req.params.id);
            res.json({ message: 'Question deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        memoryQuestions = memoryQuestions.filter(q => q._id !== req.params.id);
        res.json({ message: 'Question deleted from memory' });
    }
});

module.exports = router;