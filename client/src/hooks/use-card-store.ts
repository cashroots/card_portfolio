import { create } from 'zustand';
import { Card } from '@shared/schema';

interface CardStore {
  cards: Card[];
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (updatedCard: Card) => void;
  deleteCard: (id: number) => void;
  
  // Filters
  search: string;
  setSearch: (search: string) => void;
  sport: string;
  setSport: (sport: string) => void;
  year: string;
  setYear: (year: string) => void;
  brand: string;
  setBrand: (brand: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  
  // View
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Reset all filters
  resetFilters: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((state) => ({ cards: [card, ...state.cards] })),
  updateCard: (updatedCard) => set((state) => ({
    cards: state.cards.map((card) => 
      card.id === updatedCard.id ? updatedCard : card
    ),
  })),
  deleteCard: (id) => set((state) => ({
    cards: state.cards.filter((card) => card.id !== id),
  })),
  
  // Filters
  search: '',
  setSearch: (search) => set({ search }),
  sport: 'all',
  setSport: (sport) => set({ sport }),
  year: 'all',
  setYear: (year) => set({ year }),
  brand: 'all',
  setBrand: (brand) => set({ brand }),
  condition: 'all',
  setCondition: (condition) => set({ condition }),
  sortBy: 'recent',
  setSortBy: (sortBy) => set({ sortBy }),
  
  // View
  viewMode: 'grid',
  setViewMode: (viewMode) => set({ viewMode }),
  
  // Reset all filters
  resetFilters: () => set({
    search: '',
    sport: 'all',
    year: 'all',
    brand: 'all',
    condition: 'all',
    sortBy: 'recent',
  }),
}));
