import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getServices } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  try {
    if (type === 'categories') {
      const categories = await getCategories();
      return NextResponse.json(categories);
    } else if (type === 'services') {
      const services = await getServices();
      return NextResponse.json(services);
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use "categories" or "services".' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
