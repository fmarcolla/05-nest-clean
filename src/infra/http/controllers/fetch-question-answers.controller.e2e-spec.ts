import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
    })

    await Promise.all([
      answerFactory.makeAnswerQuestion({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer 01',
      }),
      answerFactory.makeAnswerQuestion({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer 02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/answers`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.answers).toHaveLength(2)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer 01' }),
        expect.objectContaining({ content: 'Answer 02' }),
      ]),
    })
  })
})
