import { env } from '../config/env';

interface GeoIpData {
  country: string | null;
  city: string | null;
}

export const getIpLocation = async (ip: string): Promise<GeoIpData> => {
  // Handle localhost/private ranges
  const isPrivateIp = 
    ip === '127.0.0.1' || 
    ip === '::1' || 
    ip.startsWith('192.168.') || 
    ip.startsWith('10.') || 
    ip.startsWith('172.16.') ||
    ip.startsWith('::ffff:127.0.0.1');

  if (isPrivateIp) {
    return { 
      country: env.NODE_ENV === 'production' ? 'Unknown' : 'Development Server', 
      city: env.NODE_ENV === 'production' ? 'Unknown' : 'Localhost' 
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout limit

    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json() as any;
      if (data && data.status === 'success') {
        return {
          country: data.country || null,
          city: data.city || null
        };
      }
    }
  } catch (error) {
    // Fail silently on rate limits, timeouts or offline states
  }

  return { country: 'Unknown', city: 'Unknown' };
};

export default {
  getIpLocation
};
