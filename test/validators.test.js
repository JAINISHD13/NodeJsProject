'use strict';

const { validateButterfly, validateUser,validateRatings,validateRatingRange } = require('../src/validators');

describe('validateButterfly', () => {
  const validButterfly = {
    commonName: 'Butterfly Name',
    species: 'Species name',
    article: 'http://example.com/article'
  };

  it('is ok for a valid butterfly', () => {
    const result = validateButterfly(validButterfly);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateButterfly({});
    }).toThrow('The following properties have invalid values:');

    expect(() => {
      validateButterfly({
        ...validButterfly,
        commonName: 123
      });
    }).toThrow('commonName must be a string.');

    expect(() => {
      validateButterfly({
        extra: 'field',
        ...validButterfly
      });
    }).toThrow('The following keys are invalid: extra');
  });
});

describe('validateUser', () => {
  const validUser = {
    username: 'test-user'
  };

  it('is ok for a valid user', () => {
    const result = validateUser(validUser);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateUser({});
    }).toThrow('username is required');

    expect(() => {
      validateUser({
        extra: 'field',
        ...validUser
      });
    }).toThrow('The following keys are invalid: extra');

    expect(() => {
      validateUser({
        username: [555]
      });
    }).toThrow('username must be a string');
  });
});


describe('validateRatings', () => {
  const validRatings = {
    user_id: 'abcd1',
    butterfly_id: 'def2',
    rate: 2
  };

  it('is ok for a valid rate', () => {
    const result = validateRatings(validRatings);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateRatings({});
    }).toThrow('The following properties have invalid values:');

    expect(() => {
      validateRatings({
        ...validRatings,
        rate: '1'
      });
    }).toThrow('rate must be a number.');

    expect(() => {
      validateRatings({
        extra: 'field',
        ...validRatings
      });
    }).toThrow('The following keys are invalid: extra');
  });
});


describe('validateRatingRange', () => {
  const rate = 2;
  const outofbound_rate = 6;
  const outofbound_rate_1 = -1;
  it('value should be between 0 to 5', () => {
    const result = validateRatingRange(rate);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid',() => {
    expect(() => {
      validateRatingRange(outofbound_rate_1);
    }).toThrow('value must be a number between 0 & 5 (inclusive)');

    expect(() => {
      validateRatingRange(outofbound_rate);
    }).toThrow('value must be a number between 0 & 5 (inclusive)');
  });
});

