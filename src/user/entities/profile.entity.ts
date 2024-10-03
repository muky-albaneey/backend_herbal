// /* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { AbstractFileEntity } from './abstract.entity';


// @Entity()
// export class ProfileImage extends AbstractFileEntity<ProfileImage> {
    
// }

@Entity()
export class ProfileImage  {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    url: string;  // Store the URL of the uploaded file
  
    @Column()
    ext: string;  // Store the file extension
  
}
