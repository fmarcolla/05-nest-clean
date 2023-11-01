import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersCommentRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-autor'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswersCommentRepository
  implements AnswersCommentRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(questionComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const questionComment = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return questionComment
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(
            `Auhtor with ID "${comment.authorId}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
        })
      })

    return answerComments
  }
}
