import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Whaleora shipping coverage, order processing, delivery estimates, shipping charges and order support across India.',
};

export default function ShippingPage() {
  return <PolicyPage policy="shipping" />;
}
