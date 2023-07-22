import {DynamicModule, Module, ModuleMetadata} from '@nestjs/common';
import {CheckController} from './check.controller';
import {PoapModule} from "../../secondary-adapters/poap/poap.module";
import {LensModule} from "../../secondary-adapters/lens/lens.module";

@Module({})
export class CheckModule {
  static register(imports: ModuleMetadata['imports'] = []): DynamicModule {
    return {
      module: CheckModule,
      imports: [
        ...imports,
          PoapModule,
          LensModule,
      ],
      controllers: [CheckController],
    };
  }
}
