import { z } from 'zod';

// Common validation schemas
export const tankSchema = z.object({
  name: z.string().min(1, 'Tank name is required'),
  capacity: z.number().positive('Capacity must be greater than 0'),
  currentVolume: z.number().min(0, 'Current volume cannot be negative'),
  productType: z.enum(['PMS', 'AGO']),
  status: z.enum(['Active', 'Inactive', 'Maintenance']),
  sellingPrice: z.number().positive('Selling price must be greater than 0'),
});

export const salesSchema = z.object({
  staffId: z.number(),
  dispenserId: z.number(),
  nozzleId: z.number(),
  shift: z.enum(['Morning', 'Afternoon']),
  openingReading: z.number().min(0),
  closingReading: z.number().min(0),
  volumeSold: z.number().min(0),
  revenue: z.number().min(0),
  date: z.string(),
  time: z.string(),
});

export const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.string().min(1, 'Role is required'),
});

// Validation helper functions
export function validateTank(data: unknown) {
  return tankSchema.safeParse(data);
}

export function validateSales(data: unknown) {
  return salesSchema.safeParse(data);
}

export function validateStaff(data: unknown) {
  return staffSchema.safeParse(data);
}