
// const nodemailer=require("nodemailer")
const {Resend}=require("resend")
const resend=new Resend(process.env.RESEND_API_KEY)
async function mailGen(mail,otp,purpose){
   let message=purpose=="sign"?`dont  share otp ${otp}, use `:`dont  share otp ${otp}, use and update your password`
   let subject=purpose=="sign"?"account create otp":"password change otp"

   const {data,error}=await resend.emails.send({
      from:process.env.MAIL,
      to:[mail],
      subject:subject,
      text:message
   });
   if(error){
      console.log("email error:",error)
      throw new Error(error.mesage)
   }
   return data;
   
}
module.exports=mailGen

/*
let transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.MAIL,
            pass:process.env.APP_PASS
        }
    })
   let mailOptions={
    from:process.env.MAIL,
    to:mail,
    subject:subject,
    text:message
   }
   try{
const info=await transport.sendMail(mailOptions)
console.log("email send successfully")
return info
   }catch(err){
console.error("error sending email",err)
throw err
   }
*/ 