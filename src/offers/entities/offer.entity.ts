import { Base } from 'src/utils/base-entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
@Entity()
export class Offer extends Base {
  @ManyToOne(() => User, (user) => user.offers)
  user: User; // Ссылка на пользователя, желающего скинуться

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; // Ссылка на товар

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Сумма заявки

  @Column({ default: false })
  hidden: boolean; // Флаг, определяющий показ информации о скидывающемся
}
