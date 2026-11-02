import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './space.entity.js';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  async findAll(search?: string): Promise<Space[]> {
    if (search) {
      return await this.spaceRepository.find({
        where: { name: ILike(`%${search}%`) },
      });
    }
    return await this.spaceRepository.find();
  }

  async create(data: Partial<Space>): Promise<Space> {
    const space = this.spaceRepository.create(data);
    return await this.spaceRepository.save(space);
  }

    async update(id: string, updateData: Partial<Space>): Promise<Space> {
    await this.spaceRepository.update(id, updateData);
    return await this.spaceRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.spaceRepository.delete(id);
  }
}