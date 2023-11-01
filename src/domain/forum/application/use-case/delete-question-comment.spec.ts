import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let sut: DeleteQuestionCommentUseCase
let questionsCommentRepository: InMemoryQuestionsCommentRepository
let studentsRepository: InMemoryStudentsRepository

describe('Delete Question Comment', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionsCommentRepository = new InMemoryQuestionsCommentRepository(
      studentsRepository,
    )

    sut = new DeleteQuestionCommentUseCase(questionsCommentRepository)
  })

  it('should be able to delete comment on question', async () => {
    const questionComment = makeQuestionComment()
    await questionsCommentRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(questionsCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })
    await questionsCommentRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
