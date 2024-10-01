// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { Order } from './order.entity';

// @Entity()
// export class CartItem {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   name: string;

//   @Column()
//   price: number;

//   @Column()
//   quantity: number;

//   @ManyToOne(() => Order, (order) => order.items)
//   order: Order;
// }
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items, { nullable: false })
  order: Order;
}
