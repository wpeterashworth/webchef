/**
 * Shared recipe and content-shape types for JS helpers.
 */

/**
 * @typedef {object} RecipeIngredient
 * @property {string=} original
 * @property {string=} name
 */

/**
 * @typedef {object} Recipe
 * @property {string} id
 * @property {string} title
 * @property {string | null=} description
 * @property {string | null=} image_url
 * @property {number | null=} ready_in_minutes
 * @property {number | null=} servings
 * @property {string | null=} source_url
 * @property {string[]=} cuisines
 * @property {string[]=} meals
 * @property {RecipeIngredient[]=} ingredients
 * @property {string[]=} instructions
 */

/**
 * @typedef {object} RecipeCard
 * @property {string} id
 * @property {string} title
 * @property {string | null=} description
 * @property {string | null=} image_url
 * @property {number | null=} ready_in_minutes
 * @property {number | null=} servings
 * @property {string[]=} cuisines
 * @property {string[]=} meals
 */

export {};