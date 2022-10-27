import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import ProductModel, { ProductDocument } from "../models/product.model"

export async function createProduct(input: DocumentDefinition<Omit<ProductDocument, 'createdOn' | 'productId'>>): Promise<ProductDocument> {
    try {
        return await ProductModel.create(input)
    } 
    catch (e: any) {
        throw new Error(e)
    }
}

export async function findProduct(query: FilterQuery<ProductDocument>){
    return ProductModel.findOne(query).lean()
}

export async function updateProduct(
    query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions
){
    // Escape $ in update query
    const updateQuery = JSON.parse(JSON.stringify(update).replace(/\$/g, "$$$$"))
    return ProductModel.findOneAndUpdate(query, updateQuery, options)
}
