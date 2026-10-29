import { mobileCoreSchemas, mobileCorePaths } from './mobile-core-contract';
import { mobileContractSchemas, mobileContractPaths } from './mobile-contract';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { healthResponseSchema } from '@court-booking/shared';
import {
  cityResponseSchema,
  areaResponseSchema,
  courtResponseSchema,
  venueResponseSchema,
  quoteResponseSchema,
  availabilityResponseSchema,
} from '../modules/venues/presentation/response-schemas';
import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  mobileRefreshSchema,
  registerSchema,
  resetSchema,
  tokenSchema,
  updateMeSchema,
  publicUserResponseSchema,
  authResponseSchema,
  acceptedResponseSchema,
} from '../modules/auth/presentation/schemas';
import { adminBookingsResponseSchema } from '../modules/admin/presentation/schemas';
import {
  fakePaymentInputSchema,
  fakePaymentResponseSchema,
} from '../modules/bookings/presentation/fake-payment.schemas';

type JsonSchema = Record<string, unknown>;
const convertSchema = zodToJsonSchema as unknown as (
  schema: z.ZodTypeAny,
  name: string,
) => JsonSchema;
const toJsonSchema = (schema: z.ZodTypeAny, name: string): JsonSchema => {
  const document = convertSchema(schema, name);
  const definitions = document.definitions as Record<string, JsonSchema>;
  const result = definitions[name];
  if (!result) throw new Error(`Missing schema definition: ${name}`);
  return JSON.parse(
    JSON.stringify(result).replaceAll('#/definitions/', '#/components/schemas/'),
  ) as JsonSchema;
};

const schemas = {
  ...Object.fromEntries(
    Object.entries({...mobileContractSchemas,...mobileCoreSchemas}).map(([name, schema]) => [
      name,
      toJsonSchema(schema, name),
    ]),
  ),
  HealthResponse: toJsonSchema(healthResponseSchema, 'HealthResponse'),
  RegisterInput: toJsonSchema(registerSchema, 'RegisterInput'),
  LoginInput: toJsonSchema(loginSchema, 'LoginInput'),
  EmailInput: toJsonSchema(emailSchema, 'EmailInput'),
  TokenInput: toJsonSchema(tokenSchema, 'TokenInput'),
  MobileRefreshInput: toJsonSchema(mobileRefreshSchema, 'MobileRefreshInput'),
  ResetPasswordInput: toJsonSchema(resetSchema, 'ResetPasswordInput'),
  ChangePasswordInput: toJsonSchema(changePasswordSchema, 'ChangePasswordInput'),
  UpdateMeInput: toJsonSchema(updateMeSchema, 'UpdateMeInput'),
  PublicUserResponse: toJsonSchema(publicUserResponseSchema, 'PublicUserResponse'),
  AuthResponse: toJsonSchema(authResponseSchema, 'AuthResponse'),
  AcceptedResponse: toJsonSchema(acceptedResponseSchema, 'AcceptedResponse'),
  CityResponse: toJsonSchema(cityResponseSchema, 'CityResponse'),
  AreaResponse: toJsonSchema(areaResponseSchema, 'AreaResponse'),
  CourtResponse: toJsonSchema(courtResponseSchema, 'CourtResponse'),
  VenueResponse: toJsonSchema(venueResponseSchema, 'VenueResponse'),
  QuoteResponse: toJsonSchema(quoteResponseSchema, 'QuoteResponse'),
  AvailabilityResponse: toJsonSchema(availabilityResponseSchema, 'AvailabilityResponse'),
  AdminBookingsResponse: toJsonSchema(adminBookingsResponseSchema, 'AdminBookingsResponse'),
  FakePaymentInput: toJsonSchema(fakePaymentInputSchema, 'FakePaymentInput'),
  FakePaymentResponse: toJsonSchema(fakePaymentResponseSchema, 'FakePaymentResponse'),
};

const requestBody = (schema: string) => ({
  requestBody: {
    required: true,
    content: { 'application/json': { schema: { $ref: `#/components/schemas/${schema}` } } },
  },
});
const response = (schema: string, status = '201') => ({
  [status]: {
    description: 'Success',
    content: { 'application/json': { schema: { $ref: `#/components/schemas/${schema}` } } },
  },
});
const accepted = response('AcceptedResponse');
const authenticated = [{ bearerAuth: [] }];
const queryParameter = (name: string, required = false) => ({
  name,
  in: 'query',
  required,
  schema: { type: 'string' },
});
const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
};
const listResponse = (schema: string) => ({
  '200': {
    description: 'Current array response; cursor pagination remains pending',
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: `#/components/schemas/${schema}` } },
      },
    },
  },
});

