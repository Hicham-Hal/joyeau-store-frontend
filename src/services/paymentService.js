import { delay } from "./mockDb";

// ---------------------------------------------------------------------------
// SofizPay (EDAHABIA / CIB) integration placeholder.
// Real integration (once backend/API keys are available) looks like this:
//
//   import SofizPaySDK from "sofizpay-js-sdk";
//   const sdk = new SofizPaySDK();
//   const result = await sdk.makeCIBTransaction({
//     account: "YOUR_SOFIZPAY_ACCOUNT_PUBLIC_KEY",
//     amount: depositAmount,
//     full_name: `${firstName} ${lastName}`,
//     phone,
//     email,
//     memo: `Acompte commande ${orderNumber}`,
//     return_url: "https://joyaubrillant-batna.dz/order/success",
//     webhook_url: "https://api.joyaubrillant-batna.dz/api/payments/webhook",
//     language: "fr",
//     redirect: true,
//   });
//   // user is redirected to the hosted SATIM/Dahabiya checkout page.
//
// For this demo (no backend yet) we simulate a short "processing" delay and
// always resolve successfully so the automatic confirmation flow can be
// demonstrated end-to-end.
// ---------------------------------------------------------------------------

export async function payWithSofizPay({ amount, fullName, phone }) {
  await delay(1800);
  return {
    success: true,
    transactionId: "SFP-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    amount,
    fullName,
    phone,
    paidAt: Date.now(),
  };
}
