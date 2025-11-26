// Type definitions for 72 AI Labs website

export interface Project {
  id: string;
  name: string;
  shortBlurb: string;
  tagline: string;
  description: string;
  category: string;
  featured: boolean;
  dataTypes: string[];
  mlMethods: string[];
  challenges: string[];
  tags: string[];
}

export interface Solution {
  id: string;
  name: string;
  description: string;
  projects: string[];
}
