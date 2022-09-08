import { Request, Response } from "express"
import { CreateProductInput, FindProductInput, UpdateProductInput } from "../schema/product.schema"
import { createProduct, findProduct, updateProduct } from "../service/product.service"

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response) {
    try {
        const body = req.body
        const product = await createProduct({...body, inStock: true})
        
        return res.send(product)
    } 
    catch (e: any) {
        throw new Error(e)
    }
}

export async function findProductHandler(req: Request<FindProductInput['params']>, res: Response) {
    try {
        const productId = req.params.productId
        const product = await findProduct({productId})

        if(!product){
            return res.sendStatus(404)
        }
        return res.send(product)
    }
    catch (e: any) {
        throw new Error(e)
    }
}

export async function updateProductHandler(req: Request<UpdateProductInput['params']>, res: Response) {
    try {
        const productId = req.params.productId
        const update = req.body
        const product = await findProduct({$eq: {productId}})

        if(!product){
            return res.sendStatus(404)
        }

        const updatedProduct = await updateProduct({productId}, update, {new: true})

        return res.send(updatedProduct)
    }
    catch (e: any) {
        throw new Error(e)
    }
}