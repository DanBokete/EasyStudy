import { PartialType } from '@nestjs/mapped-types';
import { CreateXpDto } from './create-xp.dto';

export class UpdateXpDto extends PartialType(CreateXpDto) {}
