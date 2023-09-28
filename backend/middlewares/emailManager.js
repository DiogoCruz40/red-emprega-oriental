var cron = require('node-cron');
const Queue = require('bee-queue');
const config = require('../config/config');
const email = require('../models/email');
var transporter = require("../config/email");
const fs = require('fs');
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink);

const options = {
    removeOnSuccess: true,
    redis: {
        host: config.DB_HOST,
        port: config.DB_PORT,
    },
    activateDelayedJobs: true,
    delayedDebounce: 15000
}

const naoResponda = `
<span style="font-style: italic;font-size:14px">
Esta mensagem é enviada automaticamente, por favor não responda.
Em caso de dúvidas ou informações adicionais, aceda a <a href="https://www.workipedia.pt"
  target="_blank">www.workipedia.pt</a></span><br>
`
const sendEmailQueue = new Queue('sendEmail', options);

sendEmailQueue.process(1, async (job, done) => {
    var mailOptions = {
        from: "Workipedia.pt geral@workipedia.pt",
        to: job.data.to,
        subject: job.data.assunto,
        html: naoResponda + job.data.mensagem
    };
    if (job.data.anexo) {
        mailOptions.attachments = job.data.anexo;
    }
    console.log("A enviar email para: " + mailOptions.to);

    await transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            done("Não foi possivel mandar o email " + error);
        } else {
            email.findByIdAndUpdate(job.data._id, { sended: true }, async (err) => {
                if (err) {
                    res.status(400).send({ message: err });
                    return;
                }
                if (mailOptions.attachments)
                    await unlinkAsync(mailOptions.attachments.path);
            });
            console.log('Email enviado: %s', response.response);
        }
    });

    setTimeout(() => {
        done(null);
    }, 15000)

});



const placeEmail = async (email) => {
    const emailJob = await sendEmailQueue.createJob(email)
        .retries(3)
        .backoff('fixed', 5000)
        .save();

    emailJob.on('failed', (err) => {
        console.log(`Job ${emailJob.id} failed with error ${err}`);
    });
    emailJob.on('retrying', (err) => {
        console.log(
            `Job ${emailJob.id} failed with error ${err.message} but is being retried!`
        );
    });
    return emailJob;
};

module.exports.placeEmail = placeEmail;

//cron.schedule('15,30,45,59 * * * * *', () => {

/*var mailOptions = {
    from: 'netflixencalhados@gmail.com',
    to: "diogo.e.cruz@hotmail.com, p.m.cruz@hotmail.com",
    subject: 'Foi adicionado aos administradores da RedeEmprega Oriental',
    text: 'Exmo(a). Senhor(a),\n' + user.nome + '\n\nInformamos que foi adicionado aos administradores da RedeEmprega Oriental,' +
    '\nPara aceder dirija-se a https://red-emprega-oriental.pt/ ' + '\n\n\nEmail: ' + req.body.email + '\nPalavra-passe: ' + password +
    '\n\nPode alterar a sua palavra-passe em Perfil -> Alterar Palavra-Passe.'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});*/
   // console.log();
  // console.log('ola');
  //}).start();
