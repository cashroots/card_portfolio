import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card as CardType } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import CardGrid from "@/components/CardGrid";
import SearchFilters from "@/components/SearchFilters";
import AddEditCardModal from "@/components/AddEditCardModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PriceResearchModal from "@/components/PriceResearchModal";
import { Button } from "@/components/ui/button";
import { PlusIcon, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/utils";

export default function Collection() {
  const { toast } = useToast();
  
  // State for search and filters
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("all");
  const [year, setYear] = useState("all");
  const [brand, setBrand] = useState("all");
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [priceResearchOpen, setPriceResearchOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  
  // Query to fetch cards with filters
  const { data: cards = [], isLoading, refetch } = useQuery<CardType[]>({
    queryKey: [
      '/api/cards',
      search,
      sport,
      year,
      brand,
      condition,
      sortBy
    ],
    queryFn: async ({ queryKey }) => {
      const [_endpoint, search, sport, year, brand, condition, sortBy] = queryKey;
      
      const params = new URLSearchParams();
      if (search) params.append('search', search as string);
      if (sport && sport !== 'all') params.append('sport', sport as string);
      if (year && year !== 'all') params.append('year', year as string);
      if (brand && brand !== 'all') params.append('brand', brand as string);
      if (condition && condition !== 'all') params.append('condition', condition as string);
      if (sortBy) params.append('sortBy', sortBy as string);
      
      const response = await fetch(`/api/cards?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      
      return response.json();
    }
  });
  
  // Stats for the collection
  const totalCards = cards.length;
  const sportCounts = cards.reduce((acc, card) => {
    acc[card.sport] = (acc[card.sport] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalValue = cards.reduce((sum, card) => sum + (card.currentValue || 0), 0);
  const totalPurchaseCost = cards.reduce((sum, card) => sum + (card.purchasePrice || 0), 0);
  
  const handleAddCard = () => {
    setCurrentCard(null);
    setAddEditModalOpen(true);
  };
  
  const handleEditCard = (card: CardType) => {
    setCurrentCard(card);
    setAddEditModalOpen(true);
  };
  
  const handleDeleteCard = (card: CardType) => {
    setCurrentCard(card);
    setDeleteDialogOpen(true);
  };
  
  const handleResearchPrice = (card: CardType) => {
    setCurrentCard(card);
    setPriceResearchOpen(true);
  };
  
  const handleExportCSV = () => {
    if (!cards.length) {
      toast({
        title: "No cards to export",
        description: "Your collection is empty.",
        variant: "destructive"
      });
      return;
    }
    
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
    
    downloadCsv(exportData, 'my-collection.csv');
    
    toast({
      title: "Export successful",
      description: "Your collection has been exported to CSV",
    });
  };
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        {/* Top navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-600"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 ml-3">Card Collector</h1>
            </div>
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-gray-800">My Collection</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">
          {/* Collection stats */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Collection</h1>
            <p className="text-gray-600">View and analyze your entire card collection</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Cards</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCards}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Purchase Cost</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${totalPurchaseCost.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">ROI</h3>
              <p className="text-2xl font-bold mt-1" style={{ color: totalValue - totalPurchaseCost >= 0 ? '#16a34a' : '#dc2626' }}>
                {totalPurchaseCost > 0 
                  ? `${(((totalValue - totalPurchaseCost) / totalPurchaseCost) * 100).toFixed(1)}%` 
                  : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Collection Breakdown</h2>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleAddCard}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Card
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          
          {/* Sport breakdown */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Cards by Sport</h3>
            <div className="space-y-3">
              {Object.entries(sportCounts).map(([sport, count]) => (
                <div key={sport} className="flex items-center">
                  <div className="w-32 font-medium">{sport}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${(count / totalCards) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-500">
                    {count} ({((count / totalCards) * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and filters */}
          <SearchFilters 
            search={search}
            setSearch={setSearch}
            sport={sport}
            setSport={setSport}
            year={year}
            setYear={setYear}
            brand={brand}
            setBrand={setBrand}
            condition={condition}
            setCondition={setCondition}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Card collection */}
          <CardGrid 
            cards={cards} 
            isLoading={isLoading} 
            viewMode={viewMode}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            onResearch={handleResearchPrice}
          />
        </div>
      </main>

      {/* Modals */}
      <AddEditCardModal 
        open={addEditModalOpen} 
        onOpenChange={setAddEditModalOpen}
        card={currentCard}
        onSuccess={() => {
          refetch();
          toast({
            title: currentCard ? "Card updated" : "Card added",
            description: currentCard 
              ? "The card has been updated successfully" 
              : "The card has been added to your collection",
          });
        }}
      />
      
      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        card={currentCard}
        onSuccess={() => {
          refetch();
          toast({
            title: "Card removed",
            description: "The card has been removed from your collection",
          });
        }}
      />
      
      <PriceResearchModal 
        open={priceResearchOpen}
        onOpenChange={setPriceResearchOpen}
        card={currentCard}
      />
    </div>
  );
}