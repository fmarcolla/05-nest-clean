import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${acessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
