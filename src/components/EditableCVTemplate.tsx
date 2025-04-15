import React, { useState, useEffect, useRef } from "react";
import { CVTemplate } from "@/components/CVTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePhotoUploader } from "@/components/ProfilePhotoUploader";
import { Download, Save, Wand2, SkipForward } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { Switch } from "@/components/ui/switch";

interface EditableCVTemplateProps {
  initialData?: any;
}

export const EditableCVTemplate: React.FC<EditableCVTemplateProps> = ({ initialData }) => {
  const [cvData, setCvData] = useState({
    name: "Juliana Silva",
    title: "Family Wellness Counselor",
    summary: "A compassionate Family Wellness Counselor with a strong background in providing support and guidance to families facing various challenges.",
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City, ST 12345",
    skills: [
      "Family Assessment",
      "Conflict Resolution",
      "Communication Improvement",
      "Crisis Intervention",
      "Group Therapy",
      "Case Management"
    ],
    certifications: [
      {
        title: "Certified Family Counselor",
        date: "AUG 2021",
        organization: "Arowwai Industries Training Center, Any City"
      }
    ],
    memberships: [
      {
        title: "AMFT Member",
        period: "2022-PRESENT",
        organization: "Association for Marriage and Family Therapy"
      }
    ],
    education: [
      {
        degree: "Master of Science in Marriage and Family Counseling",
        university: "Rimberio University",
        year: "2021",
        graduationDate: "Graduated: May 2024"
      }
    ],
    experience: [
      {
        position: "Family Wellness Counselor at Giggling Platypus Co.",
        company: "Any City",
        location: "",
        year: "2022",
        responsibilities: [
          "Conducted individual and family counseling sessions, addressing issues such as domestic violence, abuse, and others.",
          "Collaborated with a multidisciplinary team to develop holistic treatment plans for families.",
          "Provided expertise and guidance to families facing various challenges."
        ]
      }
    ]
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [useProfilePhoto, setUseProfilePhoto] = useState<boolean>(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const { toast } = useToast();
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setCvData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setCvData({
      ...cvData,
      [field]: value
    });
  };

  const handleArrayChange = (parentField: string, index: number, field: string | null, value: any) => {
    const updatedArray = [...cvData[parentField]];
    
    if (field === null) {
      // If field is null, we're updating the entire item
      updatedArray[index] = value;
    } else {
      // Otherwise we're updating a specific field in the item
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
    }
    
    setCvData({
      ...cvData,
      [parentField]: updatedArray
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills[index] = value;
    
    setCvData({
      ...cvData,
      skills: updatedSkills
    });
  };

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, "New Skill"]
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills.splice(index, 1);
    
    setCvData({
      ...cvData,
      skills: updatedSkills
    });
  };

  const handleResponsibilityChange = (expIndex: number, respIndex: number, value: string) => {
    const updatedExperience = [...cvData.experience];
    const updatedResponsibilities = [...updatedExperience[expIndex].responsibilities];
    updatedResponsibilities[respIndex] = value;
    
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      responsibilities: updatedResponsibilities
    };
    
    setCvData({
      ...cvData,
      experience: updatedExperience
    });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          position: "New Position",
          company: "Company Name",
          location: "Location",
          year: new Date().getFullYear().toString(),
          responsibilities: ["Responsibility 1"]
        }
      ]
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...cvData.experience];
    updatedExperience.splice(index, 1);
    
    setCvData({
      ...cvData,
      experience: updatedExperience
    });
  };

  const handleProfilePhotoUpload = (imageUrl: string) => {
    setProfilePhoto(imageUrl);
    setUseProfilePhoto(true);
  };

  const enhanceWithAI = async (field: string) => {
    setIsGeneratingAI(true);
    
    try {
      // Simulating AI enhancement with a timeout
      // In a real implementation, this would call an API endpoint
      setTimeout(() => {
        let enhancedContent = "";
        
        switch (field) {
          case "summary":
            enhancedContent = "A highly skilled and compassionate Family Wellness Counselor with over 5 years of experience providing comprehensive support to families navigating various challenges. Specialized in conflict resolution, communication improvement, and crisis intervention with a person-centered approach that consistently delivers positive outcomes.";
            handleInputChange('summary', enhancedContent);
            break;
          case "skills":
            const enhancedSkills = [
              "Family System Assessment",
              "Advanced Conflict Resolution",
              "Therapeutic Communication",
              "Crisis Intervention & Management",
              "Multi-family Group Therapy",
              "Comprehensive Case Management",
              "Trauma-informed Care",
              "Cognitive Behavioral Techniques"
            ];
            setCvData({
              ...cvData,
              skills: enhancedSkills
            });
            break;
          default:
            break;
        }
        
        setIsGeneratingAI(false);
        
        toast({
          title: "AI Enhancement Complete",
          description: `Your ${field} has been enhanced with AI-generated content.`,
        });
      }, 1500);
    } catch (error) {
      setIsGeneratingAI(false);
      toast({
        title: "Enhancement failed",
        description: "There was an error enhancing your content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportPdf = async () => {
    const cvElement = document.querySelector('.cv-template');
    if (!cvElement) {
      toast({
        title: "Export failed",
        description: "Could not find CV element to export",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Preparing PDF",
      description: "Your CV is being converted to PDF...",
    });
    
    // Create a clone of the CV template to modify before export
    const clonedElement = cvElement.cloneNode(true) as HTMLElement;
    
    // Handle profile photo visibility based on user preference
    if (!useProfilePhoto) {
      const photoContainer = clonedElement.querySelector('.profile-photo-container');
      if (photoContainer) {
        photoContainer.remove();
      }
    } else if (profilePhoto) {
      // Ensure the profile photo is properly embedded in the PDF
      const profileImg = clonedElement.querySelector('.profile-photo') as HTMLImageElement;
      if (profileImg) {
        profileImg.src = profilePhoto;
      }
    }
    
    const options = {
      margin: 0,
      filename: 'my-cv.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false, 
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16
      }
    };
    
    try {
      await html2pdf().from(clonedElement).set(options).save();
      
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-4 overflow-hidden">
          <div ref={cvRef}>
            <CVTemplate data={cvData} profileImageUrl={useProfilePhoto ? profilePhoto : null} />
          </div>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Personalize Your CV</h3>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="use-profile" 
                  checked={useProfilePhoto}
                  onCheckedChange={setUseProfilePhoto}
                />
                <Label htmlFor="use-profile" className="text-sm cursor-pointer">
                  {useProfilePhoto ? "Show photo" : "Hide photo"}
                </Label>
              </div>
            </div>
            
            {useProfilePhoto ? (
              <ProfilePhotoUploader onPhotoUpload={handleProfilePhotoUpload} />
            ) : (
              <div className="flex justify-center my-4">
                <Button variant="outline" onClick={() => setUseProfilePhoto(true)}>
                  <SkipForward className="mr-2 h-4 w-4" />
                  Add profile photo
                </Button>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={cvData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title" 
                  value={cvData.title} 
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => enhanceWithAI('summary')}
                    disabled={isGeneratingAI}
                    className="h-7 text-xs"
                  >
                    {isGeneratingAI ? "Enhancing..." : (
                      <>
                        <Wand2 className="mr-1 h-3 w-3" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea 
                  id="summary" 
                  value={cvData.summary} 
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={cvData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={cvData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={cvData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Work Experience</h4>
                <Button size="sm" variant="outline" onClick={addExperience}>Add Experience</Button>
              </div>
              
              {cvData.experience.map((exp, expIndex) => (
                <Card key={expIndex} className="p-3">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-medium">Position {expIndex + 1}</h5>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeExperience(expIndex)}
                      className="h-6 text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`position-${expIndex}`}>Job Title</Label>
                      <Input 
                        id={`position-${expIndex}`} 
                        value={exp.position} 
                        onChange={(e) => handleArrayChange('experience', expIndex, 'position', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`company-${expIndex}`}>Company</Label>
                      <Input 
                        id={`company-${expIndex}`} 
                        value={exp.company} 
                        onChange={(e) => handleArrayChange('experience', expIndex, 'company', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`year-${expIndex}`}>Year</Label>
                      <Input 
                        id={`year-${expIndex}`} 
                        value={exp.year} 
                        onChange={(e) => handleArrayChange('experience', expIndex, 'year', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Responsibilities</Label>
                      {exp.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} className="flex mt-2">
                          <Input 
                            value={resp} 
                            onChange={(e) => handleResponsibilityChange(expIndex, respIndex, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <div className="space-y-3">
                  {cvData.education.map((edu, index) => (
                    <Card key={index} className="p-3">
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`degree-${index}`}>Degree</Label>
                          <Input 
                            id={`degree-${index}`} 
                            value={edu.degree} 
                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`university-${index}`}>University</Label>
                          <Input 
                            id={`university-${index}`} 
                            value={edu.university} 
                            onChange={(e) => handleArrayChange('education', index, 'university', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`year-${index}`}>Year</Label>
                            <Input 
                              id={`year-${index}`} 
                              value={edu.year} 
                              onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`graduation-${index}`}>Graduation</Label>
                            <Input 
                              id={`graduation-${index}`} 
                              value={edu.graduationDate} 
                              onChange={(e) => handleArrayChange('education', index, 'graduationDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Skills</h4>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => enhanceWithAI('skills')}
                    disabled={isGeneratingAI}
                    className="h-7 text-xs"
                  >
                    {isGeneratingAI ? "Enhancing..." : (
                      <>
                        <Wand2 className="mr-1 h-3 w-3" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={addSkill}>Add Skill</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={skill} 
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeSkill(index)}
                      className="h-8 text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Certifications</Label>
                {cvData.certifications.map((cert, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`cert-title-${index}`}>Title</Label>
                        <Input 
                          id={`cert-title-${index}`} 
                          value={cert.title} 
                          onChange={(e) => handleArrayChange('certifications', index, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`cert-date-${index}`}>Date</Label>
                        <Input 
                          id={`cert-date-${index}`} 
                          value={cert.date} 
                          onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`cert-org-${index}`}>Organization</Label>
                        <Input 
                          id={`cert-org-${index}`} 
                          value={cert.organization} 
                          onChange={(e) => handleArrayChange('certifications', index, 'organization', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Memberships</Label>
                {cvData.memberships.map((mem, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`mem-title-${index}`}>Title</Label>
                        <Input 
                          id={`mem-title-${index}`} 
                          value={mem.title} 
                          onChange={(e) => handleArrayChange('memberships', index, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`mem-period-${index}`}>Period</Label>
                        <Input 
                          id={`mem-period-${index}`} 
                          value={mem.period} 
                          onChange={(e) => handleArrayChange('memberships', index, 'period', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`mem-org-${index}`}>Organization</Label>
                        <Input 
                          id={`mem-org-${index}`} 
                          value={mem.organization} 
                          onChange={(e) => handleArrayChange('memberships', index, 'organization', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
