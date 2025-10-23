import mongoose from "mongoose";

const UserSChema = new mongoose.Schema({
    fullName: {
        type: String,
        required : true,
    },
    email: {
        type: String,
        required : true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    favorites: [
        {
          name: String,
          country: String,
          web_pages: [String],
        },
      ],
    gpa: {
        type: Number,
        default: null,
    },
    ielts: {
        type: Number,
        default: null,
    },
    sat: {
        type: Number,
        default: null,
    },
    currencyBalance: { type: Number, default: 10 },
    hasReceivedScoreBonus: { type: Boolean, default: false },

}, {
    timestamps: true,
},)

export default mongoose.model('User', UserSChema);