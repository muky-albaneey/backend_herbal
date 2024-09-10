import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { nullable: false })
  order: Order;

  @Column({ type: 'varchar', nullable: false })
  productName: string; // Store product name

  @Column({ type: 'decimal', nullable: false })
  price: number; // Product price

  @Column({ type: 'int', nullable: false })
  quantity: number; // Quantity purchased

  @Column({ type: 'decimal', nullable: false })
  total: number; // Total price for this item (price * quantity)

  constructor(orderItem: Partial<OrderItem>) {
    Object.assign(this, orderItem);
  }
}
