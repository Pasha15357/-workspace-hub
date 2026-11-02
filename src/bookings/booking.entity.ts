import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// ❌ Удаляем импорт Space, если он больше нигде в этом файле не используется:
// import { Space } from '../spaces/space.entity.js';
import type { Space } from '../spaces/space.entity.js'; // Используем только как TypeScript-тип

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  // 👇 Передаем название сущности строкой 'Space' вместо прямой ссылки на класс
  @ManyToOne('Space', (space: Space) => space.bookings, { onDelete: 'CASCADE' })
  space: Space;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', default: 'confirmed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}