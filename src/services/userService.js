const User = require("../models/user");
require("dotenv").config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const createUserService = async (name, email, password, confirmPassword) => {
    try {
        if (password != confirmPassword) {
            return null;
        }
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            return null;
        }

        //hash user password
        //save in database
        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "user",
            address: ""
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}


const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "email/password khong hop le"
                }
            } else {
                //create an access toke
                const payload = {
                    email: user.email,
                    name: user.name,
                    address: user.address,
                    role: user.role
                }
                const access_token = jwt.sign(payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    })
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        address: user.address,
                        role: user.role
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "email/password khong hop le"
            }
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}


const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateAccountService = async (email, address) => {
    try {
        let result = await User.updateOne({ email: email }, { address: address });
        return result
    } catch (error) {
        console.log(error);
        return null;
    }

}
const getCountAccountService = async () => {
    try {
        let result = await User.countDocuments({})
        return result
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createProductService = async () => {

}

module.exports = {
    createUserService,
    loginService,
    getUserService,
    updateAccountService,
    getCountAccountService,
    createProductService
}