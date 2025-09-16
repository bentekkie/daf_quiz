export interface Daf {
  ref: string;
  textA: string;
  textB: string;
}

// Helper to flatten nested arrays which can occur in Sefaria's API response
const flattenText = (arr: any[]): string[] => {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenText(val)) : acc.concat(val),
    []
  );
};

export async function getTodaysDaf(date: Date): Promise<Daf> {
  try {
    const calendarRes = await fetch(`https://www.sefaria.org/api/calendars?diaspora=1&year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`, {
      next: { revalidate: 3600 }, // Cache calendar for 1 hour
    });

    if (!calendarRes.ok) {
      throw new Error(`Failed to fetch Sefaria calendar: ${calendarRes.statusText}`);
    }
    const calendarData = await calendarRes.json();

    const dafYomiItem = calendarData.calendar_items.find(
      (item: any) => item.title.en === 'Daf Yomi'
    );

    if (!dafYomiItem || !dafYomiItem.ref) {
      throw new Error('Daf Yomi not found in Sefaria calendar for today.');
    }

    const dafRef = dafYomiItem.ref;

    // Fetch the text of the daf. commentary=0 removes commentaries, context=1 ensures we get the full page.
    const textRes = await fetch(`https://www.sefaria.org/api/v3/texts/${dafRef}?commentary=0&context=1&version=english`, {
      next: { revalidate: 86400 }, // Cache daf text for 24 hours
    });

    if (!textRes.ok) {
      throw new Error(`Failed to fetch text for ${dafRef}: ${textRes.statusText}`);
    }

    const textData = await textRes.json();
    
    // The English text is in the 'en' property and can be a string or a nested array of strings.
    let linesA: string[] = textData.versions[0].text[0]
    let textA = linesA.map((l, i) => `${i+1}: ${l}`).join('\n');
    let linesB: string[] = textData.versions[0].text[1]
    let textB = linesB.map((l, i) => `${i+1}: ${l}`).join('\n');

    if (!textA || !textB) {
      throw new Error(`Text for ${dafRef} is empty or not available in English or Hebrew.`);
    }

    return { ref: dafRef, textA: textA, textB: textB };
  } catch (error) {
    console.error("Error fetching today's daf:", error);
    // Re-throw a more user-friendly error for the UI to catch
    throw new Error("Could not retrieve today's Daf Yomi page from Sefaria.org. The service may be temporarily unavailable.");
  }
}
