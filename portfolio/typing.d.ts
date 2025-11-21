interface sanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}


interface image {
    _type: "image";
    asset: {
        _ref: string;
        _type: "reference";
    };
}   

export interface PageInfo extends sanityBody {
    _type: "pageInfo";
    name: string;
    role: string;
    heroImage: image;
    backgroundInformation: string;
    profilePic: image;
    phoneNumber: string;
    email: string;
    address: string;
    socials: Social[];
}

export interface Technology extends sanityBody {
    _type: "skill";
    title: string;
    progress: number;
    image: image;
}

export interface skills extends sanityBody {
    _type: "skill";
    title: string;
    progress: number;
    image: image;
}

export interface Experience extends sanityBody {
    _type: "experience";
    jobTitle: string;
    companyImage: image;
    company: string;
    dateStarted: string;
    dateEnded: string;
    isCurrentlyWorkingHere: boolean;
    points: string[];
    technologies: Technology[];
}

export interface Project extends sanityBody {
    _type: "project";
    title: string;
    image: image;
    summary: string;
    technologies: Technology[];
    linkToBuild: string;
}

export interface Social extends sanityBody {
    _type: "social";
    title: string;
    url: string;
}