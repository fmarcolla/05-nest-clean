import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answers comment (E2E)', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerCommentFactory,
        AnswerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwtService = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makeAnswerQuestion({
      authorId: user.id,
      questionId: question.id,
    })

    const comment = await answerCommentFactory.makeAnswerComment({
      authorId: user.id,
      answerId: answer.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${comment.id}`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prismaService.comment.findUnique({
      where: {
        id: comment.id.toString(),
      },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
