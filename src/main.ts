import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;

  app.enableCors({
    origin: process.env.FE_URL,
  });

  await app.listen(PORT, () => {
    console.log(
      `Application running mode: ${process.env.NODE_ENV} on port: ${PORT}`,
    );
  });
}

main();
