import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
const neynarApi = process.env.NEYNAR_KEY
const mongoURI = process.env.MONGO_URI || ''

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  console.log(email)
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
    await uploadToMongo(email, text, accountAddress)
    console.log(text)
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: `${NEXT_PUBLIC_URL}/duh.jpg`
        ,aspectRatio: '1:1'
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/mongo`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

async function uploadToMongo (email: any ,text: any, accountAddress: any) {
    try {
        const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db('Event');
    const collection = db.collection('signUps');

    const documentToInsert = {
      email: email,
      telegram: text,
      accountAddress: accountAddress,

  };

  const result = await collection.insertOne(documentToInsert);
        console.log("the result", result);

    } catch (error) {
        console.log(error)
    }
}