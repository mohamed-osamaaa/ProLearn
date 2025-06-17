import jwt from "jsonwebtoken";

const generateJWT = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
    });
    return token;
};

export default generateJWT;
