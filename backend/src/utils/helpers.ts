export function generateOrderId(): string {
  const prefix = 'PRINT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function estimatePageCount(mimeType: string, fileSize: number): number {
  if (mimeType === 'application/pdf') {
    return Math.max(1, Math.floor(fileSize / 50000));
  }
  if (mimeType.includes('word')) {
    return Math.max(1, Math.floor(fileSize / 40000));
  }
  return 1;
}

export function calculateDeliveryCharge(subtotal: number): number {
  const threshold = 199;
  const charge = 40;
  return subtotal >= threshold ? 0 : charge;
}
