import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesModule } from './spaces/spaces.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { Space } from './spaces/space.entity.js';
import { Booking } from './bookings/booking.entity.js';

@Module({
  imports: [
        TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres', 
      database: 'workspace_hub',
      entities: [Space, Booking],
      synchronize: true,
    }),
    SpacesModule,
    BookingsModule, // <-- Добавили модуль
  ],
})
export class AppModule {}