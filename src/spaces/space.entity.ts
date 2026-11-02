import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity.js';

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerHour: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.space)
  bookings: Booking[];
}