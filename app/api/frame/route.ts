import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import dotenv from 'dotenv';

dotenv.config();

const neynarApi = process.env.NEYNAR_KEY

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: neynarApi });


  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    console.log(accountAddress)
  }

  if (message?.input) {
    text = message.input;
    console.log(text)
  }
  

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `->`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/duh.jpg`,
        aspectRatio: '1:1',
      },
      input: {
        text: 'Enter Email',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/telegram?`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
