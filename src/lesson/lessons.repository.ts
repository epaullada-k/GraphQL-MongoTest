import { EntityRepository, Repository } from "typeorm";
import { Lesson } from "./lesson.entity";

@EntityRepository(Lesson)
export class LesssonsRepository extends Repository<Lesson> {
    
}