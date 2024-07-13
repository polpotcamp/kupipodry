import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, owner: User) {
    return await this.wishesRepository.save({ ...createWishDto, owner });
  }
  async findMany(key: string, param: any) {
    return await this.wishesRepository.findBy({
      [key]: param,
    });
  }
  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }
  getLastWishes() {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }
  getTopWishes() {
    return this.wishesRepository.find({ order: { copied: 'DESC' }, take: 10 });
  }
  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new BadRequestException('вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new BadRequestException(
        'вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish.owner.id !== userId) {
      throw new BadRequestException('вы не можете удалить чужой подарок');
    }
    return await this.wishesRepository.remove(wish);
  }
  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOneBy({ id });
    const isAdded = (await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    }))
      ? true
      : false;
    if (isAdded) throw new BadRequestException('вы уже скопировали этот подарок ');
    wish.owner = user;
    delete wish.id;
    return await this.wishesRepository.save(wish);
  }
  async updateByRise(id: number, newRise: number) {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }
}
