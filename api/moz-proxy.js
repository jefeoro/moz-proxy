// api/moz-proxy.js
export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu aplicación
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar peticiones OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo aceptar peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener las credenciales y datos de la petición
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Autenticación requerida' });
    }

    // Reenviar la petición a MOZ
    const mozResponse = await fetch('https://lsapi.seomoz.com/v2/url_metrics', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Obtener la respuesta
    const data = await mozResponse.json();

    // Devolver la respuesta
    if (mozResponse.ok) {
      res.status(200).json(data);
    } else {
      res.status(mozResponse.status).json(data);
    }

  } catch (error) {
    console.error('Error en el proxy:', error);
    res.status(500).json({ error: 'Error al conectar con MOZ API' });
  }
}
