import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.log(
      `Application running mode: ${process.env.NODE_ENV} on port: ${PORT}`,
    );
  });
}

main();
