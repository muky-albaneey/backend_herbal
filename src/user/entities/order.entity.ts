// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from './user.entity';
// import { CartItem } from './cart-item.entity';



// @Entity()
// export class Order {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => User, (user) => user.orders, { nullable: false })
//   @JoinColumn()
//   user: User;

//   @Column({ type: 'json', nullable: false })
//   items: CartItem[]; // Store the cart items as JSON

//   @Column({ type: 'decimal', nullable: false })
//   totalAmount: number; // Total order amount

//   @Column({ type: 'decimal', nullable: false })
//   deliveryFee: number; // Delivery fee

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date; // Date of purchase

//   constructor(order: Partial<Order>) {
//     Object.assign(this, order);
//   }
// }
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { Address } from './address.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({ type: 'json', nullable: false })
  items: CartItem[]; // Store the cart items as JSON

  @Column({ type: 'decimal', nullable: false })
  totalAmount: number; // Total order amount

  @Column({ type: 'decimal', nullable: false })
  deliveryFee: number; // Delivery fee

  @ManyToOne(() => Address, { nullable: true }) // Add the address relationship
  @JoinColumn()
  address: Address; // Address for delivery

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Date of purchase

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}
