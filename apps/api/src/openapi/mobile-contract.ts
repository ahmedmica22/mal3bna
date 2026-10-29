import { z } from 'zod';
const id = z.string().uuid();
const date = z.string().datetime();
export const mobileContractSchemas = {
  DeviceRegistrationInput: z
    .object({
      expoToken: z
        .string()
        .max(256)
        .regex(/^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/),
      platform: z.enum(['ios', 'android']),
    })
    .strict(),
  DeviceRemovalInput: z.object({ expoToken: z.string().min(1).max(256) }).strict(),
  MobileNotification: z.object({
    id,
    type: z.string(),
    title: z.string(),
    body: z.string(),
    link: z.string().nullable(),
    readAt: date.nullable(),
    createdAt: date,
  }),
  NotificationPreference: z.object({
    category: z.string(),
    emailEnabled: z.boolean(),
    pushEnabled: z.boolean(),
  }),
  PlayerStrike: z.object({
    id,
    reservationId: id,
    expiresAt: date,
    removedAt: date.nullable(),
    removedReason: z.string().nullable(),
    createdAt: date,
  }),
  PlayerDispute: z.object({
    id,
    reservationId: id,
    playerMessage: z.string(),
    ownerResponse: z.string().nullable(),
    status: z.enum(['open', 'upheld', 'overturned']),
    decidedAt: date.nullable(),
    createdAt: date,
  }),
  PlayerAppeal: z.object({
    id,
    message: z.string(),
    status: z.string(),
    decidedAt: date.nullable(),
    nextAllowedAt: date.nullable(),
    createdAt: date,
  }),
  VenueReview: z.object({
    id,
    rating: z.number().int(),
    comment: z.string().nullable(),
    ownerReply: z.string().nullable(),
    ownerRepliedAt: date.nullable(),
    createdAt: date,
  }),
  ReviewInput: z
    .object({
      reservationId: id,
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(2000).optional(),
    })
    .strict(),
  DisputeInput: z
    .object({ reservationId: id, playerMessage: z.string().trim().min(1).max(2000) })
    .strict(),
  AppealInput: z.object({ message: z.string().trim().min(1).max(2000) }).strict(),
  PreferenceInput: z
    .object({
      category: z.string().min(1).max(100),
      emailEnabled: z.boolean(),
      pushEnabled: z.boolean(),
    })
    .strict(),
};
const auth = [{ bearerAuth: [] }];
const parameter = (name: string) => ({
  in: 'path',
  name,
  required: true,
  schema: { type: 'string', format: 'uuid' },
});
const read = (operationId: string, schema: string, parameters: unknown[] = []) => ({
  operationId,
  security: auth,
  parameters,
  responses: {
    '200': {
      description: 'Success',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: `#/components/schemas/${schema}` } },
        },
      },
    },
  },
});
const write = (operationId: string, schema?: string, parameters: unknown[] = []) => ({
  operationId,
  security: auth,
  parameters,
  ...(schema
    ? {
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: `#/components/schemas/${schema}` } } },
        },
      }
    : {}),
  responses: { '201': { description: 'Persisted mutation result' } },
});
export const mobileContractPaths = {
  '/notifications/devices': {
    post: write('registerDevice', 'DeviceRegistrationInput'),
    delete: {
      ...write('removeDevice', 'DeviceRemovalInput'),
      responses: { '200': { description: 'Device removed from this account' } },
    },
  },
  '/notifications': { get: read('getNotifications', 'MobileNotification') },
  '/notifications/{id}/read': { post: write('readNotification', undefined, [parameter('id')]) },
  '/notifications/preferences': {
    get: read('getNotificationPreferences', 'NotificationPreference'),
    post: write('setNotificationPreference', 'PreferenceInput'),
  },
  '/player/strikes': { get: read('getPlayerStrikes', 'PlayerStrike') },
  '/player/disputes': {
    get: read('getPlayerDisputes', 'PlayerDispute'),
    post: write('createPlayerDispute', 'DisputeInput'),
  },
  '/player/appeals': {
    get: read('getPlayerAppeals', 'PlayerAppeal'),
    post: write('createPlayerAppeal', 'AppealInput'),
  },
  '/player/reviews': { post: write('createPlayerReview', 'ReviewInput') },
  '/public/venues/{venueId}/reviews': {
    get: { ...read('getVenueReviews', 'VenueReview', [parameter('venueId')]), security: [] },
  },
};
