import { CssSelectorRegistry } from '@xivapi/nodestone/types/core/css-selector-registry';
import { Request } from 'express';
// https://github.com/xivapi/lodestone-css-selectors
import * as mounts from './mounts-css-selector.json';
import { PageParser } from '../../core/page-parser';

export class CharacterMounts extends PageParser {
  protected getURL(req: Request): string {
    return (
      'https://na.finalfantasyxiv.com/lodestone/character/' +
      req.params.characterId +
      '/mount'
    );
  }

  protected getCSSSelectors(): CssSelectorRegistry {
    return mounts;
  }
}
