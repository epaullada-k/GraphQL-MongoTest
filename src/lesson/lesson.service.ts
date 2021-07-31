import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonInput } from './lesson.input';
import { Lesson } from './lesson.entity';
import { v4 as uuid} from 'uuid'
import { LesssonsRepository } from './lessons.repository';
import { AssignStudentsToLessonInput } from './assign-students.input';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonsRepository: LesssonsRepository
    ) {}
    
    async getLessons(): Promise<Lesson[]> {
        return await this.lessonsRepository.find()
    }

    async getLessonById(id: string): Promise<Lesson> {
        const found = await this.lessonsRepository.findOne({ id })

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }

        return found
    }
    
    createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const { name, startDate, endDate, students } = createLessonInput

        const lesson = this.lessonsRepository.create({
            id: uuid(),
            name,
            startDate,
            endDate,
            students
        })

        return this.lessonsRepository.save(lesson)
    }
    
    async assignStudentsToLesson(assignStudentsToLessonInput: AssignStudentsToLessonInput): Promise<Lesson> {
        const { lessonId, studentIds } = assignStudentsToLessonInput
        const lesson = await this.lessonsRepository.findOne({ id: lessonId })
        lesson.students = [...lesson.students, ...studentIds]
        return this.lessonsRepository.save(lesson)
    }
}
