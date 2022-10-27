import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

export interface UserDocument extends mongoose.Document {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    role: string
    joinedOn: Date
    lastUpdated: Date
    comparePassword(userPassword: string): Promise<Boolean>
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

userSchema.pre('save',
    async function (next) {
        const user = this as UserDocument

        if (!user.isModified('password')) {
            return next()
        }

        const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))
        user.password = bcrypt.hashSync(user.password, salt)

        return next()
    })

userSchema.methods.comparePassword = async function(
    userPassword: string
): Promise<boolean>{
    const user = this as UserDocument

    return bcrypt.compare(userPassword, user.password)
    .catch((e) =>
        false
    )
}

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel

