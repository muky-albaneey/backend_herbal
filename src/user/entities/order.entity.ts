
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { Address } from './address.entity';

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

//   @ManyToOne(() => Address, { nullable: true }) // Add the address relationship
//   @JoinColumn()
//   address: Address; // Address for delivery

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date; // Date of purchase

//   constructor(order: Partial<Order>) {
//     Object.assign(this, order);
//   }
// }
import { Exclude } from 'class-transformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { cascade: true })
  @Exclude() // Exclude to prevent circular reference
  items: CartItem[];

  @Column({ type: 'decimal', nullable: false })
  totalAmount: number;

  @Column({ type: 'decimal', nullable: false })
  deliveryFee: number;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn()
  address: Address;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(order?: Partial<Order>) {
    Object.assign(this, order);
  }
}


