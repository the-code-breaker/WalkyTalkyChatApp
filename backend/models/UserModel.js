const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
        },
        email:{
            type: String,
            unique: true,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        pic:{
            type:String,
            default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        }
    },
    {
        timestamps: true
    }
);

userModel.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userModel.pre('save', async function (next){
    if(!this.modified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



const User = mongoose.model("User", userModel);
module.exports = User;