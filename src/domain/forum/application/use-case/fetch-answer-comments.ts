import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-autor'
import { AnswersCommentRepository } from '../repositories/answers-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswersCommentRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    return right({
      comments,
    })
  }
}
