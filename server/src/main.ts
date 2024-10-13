import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ClusterService } from './cluster.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            // This will remove any additional properties that are not in the DTO
            whitelist: true,
        }),
    )
    await app.listen(5000);
}

ClusterService.clusterize(bootstrap);