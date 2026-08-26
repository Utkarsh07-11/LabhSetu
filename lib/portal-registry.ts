export interface PortalRegistryEntry {
  id: string;
  name: string;
  level: "Central" | "State";
  state?: string;
  category:
    | "Scheme Directory"
    | "Service Portal"
    | "Scholarship"
    | "Health"
    | "Housing"
    | "Agriculture"
    | "Welfare"
    | "Finance";
  url: string;
  source: "portal-registry";
  notes?: string;
}

export const portalRegistry: PortalRegistryEntry[] = [
  {
    id: "myscheme",
    name: "myScheme",
    level: "Central",
    category: "Scheme Directory",
    url: "https://www.myscheme.gov.in/",
    source: "portal-registry",
    notes: "National platform for scheme discovery by Digital India Corporation."
  },
  {
    id: "india-gov-schemes",
    name: "India.gov.in Schemes",
    level: "Central",
    category: "Scheme Directory",
    url: "https://www.india.gov.in/my-government/schemes",
    source: "portal-registry",
    notes: "National Portal of India schemes directory."
  },
  {
    id: "pm-kisan-portal",
    name: "PM Kisan Portal",
    level: "Central",
    category: "Agriculture",
    url: "https://pmkisan.gov.in/",
    source: "portal-registry"
  },
  {
    id: "pmjay-portal",
    name: "Ayushman Bharat PM-JAY",
    level: "Central",
    category: "Health",
    url: "https://pmjay.gov.in/",
    source: "portal-registry"
  },
  {
    id: "pmay-urban-portal",
    name: "PMAY Urban Portal",
    level: "Central",
    category: "Housing",
    url: "https://pmaymis.gov.in/",
    source: "portal-registry"
  },
  {
    id: "pm-svanidhi-portal",
    name: "PM SVANidhi",
    level: "Central",
    category: "Finance",
    url: "https://pmsvanidhi.mohua.gov.in/",
    source: "portal-registry"
  },
  {
    id: "national-scholarship-portal",
    name: "National Scholarship Portal",
    level: "Central",
    category: "Scholarship",
    url: "https://scholarships.gov.in/",
    source: "portal-registry"
  },
  {
    id: "atal-pension-portal",
    name: "Atal Pension Yojana Enrollment",
    level: "Central",
    category: "Finance",
    url: "https://enps.nsdl.com/eNPS/NationalPensionSystem.html",
    source: "portal-registry"
  },
  {
    id: "mahadbt",
    name: "MahaDBT",
    level: "State",
    state: "Maharashtra",
    category: "Welfare",
    url: "https://mahadbt.maharashtra.gov.in/",
    source: "portal-registry",
    notes: "Aaple Sarkar DBT portal."
  },
  {
    id: "ladki-bahin",
    name: "Majhi Ladki Bahin Portal",
    level: "State",
    state: "Maharashtra",
    category: "Welfare",
    url: "https://ladakibahin.maharashtra.gov.in/",
    source: "portal-registry"
  },
  {
    id: "maharashtra-health",
    name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
    level: "State",
    state: "Maharashtra",
    category: "Health",
    url: "https://www.jeevandayee.gov.in/",
    source: "portal-registry"
  },
  {
    id: "seva-sindhu",
    name: "Seva Sindhu",
    level: "State",
    state: "Karnataka",
    category: "Service Portal",
    url: "https://sevasindhu.karnataka.gov.in/",
    source: "portal-registry"
  },
  {
    id: "digital-gujarat",
    name: "Digital Gujarat",
    level: "State",
    state: "Gujarat",
    category: "Service Portal",
    url: "https://www.digitalgujarat.gov.in/",
    source: "portal-registry"
  },
  {
    id: "telangana-meeseva",
    name: "MeeSeva Telangana",
    level: "State",
    state: "Telangana",
    category: "Service Portal",
    url: "https://www.telangana.gov.in/services/meeseva-services",
    source: "portal-registry"
  },
  {
    id: "ap-gsws",
    name: "Grama Ward Sachivalayam",
    level: "State",
    state: "Andhra Pradesh",
    category: "Service Portal",
    url: "https://gramawardsachivalayam.ap.gov.in/gsws/Home/Main",
    source: "portal-registry"
  },
  {
    id: "tn-e-sevai",
    name: "Tamil Nadu e-Sevai",
    level: "State",
    state: "Tamil Nadu",
    category: "Service Portal",
    url: "https://it.tn.gov.in/en/node/258",
    source: "portal-registry"
  },
  {
    id: "tn-arasu-e-sevai",
    name: "Arasu e-Sevai Centres",
    level: "State",
    state: "Tamil Nadu",
    category: "Service Portal",
    url: "https://www.it.tn.gov.in/en/node/212",
    source: "portal-registry"
  },
  {
    id: "tn-agri-esevai",
    name: "Tamil Nadu Agri e-Sevai",
    level: "State",
    state: "Tamil Nadu",
    category: "Agriculture",
    url: "https://www.tnagrisnet.tn.gov.in/esevai/",
    source: "portal-registry"
  },
  {
    id: "kerala-e-district",
    name: "Kerala e-District",
    level: "State",
    state: "Kerala",
    category: "Service Portal",
    url: "https://edistrict.kerala.gov.in/",
    source: "portal-registry"
  },
  {
    id: "rajasthan-jan-soochna",
    name: "Jan Soochna Portal",
    level: "State",
    state: "Rajasthan",
    category: "Scheme Directory",
    url: "https://jansoochna.rajasthan.gov.in/",
    source: "portal-registry"
  },
  {
    id: "rajasthan-sje",
    name: "Rajasthan Social Justice and Empowerment",
    level: "State",
    state: "Rajasthan",
    category: "Welfare",
    url: "https://sje.rajasthan.gov.in/",
    source: "portal-registry"
  }
];
