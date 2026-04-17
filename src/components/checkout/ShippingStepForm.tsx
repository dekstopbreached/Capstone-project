import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  shippingSchema,
  type ShippingFormValues,
} from '../../lib/schemas/checkout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

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
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Full name
          </Label>
          <Input
            {...register('fullName')}
            autoComplete="name"
            placeholder="John Doe"
            className="h-11"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Email
          </Label>
          <Input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            className="h-11"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Phone
          </Label>
          <Input
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className="h-11"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Address
          </Label>
          <Input
            {...register('addressLine')}
            autoComplete="street-address"
            placeholder="123 Main St, Apt 4"
            className="h-11"
          />
          {errors.addressLine && (
            <p className="mt-1 text-sm text-red-600">
              {errors.addressLine.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            City
          </Label>
          <Input
            {...register('city')}
            autoComplete="address-level2"
            placeholder="New York"
            className="h-11"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Postal code
          </Label>
          <Input
            {...register('postalCode')}
            autoComplete="postal-code"
            placeholder="10001"
            className="h-11"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label className="uppercase text-[10px] font-black tracking-widest text-stone-500">
            Country
          </Label>
          <select
            {...register('country')}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-bold"
      >
        {isSubmitting ? 'Processing...' : 'Send verification code'}
      </Button>
    </form>
  );
}
