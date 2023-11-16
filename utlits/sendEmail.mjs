import nodemailer from "nodemailer";
import path from "path";
import handlebarsEngine from "nodemailer-express-handlebars"


const transporter = nodemailer.createTransport({

   service:"gmail",
   auth:{
    user:"aliismailh08@gmail.com",
    pass:"rzht eany pmjh muzd"
   }

})


const handlebaroptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
}


export async function sendEmail (clientEmial, subject, content)
{

    transporter.use("compile", handlebarsEngine(handlebaroptions));
    // handle email option:

    const emailOption = {
        from : "aliismailh8@gmail.com",
        template: "email",
        to: clientEmial,
        subject: subject,
        context: {
         title: subject,
         content:content
        },
    }

    try {
        const sent = await transporter.sendMail(emailOption);
        
        if (sent)
           return true;

        else
          return false;

    } catch (error) {
        console.log(error.message)
    }

}


