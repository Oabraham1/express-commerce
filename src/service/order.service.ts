import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import OrderModel, { OrderDocument } from "../models/order.model"

export async function createOrder(input: DocumentDefinition<Omit<OrderDocument, 'createdOn' | 'orderId'>>){
    try {
        return await OrderModel.create(input)
    }
    catch (e: any) {
        throw new Error(e)
    }
}

export async function findOrder(query: FilterQuery<OrderDocument>){
    return OrderModel.findOne(query).lean()
}

export async function updateOrder(
    query: FilterQuery<OrderDocument>, update: UpdateQuery<OrderDocument>, options: QueryOptions, 
){
    try {
        return OrderModel.findOneAndUpdate(query, update, options)
    } 
    catch (e: any) {
        throw new Error(e)
    }
}

export async function deleteOrder(query: FilterQuery<OrderDocument>){
    return OrderModel.findOneAndDelete(query).lean()
}