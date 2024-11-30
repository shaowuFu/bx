import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Params } from 'nestjs-pino';
import { ENUM_APP_ENVIRONMENT } from 'src/app/enums/app.enum';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

@Injectable()
export class LoggerOptionService {
    private readonly env: ENUM_APP_ENVIRONMENT;
    private readonly name: string;

    private readonly debugEnable: boolean;
    private readonly debugLevel: string;

    constructor(private configService: ConfigService) {
        this.env = this.configService.get<ENUM_APP_ENVIRONMENT>('app.env');
        this.name = this.configService.get<string>('app.name');

        this.debugEnable = this.configService.get<boolean>('debug.enable');
        this.debugLevel = this.configService.get<string>('debug.level');
    }

    createOptions(): Params {
        return {
            pinoHttp: {
                level: this.debugEnable ? this.debugLevel : 'silent',
                formatters: {
                    level: (label: string) => ({ level: label.toUpperCase() }),
                },
                messageKey: 'message',
                timestamp: false,
                base: {
                    app: this.name,
                    env: this.env,
                    date: new Date().toISOString(),
                },
                customProps: (req: Request, _res: Response) => ({
                    context: 'HTTP',
                    'x-request-id': req.id,
                }),
                redact: {
                    paths: [
                        'req.headers.authorization',
                        'req.headers["x-api-key"]',
                        'req.body.password',
                        'req.body.newPassword',
                        'req.body.oldPassword',
                        'res.headers["set-cookie"]',
                    ],
                    censor: '**REDACTED**',
                },
                serializers: {
                    req(request: IRequestApp) {
                        return {
                            id: request.id,
                            method: request.method,
                            url: request.url,
                            queries: request.query,
                            parameters: request.params,
                            headers: request.headers,
                            body: request.body,
                        };
                    },
                    res(response) {
                        return {
                            statusCode: response.statusCode,
                            headers: response.headers,
                        };
                    },
                    err(error) {
                        return {
                            type: error.type,
                            message: error.message,
                            stack: error.stack,
                            code: error.code,
                        };
                    },
                },
                transport:
                    this.env === ENUM_APP_ENVIRONMENT.LOCAL
                        ? {
                              target: 'pino-pretty',
                              options: {
                                  colorize: true,
                                  levelFirst: true,
                                  translateTime: 'SYS:standard',
                              },
                          }
                        : undefined,
            },
        };
    }
}
