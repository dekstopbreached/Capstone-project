import { z } from 'zod';

export const shippingSchema = z.object({
  fullName: z.string().min(2, 'Add your full name'),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .min(10, 'Include area code')
    .regex(/^[\d\s+\-().]+$/, 'Invalid phone format'),
  addressLine: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;

export const cartLineInputSchema = z.object({
  productId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(99),
});

export const checkoutStartBodySchema = shippingSchema.extend({
  items: z.array(cartLineInputSchema).min(1, 'Cart cannot be empty'),
});

export type CheckoutStartBody = z.infer<typeof checkoutStartBodySchema>;

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Enter all 6 digits')
    .regex(/^\d{6}$/, 'Digits only'),
});

export type VerificationFormValues = z.infer<typeof verificationCodeSchema>;

export const checkoutVerifyBodySchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
  code: verificationCodeSchema.shape.code,
});

export type CheckoutVerifyBody = z.infer<typeof checkoutVerifyBodySchema>;

export const checkoutResendBodySchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
});

export type CheckoutResendBody = z.infer<typeof checkoutResendBodySchema>;
