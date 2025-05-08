import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card as CardType } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import CardGrid from "@/components/CardGrid";
import SearchFilters from "@/components/SearchFilters";
import ImportModal from "@/components/ImportModal";
import CsvImporter from "@/components/CsvImporter";
import AddEditCardModal from "@/components/AddEditCardModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import BulkDeleteDialog from "@/components/BulkDeleteDialog";
import PriceResearchModal from "@/components/PriceResearchModal";
import { downloadCsv } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon, FolderInput, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvImporterOpen, setCsvImporterOpen] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
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
        description: "Your inventory is empty.",
        variant: "destructive"
      });
      return;
    }
    
    // Format cards for export (omitting internal fields)
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
      title: "Export successful",
      description: "Your inventory has been exported to CSV",
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
              <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button type="button" className="text-gray-500 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                JD
              </div>
            </div>
          </div>
          
          {/* Mobile navigation tabs */}
          <div className="block md:hidden border-t border-gray-200">
            <div className="flex">
              <button className="flex-1 py-3 text-center border-b-2 border-blue-500 text-blue-600">
                <svg className="h-5 w-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="block text-xs">Inventory</span>
              </button>
              <button 
                className="flex-1 py-3 text-center text-gray-500"
                onClick={() => setImportModalOpen(true)}
              >
                <FolderInput className="h-5 w-5 mx-auto mb-1" />
                <span className="block text-xs">Import</span>
              </button>
              <button 
                className="flex-1 py-3 text-center text-gray-500"
                onClick={handleExportCSV}
              >
                <Download className="h-5 w-5 mx-auto mb-1" />
                <span className="block text-xs">Export</span>
              </button>
              <button className="flex-1 py-3 text-center text-gray-500">
                <svg className="h-5 w-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="block text-xs">Settings</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">
          {/* Action buttons and controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Card Inventory</h1>
              <p className="text-gray-600">Manage your trading card collection</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="default" 
                  onClick={() => setImportModalOpen(true)}
                  className="bg-primary hover:bg-blue-600"
                >
                  <FolderInput className="mr-2 h-4 w-4" />
                  Import Cards
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => setCsvImporterOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FolderInput className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </div>
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
              {cards.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
              )}
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

          {/* Card inventory */}
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
      <ImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen} 
        onSuccess={() => {
          refetch();
          toast({
            title: "Import successful",
            description: "Cards have been added to your inventory",
          });
        }}
      />
      
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
              : "The card has been added to your inventory",
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
            description: "The card has been removed from your inventory",
          });
        }}
      />

      <CsvImporter
        open={csvImporterOpen}
        onOpenChange={setCsvImporterOpen}
        onSuccess={() => {
          refetch();
          toast({
            title: "CSV Import successful",
            description: "Cards have been added to your inventory",
          });
        }}
      />
      
      <BulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        count={cards.length}
        onSuccess={() => {
          refetch();
          toast({
            title: "All cards deleted",
            description: "Your inventory has been cleared",
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
