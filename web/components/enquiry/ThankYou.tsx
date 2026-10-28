import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export function ThankYou({ name }: { name: string }) {
  return (
    <div className="thanks">
      <span className="eyebrow">A LITTLE SOMETHING IS ON ITS WAY</span>
      <div className="thanks-icon">
        <Check aria-hidden="true" />
      </div>
      <h2>Thank you, {name}.</h2>
      <p>
        We’ve got your enquiry and our gifting team will be in touch shortly to
        make something lovely happen.
      </p>
      <Link href="/" className="button button-dark">
        Back to the collection <ArrowUpRight aria-hidden="true" />
      </Link>
    </div>
  );
}
