<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f1f5f9; margin: 0; padding: 0; }
        .wrapper { background-color: #f1f5f9; padding: 40px 0; }
        .card { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .header { background: #0c516e; padding: 40px; text-align: center; color: white; }
        .content { padding: 40px; }
        .password-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 16px; padding: 20px; text-align: center; margin: 25px 0; }
        .password-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px; display: block; }
        .password-value { font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: #0c516e; }
        .footer { padding: 30px; text-align: center; font-size: 11px; color: #94a3b8; background: #ffffff; border-top: 1px solid #f1f5f9; }
        .btn { display: inline-block; background: #0c516e; color: #ffffff !important; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1 style="margin:0; font-size: 24px; font-weight: 300; letter-spacing: -0.02em;">Bienvenido a <span style="font-weight: 700;">KoonPay</span></h1>
            </div>
           <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #0c516e;">¡Bienvenido, {{ $datos['nombre'] }}!</h2>
    <p>Tu cuenta en <strong>KoonSystem</strong> ha sido activada por <strong>{{ $datos['empresa'] }}</strong>.</p>
    
    <div style="background: #f1f5f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
        <span style="font-size: 12px; color: #666;">TU CONTRASEÑA TEMPORAL:</span><br>
        <strong style="font-size: 18px; color: #0c516e;">{{ $datos['password'] }}</strong>
    </div>

    <p>Inicia sesión aquí: <a href="https://app.koonfinansen.com.mx/login">app.koonfinansen.com.mx/login</a></p>
</div>
            <div class="footer">
                Este es un mensaje automático de seguridad.<br>
                Si no esperabas este correo, por favor contáctanos.<br><br>
                <strong>KoonSystem © 2026</strong>
            </div>
        </div>
    </div>
</body>
</html>