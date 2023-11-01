import { AnswerQuestionUseCase } from '@/domain/forum/application/use-case/answer-question'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-case/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-case/choose-question-best-answer'
import { AnswerCommentUseCase } from '@/domain/forum/application/use-case/comment-on-answer'
import { QuestionCommentUseCase } from '@/domain/forum/application/use-case/comments-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-case/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-case/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-case/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-case/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-case/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-case/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-case/edit-question'
import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-case/fetch-answer-comments'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-case/fetch-question-answers'
import { FetchQuestionCommentUseCase } from '@/domain/forum/application/use-case/fetch-question-comments'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-case/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-case/get-question-by-slug'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-case/register-student'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-case/upload-and-create-attachment'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-case/read-notification'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments'
import { FetchAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    QuestionCommentUseCase,
    DeleteQuestionCommentUseCase,
    AnswerCommentUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentUseCase,
    FetchAnswerCommentUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
