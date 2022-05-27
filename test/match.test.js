const {calculateTip,faherenheitToCelsius,add} = require("../src/math")

test("Calculate total with tip",()=>{
    const total = calculateTip(10,30)
    expect(total).toBe(13)
})


test("calcuate total without tip",()=>{
    const total = calculateTip(10)
    expect(total).toBe(11)
})


test("calculate f-c", ()=>{
    const temp = faherenheitToCelsius(32)
    expect(temp).toBe(0)
})

/* test("Async test demo", (done)=>{
    setTimeout(()=>{
        expect(1).toBe(2)
        done()
    },2000)

    
}) */

test("Promise in test", (done)=>{
    add(4,5).then((sum)=>{
        expect(sum).toBe(9)
        done()
    })
})

test("await in test",async()=>{
    const sum = await add(4,5)
    expect(sum).toBe(9)
   
})