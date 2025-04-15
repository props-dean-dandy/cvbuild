import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Github, FileText } from "lucide-react";
import { analyzeImageWithAI, fileToBase64 } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      
      const base64Image = await fileToBase64(file);
      
      toast({
        title: "Processing template",
        description: "Analyzing your CV template. This may take a minute...",
      });
      
      await analyzeImageWithAI(base64Image);
      
      toast({
        title: "Template processed",
        description: "Your CV template has been successfully converted to HTML",
      });
      
      navigate('/cv-preview');
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing failed",
        description: "There was an error analyzing your CV template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Resume Canvas AI - Convert CV Images to Editable Templates</title>
        <meta name="description" content="Upload your resume/CV template image and let AI convert it to a fully editable, responsive HTML template. Create professional CVs instantly." />
        <meta name="keywords" content="resume builder, CV creator, resume template, CV template, AI resume, resume maker, CV generator" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="Resume Canvas AI - CV Image to Editable Template" />
        <meta property="og:description" content="Upload your resume/CV template image and let AI convert it to a fully editable, responsive HTML template. Create professional CVs instantly." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="Resume Canvas AI - CV Image to Editable Template" />
        <meta property="twitter:description" content="Upload your resume/CV template image and let AI convert it to a fully editable, responsive HTML template. Create professional CVs instantly." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Resume Canvas AI",
              "description": "AI-powered tool to convert CV template images to editable HTML templates",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/placeholder.svg" 
                alt="Resume Canvas AI" 
                className="h-8 w-8" 
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cv-darkblue bg-clip-text text-transparent">
                Resume Canvas AI
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/cv-preview" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">CV Editor</span>
                </Link>
              </Button>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto py-8 px-4">
          <section className="glass-panel p-6 mb-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Transform Any CV Template with AI
              </h2>
              <p className="text-muted-foreground text-lg">
                Upload your CV template image and our AI will convert it to a fully editable, 
                responsive template that you can customize and export as PDF.
              </p>
            </div>
          </section>
          
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Upload Your Template</h3>
                <p className="text-muted-foreground mb-6">
                  Upload an image of any CV template you like. Our AI will analyze the design 
                  and recreate it in an editable format that you can customize to your needs.
                </p>
                
                <div className="mb-6">
                  <ImageUploader 
                    onImageUpload={(file) => handleImageUpload(file)} 
                    isProcessing={isProcessing}
                  />
                </div>
                
                <div className="mt-6 space-y-3 bg-muted p-4 rounded-lg">
                  <h4 className="font-medium">Template Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 rounded-full p-1 text-xs">✓</span>
                      Clear, high-quality image
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 rounded-full p-1 text-xs">✓</span>
                      JPG/JPEG format only
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 rounded-full p-1 text-xs">✓</span>
                      Max file size: 10MB
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 rounded-full p-1 text-xs">✓</span>
                      Ideally A4 proportion (portrait)
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -left-4 -top-4 w-full h-full border-2 border-dashed border-primary/40 rounded-lg"></div>
                  <img 
                    src="/lovable-uploads/c1e4965f-13ed-4e91-936a-5675f7662d8d.png" 
                    alt="CV Template Example" 
                    className="rounded-lg shadow-lg w-full max-w-md mx-auto" 
                  />
                </div>
                <div className="mt-6 flex justify-center">
                  <Button asChild>
                    <Link to="/cv-preview">Try Our Sample Template</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-10">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-card p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Upload Template</h4>
                  <p className="text-muted-foreground text-sm">Upload any CV template image you like or want to recreate.</p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-medium mb-2">AI Conversion</h4>
                  <p className="text-muted-foreground text-sm">Our AI analyzes the design and converts it to an editable format.</p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Customize & Export</h4>
                  <p className="text-muted-foreground text-sm">Edit the content, add your info, and export as a professional PDF.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} Resume Canvas AI. All rights reserved.
              </p>
              <div className="flex gap-6 mt-3 sm:mt-0">
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-foreground">Terms of Service</a>
                <a href="#" className="hover:text-foreground">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
