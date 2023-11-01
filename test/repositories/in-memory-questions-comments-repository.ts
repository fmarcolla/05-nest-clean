import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsCommentRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-autor'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsCommentRepository
  implements QuestionsCommentRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComment = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComment
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComment = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionComment
  }
}
