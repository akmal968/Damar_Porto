export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  photo_url: string;
  contact_email: string;
  whatsapp_number: string;
  cv_url?: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  updated_at?: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution_name: string;
  degree: string;
  major: string;
  start_year: number;
  end_year: number | null;
  description: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  created_at?: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  level: number; // 0-100
  created_at?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
  created_at?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  awarder: string;
  date: string;
  description: string;
  created_at?: string;
}
