// Sanity GROQ queries for fetching data

export const pageInfoQuery = `
  *[_type == "pageInfo"][0]{
    _id,
    name,
    role,
    heroImage,
    profilePic,
    backgroundInformation,
    contactInfo {
      email,
      phoneNumber,
      address
    },
    "socials": socials[]->{
      _id,
      title,
      url
    }
  }
`;

export const experienceQuery = `
  *[_type == "experience"] | order(dateStarted desc){
    _id,
    jobTitle,
    company,
    companyImage,
    dateStarted,
    dateEnded,
    isCurrentlyWorkingHere,
    points,
    "technologies": technologies[]->{
      _id,
      title,
      image
    }
  }
`;

export const skillsQuery = `
  *[_type == "skill"] | order(title asc){
    _id,
    title,
    progress,
    image
  }
`;

export const projectsQuery = `
  *[_type == "project"] | order(_createdAt desc){
    _id,
    title,
    image,
    summary,
    linkToBuild,
    "technologies": technologies[]->{
      _id,
      title,
      image
    }
  }
`;

export const socialsQuery = `
  *[_type == "social"] | order(title asc){
    _id,
    title,
    url
  }
`;
