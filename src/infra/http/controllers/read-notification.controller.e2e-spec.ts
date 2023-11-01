import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { NotificationFactory } from 'test/factories/make-notification'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachent'
import { StudentFactory } from 'test/factories/make-student'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
        NotificationFactory,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prismaService = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prismaService.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
