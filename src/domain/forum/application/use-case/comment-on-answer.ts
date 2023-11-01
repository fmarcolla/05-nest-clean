import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswersCommentRepository } from '../repositories/answers-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface AnswerCommentUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type AnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>

@Injectable()
export class AnswerCommentUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentRepository: AnswersCommentRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: AnswerCommentUseCaseRequest): Promise<AnswerCommentUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
