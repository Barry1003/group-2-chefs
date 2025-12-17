import { NextFunction, Request, Response, Router } from "express";
import { ResultFunction } from "../helpers/utils";
// import { ReturnStatus } from "../types/generic";
// import authMiddleWare from "../middlewares/authMiddleware";
import authRouter from "./auth.route";
import userRouter from "./user.route";


const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);


apiRouter.get("/health", (req: Request, res: Response) => {
    const data = ResultFunction(
        true,
        "Welcome to group-2-chefs v1.0. Cooking has begun!",
        200,
        // ReturnStatus.OK,
        null
    );
    return res.status(data.code).json(data);
});


apiRouter.use("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        error: false,
        data: {
            app: 'group-2-chefs',
            version: '1.0'
        },
        message: 'app is healthy',
        status: 200
    })
});

export default apiRouter;
