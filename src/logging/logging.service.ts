import { Injectable, HttpService, LoggerService } from '@nestjs/common';
import { LogMessageFormat } from './log-format.model';

@Injectable()
export class IssueLoggingService {

    issueCreatorUrl = "http://localhost:3500"

    constructor(private http: HttpService) {}

    log(log: LogMessageFormat) {
        this.http.post(`${this.issueCreatorUrl}/log-receiver`, log);
    }
}
