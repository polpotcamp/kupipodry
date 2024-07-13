import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from 'src/wishes/wishes.module';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
