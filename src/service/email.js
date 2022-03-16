import{ init, send } from '@emailjs/browser';
init( process.env.REACT_APP_EMAILJS_USER_ID );

const sendMail = ( email, subject, content ) => {
    send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
            emailTo: email,
            emailSubject: subject,
            emailBody: content,
            emailFrom: "PopStore"
        },
        process.env.REACT_APP_EMAILJS_USER_ID
    ).then(
        ( response ) => {
            console.log( 'SUCCESS!', response.status, response.text );
        },
        ( error ) => {
            console.log( 'FAILED...', error );
        }
    );
};

export default sendMail;
