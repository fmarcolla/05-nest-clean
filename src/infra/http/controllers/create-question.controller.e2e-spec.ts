import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwtService = moduleRef.get(JwtService)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        title: 'New Question',
        content: 'Question Content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: 'New Question',
      },
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prismaService.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
