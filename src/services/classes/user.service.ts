import { prisma } from "../../database/conn";
import { hashPassword } from "../../helpers/hash";
import { ISignup } from "../../types/auth.type";
import Logger from "../Logger";

class User {
	private readonly logger = new Logger().logger;
	public async findExistingUser(username: string) {
		try {
			return prisma.user.findUnique({
				where: {
					username
				}
			})
		} catch (error) {
			this.logger.error("User not found")
			return null
		}
	}

	public async createUser(user: ISignup) {
		try {
			const hashed = await hashPassword(user.password)
			if (!hashed) {
				this.logger.error("Password hashing failed")
				return null
			}
			user.password = hashed
			return prisma.user.create({
				data: user
			})
		} catch (error) {
			this.logger.error("User creation failed")
			return null
		}
	}

	public async findUserById(id: string) {
		try {
			return prisma.user.findUnique({
				where: {
					id
				}
			})
		} catch (error) {
			this.logger.error("User not found")
			return null
		}
	}
}

export default User;