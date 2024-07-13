import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { WishesService } from 'src/wishes/wishes.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService ,
     private readonly wishesService: WishesService,) {}

  @Get('me')
  async getMe(@Req() req) {
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id,
    );
    return rest;
  }
  @Patch('me')
  update(@Req() req, @Body() body) {
    return this.usersService.updateOne(req.user, body);
  }

  @Get('me/wishes')
  async getMeWishes(@Req() req) {
    const users = await this.usersService.findUsersWishes(req.user.id);
    const wishes = users.map((user) => user.wishes);
    return wishes[0];
  }

  @Get(':username')
  getUser(@Param('username') username) {
    return this.usersService.findOne('username', username);
  }

  @Get(':username/wishes')
  getUsersWishes(@Param('username') username) {
    return this.wishesService.findMany('owner', { username });
  }

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }

}
