import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking } from './booking.entity.js';
import { Space } from '../spaces/space.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js'; // Импортируем наш DTO

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  // Принимаем DTO вместо кучи аргументов
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { userId, spaceId, startTime, endTime } = createBookingDto;

    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new NotFoundException('Пространство не найдено');

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) throw new BadRequestException('Время окончания должно быть позже начала');

    // Проверка на пересечение броней
    const overlapping = await this.bookingRepository.findOne({
      where: {
        space: { id: spaceId },
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });

    if (overlapping) throw new BadRequestException('Этот интервал уже забронирован');

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = hours * Number(space.pricePerHour);

    const booking = this.bookingRepository.create({
      userId,
      space,
      startTime: start,
      endTime: end,
      totalPrice,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({ 
      relations: { 
        space: true 
      } 
    });
  }

  async remove(id: string): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}