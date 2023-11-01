import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentUseCase } from '@/domain/forum/application/use-case/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageParamsSchema)

type PageParamsSchema = z.infer<typeof pageParamsSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionsComments: FetchQuestionCommentUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionsComments.execute({
      page,
      questionId,
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
