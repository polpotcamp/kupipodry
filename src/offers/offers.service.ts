import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto,  user: User) {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    const newRise = Number(wish.raised) + Number(createOfferDto.amount);

    if (wish.owner.id === user.id) {
      throw new BadRequestException('вы не можете поддерживать свои подарки');
    }
    if (createOfferDto.amount > wish.price) {
      throw new BadRequestException('сумма поддержки больше стоимости подарка');
    }
    await this.wishesService.updateByRise(createOfferDto.itemId, newRise);
    const offerDto = { ...createOfferDto, user: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: number) {
    return await this.offerRepository.findBy({ id });
  }

}
