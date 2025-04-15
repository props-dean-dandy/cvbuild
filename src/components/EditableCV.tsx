
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfilePhotoUploader } from "@/components/ProfilePhotoUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Download, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";

interface EditableCVProps {
  isLoading: boolean;
  htmlContent: string;
  cssContent: string;
  onGenerateContent: () => Promise<void>;
}

export function EditableCV({ isLoading, htmlContent, cssContent, onGenerateContent }: EditableCVProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editableHtml, setEditableHtml] = useState(htmlContent);
  const [editableCss, setEditableCss] = useState(cssContent);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEditableHtml(htmlContent);
    setEditableCss(cssContent);
  }, [htmlContent, cssContent]);

  const handleProfilePhotoUpload = (imageUrl: string) => {
    setProfilePhoto(imageUrl);
    
    // Find img tag with class containing 'profile' or 'avatar' and replace its src
    const profileImageRegex = /<img[^>]*(?:class=["'][^"']*(?:profile|avatar)[^"']*["'])[^>]*src=["'][^"']*["']/gi;
    const updatedHtml = editableHtml.replace(
      profileImageRegex,
      (match) => match.replace(/src=["'][^"']*["']/, `src="${imageUrl}"`)
    );
    
    setEditableHtml(updatedHtml);
  };

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    try {
      await onGenerateContent();
      toast({
        title: "Content generated",
        description: "AI-generated content has been applied to your CV template",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleExportPdf = async () => {
    if (!cvRef.current) return;
    
    toast({
      title: "Preparing PDF export",
      description: "Your CV is being converted to PDF...",
    });
    
    try {
      const content = cvRef.current.cloneNode(true) as HTMLElement;
      
      // Set specific styles for PDF export
      const style = document.createElement('style');
      style.textContent = `
        ${editableCss}
        body { margin: 0; padding: 0; }
        .cv-container { margin: 0; }
      `;
      content.appendChild(style);
      
      const opt = {
        margin: 0,
        filename: 'my-cv.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(content).set(opt).save();
      
      toast({
        title: "PDF exported",
        description: "Your CV has been successfully exported as PDF",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your CV to PDF",
        variant: "destructive"
      });
    }
  };

  const getLoaderOrContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">Analyzing template...</h3>
          <p className="text-muted-foreground">We're processing your CV template image.</p>
        </div>
      );
    }
    
    if (!htmlContent && !cssContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
          <p>Upload a CV template image to get started</p>
        </div>
      );
    }
    
    return (
      <div 
        ref={cvRef}
        className="cv-container"
        dangerouslySetInnerHTML={{ 
          __html: `<style>${editableCss}</style>${editableHtml}` 
        }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-4 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-medium">Analyzing template...</h3>
              <p className="text-muted-foreground">We're processing your CV template image.</p>
            </div>
          ) : !htmlContent && !cssContent ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
              <p>Upload a CV template image to get started</p>
            </div>
          ) : (
            <div 
              ref={cvRef}
              className="cv-container"
              dangerouslySetInnerHTML={{ 
                __html: `<style>${editableCss}</style>${editableHtml}` 
              }}
            />
          )}
        </Card>
        
        <div className="flex flex-wrap justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleGenerateContent} 
            disabled={isLoading || isGeneratingContent || (!htmlContent && !cssContent)}
          >
            {isGeneratingContent ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Content
          </Button>
          
          <Button 
            onClick={handleExportPdf} 
            disabled={isLoading || (!htmlContent && !cssContent)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div>
        <Card className="p-4 space-y-6">
          <h3 className="text-lg font-medium">Personalize Your CV</h3>
          
          <ProfilePhotoUploader onPhotoUpload={handleProfilePhotoUpload} />
          
          <Tabs defaultValue="edit">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit Content</TabsTrigger>
              <TabsTrigger value="code">View Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="Senior Developer" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea 
                  id="summary" 
                  placeholder="Write a brief professional summary..." 
                  rows={4}
                />
              </div>
              
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Update CV
              </Button>
            </TabsContent>
            
            <TabsContent value="code" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="html-code">HTML</Label>
                  <Textarea 
                    id="html-code" 
                    value={editableHtml}
                    onChange={(e) => setEditableHtml(e.target.value)}
                    className="font-mono text-xs h-48"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="css-code">CSS</Label>
                  <Textarea 
                    id="css-code" 
                    value={editableCss}
                    onChange={(e) => setEditableCss(e.target.value)}
                    className="font-mono text-xs h-48"
                  />
                </div>
                
                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Apply Changes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
