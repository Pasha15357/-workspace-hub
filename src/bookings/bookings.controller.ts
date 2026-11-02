import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { Booking } from './booking.entity.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(): Promise<Booking[]> {
    return await this.bookingsService.findAll();
  }

  @Post()
  async create(@Body() body: { userId: string; spaceId: string; startTime: string; endTime: string }): Promise<Booking> {
    return await this.bookingsService.create(body.userId, body.spaceId, new Date(body.startTime), new Date(body.endTime));
  }
}