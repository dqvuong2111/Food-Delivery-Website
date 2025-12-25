import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    cartData:{type:Object, default:{}},
    phone: {type:String, default:""},
    address: {type:Object, default:{
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: ""
    }},
    role: {type: String, default: "user"},
    wishlist: {type:Object, default:{}},
        resetPasswordToken: {type:String},
        resetPasswordExpires: {type:Date}
    },{minimize:false})

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;