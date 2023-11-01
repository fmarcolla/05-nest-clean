import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersCommentRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AnswerCommentUseCase } from './comment-on-answer'

let sut: AnswerCommentUseCase
let anawersRepository: InMemoryAnswersRepository
let anawersCommentRepository: InMemoryAnswersCommentRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

describe('Answer Comment', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    anawersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    anawersCommentRepository = new InMemoryAnswersCommentRepository(
      studentsRepository,
    )

    sut = new AnswerCommentUseCase(anawersRepository, anawersCommentRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    await anawersRepository.create(answer)

    await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'New comment answer',
    })

    expect(anawersCommentRepository.items[0].content).toEqual(
      'New comment answer',
    )
  })
})
