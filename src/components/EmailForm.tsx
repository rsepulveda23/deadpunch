
import { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';

const EmailForm = () => {
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
        source: 'homepage',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        setIsSuccess(true);
        if (result.duplicate) {
          toast({ title: "Already on the list.", description: "We've got you. Stay tuned." });
        } else {
          toast({ title: "You're in.", description: "Welcome to early access." });
        }
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
        }, 2500);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('[HomePage] Email submission error:', error);
      setErrorMsg('Failed to submit email');
      toast({
        title: "Something broke.",
        description: "Couldn't save your email. Try again in a sec.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="notify" className="relative py-24 md:py-36 bg-deadpunch-dark overflow-hidden">
      <div className="absolute inset-0 bg-radial-spot pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-deadpunch-red/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-10 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14 animate-reveal">
            <div className="flex justify-center mb-6">
              <span className="section-label">CHAPTER · 03 / EARLY ACCESS</span>
            </div>
            <h2 className="text-display text-5xl md:text-7xl leading-[0.95] text-deadpunch-bone mb-6">
              First in line.<br />
              <span className="text-deadpunch-red">First on the table.</span>
            </h2>
            <p className="text-deadpunch-gray-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Drop your email. Get first looks at every drop, every tournament,
              every tool. No filler. Unsubscribe anytime.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="animate-reveal delay-200 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="your.email@anywhere.com"
                  className="input-field h-14"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  required
                />
                <span className="absolute left-3 -top-2 px-2 bg-deadpunch-dark text-mono text-[9px] tracking-[0.2em] text-deadpunch-red">
                  EMAIL · REQUIRED
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`btn-primary h-14 px-8 min-w-[180px] ${isSuccess ? 'pointer-events-none' : ''}`}
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
            </div>

            {errorMsg && (
              <div className="mt-4 flex items-center justify-center gap-2 text-mono text-[11px] tracking-[0.2em] text-red-400">
                <AlertTriangle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <p className="mt-6 text-center text-mono text-[10px] tracking-[0.25em] text-deadpunch-gray-light/60">
              ENCRYPTED · NO SPAM · UNSUBSCRIBE ANYTIME
            </p>
          </form>

          {/* Stat strip under form */}
          <div className="mt-16 md:mt-20 grid grid-cols-3 gap-px bg-deadpunch-gray-dark border border-deadpunch-gray-dark animate-reveal delay-300">
            {[
              { v: '4', k: 'DROPS / YEAR' },
              { v: '0', k: 'FILLER PIECES' },
              { v: '1', k: 'MISSION' },
            ].map((s) => (
              <div key={s.k} className="bg-deadpunch-dark px-4 py-8 text-center">
                <div className="font-display text-4xl md:text-5xl text-deadpunch-bone leading-none">{s.v}</div>
                <div className="mt-3 text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
