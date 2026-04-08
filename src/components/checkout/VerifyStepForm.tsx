import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { postCheckoutResend, postCheckoutVerify } from '../../lib/api';
import {
  verificationCodeSchema,
  type VerificationFormValues,
} from '../../lib/schemas/checkout';

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
      <div>
        <label
          htmlFor="otp"
          className="block text-xs font-medium text-stone-500 uppercase"
        >
          6-digit code
        </label>
        <input
          id="otp"
          {...register('code')}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
        />
        {errors.code && (
          <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
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
          className="text-sm font-medium text-stone-600 underline-offset-2 hover:text-orange-600 hover:underline"
        >
          Resend code
        </button>
        <p className="text-xs text-stone-400">
          Sent to <span className="text-stone-600">{emailHint}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
      >
        Verify & place order
      </button>
    </form>
  );
}
