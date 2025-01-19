import { LinkData } from '@/types/link';

// Mock data - replace with actual data fetching
export function useLinkData(id: string): LinkData {
  return {
    senderAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    amount: 50.5,
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  };
}