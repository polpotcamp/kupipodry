import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.update(+id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user.id);
  }

  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user);
  }
}
