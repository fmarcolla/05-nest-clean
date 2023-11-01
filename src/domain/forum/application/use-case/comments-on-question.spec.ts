import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { QuestionCommentUseCase } from './comments-on-question'

let sut: QuestionCommentUseCase
let questionsRepository: InMemoryQuestionsRepository
let questionsCommentRepository: InMemoryQuestionsCommentRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

describe('Question Comment', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    questionsCommentRepository = new InMemoryQuestionsCommentRepository(
      studentsRepository,
    )

    sut = new QuestionCommentUseCase(
      questionsRepository,
      questionsCommentRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'New comment',
    })

    expect(questionsCommentRepository.items[0].content).toEqual('New comment')
  })
})
