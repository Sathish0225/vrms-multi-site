export const generateQRCode = (visitorId: string, visitDate: string, unit: string): string => {
  // In a real application, this would generate an actual QR code
  // For now, we'll create a data string that would be encoded in the QR code
  const qrData = {
    visitorId,
    visitDate,
    unit,
    timestamp: new Date().toISOString(),
    accessKey: btoa(`${visitorId}-${Date.now()}`)
  };
  
  return btoa(JSON.stringify(qrData));
};

export const parseQRCode = (qrCode: string) => {
  try {
    const decoded = atob(qrCode);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Invalid QR code format:', error);
    return null;
  }
};

export const generateVisitorId = (): string => {
  const prefix = 'VIS';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

export const isQRCodeValid = (qrCode: string, currentDate: string): boolean => {
  const parsed = parseQRCode(qrCode);
  if (!parsed) return false;
  
  // Check if the visit date matches current date
  return parsed.visitDate === currentDate;
};

export const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

export const isVisitOverdue = (visitDate: string, visitTime: string, maxHours: number = 8): boolean => {
  const visitDateTime = new Date(`${visitDate}T${visitTime}`);
  const now = new Date();
  const maxVisitTime = new Date(visitDateTime.getTime() + (maxHours * 60 * 60 * 1000));
  
  return now > maxVisitTime;
};