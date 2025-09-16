export interface Daf {
  ref: string;
  text: string;
}

// Helper to flatten nested arrays which can occur in Sefaria's API response
const flattenText = (arr: any[]): string[] => {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenText(val)) : acc.concat(val),
    []
  );
};

export async function getTodaysDaf(): Promise<Daf> {
  try {
    const calendarRes = await fetch('https://www.sefaria.org/api/calendars', {
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
    const textRes = await fetch(`https://www.sefaria.org/api/texts/${dafRef}?commentary=0&context=1`, {
      next: { revalidate: 86400 }, // Cache daf text for 24 hours
    });

    if (!textRes.ok) {
      throw new Error(`Failed to fetch text for ${dafRef}: ${textRes.statusText}`);
    }

    const textData = await textRes.json();
    
    // The English text is in the 'en' property and can be a string or a nested array of strings.
    let fullEnText = '';
    if(typeof textData.en === 'string'){
      fullEnText = textData.en;
    } else if (Array.isArray(textData.en)) {
      fullEnText = flattenText(textData.en).join(' ');
    }

    // If English text is empty, try to get Hebrew text as a fallback.
    if (!fullEnText) {
      let fullHeText = '';
      if(typeof textData.he === 'string'){
        fullHeText = textData.he;
      } else if (Array.isArray(textData.he)) {
        fullHeText = flattenText(textData.he).join(' ');
      }
      
      if(fullHeText) {
        fullEnText = fullHeText;
      }
    }

    if (!fullEnText) {
      throw new Error(`Text for ${dafRef} is empty or not available in English or Hebrew.`);
    }

    return { ref: dafRef, text: fullEnText };
  } catch (error) {
    console.error("Error fetching today's daf:", error);
    // Re-throw a more user-friendly error for the UI to catch
    throw new Error("Could not retrieve today's Daf Yomi page from Sefaria.org. The service may be temporarily unavailable.");
  }
}
