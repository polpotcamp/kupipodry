import { Entity, Column, OneToMany, ManyToOne} from 'typeorm';
import { IsUrl } from 'class-validator';
import { Base } from 'src/utils/base-entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
@Entity()
export class Wish extends Base {
  @Column({ length: 250 })
  name: string; // Название подарка

  @Column()
  link: string; // Ссылка на интернет-магазин

  @Column()
  @IsUrl()
  image: string; // Ссылка на изображение подарка

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Стоимость подарка

  @Column('decimal', { precision: 10, scale: 2 })
  raised: number; // Сумма предварительного сбора

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User; // Ссылка на пользователя, который добавил пожелание подарка

  @Column('text')
  description: string; // Описание подарка

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; // Массив ссылок на заявки скинуться от других пользователей

  @Column('int')
  copied: number; // Счётчик тех, кто скопировал подарок себе
}
