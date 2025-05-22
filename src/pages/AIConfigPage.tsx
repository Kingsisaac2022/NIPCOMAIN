import React, { useState } from 'react';
import { MessageSquare, Save, Key } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Header from '../components/Header';
import ChatService from '../services/ChatService';
import BottomNav from '../components/BottomNav';

const AIConfigPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [prefilledQuestions, setPrefilledQuestions] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (apiKey) {
      ChatService.getInstance().setApiKey(apiKey);
    }
    
    localStorage.setItem('chatCustomInstructions', customInstructions);
    localStorage.setItem('chatPrefilledQuestions', prefilledQuestions);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="AI Assistant Configuration" showBack />
      
      <main className="page-container fade-in py-12">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Chat Configuration</h2>
              <p className="text-text-secondary">Configure the AI assistant behavior</p>
            </div>
          </div>

          <div className="space-y-6">
            <InputField
              label="OpenAI API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              icon={<Key size={20} />}
            />

            <div>
              <label className="label">Custom Instructions</label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Enter custom instructions for the AI assistant..."
                className="input-field min-h-[100px]"
              />
              <p className="text-sm text-text-secondary mt-1">
                These instructions will guide how the AI responds to user queries.
              </p>
            </div>

            <div>
              <label className="label">Prefilled Questions</label>
              <textarea
                value={prefilledQuestions}
                onChange={(e) => setPrefilledQuestions(e.target.value)}
                placeholder="Enter common questions (one per line)..."
                className="input-field min-h-[100px]"
              />
              <p className="text-sm text-text-secondary mt-1">
                Add frequently asked questions that users can quickly select.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-700">
              {saveSuccess && (
                <p className="text-success mr-4 self-center">Settings saved successfully!</p>
              )}
              <Button
                onClick={handleSave}
                variant="primary"
                icon={<Save size={20} />}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AIConfigPage;