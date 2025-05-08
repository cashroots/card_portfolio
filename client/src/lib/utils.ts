import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) return "$0.00";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const downloadCsv = (data: any[], filename: string) => {
  // Skip if no data
  if (!data || data.length === 0) return;
  
  // Get headers from the first row
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        // Wrap value in quotes if it contains commas
        const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"`
          : value;
      }).join(',')
    ),
  ].join('\n');
  
  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getSportBadgeColor = (sport: string) => {
  switch (sport.toLowerCase()) {
    case 'baseball':
      return 'bg-blue-500';
    case 'basketball':
      return 'bg-orange-500';
    case 'football':
      return 'bg-green-500';
    case 'hockey':
      return 'bg-blue-800';
    default:
      return 'bg-gray-500';
  }
};

// Function to extract the column names from a CSV file
export const parseCSVHeaders = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        if (!csvData) {
          reject(new Error('Failed to read CSV file'));
          return;
        }
        
        // Split by new line and get the first line
        const lines = csvData.split(/\r\n|\n/);
        const headers = lines[0].split(',').map(header => header.trim());
        
        resolve(headers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Function to extract headers from Excel file
export const parseExcelHeaders = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        
        // Using dynamic import to load xlsx
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON to get headers
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const headers = jsonData[0] as string[];
        
        resolve(headers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Cleans up card notes that might contain another card's description
 * Used to fix issues with imported cards that have incorrect data in the notes field
 */
export const cleanCardNotes = (notes: string = ""): string => {
  if (!notes) return "";
  
  // First, extract just the relevant card set or collection name
  // For example, from "2024-25 Topps UEFA Club Competitions Historic Captains HC4 Lionel Messi"
  // We want to extract just "Historic Captains HC4" or "MLS 101"
  
  // Check for simple patterns first - if it's just "MLS 101" or similar, return it
  if (/^(MLS|UEFA|EPL|NFL|NBA|MLB|NHL)\s+\d+$/.test(notes.trim())) {
    return notes.trim();
  }
  
  // Check if it's already a clean card set name
  if (/^(Historic Captains|Magicians|Future Stars|Legends|Rookies|All-Stars|Champions|Autographs|Refractor)\s+\w+\d+$/.test(notes.trim())) {
    return notes.trim();
  }
  
  // Pattern for extracting collection name and card number
  const collectionPattern = /((?:Historic Captains|Magicians|Future Stars|Legends|Rookies|All-Stars|Champions|Autographs|Refractor|UEFA Club Competitions|MLS|Gold|Neon Green|Aqua)\s+(?:\w+\d+|HC\d+|[A-Z]+\d+|\d+))/i;
  const collectionMatch = notes.match(collectionPattern);
  if (collectionMatch && collectionMatch[1]) {
    return collectionMatch[1].trim();
  }
  
  // Check for card number pattern at end of string
  const numberPattern = /((?:MLS|UEFA|EPL)\s+(?:\d+|[A-Z]+\d+))\s*$/i;
  const numberMatch = notes.match(numberPattern);
  if (numberMatch && numberMatch[1]) {
    return numberMatch[1].trim();
  }
  
  // If notes has structure like "2024-25 Topps UEFA Club Competitions", extract just the set name
  const setPattern = /\d{4}(?:-\d{2})?\s+(?:Topps|Panini)(?:\s+(?:Topps|Panini))?\s+([^#]+?)(?:\s+(?:HC\d+|#\d+|\d+))?$/i;
  const setMatch = notes.match(setPattern);
  if (setMatch && setMatch[1]) {
    // Check if what we've matched is too long (likely contaminated)
    if (setMatch[1].split(' ').length <= 4) {
      return setMatch[1].trim();
    }
  }
  
  // Last resort - if all the above patterns fail but we have "captains" or similar
  // extract just that portion
  const specificWordPatterns = [
    /\b(Captains\s+HC\d+)\b/i,
    /\b(MLS\s+\d+)\b/i,
    /\b(Finest\s+(?:MLS|MLB|NBA|NFL|NHL))\b/i,
    /\b(Gold\s+UEFA)\b/i,
    /\b(Magicians\s+\d+)\b/i,
    /\b(Future\s+Stars\s+\w+\d+)\b/i
  ];
  
  for (const pattern of specificWordPatterns) {
    const match = notes.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If we've made it here, we couldn't extract a clean card set name
  // Try one last approach - return the first 3-4 words if they're short enough
  const words = notes.split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    return notes.trim();
  } else if (words.length > 4) {
    // Return just the last 2-3 words which might contain the card collection/number
    return words.slice(-3).join(' ').trim();
  }
  
  // If all patterns fail, return empty rather than contaminated data
  return "";
};
