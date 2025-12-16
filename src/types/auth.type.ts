export interface ILogin {
	username: string;
	password: string;
}

export interface ISignup {
	username: string;
	email: string;
	password: string;
	profile_pic?: string
	cooking_skill_level?: string
	bio?: string
}
