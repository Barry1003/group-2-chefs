import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { AxiosError } from 'axios';
import Logger from '../services/Logger';
import { ResultFunction } from '../helpers/utils';
// import { JsonWebTokenError } from 'jsonwebtoken';

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const logger = new Logger().logger;
	let message = 'Oops, something went wrong. Please try again later';
	let errCode = 422;

	console.log('error handler: ', err.message);

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// handle prisma known request errors
		if (err.code === 'P2002') {
			// unique constraint violation
			const target = (err.meta?.target as string[]) || [];
			const field = target.join(', ');
			message = `An account with this ${field} already exists! Please use another one.`;
			errCode = 400;
		} else if (err.code === 'P2025') {
			// record not found
			message = 'Record not found.';
			errCode = 404;
		} else {
			message = err.message;
			errCode = 400;
		}
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		// handle prisma validation errors
		message = 'Invalid input data. Please check your request.';
		errCode = 400;
	} else if ((err as AxiosError).isAxiosError) {
		//handle axios errors
		if ((err as AxiosError).response)
			message =
				// @ts-ignore
				(err as AxiosError).response?.data.error ||
				// @ts-ignore
				(err as AxiosError).response?.data.message;
		else message = (err as AxiosError).message;

		errCode = (err as AxiosError).response?.status || 500;
	}
	// else if (err instanceof JsonWebTokenError) {
	// 	//handle jwt errors
	// 	message = err.message;
	// 	errCode = 403;
	// }
	else if (err instanceof Error) {
		//handle generic errors
		message = err.message;
		errCode = 422;
	} else if (
		err instanceof SyntaxError ||
		err instanceof EvalError ||
		err instanceof RangeError ||
		err instanceof ReferenceError ||
		err instanceof TypeError ||
		err instanceof URIError
	) {
		//handle global error types
		message = err.message;
		errCode = 400;
	}

	logger.error(
		`[${req.method} ${req.url}] ${typeof message === 'string' ? message : JSON.stringify(message)
		}`
	);

	const response = ResultFunction(
		false,
		message,
		errCode,
		null
	);
	res.status(errCode).json(response);
};

export default errorHandler;
