import { ISignup, ILogin } from "../../types/auth.type";
import User from "./user.service";
import { ResultFunction } from "../../helpers/utils";
import { comparePassword } from "../../helpers/hash";

import { signJwt } from "../../helpers/utils";

class Auth extends User {
    public async signup(input: ISignup) {
        const { username } = input
        const existingUser = await this.findExistingUser(username)
        if (existingUser) {
            return ResultFunction(false, "User already exists", 400, null)
        }
        const user = await this.createUser(input)
        if (!user) {
            return ResultFunction(false, "User creation failed", 500, null)
        }

        const token = signJwt(user);
        const { password, ...userWithoutPassword } = user;
        const responseData = { ...userWithoutPassword, token };

        return ResultFunction(true, "User created successfully", 201, responseData)
    }

    public async login(input: ILogin) {
        const { username, password } = input
        const user = await this.findExistingUser(username)
        if (!user) {
            return ResultFunction(false, "User not found", 404, null)
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return ResultFunction(false, "Invalid password", 401, null)
        }

        const token = signJwt(user);
        const { password: _, ...userWithoutPassword } = user;
        const responseData = { ...userWithoutPassword, token };

        return ResultFunction(true, "Login successful", 200, responseData)
    }
}

export default Auth