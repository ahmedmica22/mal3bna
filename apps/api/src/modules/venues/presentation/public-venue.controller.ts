import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Public } from '../../auth/presentation/metadata';
import { VenueService } from '../application/venue.service';
import { PrismaOwnerOperationsService } from '../infrastructure/prisma-owner-operations.service';

@Public()
@Controller('public')
export class PublicVenueController {
  constructor(
    private readonly venues: VenueService,
    private readonly operations: PrismaOwnerOperationsService,
  ) {}
  @Get('cities') cities() {
    return this.venues.listCities();
  }
  @Get('areas') areas(@Query('cityId') cityId?: string) {
    return this.venues.listAreas(cityId);
  }
  @Get('venues') venuesList(
    @Query('areaId') areaId?: string,
    @Query('search') search?: string,
    @Query('sport') sport?: 'football' | 'padel',
    @Query('size') size?: string,
  ) {
    return this.venues.listVenues({
      ...(areaId ? { areaId } : {}),
      ...(search ? { search } : {}),
      ...(sport ? { sport } : {}),
      ...(size ? { size: Number(size) as 5 | 7 | 11 } : {}),
    });
  }
  @Get('venues/:id') async venue(@Param('id') id: string) {
    const venue = await this.venues.getVenue(id);
    if (!venue) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Venue not found' });
    return venue;
  }
  @Get('courts/:id/quote') quote(
    @Param('id') id: string,
    @Query('startsAt') startsAt: string,
    @Query('hours', ParseIntPipe) hours: number,
  ) {
    return this.venues.quote(id, new Date(startsAt), hours);
  }
  @Get('courts/:id/availability') availability(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.venues.availability(id, new Date(date));
  }
  @Get('checkin/:code')
  getCheckinInfo(@Param('code') code: string) {
    return this.operations.publicCheckIn(code);
  }
  @Post('checkin/:code')
  checkin(@Param('code') code: string) {
    return this.operations.publicCheckIn(code);
  }
}
