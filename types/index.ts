// Type definitions for the application

export interface SanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export interface Image {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface ContactInfo {
  email: string;
  phoneNumber: string;
  address: string;
}

export interface PageInfo extends SanityBody {
  _type: "pageInfo";
  name: string;
  role: string;
  heroImage: Image;
  backgroundInformation: string;
  profilePic: Image;
  contactInfo: ContactInfo;
  socials: Social[];
}

export interface Technology extends SanityBody {
  _type: "skill";
  title: string;
  progress: number;
  image: Image;
}

export interface Skill extends SanityBody {
  _type: "skill";
  title: string;
  progress: number;
  image: Image;
}

export interface Experience extends SanityBody {
  _type: "experience";
  jobTitle: string;
  companyImage: Image;
  company: string;
  dateStarted: string;
  dateEnded: string;
  isCurrentlyWorkingHere: boolean;
  points: string[];
  technologies: Technology[];
}

export interface Project extends SanityBody {
  _type: "project";
  title: string;
  image: Image;
  summary: string;
  technologies: Technology[];
  linkToBuild: string;
}

export interface Social extends SanityBody {
  _type: "social";
  title: string;
  url: string;
}
