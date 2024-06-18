import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toast() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Scheduled: Catch up",
      // description: "Friday, February 10, 2023 at 5:57 PM",
      action: (
        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
      ),
    });
  }, []); // The empty array ensures this effect runs once on mount

  return null; // Render nothing or your component's UI here
}
