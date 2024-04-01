const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'service_email',
    auth:
        {
            user: 'admin@email.com',
            pass: 'your pass word'
        }
});

function sendPasswordResetEmail(email, resetToken){
    const mailOptions = {
        from: 'adminbiblioteca@gmail.com',
        to: email,
        subject: 'Recuperação de senha do Admin do sistema de biblioteca',
        html:    
        `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <p>Olá,</p>
            <p>Esqueceu sua senha do sistema ______, com o email: ${email}?</p>
            <p>Para redefinir sua senha, clique no botão abaixo:</p>
            <a href="http://localhost:3000/auth/reset_password/${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #00642c; color: #fff; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
            <p style="margin-top: 20px;">Se você não solicitou uma redefinição de senha, ignore este email.</p>
            <p style="margin-top: 20px;">Atenciosamente,</p>
            <p style="font-weight: bold;">Suco Maria Peregrina</p>
        </div>
    `};

    transporter.sendMail(mailOptions, (error) =>{
        if(error) {
            console.log(`Não foi possível enviar o email de recuperação de senha do user ${email}`, error);
        } else {
            console.log(`Email de recuperação de senha do user ${email} enviado com sucessso!`)
        }
    })

};

// Função para enviar o email de confirmação de alteração de senha
function sendPasswordResetConfirmationEmail(email) {
    const mailOptions = {
        from: 'youremail@email.com',
        to: email,
        subject: 'Confirmação de Alteração de Senha',
        html: `
            <p>Sua senha foi alterada com sucesso no sistema ________, com o email: ${email}.</p>
            <p>Se você não realizou esta alteração, entre em contato conosco imediatamente. Clique no link ou contate-nos pelo telefone: (xx) xxxxx-xxxx</p>
        `
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Erro ao enviar email de confirmação de alteração de senha: ', error);
        } else {
            console.log('Email de confirmação de alteração de senha enviado com sucesso.');

        }
    });
}


function generateResetToken(){
    const tokenLength = 30;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i<tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    };
    return token;
};

module.exports =  {
    sendPasswordResetEmail, 
    sendPasswordResetConfirmationEmail,
    generateResetToken
}