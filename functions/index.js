const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configurar Nodemailer con tu servicio de email
const transporter = nodemailer.createTransport({
  service: "gmail", // o tu servicio de email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // O usa App Password si es Gmail
  },
});

/**
 * Enviar email personalizado de recuperación de contraseña
 */
exports.sendPasswordResetEmail = functions.https.onCall(async (data) => {
  const { email, resetLink } = data;

  if (!email || !resetLink) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email y resetLink son requeridos"
    );
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Recupera tu contraseña - ICFES Master",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); color: white; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 30px; color: #333; line-height: 1.6; }
              .greeting { font-size: 16px; margin-bottom: 20px; }
              .message { margin: 20px 0; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
                  color: white; 
                  padding: 14px 40px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold;
                  margin: 30px 0;
              }
              .cta-button:hover { opacity: 0.9; }
              .warning-box {
                  background-color: #fff3cd;
                  border-left: 4px solid #ffc107;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 4px;
              }
              .warning-box strong { color: #856404; }
              .warning-box li { color: #856404; margin: 8px 0; }
              .link-box {
                  background-color: #f0f0f0;
                  padding: 15px;
                  border-radius: 4px;
                  margin: 20px 0;
                  word-break: break-all;
                  font-size: 12px;
              }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
              .footer p { margin: 5px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🔐 Recuperar tu Contraseña</h1>
              </div>
              <div class="content">
                  <p class="greeting">Hola,</p>
                  
                  <p class="message">
                      Recibimos una solicitud para restablecer tu contraseña en <strong>ICFES Master</strong>.
                  </p>
                  
                  <p class="message">
                      Haz clic en el siguiente botón para crear una nueva contraseña:
                  </p>
                  
                  <div style="text-align: center;">
                      <a href="${resetLink}" class="cta-button">Restablecer Contraseña</a>
                  </div>
                  
                  <div class="warning-box">
                      <strong>⚠️ Importante:</strong>
                      <ul>
                          <li>Este enlace expirará en <strong>1 hora</strong> por razones de seguridad</li>
                          <li>No compartas este enlace con otras personas</li>
                          <li>Si no solicitaste este cambio, puedes ignorar este email de forma segura</li>
                      </ul>
                  </div>
                  
                  <p class="message">
                      Si tienes problemas con el botón anterior, copia y pega este enlace en tu navegador:
                  </p>
                  
                  <div class="link-box">
                      ${resetLink}
                  </div>
                  
                  <p class="message" style="color: #666; font-size: 14px;">
                      Si no reconoces esta actividad, <strong>cambia tu contraseña inmediatamente</strong> o contáctanos.
                  </p>
              </div>
              <div class="footer">
                  <p><strong>ICFES Master</strong> - Tu plataforma de preparación</p>
                  <p>© 2025 ICFES Master - Todos los derechos reservados</p>
                  <p>Este es un correo automático generado automáticamente. Por favor, no respondas a este mensaje.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `
      RECUPERAR CONTRASEÑA - ICFES MASTER

      Hola,

      Recibimos una solicitud para restablecer tu contraseña en ICFES Master.

      Haz clic en el siguiente enlace para crear una nueva contraseña:
      ${resetLink}

      IMPORTANTE:
      - Este enlace expirará en 1 hora
      - No compartas este enlace con otros
      - Si no solicitaste este cambio, ignora este email

      Si tienes problemas con el enlace anterior, cópialo y pégalo en tu navegador.

      © 2025 ICFES Master - Todos los derechos reservados
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email enviado correctamente" };
  } catch (error) {
    console.error("Error enviando email:", error);
    throw new functions.https.HttpsError("internal", "Error al enviar el email");
  }
});
