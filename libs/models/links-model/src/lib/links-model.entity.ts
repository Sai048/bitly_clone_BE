import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;  

  @Column({ unique: true })
  shortUrl: string;   

  @Column()
  longUrl: string;    

  @Column({ default: 0 })
  clicks: number;     

  @Column({ type: 'timestamptz', nullable: true })
  lastClicked: Date | null;   

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
