import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_otp_email(to_email, otp):
    smtp_server = "smtp.gmail.com"
    port = 587
    sender_email = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASSWORD")

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset OTP"
    message["From"] = sender_email
    message["To"] = to_email

    text = f"""
    Your OTP for password reset is: {otp}
    This OTP will expire in 10 minutes.
    """

    html = f"""
    <html>
      <body>
        <p>Your OTP for password reset is: <strong>{otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, to_email, message.as_string())

