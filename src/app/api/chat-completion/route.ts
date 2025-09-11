import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { load } from 'cheerio';
import Parser from 'rss-parser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CalendarEvent {
  date: string;
  description: string;
}

interface TermData {
  term: string;
  events: CalendarEvent[];
}

interface OsuEvent {
  title: string;
  link: string;
  date: string;
  description: string;
  location: string;
}

// Function to fetch academic calendar data
async function fetchAcademicCalendar(): Promise<TermData[] | null> {
  try {
    const response = await axios.get('https://registrar.oregonstate.edu/osu-academic-calendar');
    const $ = load(response.data);
    
    // Extract calendar data from the webpage
    const calendarData: TermData[] = [];
    $('.academic-calendar').each((_, element) => {
      const termData: TermData = {
        term: $(element).find('.term-header').text().trim(),
        events: []
      };
      
      $(element).find('.calendar-event').each((_, eventElement) => {
        termData.events.push({
          date: $(eventElement).find('.event-date').text().trim(),
          description: $(eventElement).find('.event-description').text().trim()
        });
      });
      
      calendarData.push(termData);
    });
    
    return calendarData;
  } catch (error) {
    console.error('Error fetching academic calendar:', error);
    return null;
  }
}

// Function to fetch OSU events from the RSS feed
async function fetchOsuEvents(): Promise<OsuEvent[] | null> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://events.oregonstate.edu/calendar.xml');
    return feed.items.map(item => {
      const location = typeof item === 'object' && item !== null && 'osuevent:location' in item ? (item as Record<string, string>)['osuevent:location'] : '';
      return {
        title: item.title || '',
        link: item.link || '',
        date: item.pubDate || '',
        description: item.contentSnippet || '',
        location,
      };
    });
  } catch (error) {
    console.error('Error fetching OSU events:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if the message is about the academic calendar
    const isCalendarQuery = message.toLowerCase().includes('academic calendar') ||
                           message.toLowerCase().includes('term dates') ||
                           message.toLowerCase().includes('finals week') ||
                           message.toLowerCase().includes('term schedule');

    // Check if the message is about events
    const isEventQuery = message.toLowerCase().includes('event') ||
                        message.toLowerCase().includes('etkinlik') ||
                        message.toLowerCase().includes('activity') ||
                        message.toLowerCase().includes('upcoming') ||
                        message.toLowerCase().includes('club') ||
                        message.toLowerCase().includes('organization');

    // If it's a calendar query, fetch the latest data
    let calendarData: TermData[] | null = null;
    if (isCalendarQuery) {
      calendarData = await fetchAcademicCalendar();
    }

    // If it's an event query, fetch the latest events
    let osuEvents: OsuEvent[] | null = null;
    if (isEventQuery) {
      osuEvents = await fetchOsuEvents();
    }

    const systemPrompt = `You are an AI assistant for Oregon State University students. You can help with academic questions, campus information, and more.

When students ask about locations on campus, provide the location information in a special format:
[location]{"lat": latitude, "lng": longitude, "name": "Location Name"}[/location]

For example, if someone asks about the location of the Memorial Union, you would respond with:
The Memorial Union is located at the heart of campus.
[location]{"lat": 44.5647, "lng": -123.2790, "name": "Memorial Union"}[/location]

For mathematical expressions, use LaTeX format:
- Use single $ symbols for inline equations: $E = mc^2$
- Use double $$ symbols for block equations: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$

Be clear, helpful, and professional in your responses.

${calendarData ? `\n\nHere is the current academic calendar data:\n${JSON.stringify(calendarData, null, 2)}` : ''}
${osuEvents ? `\n\nHere are the latest OSU events:\n${JSON.stringify(osuEvents.slice(0, 8), null, 2)}` : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in chat completion:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
} 