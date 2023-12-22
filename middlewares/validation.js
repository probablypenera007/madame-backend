const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value,helpers) => {
  if(validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri")
};

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    dob: Joi.date().required().messages({
      "any.required": 'The "dob" field must be filled in',
      "date.base": 'The "dob" field must be a valid date',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'the "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'the "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.length": 'The "itemId" must be exactly 24 characters long',
      "string.hex": 'The "itemId" must be a valid hexadecimal value',
      "string.empty": 'The "itemId" field must be filled in',
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    dob: Joi.date().required().messages({
      "any.required": 'The "dob" field must be filled in',
      "date.base": 'The "dob" field must be a valid date',
    }),
  }),
});
