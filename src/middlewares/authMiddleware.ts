// import { NextFunction, Request, Response } from "express";
// import { ResultFunction, verifyJwt } from "../helpers/utils";
// // import { ReturnStatus } from "../types/generic";
// // import User from "../models/user.model";
// import { prisma } from "../database/conn";
// import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

// const authMiddleWare = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // extract auth header
//   const authorization = req.headers.authorization;
//   const response = ResultFunction(
//     false,
//     "invalid or missing token",
//     401,
//     // ReturnStatus.INVALID_TOKEN,
//     null
//   );

//   if (!authorization) {
//     return res.status(response.code).json(response);
//   }

//   // check if token is bearer token

//   if (authorization.startsWith("Bearer ") === false) {
//     return res.status(response.code).json(response);
//   }

//   const token = authorization.split(" ")[1];
//   // extract jwt token
//   if (!token) {
//     return res.status(response.code).json(response);
//   }

//   // verify jwt token
//   // const payload = verifyJwt(token);
//   // if (payload instanceof JsonWebTokenError) {
//   //   // if it's an instance of JsonWebTokenError then something was wrong with the token
//   //   // check how JsonWebTokenError is handled in error handler
//   //   return next(payload);
//   // }

//   const id = req.body.id;
//   // // find user and add to res object
//   const data = await prisma.user.findUniqueOrThrow({ where: { id } });
//   const user = {
//     ...data,
//     token,
//   };
//   // console.log(user);

//   res.locals.user = user;

//   next();
// };

// export default authMiddleWare;

import { NextFunction, Request, Response } from "express";
import { ResultFunction, verifyJwt } from "../helpers/utils";
import { prisma } from "../database/conn";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      const response = ResultFunction(
        false,
        "Invalid or missing token",
        401,
        null
      );
      return res.status(response.code).json(response);
    }

    const token = authorization.split(" ")[1];

    // verify JWT token; if invalid, verifyJwt should throw
    const payload = verifyJwt(token) as { id: string };

    if (!payload || !payload.id) {
      const response = ResultFunction(false, "Invalid token", 401, null);
      return res.status(response.code).json(response);
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        profile_pic: true,
        bio: true,
        cooking_skill_level: true,
      },
    });

    res.locals.user = { ...user, token };
    next();
  } catch (error: any) {
    console.error("Auth Middleware Error:", error);
    const response = ResultFunction(false, "Unauthorized", 401, null);
    return res.status(response.code).json(response);
  }
};

export default authMiddleware;
