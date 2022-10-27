import { get } from "lodash"
import config from 'config'
import { FilterQuery, UpdateQuery } from "mongoose"
import UserSessionModel, { UserSessionDocument } from "../models/session.model"
import { signJWT, verifyJWT } from "../utils/jwt.utils"
import { findUser } from "./user.service"

export async function createUserSession(userId: any) {
    const userSession = await UserSessionModel.create({user: userId})

    return userSession.toJSON()
}

export async function findUserSessions(query: FilterQuery<UserSessionDocument>){
    return UserSessionModel.find(query).lean()
}

export async function updateUserSession(query: FilterQuery<UserSessionDocument>, update: UpdateQuery<UserSessionDocument>){
    return UserSessionModel.updateOne(query, update)
}

export async function reIssueAccessToken({refreshToken}:{refreshToken:string}){
    const {decoded} = verifyJWT(refreshToken)

    if(!decoded || !get(decoded, 'session')){
        return false
    }

    const usersession = await UserSessionModel.findById(get(decoded, 'session'))
    if(!usersession || !usersession.valid) return false

    const user = await findUser({ _id: usersession.user })
    if(!user){
        return false
    }

    return signJWT(
        {...user, session: usersession._id},
        { expiresIn: config.get('accessTokenTimeToLive') }
    )
}