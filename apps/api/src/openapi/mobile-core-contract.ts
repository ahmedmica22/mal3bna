import { z } from 'zod';
import { createSchema } from '../modules/bookings/presentation/booking.controller';
import { profileSchema } from '../modules/trust/trust.controller';
import { manualSchema,blockSchema,ownerProfileSchema } from '../modules/venues/presentation/owner-operations.controller';
import { venueSchema,updateVenueSchema,courtSchema,photosSchema,hoursSchema,pricesSchema } from '../modules/venues/presentation/owner-venue.controller';
const id=z.string().uuid();const date=z.string().datetime();const money=z.number().int();
const profile=z.object({userId:id,photoFileId:id.nullable(),photoUrl:z.string().nullable(),preferredFoot:z.string().nullable(),playingStyle:z.string().nullable(),position1:z.string().nullable(),position2:z.string().nullable(),areaId:id.nullable(),padelSide:z.string().nullable(),padelHand:z.string().nullable(),padelLevel:z.string().nullable()});
export const mobileCoreSchemas={
 CreateBookingInput:createSchema,PlayerProfileInput:profileSchema,PlayerProfileResponse:profile,
 OwnerManualInput:manualSchema,OwnerBlockInput:blockSchema,OwnerProfileInput:ownerProfileSchema,
 OwnerVenueInput:venueSchema,OwnerVenueUpdateInput:updateVenueSchema,OwnerCourtInput:courtSchema,OwnerPhotosInput:photosSchema,OwnerHoursInput:hoursSchema,OwnerPricesInput:pricesSchema,
 MobileBookingSummary:z.object({id,bookingCode:z.string(),courtId:id,venueId:id,courtName:z.string(),venueName:z.string(),venueAddress:z.string(),sport:z.enum(['football','padel']),size:z.number().nullable(),startsAt:date,endsAt:date,status:z.string(),holdExpiresAt:date.nullable(),totalPiastres:money,depositPiastres:money,paidPiastres:money,dueAtVenuePiastres:money,paymentOption:z.enum(['deposit','full']).nullable(),isTestPayment:z.boolean(),review:z.object({id,rating:z.number(),comment:z.string().nullable()}).nullable(),dispute:z.object({id,status:z.string()}).nullable()}),
 ReservationResponse:z.object({id,bookingCode:z.string(),courtId:id,venueId:id,playerId:id,startsAt:date,endsAt:date,status:z.string(),holdExpiresAt:date,totalPiastres:money,depositPiastres:money,paidPiastres:money,paymentOption:z.enum(['deposit','full'])}),
 CancellationPreview:z.object({reservationId:id,startsAt:date,refundPiastres:money,retainedPiastres:money,commissionPiastres:money,reason:z.string()}),
 OwnerMoney:z.object({availablePiastres:money,pendingPiastres:money,releasedPiastres:money,cashCollectedPiastres:money,todayCashCollectedPiastres:money,totalEarnedPiastres:money}),
 OwnerProfileResponse:z.object({userId:id,name:z.string(),email:z.string().email(),phone:z.string().nullable(),photoUrl:z.string().nullable(),photoFileId:id.nullable()}),
};
const auth=[{bearerAuth:[]}];const param=(name:string)=>({name,in:'path',required:true,schema:{type:'string',format:'uuid'}});
const operation=(operationId:string,schema?:string,array=false,parameters:unknown[]=[],input?:string,post=false)=>({operationId,security:auth,parameters,...(input?{requestBody:{required:true,content:{'application/json':{schema:{$ref:`#/components/schemas/${input}`}}}}}:{}),responses:{[post?'201':'200']:{description:'Success',...(schema?{content:{'application/json':{schema:array?{type:'array',items:{$ref:`#/components/schemas/${schema}`}}:{$ref:`#/components/schemas/${schema}`}}}}:{})}}});
const key={name:'Idempotency-Key',in:'header',required:true,schema:{type:'string'}};
export const mobileCorePaths={
 '/player/profile':{get:{...operation('getPlayerProfile','PlayerProfileResponse'),responses:{'200':{description:'Profile, or null before one is saved',content:{'application/json':{schema:{anyOf:[{$ref:'#/components/schemas/PlayerProfileResponse'},{type:'null'}]}}}}}},patch:operation('updatePlayerProfile','PlayerProfileResponse',false,[],'PlayerProfileInput')},
 '/player/bookings':{get:operation('getPlayerBookings','MobileBookingSummary',true),post:operation('createPlayerBooking','ReservationResponse',false,[key],'CreateBookingInput',true)},
 '/player/bookings/{id}':{get:operation('getPlayerBooking','ReservationResponse',false,[param('id')])},
 '/player/bookings/{id}/cancel-preview':{get:operation('getCancellationPreview','CancellationPreview',false,[param('id')])},
 '/player/bookings/{id}/cancel':{post:operation('cancelPlayerBooking',undefined,false,[param('id'),key],undefined,true)},
 '/owner/profile':{get:operation('getOwnerProfile','OwnerProfileResponse'),patch:operation('updateOwnerProfile','OwnerProfileResponse',false,[],'OwnerProfileInput')},
 '/owner/venues/mine':{get:operation('getOwnedVenue')},
 '/owner/venues':{post:operation('registerOwnedVenue',undefined,false,[],'OwnerVenueInput',true)},
 '/owner/venues/{venueId}':{patch:operation('updateOwnedVenue',undefined,false,[param('venueId')],'OwnerVenueUpdateInput')},
 '/owner/venues/{venueId}/submit':{post:operation('submitOwnedVenue',undefined,false,[param('venueId')],undefined,true)},
 '/owner/venues/{venueId}/photos':{post:operation('uploadVenuePhotos',undefined,false,[param('venueId')],'OwnerPhotosInput',true)},
 '/owner/venues/{venueId}/courts':{post:operation('addOwnedCourt',undefined,false,[param('venueId')],'OwnerCourtInput',true)},
 '/owner/venues/{venueId}/courts/{courtId}/photos':{post:operation('uploadCourtPhotos',undefined,false,[param('venueId'),param('courtId')],'OwnerPhotosInput',true)},
 '/owner/venues/{venueId}/opening-hours':{post:operation('setOwnedOpeningHours',undefined,false,[param('venueId')],'OwnerHoursInput',true)},
 '/owner/venues/{venueId}/courts/{courtId}/price-rules':{post:operation('setOwnedPriceRules',undefined,false,[param('venueId'),param('courtId')],'OwnerPricesInput',true)},
 '/owner/bookings':{get:operation('getOwnedBookings')},
 '/owner/bookings/{id}/arrive':{post:operation('arriveOwnedBooking',undefined,false,[param('id')],undefined,true)},
 '/owner/bookings/{id}/collect':{post:operation('collectOwnedBooking',undefined,false,[param('id')],undefined,true)},
 '/owner/bookings/{id}/complete':{post:operation('completeOwnedBooking',undefined,false,[param('id')],undefined,true)},
 '/owner/bookings/{id}/cancel':{post:operation('cancelOwnedBooking',undefined,false,[param('id'),key],undefined,true)},
 '/owner/bookings/{id}/no-show':{post:operation('reportOwnedNoShow',undefined,false,[param('id')],undefined,true)},
 '/owner/manual-bookings':{post:operation('createManualBooking',undefined,false,[],'OwnerManualInput',true)},
 '/owner/blocks':{post:operation('createCourtBlock',undefined,false,[],'OwnerBlockInput',true)},
 '/owner/balance':{get:operation('getOwnerBalance','OwnerMoney')},
};
