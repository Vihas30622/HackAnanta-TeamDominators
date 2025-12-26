import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Shield, AlertTriangle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Category = 'bullying' | 'harassment' | 'misconduct' | 'other';

interface FormData {
  category: Category | '';
  description: string;
  location: string;
  date: string;
}

const categories: { value: Category; label: string; description: string }[] = [
  { value: 'bullying', label: 'Bullying', description: 'Verbal, physical, or cyber bullying' },
  { value: 'harassment', label: 'Harassment', description: 'Sexual or any form of harassment' },
  { value: 'misconduct', label: 'Misconduct', description: 'Faculty or staff misconduct' },
  { value: 'other', label: 'Other', description: 'Any other grievance' },
];

const GrievancePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    description: '',
    location: '',
    date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!formData.category || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ category: '', description: '', location: '', date: '' });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-success mx-auto flex items-center justify-center mb-6"
          >
            <Check className="w-10 h-10 text-success-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Your anonymous report has been sent to the concerned authorities. They will take appropriate action.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Report Grievance</h1>
            <p className="text-sm text-muted-foreground">Anonymous & Confidential</p>
          </div>
        </div>
      </header>

      {/* Privacy Notice */}
      <div className="px-4 mb-6">
        <div className="glass-card p-4 bg-secondary/10 border-secondary/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Your Identity is Protected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This report is completely anonymous. No personal information will be shared with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 space-y-6">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Category <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                className={`p-3 rounded-xl text-left transition-all ${
                  formData.category === cat.value
                    ? 'bg-secondary/20 border-2 border-secondary'
                    : 'bg-card border-2 border-transparent'
                }`}
              >
                <h4 className="font-medium text-foreground text-sm">{cat.label}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the incident in detail. Include what happened, who was involved (use titles/roles instead of names), and any witnesses."
            className="w-full bg-card rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50 min-h-[150px] resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Location (Optional)
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Where did this happen?"
            className="w-full bg-card rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Date of Incident (Optional)
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full bg-card rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>

        {/* Warning */}
        <div className="glass-card p-4 bg-warning/10 border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              False reports are taken seriously and may result in disciplinary action. Please ensure your report is truthful.
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.category || !formData.description}
          className="w-full h-12 gradient-primary text-base font-semibold"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Submitting...
            </div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GrievancePage;
