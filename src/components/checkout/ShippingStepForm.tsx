import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  shippingSchema,
  type ShippingFormValues,
} from '../../lib/schemas/checkout';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'India',
  'Australia',
  'Other',
];

type Props = {
  defaultEmail?: string;
  serverError?: string | null;
  onSubmitted: (values: ShippingFormValues) => void | Promise<void>;
};

export function ShippingStepForm({
  defaultEmail,
  serverError,
  onSubmitted,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: '',
      email: defaultEmail ?? '',
      phone: '',
      addressLine: '',
      city: '',
      postalCode: '',
      country: countries[0] ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmitted(values);
      })}
      className="space-y-4"
      noValidate
    >
      {serverError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {serverError}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Full name
          </label>
          <input
            {...register('fullName')}
            autoComplete="name"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Address
          </label>
          <input
            {...register('addressLine')}
            autoComplete="street-address"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.addressLine && (
            <p className="mt-1 text-sm text-red-600">
              {errors.addressLine.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase">
            City
          </label>
          <input
            {...register('city')}
            autoComplete="address-level2"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Postal code
          </label>
          <input
            {...register('postalCode')}
            autoComplete="postal-code"
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-stone-500 uppercase">
            Country
          </label>
          <select
            {...register('country')}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-orange-500/0 transition focus:border-orange-400 focus:ring-4"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
      >
        Send verification code
      </button>
    </form>
  );
}
