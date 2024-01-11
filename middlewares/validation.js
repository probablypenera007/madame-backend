const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
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
    placeOfBirth: Joi.string().optional(),
    maritalStatus: Joi.string()
      .valid("Single", "In a Relationship", "Married", "Divorced", "Widowed")
      .optional(),
    sexualOrientation: Joi.string()
      .valid(
        "Straight-Male",
        "Straight-Female",
        "Gay",
        "Lesbian",
        "Bisexual",
        "Pansexual",
        "Asexual",
        "Queer",
        "Questioning",
        "Demisexual",
        "Greysexual",
        "Heteroflexible",
        "Homoflexible",
        "Androgynosexual",
        "Skoliosexual",
        "Polysexual",
        "Two-Spirit",
        "Agender",
        "Bigender",
        "Genderfluid",
        "Non-Binary",
        "Other",
      )
      .optional(),
      email: Joi.custom(validateEmail, 'Email Validation').messages({
        "string.email": 'The "email" field must be a valid email address',
      }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.custom(validateEmail, 'Email Validation').messages({
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
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
    placeOfBirth: Joi.string().optional(),
    maritalStatus: Joi.string()
      .valid("Single", "In a Relationship", "Married", "Divorced", "Widowed")
      .optional(),
    sexualOrientation: Joi.string()
      .valid(
        'Straight-Male',
        'Straight-Female',
        'Gay',
        'Lesbian',
        'Bisexual',
        'Pansexual',
        'Asexual',
        'Queer',
        'Questioning',
        'Demisexual',
        'Greysexual',
        'Heteroflexible',
        'Homoflexible',
        'Androgynosexual',
        'Skoliosexual',
        'Polysexual',
        'Two-Spirit',
        'Agender',
        'Bigender',
        'Genderfluid',
        'Non-Binary',
        'Other',
      )
      .optional(),
  }),
});
