import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Brain, Save, GraduationCap, Plus, Trash2, Sparkles, Check } from 'lucide-react';

export default function Settings() {
  const { automations, updateBrandGuidelines } = useContext(AppContext);
  const [brandGuidelines, setBrandGuidelines] = useState(automations.customInstructions);
  
  // Custom training items
  const [bannedWord, setBannedWord] = useState('');
  const [bannedWordsList, setBannedWordsList] = useState(automations.bannedWords || ['cheap', 'perfect', 'no problem']);

  const [fewShotReview, setFewShotReview] = useState('');
  const [fewShotReply, setFewShotReply] = useState('');
  const [trainedExamples, setTrainedExamples] = useState([
    {
      id: 1,
      review: "The coffee was alright but they took 15 minutes to serve me my morning croissant.",
      reply: "Dear Customer, thank you for your feedback. We are pleased you enjoyed our coffee, but we sincerely apologize for the 15-minute wait for your croissant. Efficiency is key to our customer experience, and we have addressed this delay with our bakery squad. We hope to serve you again soon to demonstrate our standard."
    }
  ]);

  const handleSaveBrandVoice = () => {
    updateBrandGuidelines(brandGuidelines);
  };

  const handleAddBannedWord = () => {
    if (!bannedWord.trim()) return;
    setBannedWordsList([...bannedWordsList, bannedWord.trim().toLowerCase()]);
    setBannedWord('');
  };

  const handleRemoveBannedWord = (word) => {
    setBannedWordsList(bannedWordsList.filter(w => w !== word));
  };

  const handleAddTrainedExample = () => {
    if (!fewShotReview.trim() || !fewShotReply.trim()) return;
    setTrainedExamples([
      ...trainedExamples,
      {
        id: Date.now(),
        review: fewShotReview.trim(),
        reply: fewShotReply.trim()
      }
    ]);
    setFewShotReview('');
    setFewShotReply('');
  };

  const handleRemoveTrainedExample = (id) => {
    setTrainedExamples(trainedExamples.filter(t => t.id !== id));
  };

  return (
    <div className="settings-page animate-fade-in">
      <Header title="AI Training & Brand Voice" />

      <div className="settings-cards-grid">
        
        {/* Card 1: Brand voice guidelines */}
        <div className="settings-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <Brain className="glow-brand-icon" size={22} />
            <div>
              <h3>AI Brand Voice Guidelines</h3>
              <p>Train the AI model on your unique brand vocabulary, style guidelines, and service values</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="form-control-item">
              <label>Custom Brand & Style Guidelines Instructions:</label>
              <p className="field-explanation">Input detailed instructions detailing how you want customer replies formulated. E.g. business history, value propositions, key services, and character restrictions.</p>
              <textarea 
                className="training-textarea"
                value={brandGuidelines}
                onChange={(e) => setBrandGuidelines(e.target.value)}
                placeholder="Example: We are Broadway Boutique, a luxury fashion house in New York. Always address customers by name. Refer to fabrics as elite quality. Never use slang terms or casual greetings like 'Hey'..."
              />
            </div>

            <div className="form-footer-action-panel">
              <button className="save-settings-btn" onClick={handleSaveBrandVoice}>
                <Save size={16} />
                <span>Update Guidelines & Retrain AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Banned words configuration */}
        <div className="settings-main-card glass-panel">
          <div className="card-top-header">
            <GraduationCap className="glow-brand-icon" size={22} />
            <div>
              <h3>Banned Words Filter</h3>
              <p>Prevent AI from generating words or sensitive vocabulary that conflicts with brand standards</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="banned-words-input-group">
              <input 
                type="text" 
                placeholder="Enter word to restrict..." 
                value={bannedWord}
                onChange={(e) => setBannedWord(e.target.value)}
              />
              <button className="add-banned-word-btn" onClick={handleAddBannedWord}>
                <Plus size={16} />
              </button>
            </div>

            <div className="banned-words-tags-display">
              {bannedWordsList.map((word, i) => (
                <span key={i} className="banned-word-tag">
                  <span>{word}</span>
                  <button className="remove-word-btn" onClick={() => handleRemoveBannedWord(word)}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Example training (Few-shot prompting) */}
        <div className="settings-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <Sparkles className="glow-brand-icon" size={22} />
            <div>
              <h3>Interactive Response Examples Training</h3>
              <p>Teach the AI by example! Provide sample reviews and your ideal replies to perfectly tailor its output style.</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="few-shot-training-form">
              <div className="input-group">
                <label>Sample Customer Review:</label>
                <textarea 
                  className="few-shot-textarea"
                  value={fewShotReview}
                  onChange={(e) => setFewShotReview(e.target.value)}
                  placeholder="Enter a typical customer review..."
                />
              </div>

              <div className="input-group">
                <label>Your Ideal Response:</label>
                <textarea 
                  className="few-shot-textarea"
                  value={fewShotReply}
                  onChange={(e) => setFewShotReply(e.target.value)}
                  placeholder="Enter the perfect template response you want the AI to learn from..."
                />
              </div>

              <button className="submit-training-example-btn" onClick={handleAddTrainedExample}>
                <Plus size={16} />
                <span>Save Example and Train Models</span>
              </button>
            </div>

            {/* List of current training logs */}
            <div className="trained-examples-display-list">
              <h4 className="list-title">Active Response Templates ({trainedExamples.length})</h4>
              
              {trainedExamples.map(item => (
                <div key={item.id} className="trained-example-row">
                  <div className="example-block-left">
                    <div className="ex-sub-bubble review-bubble">
                      <span className="bubble-type">Review</span>
                      <p>"{item.review}"</p>
                    </div>
                    <div className="ex-sub-bubble reply-bubble">
                      <span className="bubble-type bubble-ai">Target AI Response</span>
                      <p>"{item.reply}"</p>
                    </div>
                  </div>
                  <button className="delete-example-btn" onClick={() => handleRemoveTrainedExample(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
