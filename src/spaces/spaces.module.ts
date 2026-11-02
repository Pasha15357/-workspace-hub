import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity.js';
import { SpacesController } from './spaces.controller.js';
import { SpacesService } from './spaces.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Space])],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}