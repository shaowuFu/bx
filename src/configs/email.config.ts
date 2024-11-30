import { registerAs } from '@nestjs/config';

export default registerAs(
    'email',
    (): Record<string, any> => ({
        name: process.env.APP_NAME,
        fromEmail: 'noreply@mail.com',
        supportEmail: 'support@mail.com',

        clientUrl: process.env.CLIENT_URL ?? 'https://example.com',
    })
);
