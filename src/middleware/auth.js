const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const while_list = ["/", "/register", "/login", "/getProduct"];
    if (while_list.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            //verify
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    address: decoded.address,
                    role: decoded.role
                }
                console.log("check decoed", decoded);
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "token het han/token khong hop le"
                })
            }
        } else {
            return res.status(401).json({
                message: "Ban chua truyen access token/ token het han"
            })
        }
    }


}

module.exports = auth;