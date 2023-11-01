import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-case/delete-answer'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswerUseCase: DeleteAnswerUseCase) {}

  @HttpCode(204)
  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerUseCase.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
