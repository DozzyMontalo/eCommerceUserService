import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config"
import {PrismaClient} from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        const databaseurl = config.get<string>('DATABASE_URL')
        console.log('Database Url:', databaseurl)
        super({
            datasources: {
                db: {
                    url: databaseurl
                }
            }
        })
    }

    cleanDb(){
        return this.$transaction([
            this.user.deleteMany()
        ]);
    }
};
