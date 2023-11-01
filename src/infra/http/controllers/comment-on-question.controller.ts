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
import { QuestionCommentUseCase } from '@/domain/forum/application/use-case/comments-on-question'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comment')
export class CommentOnQuestionController {
  constructor(private commentOnQuestionUseCase: QuestionCommentUseCase) {}

  @HttpCode(201)
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnQuestionUseCase.execute({
      questionId,
      content,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
