export interface ParsedCheckIn {
  code: string;
  id?: string;
  name?: string;
  phone?: string;
  venue?: string;
  court?: string;
  startsAt?: string;
  dueAtVenueEgp?: number;
}

export function parseCheckInQr(data: string): ParsedCheckIn {
  if (!data) return { code: '' };
  const trimmed = data.trim();

  // 1. Check if it's a URL (e.g. http://192.168.1.105:5173/checkin?code=F0F5AC13)
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('checkin') || trimmed.includes('code=')) {
    try {
      const match = trimmed.match(/[?&](?:code|checkin)=([^&#]+)/i);
      if (match && match[1]) {
        return { code: decodeURIComponent(match[1]).replace(/^#/, '') };
      }
    } catch {
      // ignore
    }
  }

  // 2. JSON check
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      return {
        code: (parsed.code || parsed.bookingCode || '').toString().replace(/^#/, ''),
        id: (parsed.id || parsed.reservationId || '').toString(),
        name: parsed.name || parsed.playerName || parsed.customerName,
        phone: parsed.phone || parsed.customerPhone,
        venue: parsed.venue || parsed.venueName,
        court: parsed.court || parsed.courtName,
        startsAt: parsed.startsAt,
        dueAtVenueEgp: parsed.dueAtVenueEgp,
      };
    }
  } catch {
    // Plain code or UUID
  }

  return { code: trimmed.replace(/^#/, '') };
}