const document = {
  openapi: '3.1.0',
  info: { title: 'Court Booking Platform API', version: '0.1.0' },
  servers: [{ url: '/api/v1' }],
  components: {
    schemas,
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
  },
  paths: {
    ...mobileContractPaths,
    ...mobileCorePaths,
    '/player/bookings/{id}/fake-payment': {
      post: {
        operationId: 'simulateLocalPayment',
        description:
          'Development/test only. Requires the booking owner and FakeGateway. No real money is charged.',
        security: authenticated,
        parameters: [
          idParameter,
          { name: 'Idempotency-Key', in: 'header', required: true, schema: { type: 'string' } },
        ],
        ...requestBody('FakePaymentInput'),
        responses: response('FakePaymentResponse'),
      },
    },
    '/public/cities': {
      get: { operationId: 'listCities', responses: listResponse('CityResponse') },
    },
    '/public/areas': {
      get: {
        operationId: 'listAreas',
        parameters: [queryParameter('cityId', true)],
        responses: listResponse('AreaResponse'),
      },
    },
    '/public/venues': {
      get: {
        operationId: 'listVenues',
        parameters: ['areaId', 'sport', 'size'].map((name) => queryParameter(name)),
        responses: listResponse('VenueResponse'),
      },
    },
    '/public/venues/{id}': {
      get: {
        operationId: 'getVenue',
        parameters: [idParameter],
        responses: response('VenueResponse', '200'),
      },
    },
    '/public/courts/{id}/quote': {
      get: {
        operationId: 'getCourtQuote',
        parameters: [idParameter, queryParameter('startsAt', true), queryParameter('hours', true)],
        responses: response('QuoteResponse', '200'),
      },
    },
    '/public/courts/{id}/availability': {
      get: {
        operationId: 'getCourtAvailability',
        parameters: [idParameter, queryParameter('date', true)],
        responses: response('AvailabilityResponse', '200'),
      },
    },
    '/health': {
      get: {
        operationId: 'health',
        responses: {
          '200': {
            description: 'Healthy',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } },
            },
          },
        },
      },
    },
    '/admin/bookings': {
      get: {
        operationId: 'listAdminBookings',
        security: authenticated,
        parameters: [queryParameter('page'), queryParameter('pageSize')],
        responses: response('AdminBookingsResponse', '200'),
      },
    },
    '/auth/register': {
      post: {
        operationId: 'register',
        ...requestBody('RegisterInput'),
        responses: response('PublicUserResponse'),
      },
    },
    '/auth/verify-email': {
      post: {
        operationId: 'verifyEmail',
        ...requestBody('TokenInput'),
        responses: response('PublicUserResponse'),
      },
    },
    '/auth/resend-verification': {
      post: {
        operationId: 'resendVerification',
        ...requestBody('EmailInput'),
        responses: accepted,
      },
    },
    '/auth/login': {
      post: {
        operationId: 'login',
        ...requestBody('LoginInput'),
        responses: response('AuthResponse'),
      },
    },
    '/auth/refresh': {
      post: {
        operationId: 'refresh',
        description:
          'Web uses the HttpOnly refresh cookie without a body. Mobile sends X-Client: mobile and a refreshToken body.',
        requestBody: { ...requestBody('MobileRefreshInput').requestBody, required: false },
        responses: response('AuthResponse'),
      },
    },
    '/auth/logout': {
      post: { operationId: 'logout', security: authenticated, responses: accepted },
    },
    '/auth/logout-all': {
      post: { operationId: 'logoutAll', security: authenticated, responses: accepted },
    },
    '/auth/forgot-password': {
      post: { operationId: 'forgotPassword', ...requestBody('EmailInput'), responses: accepted },
    },
    '/auth/reset-password': {
      post: {
        operationId: 'resetPassword',
        ...requestBody('ResetPasswordInput'),
        responses: accepted,
      },
    },
    '/auth/change-password': {
      post: {
        operationId: 'changePassword',
        security: authenticated,
        ...requestBody('ChangePasswordInput'),
        responses: accepted,
      },
    },
    '/me': {
      get: {
        operationId: 'getMe',
        security: authenticated,
        responses: response('PublicUserResponse', '200'),
      },
      patch: {
        operationId: 'patchMe',
        security: authenticated,
        ...requestBody('UpdateMeInput'),
        responses: response('PublicUserResponse', '200'),
      },
      delete: {
        operationId: 'deleteMe',
        security: authenticated,
        responses: response('AcceptedResponse', '200'),
      },
    },
  },
};
const output = resolve(process.cwd(), 'openapi/openapi.json');
mkdirSync(resolve(process.cwd(), 'openapi'), { recursive: true });
writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`Generated ${output}`);
