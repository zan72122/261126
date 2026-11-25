// http(s) entry: ES modules.
import { createHero } from '../hero/hero.js';
import { boot } from './boot.js';
boot(createHero);
