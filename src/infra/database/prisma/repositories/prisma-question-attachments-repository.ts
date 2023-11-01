import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        questionId,
      },
    })

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deletManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prismaService.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentsId = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsId,
        },
      },
    })
  }
}
