import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let sut: RegisterStudentUseCase

let studentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

describe('Create Student', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, fakeHasher)
  })

  it('should be able to create a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(studentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
