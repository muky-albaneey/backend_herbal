import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[]; // Each order contains multiple items

  @Column({ type: 'decimal', nullable: false })
  totalAmount: number; // Total order amount (sum of item totals + delivery fee)

  @Column({ type: 'decimal', nullable: false })
  deliveryFee: number; // Delivery fee

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Date of purchase

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}
