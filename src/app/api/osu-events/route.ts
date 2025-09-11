import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://events.oregonstate.edu/calendar.xml');
  console.log('feed', feed);
  // Sadece gerekli alanları döndürmek için mapleyebilirsin
  const events = feed.items.map(item => ({
    title: item.title,
    link: item.link,
    date: item.pubDate,
    description: item.contentSnippet,
    location: item['osuevent:location'] || '', // Bazı RSS'lerde özel alanlar olabilir
  }));
  return NextResponse.json({ events });
}