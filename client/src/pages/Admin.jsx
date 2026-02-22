import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Save, Trash2, Edit, X, CheckSquare, Square, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Admin = () => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [questionType, setQuestionType] = useState('SBA'); // 'SBA' or 'MTF'
  const [formData, setFormData] = useState({
    question: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    correctAnswerIndex: 0, // For SBA
    rationale: '',
    category: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (err) {
      console.error('Failed to fetch questions');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);

    try {
      const orderedIds = items.map(item => item._id);
      await axios.put('/api/questions/reorder', { orderedIds });
    } catch (err) {
      console.error('Failed to update order', err);
      // Revert on error
      fetchQuestions();
    }
  };

  const handleOptionTextChange = (index, text) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionCorrectChange = (index) => {
    if (questionType === 'MTF') {
      const newOptions = [...formData.options];
      newOptions[index] = { ...newOptions[index], isCorrect: !newOptions[index].isCorrect };
      setFormData({ ...formData, options: newOptions });
    } else {
      // SBA Logic
      setFormData({ ...formData, correctAnswerIndex: index });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Saving...' });

    // Prepare payload based on type
    const payload = {
      question: formData.question,
      rationale: formData.rationale,
      category: formData.category,
      type: questionType
    };

    if (questionType === 'SBA') {
        payload.options = formData.options.map((opt, i) => ({
            text: opt.text,
            isCorrect: i === formData.correctAnswerIndex
        }));
        payload.correctAnswer = formData.correctAnswerIndex; 
    } else {
        payload.options = formData.options;
    }

    try {
      if (editingId) {
        await axios.put(`/api/questions/${editingId}`, payload);
        setStatus({ type: 'success', message: 'Question updated successfully!' });
      } else {
        // Assign order to end of list
        payload.order = questions.length;
        await axios.post('/api/questions', payload);
        setStatus({ type: 'success', message: 'Question added successfully!' });
      }
      
      resetForm();
      fetchQuestions(); // Refresh list
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save question.' });
    }
  };

  const resetForm = () => {
    setFormData({
        question: '',
        options: Array(5).fill({ text: '', isCorrect: false }),
        correctAnswerIndex: 0,
        rationale: '',
        category: ''
      });
      setEditingId(null);
      setQuestionType('SBA');
  }

  const handleEdit = (q) => {
    const type = q.type || 'SBA';
    setQuestionType(type);
    
    // Parse options to consistent format
    let formattedOptions = [];
    let correctIndex = 0;

    if (q.options && q.options.length > 0) {
        if (typeof q.options[0] === 'string') {
            // Legacy SBA format
            formattedOptions = q.options.map((text, i) => ({
                text,
                isCorrect: i === q.correctAnswer
            }));
            correctIndex = q.correctAnswer || 0;
        } else {
            // New Object format
            formattedOptions = q.options.map(o => ({
                text: o.text,
                isCorrect: o.isCorrect
            }));
            // Find correct index for SBA visualization
            correctIndex = q.options.findIndex(o => o.isCorrect);
            if (correctIndex === -1) correctIndex = 0;
        }
    } else {
        formattedOptions = Array(5).fill({ text: '', isCorrect: false });
    }

    setFormData({
      question: q.question,
      options: formattedOptions,
      correctAnswerIndex: correctIndex,
      rationale: q.rationale,
      category: q.category
    });
    setEditingId(q._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus({ type: '', message: '' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setStatus({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`/api/questions/${id}`);
        fetchQuestions();
        setStatus({ type: 'success', message: 'Question deleted successfully!' });
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to delete question.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <Edit className="text-blue-600" /> : <Plus className="text-blue-600" />}
              {editingId ? `Edit ${questionType} Question` : 'Add New Question'}
            </h1>
            {editingId && (
              <button 
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Type Selector */}
            {!editingId && (
                <div className="flex gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setQuestionType('SBA')}
                        className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-all ${
                            questionType === 'SBA' 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Single Best Answer (SBA)
                    </button>
                    <button
                        type="button"
                        onClick={() => setQuestionType('MTF')}
                        className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-all ${
                            questionType === 'MTF' 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Multiple True/False (MTF)
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Respiratory"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Stem</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Enter the clinical scenario or question..."
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {questionType === 'SBA' ? 'Options (Select correct answer)' : 'Options (Select True statements)'}
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-mono text-sm text-gray-600 shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  
                  {questionType === 'SBA' ? (
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswerIndex === index}
                        onChange={() => handleOptionCorrectChange(index)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title="Mark as correct answer"
                      />
                  ) : (
                      <button
                        type="button"
                        onClick={() => handleOptionCorrectChange(index)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          option.isCorrect 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {option.isCorrect ? <CheckSquare size={18} /> : <Square size={18} />}
                        {option.isCorrect ? 'True' : 'False'}
                      </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rationale</label>
              <textarea
                value={formData.rationale}
                onChange={(e) => setFormData({...formData, rationale: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Explain the answers..."
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              {status.message && (
                <div className={`text-sm px-3 py-1 rounded ${
                  status.type === 'success' ? 'bg-green-100 text-green-700' : 
                  status.type === 'error' ? 'bg-red-100 text-red-700' : 'text-gray-500'
                }`}>
                  {status.message}
                </div>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-auto shadow-md"
              >
                <Save size={18} />
                {editingId ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Manage Questions ({questions.length})</h2>
            <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder questions</p>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-100"
                >
                  {questions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No questions added yet.
                    </div>
                  ) : (
                    questions.map((q, index) => {
                        const isSBA = !q.type || q.type === 'SBA';
                        const typeLabel = isSBA ? 'SBA' : 'MTF';
                        const typeColor = isSBA ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';

                        // Count true statements or find correct answer
                        let answerSummary = '';
                        if (q.options && q.options.length > 0) {
                            if (isSBA) {
                                let correctIdx = -1;
                                if (typeof q.correctAnswer === 'number') correctIdx = q.correctAnswer;
                                else correctIdx = q.options.findIndex(o => o.isCorrect);
                                
                                if (correctIdx !== -1 && q.options[correctIdx]) {
                                    answerSummary = `Answer: ${String.fromCharCode(65 + correctIdx)}`;
                                }
                            } else {
                                const trueCount = q.options.filter(o => o.isCorrect).length;
                                answerSummary = `${trueCount} True statements`;
                            }
                        }

                        return (
                          <Draggable key={q._id} draggableId={q._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="p-4 hover:bg-gray-50 transition-colors group flex items-start gap-4 bg-white"
                              >
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mt-2 text-gray-400 cursor-grab hover:text-gray-600"
                                >
                                  <GripVertical size={20} />
                                </div>

                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                      {q.category}
                                    </span>
                                    <span className={`${typeColor} text-xs font-medium px-2 py-0.5 rounded`}>
                                      {typeLabel}
                                    </span>
                                  </div>
                                  <p className="font-medium text-gray-900 line-clamp-2">{q.question}</p>
                                  <div className="text-sm text-gray-500">
                                     {answerSummary}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(q)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(q._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                    })
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Admin;