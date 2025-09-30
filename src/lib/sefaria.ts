import { YearMonthDayTag, type QuizTypeName, type YearMonthDay } from "@/lib/types";

export interface SefariaData {
  ref: string;
  text: string;
  title: string;
}

// Helper to flatten nested arrays which can occur in Sefaria's API response
const flattenText = (arr: any[]): string[] => {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenText(val)) : acc.concat(val),
    []
  );
};

export async function getTodaysSefariaData(quizType: QuizTypeName, date: YearMonthDay): Promise<SefariaData> {
  const dateTag = YearMonthDayTag(date)
  try {
    const calendarRes = await fetch(`https://www.sefaria.org/api/calendars?diaspora=1&year=${date.year}&month=${date.month}&day=${date.day})}`, {
      next: { revalidate: 86400, tags: ['sefaria-calendar', dateTag] }, // Cache for 24h, but tag with date.
    });

    if (!calendarRes.ok) {
      throw new Error(`Failed to fetch Sefaria calendar: ${calendarRes.statusText}`);
    }
    const calendarData = await calendarRes.json();
    
    const calendarItem = calendarData.calendar_items.find(
      (item: any) => item.title.en === quizType
    );

    if (!calendarItem || !calendarItem.ref) {
      throw new Error(`${quizType} not found in Sefaria calendar for today.`);
    }

    const itemRef = calendarItem.ref;

    // Fetch the text of the item. commentary=0 removes commentaries, context=1 ensures we get the full page.
    const textRes = await fetch(`https://www.sefaria.org/api/v3/texts/${itemRef}?commentary=0&context=1&version=english`, {
      next: { revalidate: 86400 }, // Cache text for 24 hours
    });

    if (!textRes.ok) {
      throw new Error(`Failed to fetch text for ${itemRef}: ${textRes.statusText}`);
    }

    const textData = await textRes.json();
    
    // The English text is in the 'en' property and can be a string or a nested array of strings.
    let text = ''
    switch(quizType){
    case "Daf Yomi":
      const atext : string[] = textData.versions[0].text[0]
      const btext: string[] = textData.versions[0].text[1]
      text =atext.map((l, i) => `${i+1}, side A: ${l}`)+ '\n' + btext.map((l, i) => `${i+1}, side B: ${l}`).join('\n');
    default:
      const lines: string[] = flattenText(textData.versions[0].text);
      text = lines.map((l, i) => `${i+1}: ${l}`).join('\n');
    }

    if (!text) {
      throw new Error(`Text for ${itemRef} is empty or not available.`);
    }

    return { ref: itemRef, text: text, title: calendarItem.title.en };
  } catch (error) {
    console.error(`Error fetching today's ${quizType}:`, error);
    // Re-throw a more user-friendly error for the UI to catch
    throw new Error(`Could not retrieve today's ${quizType} page from Sefaria.org. The service may be temporarily unavailable.`);
  }
}
