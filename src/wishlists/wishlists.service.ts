import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}
  async create(dto: CreateWishlistDto, owner: User) {
    const { itemsId, ...rest } = dto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: owner.id },
    });
    return this.wishlistsRepository.save(wishList);
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: { items: true },
    });
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async update(id: number, dto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException('вы не можете редактировать чужие списки ');
    }

    const { itemsId, ...rest } = dto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...rest, items };

    await this.wishlistsRepository.update(id, updatedWishlist);
    return this.wishlistsRepository.findOne({ where: { id } });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException('вы не можете удалить чужой список');
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
