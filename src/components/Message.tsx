'use client';

import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Map from './Map';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

interface LocationData {
  lat: number;
  lng: number;
  name: string;
}

const markdownComponents = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

export default function Message({ role, content }: MessageProps) {
  // Function to check if content contains location data
  const hasLocationData = (text: string): LocationData | null => {
    try {
      const locationMatch = text.match(/\[location\](.*?)\[\/location\]/);
      if (locationMatch) {
        const locationData = JSON.parse(locationMatch[1]);
        if (locationData.lat && locationData.lng && locationData.name) {
          return locationData;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // Function to process the content and render LaTeX and Markdown
  const processedContent = useMemo(() => {
    // Check for location data first
    const locationData = hasLocationData(content);
    const contentWithoutLocation = content.replace(/\[location\].*?\[\/location\]/, '');

    // Split content by LaTeX delimiters
    const parts = contentWithoutLocation.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    
    const renderedParts = parts.map((part, index) => {
      // Check if it's a LaTeX block ($$...$$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const latex = part.slice(2, -2);
        return <BlockMath key={index} math={latex} />;
      }
      // Check if it's inline LaTeX ($...$)
      else if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      }
      // For AI, render markdown; for user, render plain text
      else {
        if (role === 'assistant') {
          return <ReactMarkdown key={index} components={markdownComponents}>{part}</ReactMarkdown>;
        } else {
          return <span key={index}>{part}</span>;
        }
      }
    });

    // Add map if location data exists
    if (locationData) {
      renderedParts.push(
        <div key="map" className="mt-4">
          <Map location={locationData} />
        </div>
      );
    }

    return renderedParts;
  }, [content, role]);

  const isAI = role === 'assistant';

  return (
    <div className="py-3">
      <div className="max-w-3xl mx-auto px-4">
        <div className={`flex gap-3 items-start ${isAI ? '' : 'flex-row-reverse'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAI ? 'bg-orange-500' : 'bg-blue-500'} text-white font-bold flex-shrink-0 mb-1`}>
            {isAI ? 'AI' : 'U'}
          </div>
          <div className={`flex-1 ${isAI ? 'items-end' : 'items-start'} max-w-[85%]`}>
            <div 
              className={`
                rounded-2xl px-4 py-2.5 
                ${isAI ? 'bg-orange-500/10 rounded-tl-sm' : 'bg-blue-500/10 rounded-tr-sm'} 
                shadow-sm
              `}
            >
              <div className={`prose prose-invert max-w-none ${isAI ? 'text-gray-100' : 'text-gray-100'}`}>
                {processedContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}