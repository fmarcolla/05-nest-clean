import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionCommentFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /answers/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
    })

    const answer = await answerFactory.makeAnswerQuestion({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all([
      answerCommentFactory.makeAnswerComment({
        answerId: answer.id,
        authorId: user.id,
        content: 'Comment 01',
      }),
      answerCommentFactory.makeAnswerComment({
        answerId: answer.id,
        authorId: user.id,
        content: 'Comment 02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id}/comments`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(2)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 01',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          content: 'Comment 02',
          authorName: 'John Doe',
        }),
      ]),
    })
  })
})
