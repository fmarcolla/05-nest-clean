import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        answerId,
      },
    })

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deletManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prismaService.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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
