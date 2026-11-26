// file:// entry (bundled by tools/build.mjs). The hero comes from hero/hero.classic.js (window.HeroModule).
import { boot } from './boot.js';
boot(window.HeroModule && window.HeroModule.createHero);
