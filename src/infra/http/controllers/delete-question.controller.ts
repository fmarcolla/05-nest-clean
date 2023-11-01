import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-case/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @HttpCode(204)
  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionUseCase.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
