import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Đảm bảo load env variables
dotenv.config();

// Kiểm tra và log để debug
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

const defaultUrl = ["/", "/registerUser", '/handleLogin', '/handleLogout'];
const createToken = (payload) => {
    let token = null;
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });
    } catch (err) {
        console.log('Error creating token:', err);
        throw err;
    }
    return token;
}

const createRefreshToken = (payload) => {
    let refreshToken = null;
    try {
        console.log('Creating token with secret:', process.env.JWT_REFRESH_SECRET);
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        });
    } catch (err) {
        console.log('Error creating refresh token:', err);
        throw err;
    }
    return refreshToken;
}

const verifyToken = (token) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log('Error verifying token:', err);
        return null;
    }
}

const verifyRefreshToken = (refreshToken) => {
    try {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        console.log('Error verifying refresh token:', err);
        return null;
    }
}

const checkTokenWithCookie = (req, res, next) => {
    if (defaultUrl.includes(req.path)) {
        return next();
    }

    if ((req.cookies && req.cookies.jwt) || req.headers.authorization.split(' ')[1]) {
        let reqToken = req.cookies.jwt || req.headers.authorization.split(' ')[1];
        let reqDecoded = verifyToken(reqToken);
        if (reqDecoded !== null) {
            req.user = reqDecoded;
            req.token = reqToken;
            return next();
        } else {
            return res.status(401).json({
                EC: 401,
                EM: "Unauthorized",
                DT: ""
            });
        }
    } else {
        return res.status(401).json({
            EC: 401,
            EM: "Please login again...",
            DT: ""
        });
    }
}

const checkAuthentication = (req, res, next) => {
    if (defaultUrl.includes(req.path) || req.path === "/account") {
        return next();
    }
    if (req.user && req.user.groupRole && req.user.groupRole) {
        let role = req.user.groupRole[0].groupData;
        if (role && role.length > 0) {
            let allowedRoles = role.map(r => r.url);
            if (allowedRoles.includes(req.path)) {
                return next();
            } else {
                return res.status(403).json({
                    EC: 403,
                    EM: "Forbidden " + req.path,
                    DT: ""
                });
            }
        } else {
            return res.status(403).json({
                EC: 403,
                EM: "Forbidden",
                DT: ""
            });
        }
    } else {
        return res.status(401).json({
            EC: 401,
            EM: "Unauthorized",
            DT: ""
        });
    }
}

module.exports = {
    createToken,
    createRefreshToken,
    verifyToken,
    verifyRefreshToken,
    checkTokenWithCookie,
    checkAuthentication,
}