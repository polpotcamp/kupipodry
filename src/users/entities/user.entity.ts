import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from 'src/utils/base-entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
@Entity()
export class User extends Base {
  @Column({ length: 30, unique: true })
  username: string; // Имя пользователя, уникальное

  @Column('text', { default: 'Пока ничего не рассказал о себе' })
  about: string; // Информация о пользователе

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string; // Ссылка на аватар

  @Column({ unique: true })
  email: string; // Адрес электронной почты

  @Column()
  password: string; // Пароль
  // Определите связи с другими сущностями
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]; // Список желаемых подарков

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; // Список подарков, на которые скидывается пользователь

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]; // Список вишлистов, созданных пользователем
}
