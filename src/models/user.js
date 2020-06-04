const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            }
        }
    },
    password: {
        type: String,
        trim: true
    },
    token: [String]
});


userSchema.statics.loginWithCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found!");
    const auth = await bcrypt.compare(password.toString(), user.password);
    if (!auth) throw new Error("Wrong password");
    return user;
}

userSchema.statics.findOneOrCreate = async ({ name, email }) => {
    let user = await User.findOne({ email });
    if (!user) {
       user = await User.create({ name, email });
    }
    return user;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.methods.generateToken = async function () {
    const userToken = jwt.sign({ email: this.email, id: this._id }, process.env.SECRET);
    this.token.push(userToken);
    await this.save()
    return userToken
}


const User = mongoose.model('User', userSchema);


module.exports = User;
