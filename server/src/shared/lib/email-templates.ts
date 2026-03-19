export function get2FAEmailHTML(code: string, userName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px 40px;text-align:center;">
              <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#fff;margin-bottom:12px;line-height:48px;">A</div>
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">Verificación de identidad</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#475569;font-size:15px;margin:0 0 8px;">Hola <strong>${userName}</strong>,</p>
              <p style="color:#475569;font-size:15px;margin:0 0 24px;">Tu código de verificación es:</p>
              <div style="text-align:center;margin:0 0 24px;">
                <div style="display:inline-block;background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;padding:16px 32px;letter-spacing:8px;font-size:32px;font-weight:800;color:#1e293b;">${code}</div>
              </div>
              <p style="color:#94a3b8;font-size:13px;margin:0 0 4px;text-align:center;">Este código expira en <strong>5 minutos</strong>.</p>
              <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">Si no solicitaste este código, ignora este correo.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 24px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#cbd5e1;font-size:12px;margin:0;">© ${new Date().getFullYear()} Acerlim — Sistema de Gestión Integral</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
