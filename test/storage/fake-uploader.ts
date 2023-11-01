import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

export interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload(params: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName: params.fileName,
      url,
    })

    return { url }
  }
}
