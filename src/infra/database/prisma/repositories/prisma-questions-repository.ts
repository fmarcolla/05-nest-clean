import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prismaService: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private cache: CacheRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async findManyRecents({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prismaService.question.update({
        data,
        where: {
          id: data.id,
        },
      }),

      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),

      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),

      this.cache.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
