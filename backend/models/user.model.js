import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,    
        required: true,
        unique: true    
    },
    password: { 
        type: String,    
        required: true    
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bannerImg: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "CareerConnect User"
    },  
    location: {
        type: String,
        default: ""
    },
    about: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        title:String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
    },
    education: {
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String
    },
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema);