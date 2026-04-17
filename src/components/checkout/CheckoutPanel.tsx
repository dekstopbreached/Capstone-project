import { useCallback, useState } from 'react';
import { buildCheckoutPayload, postCheckoutStart } from '../../lib/api';
import type { ShippingFormValues } from '../../lib/schemas/checkout';
import { useCart } from '../../context/CartContext';
import { ShippingStepForm } from './ShippingStepForm';
import { VerifyStepForm } from './VerifyStepForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Check, Info } from 'lucide-react';

type Props = {
  onOrderComplete: () => void;
  onServerSubtotal?: (subtotalCents: number) => void;
};

export function CheckoutPanel({ onOrderComplete, onServerSubtotal }: Props) {
  const { lines } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingFormValues | null>(null);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);

  const handleShippingSubmit = useCallback(
    async (values: ShippingFormValues) => {
      setStartError(null);
      if (lines.length === 0) {
        setStartError('Your cart is empty.');
        return;
      }
      try {
        const payload = buildCheckoutPayload(values, lines);
        const data = await postCheckoutStart(payload);
        setShipping(values);
        setSessionId(data.sessionId);
        setDevOtp(data.devOtp ?? null);
        onServerSubtotal?.(data.subtotalCents);
        setStep(2);
        setBannerOpen(true);
      } catch (e) {
        setStartError(e instanceof Error ? e.message : 'Checkout failed');
      }
    },
    [lines, onServerSubtotal],
  );

  const handleResendOtp = useCallback((next?: string) => {
    if (next) setDevOtp(next);
    setBannerOpen(true);
  }, []);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex items-center gap-2">
        <StepDot index={1} label="Details" state={step === 1 ? 'current' : 'complete'} />
        <div
          className={`h-0.5 flex-1 rounded-full ${step > 1 ? 'bg-primary' : 'bg-border'}`}
          aria-hidden
        />
          <StepDot
            index={2}
            label="Verify"
            state={step === 2 ? 'current' : 'upcoming'}
          />
        </div>

      {step === 2 && shipping && bannerOpen && (
        <Alert
          className={`mb-10 glass preserve-3d translate-z-20 ${
            devOtp
              ? 'border-primary/20 bg-primary/5 text-foreground'
              : 'border-border bg-card/50 text-foreground'
          }`}
        >
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="flex justify-between items-start gap-4">
            <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {devOtp ? (
                <>
                  <span className="text-primary">Dev Notice:</span> your code
                  is{' '}
                  <Badge variant="outline" className="font-mono font-black border-primary/50 text-primary bg-primary/10">
                    {devOtp}
                  </Badge>
                  .
                </>
              ) : (
                <>
                  Code sent to{' '}
                  <span className="text-primary">{shipping.email}</span>.
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBannerOpen(false)}
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <ShippingStepForm
          defaultEmail={shipping?.email}
          serverError={startError}
          onSubmitted={handleShippingSubmit}
        />
      )}

      {step === 2 && sessionId && shipping && (
        <VerifyStepForm
          sessionId={sessionId}
          emailHint={shipping.email}
          onResend={handleResendOtp}
          onVerified={onOrderComplete}
        />
      )}

      {step === 2 && (
        <Button
          variant="link"
          onClick={() => {
            setStep(1);
            setSessionId(null);
            setDevOtp(null);
          }}
          className="mt-10 text-muted-foreground hover:text-foreground h-auto p-0 gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" />
          Change details
        </Button>
      )}
    </div>
  );
}

function StepDot({
  index,
  label,
  state,
}: {
  index: number;
  label: string;
  state: 'upcoming' | 'current' | 'complete';
}) {
  const circle =
    state === 'complete'
      ? 'bg-primary text-background shadow-[0_0_20px_theme("colors.primary.DEFAULT/0.3")]'
      : state === 'current'
        ? 'bg-foreground text-background shadow-xl scale-110'
        : 'bg-muted text-muted-foreground opacity-50';

  return (
    <div className="flex flex-col items-center gap-2.5 preserve-3d group">
      <span
        className={`flex size-11 items-center justify-center rounded-full text-xs font-black transition-all duration-500 translate-z-10 group-hover:translate-z-20 ${circle}`}
      >
        {state === 'complete' ? <Check className="h-5 w-5 stroke-[3]" /> : index}
      </span>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
        state === 'current' ? 'text-foreground' : state === 'complete' ? 'text-primary' : 'text-muted-foreground'
      }`}>{label}</span>
    </div>
  );
}
