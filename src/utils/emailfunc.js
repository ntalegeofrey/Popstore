import sendMail from "../service/email";

const sendOrderConfirmationEmail = (email, store, storeLink, orderRef) => {
  const orderConfirmationEmail = `
    <!doctype html>
    <html lang="en">
    <head>
      <style>
        body {
          font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
        }
      </style>
      <title>PopStore Order</title>
    </head>
    <body>
      <h1>Order Confirmation</h1>
      <p>Thank you for your order. Your order from <b>${store.storeName}</b> has been placed successfully. You can view your order by visiting the following link:</p>
      <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
      <p>&nbsp;</p>
      <p>Regards</p>
      <p>PopStore Team</p>
    </body>
    </html>
  `;

  sendMail(email, "PopStore Order Confirmation", orderConfirmationEmail);
};

const sendNewOrderEmail = (store, storeLink, orderRef) => {
  const newOrderEmail = `
    <!doctype html>
    <html lang="en">
    <head>
      <style>
        body {
          font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
        }
      </style>
      <title>New PopStore Order</title>
    </head>
    <body>
      <h1>Order</h1>
      <p>A new order has been placed on <b>${store.storeName}</b>. You can view your order by visiting the following link:</p>
      <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
      <p>&nbsp;</p>
      <p>Regards</p>
      <p>PopStore Team</p>
    </body>
    </html>
  `;

  if (isEmail(store.storeOwner)) {
    sendMail(store.storeOwner, "New PopStore Order", newOrderEmail);
  }
};

export { sendOrderConfirmationEmail, sendNewOrderEmail };
