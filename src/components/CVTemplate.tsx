
import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface CVTemplateProps {
  data?: {
    name: string;
    title: string;
    summary: string;
    phone: string;
    email: string;
    address: string;
    skills: string[];
    certifications: {
      title: string;
      date: string;
      organization: string;
    }[];
    memberships: {
      title: string;
      period: string;
      organization: string;
    }[];
    education: {
      degree: string;
      university: string;
      year: string;
      graduationDate: string;
    }[];
    experience: {
      position: string;
      company: string;
      location: string;
      year: string;
      responsibilities: string[];
    }[];
  };
  profileImageUrl?: string | null;
}

export const CVTemplate: React.FC<CVTemplateProps> = ({ data, profileImageUrl }) => {
  // Default data for the template
  const cvData = data || {
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
  };
  
  // Use the provided profile image if available, otherwise use default
  const profileImage = profileImageUrl || "/lovable-uploads/c1e4965f-13ed-4e91-936a-5675f7662d8d.png";
  
  return (
    <div className="cv-template">
      <div className="cv-container">
        {/* Left Column */}
        <div className="left-column">
          <div className="profile-photo-container">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="profile-photo" 
              crossOrigin="anonymous"
            />
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>{cvData.phone}</span>
            </div>
            
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span>{cvData.email}</span>
            </div>
            
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>{cvData.address}</span>
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-title">SKILLS</h2>
            <div className="skills-list">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="asterisk">*</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-title">CERTIFICATION</h2>
            {cvData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <div className="cert-header">
                  <h3>{cert.title}</h3>
                  <span className="date-badge">{cert.date}</span>
                </div>
                <p className="cert-organization">{cert.organization}</p>
              </div>
            ))}
          </div>
          
          <div className="section">
            <h2 className="section-title">MEMBERSHIP</h2>
            {cvData.memberships.map((membership, index) => (
              <div key={index} className="membership-item">
                <div className="membership-header">
                  <h3>{membership.title}</h3>
                  <span className="date-badge">{membership.period}</span>
                </div>
                <p className="membership-organization">{membership.organization}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="right-column">
          <div className="header">
            <h1 className="name">{cvData.name}</h1>
            <h2 className="title">{cvData.title}</h2>
            <div className="divider"></div>
            <p className="summary">{cvData.summary}</p>
          </div>
          
          <div className="section">
            <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
            <div className="summary-points">
              <div className="summary-item">
                <span className="asterisk">*</span>
                <p>Over 5 years of experience in family counseling, specializing in conflict resolution and communication.</p>
              </div>
              <div className="summary-item">
                <span className="asterisk">*</span>
                <p>Proficient in assessing family dynamics and creating tailored wellness plans.</p>
              </div>
              <div className="summary-item">
                <span className="asterisk">*</span>
                <p>Collaborated with a multidisciplinary team to develop holistic treatment plans for families.</p>
              </div>
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-title">EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-top">
                  <h3>{edu.degree}</h3>
                  <span className="year-badge">{edu.year}</span>
                </div>
                <div className="education-bottom">
                  <span>{edu.university}</span>
                  <span>{edu.graduationDate}</span>
                </div>
                <div className="education-divider"></div>
              </div>
            ))}
          </div>
          
          <div className="section">
            <h2 className="section-title">EXPERIENCE</h2>
            {cvData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3>{exp.position}</h3>
                  <span className="year-badge">{exp.year}</span>
                </div>
                <div className="experience-points">
                  {exp.responsibilities.map((resp, idx) => (
                    <div key={idx} className="experience-point">
                      <span className="asterisk">*</span>
                      <p>{resp}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
