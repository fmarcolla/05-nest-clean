import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let sut: ChooseQuestionBestAnswerUseCase
let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository,
    )
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: new UniqueEntityID('author-2').toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
