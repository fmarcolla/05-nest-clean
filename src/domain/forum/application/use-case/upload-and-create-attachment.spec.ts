import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let sut: UploadAndCreateAttachmentUseCase

let fakeUploader: FakeUploader
let attachmentsRepository: InMemoryAttachmentsRepository

describe('Upload and create attachment', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      attachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload and create attachemnt', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able upload and create attachemnt with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'audio.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
