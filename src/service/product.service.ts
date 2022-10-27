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
        // Sanitize update to ensure that untrusted data is interpreted as a literal value and not as a query object
        const sanitizedUpdate = update.$pullAll ? update : { $set: update }
        return await ProductModel.findOneAndUpdate(query, sanitizedUpdate, options).lean()
    } 
    catch (e: any) {
        throw new Error(e)
    }
}
