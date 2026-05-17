
import { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';

interface NotifyDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NotifyDialog = ({ trigger, open, onOpenChange }: NotifyDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const formattedEmail = formatEmail(email);
    if (!formattedEmail || !validateEmailFormat(formattedEmail)) {
      setErrorMsg("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveEmailSubscription(formattedEmail, {
        source: 'dialog',
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
          setEmail('');
          setIsSuccess(false);
          if (onOpenChange) onOpenChange(false);
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('[Dialog] Email submission error:', error);
      setErrorMsg('Failed to submit email');
      toast({
        title: "Something broke.",
        description: "Couldn't save your email. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[460px] bg-deadpunch-dark border border-deadpunch-gray-dark rounded-none p-0 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark">
        <span className="text-mono text-[10px] tracking-[0.25em] text-deadpunch-red">
          DEADPUNCH / EARLY ACCESS
        </span>
        <span className="flex items-center gap-1.5 text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light">
          <span className="w-1.5 h-1.5 rounded-full bg-deadpunch-red animate-ticker-flash" />
          LIVE
        </span>
      </div>

      <div className="p-8">
        <h3 className="text-display text-3xl text-deadpunch-bone leading-tight mb-2">
          Get on the list.
        </h3>
        <p className="text-deadpunch-gray-light text-sm leading-relaxed mb-6">
          Early access to drops, tournaments, and tools. No spam.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              placeholder="your.email@anywhere.com"
              className="input-field h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
      </div>
    </DialogContent>
  );

  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {dialogContent}
    </Dialog>
  );
};

export default NotifyDialog;
