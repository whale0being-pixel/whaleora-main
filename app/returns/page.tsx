import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy',
  description: 'Read Whaleora’s 7-day returns and refunds policy, including return eligibility, shipping costs and refund timelines.',
};

export default function ReturnsPage() {
  return <PolicyPage policy="returns" />;
}
