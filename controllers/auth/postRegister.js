const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postReigster = async (req, res) => {
    try {
        const {username, mail, password} = req.body;

        //check if user exists
        const userExistsWithMail = await User
        .exists({mail: mail.toLowerCase()});

        const userExistsWithUsername = await User
        .exists({username: username.toLowerCase()});

        if(userExistsWithMail) {
            return res.status(409)
            .send('Mail is already exists. Please choose new one!');
        }

        if(userExistsWithUsername) {
            return res.status(409)
            .send('Username is already exists. Please choose new one!');
        }

        //encrpyt password
        const encrpytedPassword = await bcrypt.hash(password, 10);

        //create user document and save in db
        const user = await User.create({
            username: username.toLowerCase(),
            mail: mail.toLowerCase(),
            password: encrpytedPassword,
        })

        //create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                mail,
                username
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: '24h'
            },
        );

        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username,
                _id: user._id,
            },
        });
        
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports = postReigster;