import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let sut: SendNotificationUseCase
let notificationsRepository: InMemoryNotificationsRepository

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
