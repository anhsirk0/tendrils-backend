import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TendrilsModule } from './tendrils/tendrils.module';

@Module({
  imports: [
    // AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    TendrilsModule,
    // UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
