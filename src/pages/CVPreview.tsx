
import React from "react";
import { Helmet } from "react-helmet-async";
import { EditableCVTemplate } from "@/components/EditableCVTemplate";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/cv-template.css";

const CVPreview = () => {
  return (
    <>
      <Helmet>
        <title>CV Template Editor</title>
        <meta name="description" content="Edit your professional CV template" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CV Template Editor</h1>
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="cv-preview-container">
          <EditableCVTemplate />
        </div>
      </div>
    </>
  );
};

export default CVPreview;
