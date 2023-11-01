import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsCommentRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-autor'
import { Injectable } from '@nestjs/common'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionsCommentRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
    })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questions = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questions = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prismaService.comment.create({
      data,
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
