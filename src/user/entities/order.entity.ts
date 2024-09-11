import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Date of purchase

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}
