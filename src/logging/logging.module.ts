import { Module, HttpModule } from '@nestjs/common';
import { IssueLoggingService } from './logging.service';

@Module({
    imports: [
        HttpModule
    ],
    providers: [
        IssueLoggingService
    ],
    exports: [
        IssueLoggingService
    ] 
})
export class LoggingModule {}
