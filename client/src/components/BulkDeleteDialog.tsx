import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onSuccess: () => void;
}

export default function BulkDeleteDialog({
  open,
  onOpenChange,
  count,
  onSuccess,
}: BulkDeleteDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", "/api/cards");
      
      toast({
        title: "Success",
        description: `${count} cards have been deleted from your inventory.`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting cards:", error);
      toast({
        title: "Error",
        description: "Failed to delete cards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Cards</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all {count} cards from your inventory? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAll();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete All"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}