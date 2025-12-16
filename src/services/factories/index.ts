import Auth from "../classes/auth.service";

export const authFactory = () => {
    // define parameters for initialization here

    return new Auth();
};