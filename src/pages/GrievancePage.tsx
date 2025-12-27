import React, { useState } from 'react';
import { ArrowLeft, Send, ShieldAlert, UserX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const GrievancePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General',
    'Harassment',
    'Bullying',
    'Infrastructure',
    'Academic',
    'Discrimination',
    'Safety'
  ];

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe your grievance.');
      return;
    }

    if (!db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'grievances'), {
        userId: isAnonymous ? 'ANONYMOUS' : user?.id,
        userName: isAnonymous ? 'Anonymous Student' : user?.name,
        userEmail: isAnonymous ? 'hidden' : user?.email,
        category,
        description,
        isAnonymous,
        status: 'pending', // pending, resolved, dismissed
        createdAt: serverTimestamp(),
      });

      toast.success('Grievance submitted successfully.', {
        description: isAnonymous ? 'Your identity is hidden.' : 'Admins will review this shortly.'
      });
      navigate('/more');
    } catch (error) {
      console.error('Error submitting grievance:', error);
      toast.error('Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Link to="/more" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Grievance Redressal</h1>
            <p className="text-sm text-muted-foreground">Report issues safely</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">

        {/* Info Card */}
        <div className="glass-card p-4 flex gap-3 border-l-4 border-l-primary">
          <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Safe & Secure Reporting</p>
            <p className="text-muted-foreground mt-1">
              Your concerns are taken seriously. You can report harassing, bullying, or any other issues directly to the administration.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${category === cat
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              className="w-full h-32 bg-card rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/50 resize-none border border-border"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAnonymous ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}>
              <UserX className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">Report Anonymously</p>
              <p className="text-xs text-muted-foreground">Your name and email will be hidden</p>
            </div>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-secondary' : 'bg-muted'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isAnonymous ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold gradient-sos shadow-lg shadow-red-500/20"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Report
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            In case of immediate danger, please use the SOS button on the Home screen.
          </p>

        </div>
      </main>
    </div>
  );
};

export default GrievancePage;
