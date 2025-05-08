// Database of card image URLs
export const cardImages: string[] = [
  // Front images
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-4_0005_Layer%201.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-4_0001_Layer%205.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-4_0000_Layer%206.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-4_0004_Layer%202.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-4_0002_Layer%204.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0005_Layer%208.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0004_Layer%209.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0003_Layer%2010.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0002_Layer%2011.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0001_Layer%2012.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-6_0000_Layer%2013.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-23_0010_Layer%20172.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-2_0005_Layer%201.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-2_0004_Layer%202.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-11_0011_Layer%2094.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-10_0006_Layer%2087.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-10_0012_Layer%2081.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-8_0006_Layer%2074.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-2_0000_Layer%206.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-2_0002_Layer%204.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-2_0001_Layer%205.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/andre_blake_0001_Layer%201.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Puig_Jersey_0000_Layer%201.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-3_0002_Layer%206.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-8_0009_Layer%2071.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-16_0007_Layer%20136.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/nouhou_0000_Layer%202.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-11_0009_Layer%2096.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-3_0004_Layer%204.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-3_0005_Layer%203.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/card%20matcher/Untitled-1_0045_Layer%203.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-9_0008_Layer%2084.jpg",
  "https://sportscards.standard.us-east-1.oortstorages.com/new%20card%20scans%202/Untitled-11_0006_Layer%2099.jpg"
];

// Default image if no card image is available
export const defaultCardImageUrl = "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3";

/**
 * Get a random card image from the available images
 */
export function getRandomCardImage(): string {
  if (cardImages.length === 0) {
    return defaultCardImageUrl;
  }
  
  const randomIndex = Math.floor(Math.random() * cardImages.length);
  return cardImages[randomIndex];
}

/**
 * Get a sport-specific placeholder image
 */
export function getSportSpecificImage(sport: string): string {
  // Use an actual card image instead of a placeholder
  return getRandomCardImage();
}