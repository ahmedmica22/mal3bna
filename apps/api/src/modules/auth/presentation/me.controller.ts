import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import type { PublicUser } from '../domain/auth.types';
import { CurrentUser, Roles } from './metadata';

import { updateMeSchema } from './schemas';

@Controller('me')
@Roles('player', 'owner', 'admin')
export class MeController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async get(@CurrentUser() user: PublicUser): Promise<PublicUser> {
    return this.authService.getMe(user.id);
  }
  @Patch()
  async patch(@CurrentUser() user: PublicUser, @Body() body: unknown): Promise<PublicUser> {
    const input = updateMeSchema.parse(body);
    return this.authService.updateMe(user.id, {
      ...(input.name === undefined ? {} : { name: input.name }),
      ...(input.phone === undefined ? {} : { phone: input.phone }),
      ...(input.language === undefined ? {} : { language: input.language }),
    });
  }
  @Delete()
  async delete(@CurrentUser() user: PublicUser): Promise<{ accepted: true }> {
    await this.authService.deleteMe(user.id);
    return { accepted: true };
  }
}
