const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


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