"use client";

import { useEdgeStore } from "@/lib/edegstore";
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  value?: string | null;
  canPerform: boolean;
  onChange: (url: string | null) => void;
}

export const KpiAttachButton = ({ value, canPerform, onChange }: Props) => {
  const { edgestore } = useEdgeStore();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { url } = await edgestore.publicFiles.upload({ 
        file,
        options: {
          replaceTargetUrl: value || undefined // Replace existing file if one exists
        } 
      });

      onChange(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = async () => {
    if (!value) return;
    
    setIsUploading(true);
    
    try {
      await edgestore.publicFiles.delete({
        url: value,
      });
      onChange(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2">        
        <Button 
          type="button" 
          size="sm" 
          variant="secondary" 
          onClick={handlePickFile} 
          disabled={isUploading || canPerform}
        >
          {isUploading ? "Uploading..." : value ? "Replace" : "Upload"}
        </Button>
        
        {value && (
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={handleClear}
            disabled={isUploading}
          >
            Clear
          </Button>
        )}
      </div>

      {value && (
        <a 
          className="text-xs text-marine underline hover:text-marine/80" 
          href={value} 
          target="_blank" 
          rel="noreferrer"
        >
          Open file
        </a>
      )}
    </div>
  );
}