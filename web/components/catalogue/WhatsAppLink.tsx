import { MessageCircle } from "lucide-react";

export function WhatsAppLink({ product }: { product: string }) {
  const message = encodeURIComponent(
    `Hi Tribe Green! I'd love to know more about ${product} for a corporate gifting order.`,
  );
  return (
    <a
      className="whatsapp"
      target="_blank"
      rel="noreferrer"
      href={`https://wa.me/917207967958?text=${message}`}
    >
      <MessageCircle aria-hidden="true" /> Chat about this on WhatsApp
    </a>
  );
}
