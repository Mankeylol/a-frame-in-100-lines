import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Sign up for event',
    }
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/duh.jpg`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Event sign up',
  description: 'test',
  openGraph: {
    title: 'event sign up',
    description: 'test',
    images: [`${NEXT_PUBLIC_URL}/duh.jpg`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Sign up</h1>
    </>
  );
}
