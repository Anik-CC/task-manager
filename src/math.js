const calculateTip = (total,tipPercentage=10)=> total * (tipPercentage/100)+total 


const faherenheitToCelsius = (temp)=> (temp-32)/1.8

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject("no must be non negetive")
            }
            resolve(a + b)
        }, 1000)
    })
}


module.exports = {
    calculateTip,
    faherenheitToCelsius,
    add
}