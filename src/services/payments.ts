// Payment services - currently not in use for this coffee information assistant
// This file is kept as a placeholder for future e-commerce functionality

export interface PaymentResult {
  success: boolean;
  error?: string;
}

// Placeholder functions - not currently used
export async function getTicketPrices(): Promise<null> {
  return null;
}

export async function processVoicePayment(): Promise<PaymentResult> {
  return { success: false, error: 'Payment functionality not enabled' };
}

export async function handlePaymentSuccess(): Promise<void> {
  // Not implemented
}

export async function handlePaymentFailed(): Promise<void> {
  // Not implemented
}
