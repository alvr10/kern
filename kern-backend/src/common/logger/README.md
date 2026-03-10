# Pino Logger Module

Official logging solution for the Deliveroo application using Pino - a fast, low-overhead logging library for Node.js.

## 📁 Structure

```
src/common/logger/
├── logger.service.ts          # Pino logger service
├── http-logger.middleware.ts  # HTTP request logging middleware
├── logger.module.ts           # NestJS module
├── index.ts                   # Exports
└── README.md                  # This file
```

## 🚀 Features

- **Pretty Logging**: Colorized, formatted logs in development
- **Structured Logging**: JSON logs in production
- **HTTP Request Logging**: Automatic logging of all HTTP requests
- **Context Support**: Add context to your logs
- **Performance**: Extremely fast, low overhead
- **NestJS Compatible**: Implements NestJS LoggerService interface

## 📝 Configuration

The logger is configured via environment variables in `.env`:

```env
NODE_ENV=development        # development | production
LOG_LEVEL=info             # trace | debug | info | warn | error | fatal
```

### Log Levels

- **trace**: Most verbose, for fine-grained debugging
- **debug**: Detailed debugging information
- **info**: General informational messages (default)
- **warn**: Warning messages
- **error**: Error messages
- **fatal**: Critical errors that cause application failure

## 🛠️ Usage

### 1. Inject Logger Service

The `LoggerModule` is global, so you can inject `PinoLoggerService` anywhere:

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLoggerService } from '@common/logger';

@Injectable()
export class YourService {
  constructor(private readonly logger: PinoLoggerService) {}

  doSomething() {
    this.logger.log('Doing something', 'YourService');
    this.logger.debug('Debug info', 'YourService');
    this.logger.warn('Warning message', 'YourService');
    this.logger.error('Error occurred', 'stack trace', 'YourService');
  }
}
```

### 2. HTTP Request Logging

All HTTP requests are automatically logged via `HttpLoggerMiddleware`:

```
INFO - Incoming GET /api/v1/auth/me
INFO - GET /api/v1/auth/me 200 - 45ms
```

### 3. Child Loggers (Advanced)

Create child loggers with additional context:

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLoggerService } from '@common/logger';

@Injectable()
export class OrderService {
  constructor(private readonly logger: PinoLoggerService) {}

  processOrder(orderId: string) {
    const childLogger = this.logger.child({ orderId });

    childLogger.info('Processing order');
    childLogger.info('Payment validated');
    childLogger.info('Order completed');
  }
}
```

Output:
```json
{"level":"INFO","orderId":"123","msg":"Processing order"}
{"level":"INFO","orderId":"123","msg":"Payment validated"}
{"level":"INFO","orderId":"123","msg":"Order completed"}
```

### 4. Direct Pino Access

For advanced use cases, access the underlying Pino instance:

```typescript
const pinoLogger = this.logger.getLogger();
pinoLogger.info({ userId: '123', action: 'login' }, 'User logged in');
```

## 📊 Log Format

### Development (Pretty)

```
INFO - [YourService] Doing something
WARN - [YourService] Warning message
ERROR - [YourService] Error occurred
```

### Production (JSON)

```json
{
  "level": "INFO",
  "time": "2025-10-04T10:30:00.000Z",
  "context": "YourService",
  "msg": "Doing something"
}
```

## 🌐 HTTP Request Logs

The middleware logs:

- **Request**: Method, URL, timestamp
- **Response**: Status code, duration

```
INFO - [HTTP] Incoming POST /api/v1/auth/login
INFO - [HTTP] POST /api/v1/auth/login 201 - 234ms
```

### Status Code Colors (Development)

- **2xx**: Green (success)
- **3xx**: Cyan (redirect)
- **4xx**: Yellow (client error)
- **5xx**: Red (server error)

## 🎯 Best Practices

### 1. Always Provide Context

```typescript
// Good
this.logger.log('User created successfully', 'UserService');

// Bad
this.logger.log('User created successfully');
```

### 2. Use Appropriate Log Levels

```typescript
// Information
this.logger.log('Operation completed', 'Service');

// Debugging
this.logger.debug('Processing data: ' + JSON.stringify(data), 'Service');

// Warnings
this.logger.warn('Rate limit approaching', 'Service');

// Errors
this.logger.error('Failed to save user', error.stack, 'Service');
```

### 3. Structured Logging for Production

```typescript
// Instead of string concatenation
this.logger.log(`User ${userId} logged in`);

// Use child loggers for structured data
const childLogger = this.logger.child({ userId });
childLogger.info('User logged in');
```

### 4. Don't Log Sensitive Data

```typescript
// Bad - logs password
this.logger.log('Login attempt: ' + JSON.stringify(loginDto));

// Good - omit sensitive fields
this.logger.log('Login attempt for user: ' + loginDto.email);
```

## 🔧 Customization

### Change Log Format

Edit `src/common/logger/logger.service.ts`:

```typescript
this.logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      // Customize format here
      messageFormat: '{levelLabel} - [{context}] {msg}',
    },
  },
});
```

### Add Custom Metadata

```typescript
this.logger = pino({
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  // ... rest of config
});
```

## 📦 Dependencies

- `pino`: Core logging library
- `pino-pretty`: Pretty-printing for development

Both are already installed via `nestjs-pino` package.

## 🐛 Troubleshooting

### Logs not appearing

1. Check `LOG_LEVEL` in `.env`
2. Ensure logger is injected correctly
3. Verify `LoggerModule` is imported in `app.module.ts`

### Colors not showing in development

1. Ensure `NODE_ENV=development` in `.env`
2. Check terminal supports colors
3. Verify `pino-pretty` is installed

### Performance issues

1. Set `LOG_LEVEL=warn` or `error` in production
2. Remove debug/trace logs in production code
3. Consider using async logging for high-volume apps

## 📚 Resources

- [Pino Documentation](https://getpino.io/)
- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [Best Practices for Node.js Logging](https://blog.logrocket.com/node-js-logging-best-practices/)

## 🔗 Usage in Other Modules

When creating new modules, follow this pattern:

```typescript
// In your service
import { Injectable } from '@nestjs/common';
import { PinoLoggerService } from '@common/logger';

@Injectable()
export class MyService {
  constructor(private readonly logger: PinoLoggerService) {}

  myMethod() {
    this.logger.log('Method called', 'MyService');
  }
}
```

No need to import `LoggerModule` in your module - it's already global!
