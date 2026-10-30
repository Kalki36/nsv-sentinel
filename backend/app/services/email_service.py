import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone, timedelta
from typing import Tuple

from app.core.config import settings

logger = logging.getLogger("nsv_sentinel.email")

def send_otp_email(
    to_email: str,
    otp: str,
    user_name: str = "Analyst",
    ip_address: str = "127.0.0.1"
) -> Tuple[bool, str]:
    """
    Dispatches a 2FA One-Time Password (OTP) verification email to the user's registered email address.
    Supports real SMTP delivery (Gmail, Outlook, custom SMTP) and provides resilient dev fallback.
    Returns (True, success_msg) if email was actually delivered via SMTP, or (False, reason) if not delivered.
    """
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    current_time_ist = datetime.now(ist_tz).strftime("%d %b %Y, %I:%M:%S %p IST")
    expires_minutes = settings.OTP_EXPIRE_MINUTES

    subject = f"[NSV SENTINEL] 🔐 Login Verification Code: {otp}"

    # Plain-text version
    text_content = f"""NSV SENTINEL — SECURE FINANCIAL MARKET INTELLIGENCE
Two-Factor Authentication Security Verification
================================================================================

Hello {user_name},

A login attempt was initiated for your NSV Sentinel account ({to_email}).
Your 6-digit One-Time Password (OTP) is:

    ======================
        {otp}
    ======================

This code is valid for {expires_minutes} minutes and can only be used once.

Request Details:
- Time: {current_time_ist}
- Client IP: {ip_address}
- Protocol: AES-256-GCM / SHA-256 Auth

If you did not initiate this login, please secure your credentials immediately.

NSV Sentinel Security Team
Academic Prototype — Team Nikhil · Samyak · Vrind
"""

    # HTML formatted email
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      background-color: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #e2e8f0;
    }}
    .container {{
      max-width: 540px;
      margin: 0 auto;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      border-bottom: 1px solid #312e81;
      padding: 24px;
      text-align: center;
    }}
    .logo {{
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #38bdf8;
      margin: 0;
    }}
    .badge {{
      display: inline-block;
      margin-top: 8px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .content {{
      padding: 32px 24px;
    }}
    .greeting {{
      font-size: 15px;
      color: #94a3b8;
      margin-top: 0;
      margin-bottom: 16px;
    }}
    .instruction {{
      font-size: 14px;
      line-height: 1.6;
      color: #cbd5e1;
      margin-bottom: 24px;
    }}
    .otp-card {{
      background: #020617;
      border: 1px solid #22c55e;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }}
    .otp-label {{
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #86efac;
      margin-bottom: 8px;
    }}
    .otp-code {{
      font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #22c55e;
      text-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
    }}
    .otp-expiry {{
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
    }}
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin: 20px 0;
      border-top: 1px solid #1e293b;
      border-bottom: 1px solid #1e293b;
    }}
    .meta-table td {{
      padding: 8px 4px;
      color: #94a3b8;
    }}
    .meta-table td.val {{
      color: #f1f5f9;
      text-align: right;
      font-family: monospace;
    }}
    .warning {{
      background: rgba(239, 68, 68, 0.1);
      border-left: 3px solid #ef4444;
      padding: 12px 14px;
      border-radius: 4px;
      font-size: 12px;
      color: #fca5a5;
      line-height: 1.5;
      margin-top: 20px;
    }}
    .footer {{
      background: #090d16;
      border-top: 1px solid #1e293b;
      padding: 16px 24px;
      text-align: center;
      font-size: 11px;
      color: #475569;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NSV SENTINEL</div>
      <div class="badge">Two-Factor Authentication</div>
    </div>
    <div class="content">
      <p class="greeting">Hello {user_name},</p>
      <p class="instruction">
        A sign-in request was received for your terminal account. Enter the verification code below to authorize your session:
      </p>

      <div class="otp-card">
        <div class="otp-label">One-Time Verification Code</div>
        <div class="otp-code">{otp}</div>
        <div class="otp-expiry">⏱ Valid for next {expires_minutes} minutes</div>
      </div>

      <table class="meta-table">
        <tr>
          <td>Recipient Email</td>
          <td class="val">{to_email}</td>
        </tr>
        <tr>
          <td>Request Timestamp</td>
          <td class="val">{current_time_ist}</td>
        </tr>
        <tr>
          <td>Client IP Address</td>
          <td class="val">{ip_address}</td>
        </tr>
        <tr>
          <td>Security Layer</td>
          <td class="val">Argon2id + JWT + AES-256</td>
        </tr>
      </table>

      <div class="warning">
        <strong>Security Notice:</strong> If you did not request this verification code, someone may have knowledge of your credentials. Please secure your account immediately.
      </div>
    </div>
    <div class="footer">
      NSV Sentinel Academic Financial Intelligence Platform · Team Nikhil · Samyak · Vrind<br>
      Automated dispatch — Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
"""

    clean_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    clean_password = settings.SMTP_PASSWORD.replace(" ", "").strip() if settings.SMTP_PASSWORD else ""

    # Sender email determination based on provider
    if "gmail.com" in (settings.SMTP_HOST or "").lower() and "@" in clean_user:
        sender_email = clean_user
    elif settings.SMTP_FROM_EMAIL:
        sender_email = settings.SMTP_FROM_EMAIL
    elif "@" in clean_user:
        sender_email = clean_user
    else:
        sender_email = "security@nsv-sentinel.com"

    sender_display = f"{settings.SMTP_FROM_NAME} <{sender_email}>"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_display
    msg["To"] = to_email
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    # Attempt real SMTP dispatch if credentials configured
    if clean_user and clean_password:
        try:
            logger.info(f"Dispatching OTP email via SMTP to {to_email} ({settings.SMTP_HOST}:{settings.SMTP_PORT})...")
            if settings.SMTP_PORT == 465 or settings.SMTP_SSL:
                with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    server.login(clean_user, clean_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    if settings.SMTP_TLS:
                        server.starttls()
                    server.login(clean_user, clean_password)
                    server.send_message(msg)

            logger.info(f"✅ OTP email successfully delivered to {to_email}")
            return True, f"OTP email successfully dispatched to {to_email}"
        except smtplib.SMTPAuthenticationError as auth_err:
            reason = "Gmail authentication requires a 16-character 'App Password'. Visit https://myaccount.google.com/apppasswords with 2-Step Verification enabled."
            logger.error(f"❌ Gmail SMTP Authentication Error for {to_email}: {auth_err}. {reason}")
            _log_otp_console(to_email, otp, reason)
            return False, f"SMTP Authentication failed: {reason}"
        except Exception as exc:
            logger.error(f"❌ Failed to dispatch email via SMTP to {to_email}: {exc}")
            _log_otp_console(to_email, otp, f"SMTP delivery notice: {exc}")
            return False, f"SMTP delivery error: {str(exc)}"

    # If SMTP is not configured, log clearly to terminal/console for dev & audit
    _log_otp_console(to_email, otp, "SMTP credentials not configured in backend/.env (Simulated Mode active)")
    return False, "SMTP credentials (SMTP_USER / SMTP_PASSWORD) not configured in backend/.env"

def send_registration_otp_email(
    to_email: str,
    otp: str,
    user_name: str = "New Analyst",
    ip_address: str = "127.0.0.1"
) -> Tuple[bool, str]:
    """
    Dispatches an Account Registration verification OTP code to the user's email address.
    """
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    current_time_ist = datetime.now(ist_tz).strftime("%d %b %Y, %I:%M:%S %p IST")
    expires_minutes = settings.OTP_EXPIRE_MINUTES

    subject = f"[NSV SENTINEL] 🔐 Verify Your Email — Registration Code: {otp}"

    text_content = f"""NSV SENTINEL — SECURE FINANCIAL MARKET INTELLIGENCE
Account Registration Verification
================================================================================

Hello {user_name},

Welcome to NSV Sentinel. To complete your account registration and verify your email ({to_email}), please enter the following 6-digit verification code:

    ======================
        {otp}
    ======================

This verification code is valid for {expires_minutes} minutes.
Your chosen password is encrypted with Argon2id memory-hard hashing and stored securely in the system database.

Request Details:
- Time: {current_time_ist}
- Client IP: {ip_address}
- Protocol: Argon2id + AES-256 Auth

If you did not initiate this registration, please disregard this email.

NSV Sentinel Security Team
Academic Prototype — Team Nikhil · Samyak · Vrind
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      background-color: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #e2e8f0;
    }}
    .container {{
      max-width: 540px;
      margin: 0 auto;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      border-bottom: 1px solid #312e81;
      padding: 24px;
      text-align: center;
    }}
    .logo {{
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #38bdf8;
      margin: 0;
    }}
    .badge {{
      display: inline-block;
      margin-top: 8px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }}
    .content {{
      padding: 28px 24px;
    }}
    .greeting {{
      font-size: 15px;
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 12px;
    }}
    .message {{
      font-size: 13px;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 24px;
    }}
    .otp-box {{
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border: 2px dashed #38bdf8;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }}
    .otp-code {{
      font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #38bdf8;
      margin: 6px 0;
    }}
    .otp-expiry {{
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
    }}
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }}
    .meta-table td {{
      padding: 8px 12px;
      border-bottom: 1px solid #1e293b;
      color: #64748b;
    }}
    .meta-table td.val {{
      color: #cbd5e1;
      font-weight: 500;
      text-align: right;
    }}
    .footer {{
      background-color: #0b1120;
      border-top: 1px solid #1e293b;
      padding: 16px 24px;
      text-align: center;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NSV SENTINEL</div>
      <div class="badge">EMAIL VERIFICATION · REGISTRATION</div>
    </div>
    <div class="content">
      <div class="greeting">Hello {user_name},</div>
      <div class="message">
        Welcome to NSV Sentinel. To complete creating your institutional account with email <strong>{to_email}</strong>, please enter your registration verification code below:
      </div>

      <div class="otp-box">
        <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your 6-Digit Registration Code</div>
        <div class="otp-code">{otp}</div>
        <div class="otp-expiry">⏱ Valid for next {expires_minutes} minutes</div>
      </div>

      <table class="meta-table">
        <tr>
          <td>Account Email</td>
          <td class="val">{to_email}</td>
        </tr>
        <tr>
          <td>Request Timestamp</td>
          <td class="val">{current_time_ist}</td>
        </tr>
        <tr>
          <td>Encryption Standard</td>
          <td class="val">Argon2id Memory-Hard Hash</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      NSV Sentinel Academic Financial Intelligence Platform · Team Nikhil · Samyak · Vrind<br>
      Automated dispatch — Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
"""
    clean_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    clean_password = settings.SMTP_PASSWORD.replace(" ", "").strip() if settings.SMTP_PASSWORD else ""

    if "gmail.com" in (settings.SMTP_HOST or "").lower() and "@" in clean_user:
        sender_email = clean_user
    elif settings.SMTP_FROM_EMAIL:
        sender_email = settings.SMTP_FROM_EMAIL
    else:
        sender_email = "security@nsv-sentinel.com"

    sender_display = f"{settings.SMTP_FROM_NAME} <{sender_email}>"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_display
    msg["To"] = to_email
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    if clean_user and clean_password:
        try:
            logger.info(f"Dispatching registration OTP email via SMTP to {to_email}...")
            if settings.SMTP_PORT == 465 or settings.SMTP_SSL:
                with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    server.login(clean_user, clean_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    if settings.SMTP_TLS:
                        server.starttls()
                    server.login(clean_user, clean_password)
                    server.send_message(msg)

            logger.info(f"✅ Registration OTP email successfully delivered to {to_email}")
            return True, f"Registration OTP email dispatched to {to_email}"
        except Exception as exc:
            logger.error(f"❌ Failed to dispatch registration email to {to_email}: {exc}")
            _log_otp_console(to_email, otp, f"Registration SMTP note: {exc}")
            return False, str(exc)

    _log_otp_console(to_email, otp, "SMTP credentials not active (Registration Code Simulated)")
    return False, "SMTP simulated mode active"

def _log_otp_console(email: str, otp: str, reason: str = ""):
    banner = f"""
================================================================================
  [NSV SENTINEL] 🔐 2FA LOGIN VERIFICATION CODE
--------------------------------------------------------------------------------
  Recipient : {email}
  OTP Code  : >>> {otp} <<<
  Validity  : {settings.OTP_EXPIRE_MINUTES} minutes
  Notice    : {reason}
  To deliver live emails to {email}, add SMTP_USER & SMTP_PASSWORD in backend/.env
================================================================================
"""
    logger.warning(banner)
    print(banner, flush=True)

def send_password_reset_email(
    to_email: str,
    reset_link: str,
    reset_code: str,
    user_name: str = "Analyst",
    ip_address: str = "127.0.0.1"
) -> Tuple[bool, str]:
    """
    Dispatches a password reset email containing both a direct clickable reset link
    and a 6-digit verification code.
    """
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    current_time_ist = datetime.now(ist_tz).strftime("%d %b %Y, %I:%M:%S %p IST")

    subject = "[NSV SENTINEL] 🔐 Reset Your Password Request"

    text_content = f"""NSV SENTINEL — SECURE FINANCIAL MARKET INTELLIGENCE
Password Reset Request
================================================================================

Hello {user_name},

We received a request to reset the password for your NSV Sentinel account ({to_email}).

To reset your password, visit the link below:
{reset_link}

Alternatively, enter this 6-digit reset PIN on the password reset screen:
    ======================
        {reset_code}
    ======================

This link and code are valid for 15 minutes.
If you did not request a password reset, please ignore this email.

Request Details:
- Time: {current_time_ist}
- Client IP: {ip_address}
- Protocol: Argon2id / AES-256 Auth

NSV Sentinel Security Team
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #e2e8f0; }}
    .container {{ max-width: 540px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); }}
    .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border-bottom: 1px solid #312e81; padding: 24px; text-align: center; }}
    .logo {{ font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #38bdf8; margin: 0; }}
    .badge {{ display: inline-block; margin-top: 8px; padding: 3px 10px; font-size: 11px; font-weight: 600; border-radius: 9999px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); text-transform: uppercase; letter-spacing: 1px; }}
    .content {{ padding: 32px 24px; }}
    .btn {{ display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; text-decoration: none; margin: 20px 0; }}
    .code-box {{ background: #020617; border: 1px dashed #38bdf8; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0; }}
    .code-val {{ font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #38bdf8; }}
    .footer {{ background: #090d16; border-top: 1px solid #1e293b; padding: 16px 24px; text-align: center; font-size: 11px; color: #475569; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NSV SENTINEL</div>
      <div class="badge">Password Reset Request</div>
    </div>
    <div class="content">
      <p>Hello {user_name},</p>
      <p>A request was received to reset the password for your terminal account. Click the button below to choose a new password:</p>

      <div style="text-align: center;">
        <a href="{reset_link}" class="btn" target="_blank">Reset Your Password</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; text-align: center;">Or enter this 6-digit Reset PIN directly on the reset screen:</p>
      <div class="code-box">
        <div class="code-val">{reset_code}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 6px;">⏱ Valid for 15 minutes</div>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px;">
        If you did not initiate this request, no action is needed. Your current password remains secure.
      </p>
    </div>
    <div class="footer">
      NSV Sentinel Academic Financial Intelligence Platform · Automated Security Notification
    </div>
  </div>
</body>
</html>
"""

    clean_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    clean_password = settings.SMTP_PASSWORD.replace(" ", "").strip() if settings.SMTP_PASSWORD else ""

    if "gmail.com" in (settings.SMTP_HOST or "").lower() and "@" in clean_user:
        sender_email = clean_user
    elif settings.SMTP_FROM_EMAIL:
        sender_email = settings.SMTP_FROM_EMAIL
    else:
        sender_email = "security@nsv-sentinel.com"

    sender_display = f"{settings.SMTP_FROM_NAME} <{sender_email}>"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_display
    msg["To"] = to_email
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    if clean_user and clean_password:
        try:
            logger.info(f"Dispatching Password Reset email via SMTP to {to_email}...")
            if settings.SMTP_PORT == 465 or settings.SMTP_SSL:
                with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    server.login(clean_user, clean_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                    if settings.SMTP_TLS:
                        server.starttls()
                    server.login(clean_user, clean_password)
                    server.send_message(msg)

            logger.info(f"✅ Password reset email successfully delivered to {to_email}")
            return True, f"Password reset email sent to {to_email}"
        except Exception as exc:
            logger.error(f"❌ Failed to dispatch password reset email via SMTP: {exc}")
            _log_reset_console(to_email, reset_link, reset_code, str(exc))
            return False, f"SMTP delivery failed: {str(exc)}"

    _log_reset_console(to_email, reset_link, reset_code, "SMTP credentials pending in backend/.env")
    return False, "SMTP unconfigured"

def _log_reset_console(email: str, link: str, code: str, reason: str = ""):
    banner = f"""
================================================================================
  [NSV SENTINEL] 🔐 PASSWORD RESET LINK & VERIFICATION CODE
--------------------------------------------------------------------------------
  Recipient  : {email}
  Reset Link : {link}
  Reset PIN  : >>> {code} <<<
  Validity   : 15 minutes
  Notice     : {reason}
================================================================================
"""
    logger.warning(banner)
    print(banner, flush=True)
