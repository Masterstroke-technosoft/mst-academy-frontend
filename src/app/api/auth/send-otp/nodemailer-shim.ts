import tls from 'tls';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

interface TransportOptions {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user?: string;
    pass?: string;
  };
}

class SMTPClient {
  private options: TransportOptions;

  constructor(options: TransportOptions) {
    this.options = options;
  }

  sendMail(mailOptions: MailOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const host = this.options.host || (this.options.service === 'gmail' ? 'smtp.gmail.com' : '');
      const port = this.options.port || 465;

      if (!host) {
        return reject(new Error('SMTP Host not specified'));
      }

      const socket = tls.connect(port, host, {
        rejectUnauthorized: false
      });

      let step = 0;
      const userBase64 = Buffer.from(this.options.auth.user || '').toString('base64');
      const passBase64 = Buffer.from(this.options.auth.pass || '').toString('base64');

      const send = (data: string) => {
        socket.write(data + '\r\n');
      };

      let buffer = '';

      socket.on('data', (chunk) => {
        buffer += chunk.toString();
        
        // SMTP lines end with \r\n, wait until we have a full line
        if (!buffer.endsWith('\n')) {
          return;
        }

        const lines = buffer.trim().split('\n');
        buffer = '';
        const lastLine = lines[lines.length - 1];
        const code = parseInt(lastLine.substring(0, 3), 10);

        if (code >= 400) {
          socket.end();
          return reject(new Error(`SMTP Error: ${lastLine}`));
        }

        switch (step) {
          case 0: // Connection established, wait for 220
            if (code === 220) {
              send(`EHLO localhost`);
              step = 1;
            }
            break;
          case 1: // EHLO response, wait for 250
            if (code === 250) {
              send('AUTH LOGIN');
              step = 2;
            }
            break;
          case 2: // AUTH LOGIN response, wait for 334 Username
            if (code === 334) {
              send(userBase64);
              step = 3;
            }
            break;
          case 3: // Username sent, wait for 334 Password
            if (code === 334) {
              send(passBase64);
              step = 4;
            }
            break;
          case 4: // Password sent, wait for 235 Authentication successful
            if (code === 235) {
              send(`MAIL FROM:<${mailOptions.from || this.options.auth.user || ''}>`);
              step = 5;
            }
            break;
          case 5: // MAIL FROM response, wait for 250
            if (code === 250) {
              send(`RCPT TO:<${mailOptions.to}>`);
              step = 6;
            }
            break;
          case 6: // RCPT TO response, wait for 250
            if (code === 250) {
              send('DATA');
              step = 7;
            }
            break;
          case 7: // DATA response, wait for 354
            if (code === 354) {
              const emailData = [
                `From: ${mailOptions.from || this.options.auth.user || ''}`,
                `To: ${mailOptions.to}`,
                `Subject: ${mailOptions.subject}`,
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=utf-8',
                '',
                mailOptions.html,
                '.'
              ].join('\r\n');
              send(emailData);
              step = 8;
            }
            break;
          case 8: // Mail sent response, wait for 250
            if (code === 250) {
              send('QUIT');
              step = 9;
            }
            break;
          case 9: // QUIT response, close connection
            socket.end();
            resolve();
            break;
          default:
            socket.end();
            reject(new Error('Unexpected SMTP step'));
        }
      });

      socket.on('error', (err) => {
        reject(err);
      });
    });
  }
}

const nodemailer = {
  createTransport(options: TransportOptions) {
    return new SMTPClient(options);
  }
};

export default nodemailer;
