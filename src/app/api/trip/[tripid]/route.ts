import { NextRequest, NextResponse } from 'next/server';
import getTripPlaces from '@/lib/backend/updateData/getTripPlaces';
import * as utils from '@/lib/backend/utils/utils';

export async function GET(req: NextRequest) {
  try {
    const tripID = utils.extractID(req.url);
    const data = await getTripPlaces(tripID);

    return NextResponse.json({ status: true, trips: data });
  } catch (error) {
    console.error('Error in GET /api/trip/[tripid]/route:', error);

    return NextResponse.json({ status: false }, { status: 500 });
  }
}
