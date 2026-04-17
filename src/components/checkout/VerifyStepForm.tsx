import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { postCheckoutResend, postCheckoutVerify } from '../../lib/api';
import {
  verificationCodeSchema,
  type VerificationFormValues,
} from '../../lib/schemas/checkout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  sessionId: string;
  emailHint: string;
  onVerified: () => void;
  onResend: (devOtp?: string) => void;
};

export function VerifyStepForm({
  sessionId,
  emailHint,
  onVerified,
  onResend,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: '' },
  });

  return (
    <form
      onSubmit={handleSubmit(async ({ code }) => {
        try {
          await postCheckoutVerify(sessionId, code);
          onVerified();
          reset();
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Verification failed';
          setError('code', { message });
        }
      })}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-4">
        <Label
          htmlFor="otp"
          className="uppercase text-[10px] font-black tracking-[0.3em] text-muted-foreground"
        >
          6-digit verification code
        </Label>
        <Input
          id="otp"
          {...register('code')}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          className="h-20 text-center font-mono text-4xl tracking-[0.5em] placeholder:tracking-normal placeholder:font-sans bg-muted/20 border-border/50 focus:border-primary/50 transition-all rounded-xl shadow-inner"
        />
        {errors.code && (
          <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
        <Button
          variant="link"
          type="button"
          onClick={async () => {
            try {
              const res = await postCheckoutResend(sessionId);
              onResend(res.devOtp);
              reset({ code: '' });
            } catch (e) {
              const message = e instanceof Error ? e.message : 'Resend failed';
              setError('code', { message });
            }
          }}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-auto p-0"
        >
          Resend code
        </Button>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          Sent to <span className="text-muted-foreground/60">{emailHint}</span>
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all active:scale-95 shadow-2xl"
      >
        {isSubmitting ? 'Verifying...' : 'Finalize order'}
      </Button>
    </form>
  );
}
