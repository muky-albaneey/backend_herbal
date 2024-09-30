import { Entity, OneToOne, Column, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  state: string;  // Store the URL of the uploaded file

  @Column()
  country: string;  // Store the file extensionCity

  @Column()
  streetName: string;  // Store the file extension

  @Column()
  email: string;  // Store the file extension

  @Column()
  City: string; 

   // Add the One-to-One relationship with User
  @OneToOne(() => User, (user) => user.address)
  @JoinColumn()
  user: User;  // One-to-One relationship with User

  @OneToOne(() => Product)
      @JoinColumn()
      product: Product;  // One-to-One relationship with Product
}
