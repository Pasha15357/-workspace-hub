import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { SpacesService } from './spaces.service.js';
import { Space } from './space.entity.js';
import { CreateSpaceDto } from './dto/create-space.dto.js';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

    @Get()
  async findAll(@Query('search') search?: string) {
    return this.spacesService.findAll(search);
  }

   @Post()
  async create(@Body() createSpaceDto: CreateSpaceDto): Promise<Space> {
    return await this.spacesService.create(createSpaceDto);
  }

  @Patch(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<Space>) {
    return this.spacesService.update(id, updateData);
  }

  @Delete(':id')
    async remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}