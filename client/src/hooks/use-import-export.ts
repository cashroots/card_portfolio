import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@shared/schema';
import { downloadCsv } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Type for import column mapping
export interface ColumnMapping {
  playerName: string;
  sport: string;
  year: string;
  brand: string;
  condition: string;
  purchasePrice: string;
  cardSet?: string;
  cardNumber?: string;
  notes?: string;
}

export function useImportExport() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Function to import cards from a file with column mapping
  const importCards = async (file: File, columnMap: ColumnMapping) => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'No file selected',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsImporting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('columnMap', JSON.stringify(columnMap));
      
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      const result = await response.json();
      
      toast({
        title: 'Success',
        description: `${result.results.filter((r: any) => r.success).length} cards imported`,
      });
      
      return result;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsImporting(false);
    }
  };
  
  // Function to export cards to CSV
  const exportCards = async (cards: Card[]) => {
    if (!cards.length) {
      toast({
        title: 'Export Failed',
        description: 'No cards to export',
        variant: 'destructive',
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Format cards for export
      const exportData = cards.map(card => ({
        playerName: card.playerName,
        sport: card.sport,
        year: card.year,
        brand: card.brand,
        cardSet: card.cardSet,
        condition: card.condition,
        purchasePrice: card.purchasePrice,
        currentValue: card.currentValue,
        notes: card.notes,
        cardNumber: card.cardNumber
      }));
      
      downloadCsv(exportData, 'card-inventory.csv');
      
      toast({
        title: 'Export Successful',
        description: `${cards.length} cards exported to CSV`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    importCards,
    exportCards,
    isImporting,
    isExporting,
  };
}
