import supertest from "supertest"
import createServer from "../src/utils/server"
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { createProduct } from "../src/service/product.service"
import { signJWT } from "../src/utils/jwt.utils"

const app = createServer()
const creatorId = new mongoose.Types.ObjectId().toString()
export const productDetails = {
    title: "Test Product",
    inStock: true,
    sellerName: "Test Seller",
    sellerStatus: ["Test Status"],
    price: 100.24,
}
export const userDetails = {
    _id: creatorId,
    firstName: "Test",
    lastName: "User",
    email: "test@email.com",
    phoneNumber: "123456789",
    role: "admin",
}
describe('testing product endpoints', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('test get product endpoint', () => {
        describe('given product exists', () => {
            it('should return a 200', async () => {
                const product = await createProduct(productDetails)
                const { body,  statusCode} = await supertest(app).get(`/api/products/${product.productId}`)

                expect(statusCode).toBe(200)
                expect(body.productId).toBe(product.productId)
            })
        })

        describe('given product does not exist', () => {
            it('should return a 404', async () => {
                const productId = 'product-1234'
                await supertest(app).get(`/api/products/${productId}`).expect(404)
            })
        })
    })

    describe('test add product endpoint', () => {
        describe('when the user is logged in', () => {
            it('should return a 200 when the user adds a new product', async () => {
                const jwt = signJWT(userDetails)
                const {statusCode, body} = await supertest(app).post(`/api/products`).set('Authorization', `Bearer ${jwt}`).send(productDetails)

                expect(statusCode).toBe(200)
                expect(body).toEqual(
                    {"__v": 0, "_id": expect.any(String), "productId": expect.any(String), "createdAt": expect.any(String), "title": "Test Product", "inStock": true, "sellerName": "Test Seller", "sellerStatus": ["Test Status"], "price": 100.24, "updatedAt": expect.any(String)}
                )
            })
        })

        describe('when the user is not logged in', () => {
            it('should return a 403 only', async () => {
                const { statusCode } = await supertest(app).post(`/api/products`)
                expect(statusCode).toBe(403)
            })
        })
    })
})

