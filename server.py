"""
Royal Store — Production Backend Server
Handles: OTP email, order notifications, static file serving
"""
import http.server
import json
import smtplib
import random
import string
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import parse_qs

# ── Configuration ──
ADMIN_EMAIL = "siddharths1003@gmail.com"
SMTP_SENDER = "siddharths1003@gmail.com"
SMTP_PASS = "lzzn vltr nfil qica"
PORT = 8080

otp_store = {}  # email -> otp

def send_email(to_email, subject, body_html):
    """Send HTML email via Gmail SMTP"""
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Royal Store <{SMTP_SENDER}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body_html, "html"))
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_SENDER, SMTP_PASS)
            server.send_message(msg)
        print(f"[EMAIL] Sent to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


class RoyalHandler(http.server.SimpleHTTPRequestHandler):
    """Request handler with CORS and API routes"""

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        return json.loads(body.decode("utf-8"))

    def _respond(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_POST(self):
        data = self._read_json()

        if self.path == "/send-otp":
            email = data.get("email", "")
            if not email:
                return self._respond(400, {"status": "error", "msg": "Email required"})
            otp = "".join(random.choices(string.digits, k=6))
            otp_store[email] = otp
            html = f"""
            <div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:auto;background:linear-gradient(135deg,#020C1B,#0A192F);padding:40px;border-radius:16px;border:1px solid rgba(58,123,213,0.3);">
                <div style="text-align:center;margin-bottom:24px;">
                    <span style="font-size:2.5rem;">👑</span>
                    <h1 style="color:#3A7BD5;margin:10px 0 0;font-size:1.8rem;">Royal Store</h1>
                    <p style="color:#8892B0;margin-top:4px;">Security Verification</p>
                </div>
                <div style="background:rgba(58,123,213,0.1);border:1px solid rgba(58,123,213,0.2);border-radius:12px;padding:24px;text-align:center;margin:20px 0;">
                    <p style="color:#CCD6F6;margin-bottom:12px;">Your verification code is:</p>
                    <div style="font-size:2.5rem;font-weight:800;letter-spacing:12px;color:#3A7BD5;">{otp}</div>
                </div>
                <p style="color:#5A6A8A;font-size:0.85rem;text-align:center;">This code expires in 10 minutes. Never share it with anyone.</p>
            </div>"""
            ok = send_email(email, "Royal Store — Verification Code", html)
            return self._respond(200 if ok else 500, {"status": "success" if ok else "failed"})

        elif self.path == "/verify-otp":
            email = data.get("email", "")
            otp = data.get("otp", "")
            stored = otp_store.get(email)
            if stored and stored == otp:
                del otp_store[email]
                # Notify admin of new sign-in
                send_email(ADMIN_EMAIL, f"Royal Store — New User Login: {email}",
                    f"<p>User <strong>{email}</strong> just signed in to Royal Store.</p>")
                return self._respond(200, {"status": "success"})
            return self._respond(401, {"status": "invalid_otp"})

        elif self.path == "/place-order":
            code = data.get("code", "N/A")
            email = data.get("email", "")
            name = data.get("customerName", "Customer")
            method = data.get("method", "shop")
            address = data.get("address", "Collect from Shop")
            items = data.get("items", [])
            subtotal = data.get("subtotal", 0)
            delivery_charge = data.get("deliveryCharge", 0)
            total = data.get("total", 0)

            rows = "".join(
                f"<tr><td style='padding:10px;border:1px solid #2a3f5f;'>{i['name']}</td>"
                f"<td style='padding:10px;border:1px solid #2a3f5f;text-align:center;'>{i['qty']}</td>"
                f"<td style='padding:10px;border:1px solid #2a3f5f;text-align:right;'>₹{i['price']:,}</td>"
                f"<td style='padding:10px;border:1px solid #2a3f5f;text-align:right;'>₹{i['price']*i['qty']:,}</td></tr>"
                for i in items
            )

            order_html = f"""
            <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#0A192F;padding:40px;border-radius:16px;border:1px solid rgba(58,123,213,0.3);color:#CCD6F6;">
                <div style="text-align:center;margin-bottom:30px;">
                    <span style="font-size:2rem;">👑</span>
                    <h2 style="color:#3A7BD5;margin:8px 0;">New Order — #{code}</h2>
                </div>
                <table style="width:100%;margin-bottom:20px;font-size:0.9rem;">
                    <tr><td style="color:#8892B0;padding:6px 0;">Customer</td><td style="text-align:right;">{name} ({email})</td></tr>
                    <tr><td style="color:#8892B0;padding:6px 0;">Method</td><td style="text-align:right;">{'🚚 Home Delivery' if method=='home' else '🏪 Collect from Shop'}</td></tr>
                    <tr><td style="color:#8892B0;padding:6px 0;">Address</td><td style="text-align:right;">{address}</td></tr>
                </table>
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                    <thead><tr style="background:rgba(58,123,213,0.15);">
                        <th style="padding:12px;text-align:left;border:1px solid #2a3f5f;">Item</th>
                        <th style="padding:12px;text-align:center;border:1px solid #2a3f5f;">Qty</th>
                        <th style="padding:12px;text-align:right;border:1px solid #2a3f5f;">Price</th>
                        <th style="padding:12px;text-align:right;border:1px solid #2a3f5f;">Total</th>
                    </tr></thead>
                    <tbody>{rows}</tbody>
                </table>
                <div style="text-align:right;font-size:0.9rem;">
                    <p>Subtotal: <strong>₹{subtotal:,}</strong></p>
                    <p>Delivery: <strong>₹{delivery_charge:,}</strong></p>
                    <p style="font-size:1.3rem;color:#3A7BD5;margin-top:8px;">Grand Total: <strong>₹{total:,}</strong></p>
                </div>
                <div style="text-align:center;margin-top:30px;padding:16px;background:rgba(58,123,213,0.1);border-radius:10px;">
                    <p style="color:#8892B0;font-size:0.8rem;">Unique Order Code</p>
                    <p style="font-size:2rem;font-weight:800;color:#3A7BD5;letter-spacing:6px;">{code}</p>
                </div>
            </div>"""

            # Send to admin
            send_email(ADMIN_EMAIL, f"Royal Store Order #{code} — ₹{total:,}", order_html)
            # Send to customer
            if email and email != ADMIN_EMAIL:
                send_email(email, f"Your Royal Store Order #{code} Confirmed!", order_html)

            return self._respond(200, {"status": "success", "code": code})

        else:
            return self._respond(404, {"status": "not_found"})

    def do_GET(self):
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def log_message(self, format, *args):
        print(f"[SERVER] {args[0]}")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"=== Royal Store Backend Server ===")
    print(f"    Local access: http://localhost:{PORT}")
    print(f"    Phone access: http://{local_ip}:{PORT}")
    print(f"    Admin: {ADMIN_EMAIL}")
    print(f"==================================")

    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), RoyalHandler)
    server.serve_forever()
