'use strict';
 
/**
 * Strips an optional "data:image/...;base64," prefix.
 * Returns an empty string for anything that is not a non-empty string.
 */
function cleanBase64Image(image) {
  if (typeof image !== 'string') return '';
  return image.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '').trim();
}
 
module.exports = { cleanBase64Image };
 