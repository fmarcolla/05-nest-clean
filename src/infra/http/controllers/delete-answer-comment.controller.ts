import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-case/delete-answer-comment'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

  @HttpCode(204)
  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerCommentUseCase.execute({
      answerCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
