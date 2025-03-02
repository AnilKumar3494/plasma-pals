import sys
import smtplib
from email.message import EmailMessage

EMAIL_ADDRESS = "plasmapalsdemo@gmail.com"
EMAIL_PASSWORD = "irne mxml ghpm krwb"

def send_email(reciever, subject, body):
    msg = EmailMessage()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = reciever
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)

print(f"Sending email to: {sys.argv[1]}")

send_email(sys.argv[1], "PlasmaPals DONATION SUBMISSION!", "You completed a donation! \
 \n\nThanks, \nThe PlasmaPals")
