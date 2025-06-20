import Joi from "joi";

export const validateCreateLocation = (req, res, next) => {
  const schema = Joi.object({
    buildingId: Joi.string().required().messages({
      "any.required": "Building ID is required",
    }),
    pin: Joi.string().required().messages({
      "any.required": "PIN is required",
    }),
    name: Joi.string().optional().allow("").trim(),
    streetAddress: Joi.string().optional().allow("").trim(),
    city: Joi.string().optional().allow("").trim(),
    state: Joi.string().optional().allow("").trim(),
    country: Joi.string().optional().allow("").trim(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
    }).optional(),
    description: Joi.string().optional().allow("").trim(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUpdateLocation = (req, res, next) => {
  const schema = Joi.object({
    buildingId: Joi.string().optional(),
    pin: Joi.string().optional(),
    name: Joi.string().optional().allow("").trim(),
    streetAddress: Joi.string().optional().allow("").trim(),
    city: Joi.string().optional().allow("").trim(),
    state: Joi.string().optional().allow("").trim(),
    country: Joi.string().optional().allow("").trim(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
    }).optional(),
    description: Joi.string().optional().allow("").trim(),
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};