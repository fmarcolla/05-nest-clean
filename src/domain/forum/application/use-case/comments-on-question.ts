import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsCommentRepository } from '../repositories/questions-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface QuestionCommentUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type QuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  { questionComment: QuestionComment }
>

@Injectable()
export class QuestionCommentUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentRepository: QuestionsCommentRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: QuestionCommentUseCaseRequest): Promise<QuestionCommentUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
