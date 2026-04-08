import { useCallback, useId, useState } from 'react';
import { buildCheckoutPayload, postCheckoutStart } from '../../lib/api';
import type { ShippingFormValues } from '../../lib/schemas/checkout';
import { useCart } from '../../context/CartContext';
import { ShippingStepForm } from './ShippingStepForm';
import { VerifyStepForm } from './VerifyStepForm';

type Props = {
  onOrderComplete: () => void;
  onServerSubtotal?: (subtotalCents: number) => void;
};

export function CheckoutPanel({ onOrderComplete, onServerSubtotal }: Props) {
  const { lines } = useCart();
  const bannerId = useId();
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
          className={`h-px flex-1 rounded ${step > 1 ? 'bg-orange-500' : 'bg-stone-200'}`}
          aria-hidden
        />
        <StepDot
          index={2}
          label="Verify"
          state={step === 2 ? 'current' : 'upcoming'}
        />
      </div>

      {step === 2 && shipping && bannerOpen && (
        <div
          role="status"
          aria-labelledby={bannerId}
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            devOtp
              ? 'border-orange-200 bg-orange-50 text-orange-950'
              : 'border-stone-200 bg-stone-50 text-stone-800'
          }`}
        >
          <div className="flex justify-between gap-2">
            <p id={bannerId}>
              {devOtp ? (
                <>
                  <span className="font-semibold">Development:</span> your code
                  is{' '}
                  <span className="font-mono font-bold tracking-wide">
                    {devOtp}
                  </span>
                  . In production the API would not return this; use SMS or
                  email.
                </>
              ) : (
                <>
                  Enter the 6-digit code sent to{' '}
                  <span className="font-medium">{shipping.email}</span>.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setBannerOpen(false)}
              className={`shrink-0 ${devOtp ? 'text-orange-800/70 hover:text-orange-900' : 'text-stone-500 hover:text-stone-800'}`}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
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
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setSessionId(null);
            setDevOtp(null);
          }}
          className="mt-6 text-sm font-medium text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
        >
          ← Edit shipping details
        </button>
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
      ? 'bg-orange-600 text-white'
      : state === 'current'
        ? 'bg-stone-900 text-white'
        : 'bg-stone-200 text-stone-500';

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${circle}`}
      >
        {state === 'complete' ? '✓' : index}
      </span>
      <span className="text-xs font-medium text-stone-500">{label}</span>
    </div>
  );
}
