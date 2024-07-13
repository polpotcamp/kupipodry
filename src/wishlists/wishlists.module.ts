import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist,User])
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
