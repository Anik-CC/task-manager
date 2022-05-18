const sgMail = require('@sendgrid/mail')
const sendgridApiKey = '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'

sgMail.setApiKey(sendgridApiKey)


const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'anik.mondal@codeclouds.in',
        subject: 'Thanks for Joining',
        text:`Wecome to the app ${name}. Let me know how to go along the app.. `
    })
    console.log("mail sent to "+name+" to email "+email)
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'anik.mondal@codeclouds.in',
        subject: 'Goodbye 😒',
        text:`It was nice to have you onboard ${name}. Let me know if you change your mind.. `
    })
    console.log("mail sent to "+name+" to email "+email)
}


module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}