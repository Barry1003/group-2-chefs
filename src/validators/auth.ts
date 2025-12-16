import Joi from "joi";
import { ILogin, ISignup } from "../types/auth.type";

export const loginValidator = Joi.object<ILogin>({
  username: Joi.string().alphanum().optional().min(3),
  password: Joi.string().required().min(6),
});

export const signupValidator = Joi.object<ISignup>({
  username: Joi.string().alphanum().optional().min(3),
  email: Joi.string().email().optional(),
  password: Joi.string().required().min(6),
});
