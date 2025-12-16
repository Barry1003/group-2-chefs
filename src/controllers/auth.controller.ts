import { NextFunction, Request, Response } from "express";
import { ISignup, ILogin } from "../types/auth.type";
import { authFactory } from "../services/factories/";
export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const input: ISignup = {
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		profile_pic: req.body.profile_pic,
		cooking_skill_level: req.body.cooking_skill_level,
		bio: req.body.bio,
	};
	const response = await authFactory().signup(input);
	return res.status(response.code).json(response);
};
export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const input: ILogin = {
		username: req.body.username,
		password: req.body.password,
	};
	const response = await authFactory().login(input);
	return res.status(response.code).json(response);
};