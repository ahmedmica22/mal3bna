import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, Roles } from '../auth/presentation/metadata';
import type { PublicUser } from '../auth/domain/auth.types';
import { NotificationsService } from './notifications.service';
@Controller('notifications')
@Roles('player', 'owner', 'admin')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}
  @Post('devices')
  @Roles('player', 'owner')
  registerDevice(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = z
      .object({
        expoToken: z
          .string()
          .max(256)
          .regex(/^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/),
        platform: z.enum(['ios', 'android']),
      })
      .strict()
      .parse(body);
    return this.notifications.registerDevice(user.id, input.expoToken, input.platform);
  }
  @Delete('devices')
  @Roles('player', 'owner')
  removeDevice(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const { expoToken } = z
      .object({ expoToken: z.string().min(1).max(256) })
      .strict()
      .parse(body);
    return this.notifications.removeDevice(user.id, expoToken);
  }
  @Get() inbox(@CurrentUser() user: PublicUser) {
    return this.notifications.inbox(user.id);
  }
  @Post(':id/read') read(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.notifications.markRead(user.id, id);
  }
  @Get('preferences') preferences(@CurrentUser() user: PublicUser) {
    return this.notifications.preferences(user.id);
  }
  @Post('preferences') preference(@CurrentUser() user: PublicUser, @Body() body: unknown) {
    const input = z
      .object({
        category: z.string().trim().min(1).max(100),
        emailEnabled: z.boolean(),
        pushEnabled: z.boolean(),
      })
      .strict()
      .parse(body);
    return this.notifications.setPreference(
      user.id,
      input.category,
      input.emailEnabled,
      input.pushEnabled,
    );
  }
}
