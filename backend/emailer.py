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

goal = int(sys.argv[2])
donations = int(sys.argv[3])
helped = donations * 3

left = (goal - donations * 50) / 50

print(goal, donations, helped, left)

send_email(sys.argv[1], f"PlasmaPals DONATION SUBMISSION!", f"You completed a donation!\n\n \
You're only {left} donations away from reaching your goal of ${goal}! You've helped aproximately \
{helped} people with your donation! \
 \n\nThanks, \nThe PlasmaPals")
