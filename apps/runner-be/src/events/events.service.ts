import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  findAll({ skip = 0, take = 10 }: { skip?: number; take?: number } = {}) {
    return this.eventsRepository.find({ skip, take });
  }

  findOne(id: string) {
    return this.eventsRepository.findOneBy({ id });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.eventsRepository.update(id, updateEventDto);
    return this.eventsRepository.findOneBy({ id });
  }

  remove(id: string) {
    this.eventsRepository.delete(id);
  }
}
