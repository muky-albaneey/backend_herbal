/* eslint-disable prettier/prettier */
import {PrimaryGeneratedColumn, Column } from 'typeorm';


export class AbstractFileEntity<T> {

    @PrimaryGeneratedColumn("uuid")
    id: number;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;
  
    @Column({ type: 'varchar',  nullable: true })
    base64: string;
  
    @Column({ nullable: true, type: 'bytea' })
    content: Buffer;
  
    @Column({ type: 'varchar', length: 10, nullable: true })
    ext: string;


    constructor(entity : Partial<T>){
        Object.assign(this, entity)
    }
}