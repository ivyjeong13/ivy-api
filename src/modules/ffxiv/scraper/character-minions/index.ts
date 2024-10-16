import { CssSelectorRegistry } from '@xivapi/nodestone/types/core/css-selector-registry';
import { Request } from 'express';
// https://github.com/xivapi/lodestone-css-selectors
import * as mounts from './minions-css-selector.json';
import { PageParser } from '../../core/page-parser';

export class CharacterMinions extends PageParser {
  protected getURL(req: Request): string {
    return (
      'https://na.finalfantasyxiv.com/lodestone/character/' +
      req.params.characterId +
      '/minion'
    );
  }

  protected getCSSSelectors(): CssSelectorRegistry {
    return mounts;
  }
}
