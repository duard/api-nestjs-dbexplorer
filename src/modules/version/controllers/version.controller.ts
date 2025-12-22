import { Controller, Get } from '@nestjs/common';
import * as packageJson from '../../../../package.json';
import * as semver from 'semver';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('version')
@Controller('version')
export class VersionController {
  @Get()
  getVersion() {
    return {
      version: packageJson.version,
      semver: semver.parse(packageJson.version),
    };
  }
}
