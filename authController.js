const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require('./config');
const res = require('express/lib/response');

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "12h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                if (errors.array().length == 3) {
                    return res.status(400).json({
                        status: false,
                        message: "You have empty fields!"
                    })
                }
            }
            console.log(req.body);
            const {username, email, password, events} = req.body 
            const candidate = await User.findOne({email});
            if (candidate) {
                res.status(400).json({
                    status: false,
                    message: "Email is Busy!"
                });
            }
            const hashPass = bcrypt.hashSync(password, 7);
            const user = new User({username, email, password : hashPass, events});
            await user.save();
            res.json({
                status: true,
                message: "You have successfully registered!"
            });
            } catch(e) {
                console.log(e);
                res.status(400).json({
                    status: false,
                    message: 'Registration error'
                });
            }
        }


    async login(req, res) {
        try {
            console.log(req.body);
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User is not found!"
                });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: false,
                    message: "Wrong password, try again!"
                });
            }
            const token = generateAccessToken(user._id);
            res.json({
                status: true,
                message: "You are successfully logged in!", 
                token,
            });
        } catch(e) {
            console.log(e);
            res.status(400).json({
                status: false,
                message: 'Login error'
            });
        }
    }

    async getUserName(req, res) {
        try {
            let id = req.user.id;
            const user =  await User.findById(id);
            res.json(user);
        } catch(e) {
            console.log(e);
        }
    }

    async addEvent(req, res) {
        try {
            let id = req.user.id;
            const user = await User.findById(id)
            user.events.push(req.body)
            user.save()
            await user.updateOne(id);
        } catch(e) {
            console.log(e);
            res.status(400).json({
                status: false,
                message: 'Event error'
            });
        }
    }

    async getEvents(req, res) {
        try {
            let id = req.user.id;
            const user = await User.findById(id)
            res.json(user.events);
        } catch(e) {
            console.log(e);
            res.status(400).json({
                status: false,
                message: 'Event error'
            });
        }
    }

    async deleteEvent(req, res) {
        try {
            let id = req.user.id
            const user = await User.findById(id);
            let idEvent = req.body.id;
            user.events.splice(idEvent, 1);
            user.save();
            await user.updateOne(id);
        } catch(e) {
            console.log(e);
            res.status(400).json({
                status: false,
                message: 'Delete error'
            });
        }
    }

    async getWork(req, res) {
        try {
            res.json("server work")
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Work error'});
        }
    }

    async deleteUsers(req, res) {
        try {
            await User.deleteMany({})
            res.json("delete ok");
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Delete error'});
        }
    }
}

module.exports = new authController();