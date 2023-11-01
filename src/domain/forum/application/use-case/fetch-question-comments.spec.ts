import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchQuestionCommentUseCase } from './fetch-question-comments'

let sut: FetchQuestionCommentUseCase
let questionCommentsRepository: InMemoryQuestionsCommentRepository
let studentsRepository: InMemoryStudentsRepository

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionsCommentRepository(
      studentsRepository,
    )

    sut = new FetchQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.create(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await questionCommentsRepository.create(comment1)
    await questionCommentsRepository.create(comment2)
    await questionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
