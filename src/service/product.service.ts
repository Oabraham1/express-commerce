import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import ProductModel, { ProductDocument } from "../models/product.model"

export async function createProduct(input: DocumentDefinition<Omit<ProductDocument, 'createdOn' | 'productId'>>): Promise<ProductDocument> {
    try {
        const product = await ProductModel.create(input)
        return product
    } 
    catch (e: any) {
        throw new Error(e)
    }
}

export async function findProduct(query: FilterQuery<ProductDocument>){
    return ProductModel.findOne(query).lean()
}

export async function updateProduct(
    query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions, 
){
    try {
        return ProductModel.findOneAndUpdate(query, update, options)
    } 
    catch (e: any) {
        throw new Error(e)
    }
}