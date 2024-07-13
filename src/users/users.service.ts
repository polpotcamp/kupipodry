import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like } from 'typeorm';
import { HashService } from 'src/hash/hash.service';
import { ConflictException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findOne(key: string, param: any) {
    const user = await this.usersRepository.findOneBy({ [key]: param });
    return user;
  }

  async updateOne(user: User, updateUserDto: UpdateUserDto) {
    const { id } = user;
    const { email, username } = updateUserDto;
    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.getHash(
        updateUserDto.password,
      );
    }
    const isExist = (await this.usersRepository.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;

    if (isExist) {
      throw new ConflictException(
        'пользователь с таким email или username уже зарегистрирован',
      );
    }
    try {
      await this.usersRepository.update(id, updateUserDto);
      const { password, ...updUser } = await this.usersRepository.findOneBy({
        id,
      });
      return updUser;
    } catch (_) {
      throw new BadRequestException(
        'пользователь может редактировать только свой профиль',
      );
    }
  }
  async findUsersWishes(id: number) {
    const users = await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    return users;
  }
  async findMany(query: string) {
    const searchResult = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    return searchResult;
  }
  async create(dto: CreateUserDto){
    dto.password = this.hashService.getHash(dto.password);
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }
}
