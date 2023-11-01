import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-case/fetch-answer-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageParamsSchema)

type PageParamsSchema = z.infer<typeof pageParamsSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageParamsSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP,
    )

    return {
      comments,
    }
  }
}
