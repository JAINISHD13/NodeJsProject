'use strict';

const v = require('@mapbox/fusspot');

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);

// validate the type of the rating object
const validateRatings = v.assert(
  v.strictShape({
    user_id:v.required(v.string),
    butterfly_id:v.required(v.string),
    rate: v.required(v.number)
  })
);

// validate the range of the rating
const validateRatingRange = v.assert(v.range([0, 5]));

module.exports = {
  validateButterfly,
  validateUser,
  validateRatings,
  validateRatingRange
};
