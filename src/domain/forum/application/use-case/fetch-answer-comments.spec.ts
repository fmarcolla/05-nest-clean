import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswersCommentRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchAnswerCommentUseCase } from './fetch-answer-comments'

let sut: FetchAnswerCommentUseCase
let answerCommentsRepository: InMemoryAnswersCommentRepository
let studentsRepository: InMemoryStudentsRepository

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswersCommentRepository(
      studentsRepository,
    )
    sut = new FetchAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.create(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await answerCommentsRepository.create(comment1)
    await answerCommentsRepository.create(comment2)
    await answerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
