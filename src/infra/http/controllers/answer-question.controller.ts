import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-case/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @HttpCode(201)
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.answerQuestionUseCase.execute({
      questionId,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
