import { useState } from "react";
import { Card } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card | null;
  onSuccess: () => void;
}

export default function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  card, 
  onSuccess 
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!card) return;
    
    try {
      setIsDeleting(true);
      await apiRequest("DELETE", `/api/cards/${card.id}`);
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in apiRequest
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (!card) return null;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex-row gap-3 items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        
        <div className="mt-2">
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900">{card.playerName}</h4>
            <p className="text-sm text-gray-600">{card.year} {card.brand} {card.cardSet}</p>
            <p className="text-sm text-gray-500 mt-1">
              Condition: {card.condition} | Sport: {card.sport}
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
