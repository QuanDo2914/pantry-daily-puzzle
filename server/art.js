import crypto from 'node:crypto';
import { ingredientArt, recipeArt } from '../src/visuals/clearline.js';
export const ingredientName = id => id.split('_').map(s => s === 'bbq' ? 'BBQ' : s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
export const artPath = svg => `/assets/${crypto.createHash('sha256').update(svg).digest('hex').slice(0, 20)}.svg`;
export const ingredientAsset = id => ({ svg: ingredientArt(id, ingredientName(id)), path: artPath(ingredientArt(id, ingredientName(id))) });
export const dishAsset = recipe => ({ svg: recipeArt(recipe), path: artPath(recipeArt(recipe)) });
