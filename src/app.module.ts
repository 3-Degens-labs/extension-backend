import {Module} from '@nestjs/common';
import {CheckModule} from "./primary-adapters/check/check.module";

@Module({
    imports: [CheckModule.register()],
    controllers: [],
    providers: [],
})
export class AppModule {
}
