import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string) {
    const question = this.items.find((item) => item.email === email)

    if (!question) {
      return null
    }

    return question
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
