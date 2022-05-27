const request = require('supertest')
const app = require('../src/index')

test('sould sign up', async()=>{
    await request(app).post('/person').send({
        "name":"Anik Mondal",
    "email":"anik.mondal@codeclouds.in",
    "age":26,
    "password":"anik@123",
    }).expect(200)
})