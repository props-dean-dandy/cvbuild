
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfilePhotoUploaderProps {
  onPhotoUpload: (imageUrl: string) => void;
  initialPhotoUrl?: string;
}

export function ProfilePhotoUploader({ onPhotoUpload, initialPhotoUrl }: ProfilePhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhotoUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateImage = (file: File): boolean => {
    // Check file type
    if (!file.type.match('image/*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!validateImage(file)) return;
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onPhotoUpload(url);
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated",
      });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleClick}>
        <AvatarImage src={previewUrl || ""} alt="Profile" />
        <AvatarFallback className="bg-muted">
          <ImageIcon className="h-12 w-12 text-muted-foreground/70" />
        </AvatarFallback>
      </Avatar>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <Button
        variant="outline" 
        size="sm"
        onClick={handleClick}
        className="flex items-center gap-1"
      >
        <Upload className="h-4 w-4 mr-1" />
        Upload Photo
      </Button>
    </div>
  );
}
