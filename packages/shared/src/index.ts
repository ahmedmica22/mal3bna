import { z } from 'zod';

export const roleSchema = z.enum(['player', 'owner', 'admin']);
export type Role = z.infer<typeof roleSchema>;
export const languageSchema = z.enum(['en', 'ar']);
export type Language = z.infer<typeof languageSchema>;
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  requestId: z.string().uuid(),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const designTokens = {
  colors: {
    ink: '#102a2b',
    surface: '#f4f7f5',
    turf: '#28785a',
    lime: '#baf35e',
    coral: '#ef8f6d',
    muted: '#61726d',
    danger: '#a12b2b',
    success: '#17663e',
  },
  radii: { control: 10, card: 16, feature: 32 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, section: 48 },
} as const;
