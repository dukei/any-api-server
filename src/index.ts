// src/index.ts

import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './generated/routes.js';
import type {Express, NextFunction, Request, Response} from "express";
import express from 'express';
import {ValidateError} from "tsoa";
import {HttpError} from "http-errors";

const app: Express = express();
const PORT = process.env.PORT || 3009;

// Обязательно подключаем body-parser, чтобы tsoa мог читать JSON из Body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем интерактивную документацию Swagger (доступна по адресу http://localhost:3000/docs)
try {
  const swaggerDocument = await import("./generated/swagger.json", {
    with: { type: 'json' }
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.default));
} catch (err) {
  console.log('Swagger-файл пока не сгенерирован. Запустите сборку роутов.');
}

// Регистрируем маршруты, которые tsoa вытащит из наших контроллеров
RegisterRoutes(app);

// Глобальный обработчик ошибок (для валидации tsoa)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // 1. Ошибки валидации от TSOA (например, неверный тип параметра)
  if (err instanceof ValidateError) {
    res.status(422).json({
      error: true,
      message: "Ошибка валидации параметров",
      details: err?.fields,
    });
    return;
  }

  // 2. Предусмотренные ошибки через наше кастомное исключение HttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: true,
      message: err.message,
    });
    return;
  }

  // 3. Все остальные непредвиденные ошибки (код 500)
  console.error("Непредвиденная ошибка:", err);
  res.status(500).json({
    error: true,
    message: "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`[🚀] Сервер автоматизации запущен на http://localhost:${PORT}`);
  console.log(`[📖] Документация доступна на http://localhost:${PORT}/api-docs`);
});