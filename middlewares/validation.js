const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("owner", "investor", "admin").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const userSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().unique().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("owner", "investor", "admin").required(),
  balance: Joi.number().default(0),
});
const projectSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(10).required(),
  capital: Joi.number().positive().required(),
  maxInvestmentPercentage: Joi.number().min(1).max(50).default(50),
  initialInvestment: Joi.number().min(1).default(0),
});

const investmentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  percentage: Joi.number(),
  date: Joi.date().now(),
});

const balanceSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  investmentSchema,
  balanceSchema,
  userSchema,
};
