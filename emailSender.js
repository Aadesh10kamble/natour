const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

class Mail {
    from = `Admin <${process.env.ADMIN_EMAIL}>`;
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name;
        this.url = url;
    }

    #createTransport() {
        let options;
        if (process.env.NODE_ENV === "production") {
            options = {
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            };
        } else {
            options = {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            }
        }
        return nodemailer.createTransport(options);
    }
    async #send(template, subject) {

        const html = pug.renderFile(`${__dirname}/public/views/${template}.pug`, {
            name: this.name,
            url: this.url
        });

        await this.#createTransport().sendMail({
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText.fromString(html)
        })
    }
    async sendWelcome() {
        await this.#send("welcome", "Account Created!");
    }
    async sendResetEmail() {
        await this.#send("resetpassword", "Reset Code");
    }
}

module.exports = Mail;



















// const sendMail = async function (options) {
//     const transport = nodemailer.createTransport ({
//         host : process.env.EMAIL_HOST,
//         port : process.env.EMAIL_PORT,
//         auth : {
//             user : process.env.EMAIL_USERNAME,
//             pass : process.env.EMAIL_PASSWORD
//         }
//     });
//     const mailOptions = {
//         from : "Aadesh Kamble",
//         to : options.email,
//         suject : "Password Reset",
//         text : `Reset Code : ${options.resettoken}`
//     }
//     await transport.sendMail (mailOptions);
// };

// exports.sendMail = sendMail;