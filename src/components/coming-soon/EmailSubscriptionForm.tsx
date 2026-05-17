
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';

interface EmailSubscriptionFormProps {
  category: string;
  subcategory: string;
  onSuccess: () => void;
}

export const EmailSubscriptionForm = ({
  category,
  subcategory,
  onSuccess
}: EmailSubscriptionFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }

    const formattedEmail = formatEmail(email);
    if (!formattedEmail || !validateEmailFormat(formattedEmail)) {
      setErrorMsg("Please enter a valid email address");
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveEmailSubscription(formattedEmail, {
        name: name.trim(),
        category,
        subcategory,
        source: 'coming_soon_page',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        setIsSuccess(true);
        if (result.duplicate) {
          toast({ title: "Already on the list.", description: "We've got you." });
        } else {
          toast({ title: "You're in.", description: "Welcome to early access." });
        }
        setTimeout(() => {
          setName('');
          setEmail('');
          setIsSuccess(false);
          onSuccess();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('[ComingSoon] Submission error:', error);
      setErrorMsg('Failed to submit subscription');
      toast({
        title: "Something broke.",
        description: "Couldn't save your details. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field h-12"
          disabled={isSubmitting || isSuccess}
          required
        />
        <span className="absolute left-3 -top-2 px-2 bg-deadpunch-dark text-mono text-[9px] tracking-[0.2em] text-deadpunch-red">
          NAME
        </span>
      </div>

      <div className="relative">
        <input
          id="email"
          type="email"
          placeholder="your.email@anywhere.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field h-12"
          disabled={isSubmitting || isSuccess}
          required
        />
        <span className="absolute left-3 -top-2 px-2 bg-deadpunch-dark text-mono text-[9px] tracking-[0.2em] text-deadpunch-red">
          EMAIL
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-mono text-[11px] tracking-[0.15em] text-red-400">
          <AlertTriangle size={12} />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className="btn-primary w-full h-12"
        style={isSuccess ? { background: '#16442F', color: '#D7FE3C', boxShadow: 'none' } : undefined}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Submitting
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle size={16} />
            You're In
          </>
        ) : (
          <>
            Notify Me
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-center text-mono text-[9px] tracking-[0.25em] text-deadpunch-gray-light/60 pt-2">
        ENCRYPTED · UNSUBSCRIBE ANYTIME
      </p>
    </form>
  );
};
