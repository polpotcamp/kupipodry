import { Entity, Column, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import { Base } from 'src/utils/base-entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
@Entity()
export class Wishlist extends Base {
  @Column({ length: 250 })
  name: string; // Название списка

  @Column( { length: 1500 })
  description: string; // Описание подборки

  @Column()
  image: string; // Обложка для подборки
  @ManyToOne(() => User)
  owner: User;
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[]; // Набор ссылок на подарки
}
