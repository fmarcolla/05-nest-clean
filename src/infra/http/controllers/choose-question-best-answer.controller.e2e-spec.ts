import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Choose question best answer (E2E)', () => {
  let app: INestApplication
  let prismaService: PrismaService
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

    prismaService = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwtService = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[PUT] /answerws/:answerId/choose-as-best', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      content: 'Question content',
    })

    const answer = await answerFactory.makeAnswerQuestion({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer content',
    })

    const response = await request(app.getHttpServer())
      .patch(`/answerws/${answer.id}/choose-as-best`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    const questionOnDatabase = await prismaService.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(questionOnDatabase?.bestAnswerId).toEqual(answer.id.toString())
  })
})
