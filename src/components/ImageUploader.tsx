
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export function ImageUploader({ onImageUpload, isProcessing }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateImage = (file: File): boolean => {
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/jpg')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or JPEG image.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const processFile = (file: File) => {
    if (!validateImage(file)) return;
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg"
          className="hidden"
          onChange={handleChange}
          disabled={isProcessing}
        />
        
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drag & drop your CV template</p>
              <p className="text-sm text-muted-foreground">
                or click to browse (JPG/JPEG only)
              </p>
            </div>
            <Button 
              type="button" 
              onClick={handleClick}
              disabled={isProcessing}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <img 
                src={previewUrl} 
                alt="CV Template preview" 
                className="w-full h-auto object-contain max-h-[300px]"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
