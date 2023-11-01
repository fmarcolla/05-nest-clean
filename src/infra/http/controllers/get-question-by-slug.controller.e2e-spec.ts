import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachent'
import { StudentFactory } from 'test/factories/make-student'

describe('Get question by Slug (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: Slug.create('question-01'),
    })

    const attachent = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachent.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question 01',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ],
      }),
    })
  })
})
