import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Award,
  Compass,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  MapPin,
  Building2,
  ChevronRight,
  Sparkles,
  Send,
  RotateCcw,
  Printer,
  ChevronDown,
  Activity,
  AwardIcon,
  Shield,
  ArrowRight,
  Info,
  Check,
  X,
  MessageSquare,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack
} from 'lucide-react';
import {
  generateCase,
  evaluateAnswer,
  sendTutorMessage,
  ApprenticeProfile,
  CaseStudy,
  EvaluationResult,
  ChatMessage
} from './services/api';

// Pre-defined training profile templates to let instructors test the applet immediately
const PROFILE_TEMPLATES = [
  {
    apprenticeName: "Laura Camila Restrepo",
    documentNumber: "1002345678",
    email: "lcrestrepo@misena.edu.co",
    phone: "3124567890",
    regional: "Distrito Capital",
    trainingCenter: "Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)",
    trainingProgram: "Tecnólogo en Análisis y Desarrollo de Software (ADSO)",
    level: "Tecnólogo",
    priorSena: false,
    priorSenaDetails: "",
    expectation: "Aprender a programar aplicaciones web de clase mundial y aportar al desarrollo tecnológico de mi región."
  },
  {
    apprenticeName: "Carlos Mario Bedoya",
    documentNumber: "1152119934",
    email: "cmbedoya24@misena.edu.co",
    phone: "3004891122",
    regional: "Antioquia",
    trainingCenter: "Centro de Formación Agroindustrial - El Pomar",
    trainingProgram: "Técnico en Producción Agropecuaria Ecológica",
    level: "Técnico",
    priorSena: true,
    priorSenaDetails: "Curso de Manipulación de Alimentos (SENA 2024)",
    expectation: "Implementar técnicas sostenibles de siembra y mejorar la productividad familiar en el campo."
  },
  {
    apprenticeName: "Mariana Estefanía Díaz",
    documentNumber: "1045233110",
    email: "mediaz10@misena.edu.co",
    phone: "3189901234",
    regional: "Valle",
    trainingCenter: "Centro de Diseño Tecnológico Industrial (CDTI)",
    trainingProgram: "Tecnólogo en Mecatrónica Industrial",
    level: "Tecnólogo",
    priorSena: false,
    priorSenaDetails: "",
    expectation: "Adquirir habilidades en automatización de maquinaria y robótica para vincularme a la industria manufacturera."
  }
];

// 33 SENA Regionals
const SENA_REGIONALES = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas",
  "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca",
  "Distrito Capital (Bogotá)", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés, Providencia y Santa Catalina", "Santander", "Sucre", "Tolima",
  "Valle del Cauca", "Vaupés", "Vichada"
];

// Historical milestones of SENA
const HISTORICAL_MILESTONES = [
  {
    year: "1957",
    title: "Fundación y Nacimiento",
    desc: "El SENA nació el 21 de junio de 1957 mediante el Decreto-Ley 118 de la Junta Militar de Gobierno. Su gran visionario y fundador fue Rodolfo Martínez Tono, quien planteó una entidad pública financiada por empresarios para capacitar técnicamente a la clase trabajadora colombiana."
  },
  {
    year: "1960s",
    title: "Consolidación e Internacionalización",
    desc: "SENA expande sus fronteras firmando convenios con la OIT (Organización Internacional del Trabajo) y países europeos para capacitar a instructores e importar maquinaria especializada para el aprendizaje práctico."
  },
  {
    year: "1970s",
    title: "Aulas Móviles y Sector Rural",
    desc: "Nacen los programas de 'SENA Móvil' para llegar a la Colombia profunda mediante camiones, lanchas y remolques acondicionados como talleres formativos. Se da una fuerte expansión en programas agrícolas y pecuarios."
  },
  {
    year: "1990s",
    title: "Revolución Informática y Virtual",
    desc: "SENA inicia su inmersión digital introduciendo los primeros computadores en los centros de formación y creando programas pioneros de tele-educación y formación virtual a través de plataformas electrónicas iniciales."
  },
  {
    year: "2010s",
    title: "Innovación y SENNOVA",
    desc: "Se funda SENNOVA (Sistema de Investigación, Desarrollo Tecnológico e Innovación), impulsando la investigación aplicada y apoyando la creación de empresas colombianas con el Fondo Emprender del SENA."
  },
  {
    year: "Presente",
    title: "Era Digital e Inteligencia Artificial",
    desc: "SENA asume los retos del Siglo XXI impulsando programas en Inteligencia Artificial, Energías Renovables, Desarrollo de Software de Última Generación, y Agroecología, manteniendo su matrícula 100% gratuita para millones de colombianos."
  }
];

// Symbols of SENA
const SENA_SYMBOLS = [
  {
    id: "logo",
    name: "Logo-Símbolo",
    desc: "El logo-símbolo representa gráficamente la síntesis de los enfoques de formación del SENA. El piñón de color verde representa la industria y la metalmecánica. El caduceo representa las actividades de comercio y servicios. La hoja de café representa la herencia agrícola y el sector primario de Colombia.",
    icon: Compass,
    color: "from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "shield",
    name: "El Escudo",
    desc: "Refleja los tres sectores económicos en los que el SENA forma a sus aprendices. Es un símbolo de orgullo nacional y de la productividad del pueblo colombiano, utilizado en actos protocolarios e institucionales de máxima relevancia.",
    icon: Shield,
    color: "from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
  },
  {
    id: "flag",
    name: "La Bandera",
    desc: "De fondo color blanco puro, que simboliza la paz, la tranquilidad y la libertad en el proceso formativo. Lleva en el centro el escudo de la institución, representando la soberanía de la educación técnica en todo el territorio nacional.",
    icon: FileText,
    color: "from-slate-50 to-zinc-100 text-slate-700 border-slate-300"
  },
  {
    id: "hymn",
    name: "Himno Institucional",
    desc: "Escrito por Jesús María Martínez Burgos. Su letra es un llamado al trabajo, la superación y el amor por la patria. Invita a los jóvenes colombianos a ser 'soldados de la vida' a través de la educación integral, la disciplina y el esfuerzo diario.",
    icon: Award,
    color: "from-amber-50 to-orange-50 text-amber-700 border-amber-200"
  }
];

// Apprentice Rights list
const APPRENTICE_RIGHTS = [
  {
    article: "Art. 7 - Num 1",
    title: "Formación de Calidad",
    desc: "Recibir una formación profesional integral acorde con el programa de formación, con instructores calificados y metodologías que fomenten el pensamiento crítico y el autoaprendizaje."
  },
  {
    article: "Art. 7 - Num 3",
    title: "Uso de Recursos",
    desc: "Disponer en los centros de formación de los recursos físicos, tecnológicos, bibliotecarios y conectividad a internet requeridos para un correcto desarrollo del programa."
  },
  {
    article: "Art. 7 - Num 6",
    title: "Bienestar al Aprendiz",
    desc: "Acceder a los programas, apoyos socioeconómicos y servicios ofrecidos por la Oficina de Bienestar al Aprendiz (salud, psicología, cultura, recreación y deportes)."
  },
  {
    article: "Art. 7 - Num 9",
    title: "Expresión Libre",
    desc: "Expresar con respeto y fundamentación sus ideas, opiniones y sugerencias sobre el proceso formativo, garantizándose la libertad de conciencia y culto."
  },
  {
    article: "Art. 7 - Num 13",
    title: "Debido Proceso",
    desc: "Ser escuchado, respetado y asistido en el trámite de solicitudes académicas o disciplinarias, con derecho a la defensa y la contradicción ante comités."
  }
];

// Apprentice Duties list
const APPRENTICE_DUTIES = [
  {
    article: "Art. 8 - Num 1",
    title: "Honestidad Académica",
    desc: "Actuar con honestidad y ética en el desarrollo de actividades formativas, evaluaciones y proyectos. No realizar fraude, plagio o suplantación en entregables."
  },
  {
    article: "Art. 8 - Num 3",
    title: "Porte del Uniforme y Carné",
    desc: "Portar debidamente el carné del SENA en lugar visible dentro de las instalaciones y usar el uniforme establecido de forma digna, pulcra y exclusiva para los fines formativos."
  },
  {
    article: "Art. 8 - Num 5",
    title: "Asistencia y Puntualidad",
    desc: "Asistir puntualmente a todas las sesiones presenciales o virtuales programadas en el cronograma de actividades de su ficha de formación."
  },
  {
    article: "Art. 8 - Num 9",
    title: "Conservación de Bienes",
    desc: "Cuidar de forma responsable las herramientas, maquinarias, software e infraestructura del centro, respondiendo por daños ocasionados por dolo o negligencia."
  },
  {
    article: "Art. 8 - Num 12",
    title: "Relaciones de Respeto",
    desc: "Mantener relaciones interpersonales armoniosas y de mutuo respeto con instructores, compañeros de clase, personal administrativo y de servicios."
  }
];

// Quiz Questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "¿En qué año se fundó el SENA y quién fue su fundador principal?",
    options: [
      { text: "1962 por Gustavo Rojas Pinilla", isCorrect: false },
      { text: "1957 por Rodolfo Martínez Tono", isCorrect: true },
      { text: "1970 por Carlos Lleras Restrepo", isCorrect: false },
      { text: "1950 por Alberto Lleras Camargo", isCorrect: false }
    ],
    explanation: "El SENA fue fundado el 21 de junio de 1957 mediante el Decreto-Ley 118 de la Junta Militar de Gobierno, bajo la gran visión del abogado y economista cartagenero Rodolfo Martínez Tono."
  },
  {
    id: 2,
    question: "¿Qué significan las tres figuras icónicas de los símbolos del SENA (piñón, caduceo y hoja de café)?",
    options: [
      { text: "Educación básica, media y universitaria", isCorrect: false },
      { text: "Los tres sectores económicos: Industria, Comercio/Servicios y Agropecuario", isCorrect: true },
      { text: "Las tres zonas de Colombia: Andina, Caribe y Pacífica", isCorrect: false },
      { text: "Técnico, Tecnólogo y Auxiliar operativo", isCorrect: false }
    ],
    explanation: "El piñón representa al sector de la industria y metalmecánica, el caduceo al de comercio y servicios, y la hoja de café al sector primario, agrícola y rural."
  },
  {
    id: 3,
    question: "Si un aprendiz incurre en copia o plagio de un proyecto de software o trabajo académico, ¿qué tipo de falta está cometiendo según el Reglamento?",
    options: [
      { text: "Falta Académica, que da inicio a un debido proceso y plan de mejoramiento", isCorrect: true },
      { text: "Es un derecho del aprendiz compartir archivos libremente sin citar", isCorrect: false },
      { text: "Es una falta leve que se soluciona únicamente con disculpas verbales", isCorrect: false },
      { text: "No está tipificado en el Reglamento del Aprendiz", isCorrect: false }
    ],
    explanation: "El fraude o plagio viola el deber de honestidad académica (Art. 8). Se clasifica como falta académica y activa el comité de evaluación, pudiendo acarrear desde llamado escrito hasta cancelación de matrícula."
  },
  {
    id: 4,
    question: "¿Cuántas oficinas Regionales tiene el SENA en todo el país?",
    options: [
      { text: "15 Regionales principales", isCorrect: false },
      { text: "24 Regionales (una por departamento principal)", isCorrect: false },
      { text: "33 Regionales (una en cada departamento de Colombia y Distrito Capital)", isCorrect: true },
      { text: "5 Regionales por zonas geográficas", isCorrect: false }
    ],
    explanation: "El SENA cuenta con cobertura del 100% nacional a través de 33 oficinas Regionales, logrando presencia física en todos los departamentos y en Bogotá D.C."
  },
  {
    id: 5,
    question: "¿Cuál de las siguientes es una modalidad válida regulada para el desarrollo de la Etapa Práctica?",
    options: [
      { text: "Únicamente el Contrato de Aprendizaje empresarial", isCorrect: false },
      { text: "Trabajo informal sin supervisión del centro de formación", isCorrect: false },
      { text: "Contrato de Aprendizaje, Proyecto Productivo, Pasantía, Vínculo Laboral o Monitoría", isCorrect: true },
      { text: "Cursar otro programa técnico en paralelo", isCorrect: false }
    ],
    explanation: "El SENA permite múltiples alternativas para la etapa práctica con el fin de brindar flexibilidad: Contrato de Aprendizaje, Proyectos Productivos, Pasantías, Vínculo laboral directo y Monitorías académicas."
  }
];

interface RegionalInfo {
  id: string;
  name: string;
  capital: string;
  x: number;
  y: number;
  regionalName: string;
  address: string;
  phone: string;
  email: string;
  zone: 'Caribe' | 'Andina' | 'Pacífica' | 'Orinoquía' | 'Amazonía' | 'Insular';
  centers: string[];
}

const COLOMBIA_REGIONS_DATA: RegionalInfo[] = [
  {
    id: "amazonas",
    name: "Amazonas",
    capital: "Leticia",
    x: 58,
    y: 88,
    regionalName: "Regional Amazonas",
    address: "Av. Vásquez Cobo No. 11-139, Leticia",
    phone: "(608) 5927626",
    email: "amazon_director@sena.edu.co",
    zone: "Amazonía",
    centers: ["Centro de Formación Tecnológica del Amazonas"]
  },
  {
    id: "antioquia",
    name: "Antioquia",
    capital: "Medellín",
    x: 38,
    y: 36,
    regionalName: "Regional Antioquia",
    address: "Calle 51 No. 57-70, Medellín",
    phone: "(604) 5760000",
    email: "antio_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Tecnología de la Manufactura Avanzada (CTMA)",
      "Centro Tecnológico del Mobiliario",
      "Centro de Servicios de Salud",
      "Centro Metalmecánico",
      "Centro de Formación Agroindustrial (El Pomar)",
      "Centro de Servicios y Gestión Empresarial",
      "Centro de Diseño y Manufactura del Cuero",
      "Centro Textil y de Gestión Industrial"
    ]
  },
  {
    id: "arauca",
    name: "Arauca",
    capital: "Arauca",
    x: 65,
    y: 38,
    regionalName: "Regional Arauca",
    address: "Carrera 20 con Calle 29, Arauca",
    phone: "(607) 8851474",
    email: "arauc_director@sena.edu.co",
    zone: "Orinoquía",
    centers: ["Centro de Gestión y Desarrollo Agroindustrial de Arauca"]
  },
  {
    id: "atlantico",
    name: "Atlántico",
    capital: "Barranquilla",
    x: 42,
    y: 11,
    regionalName: "Regional Atlántico",
    address: "Calle 30 No. 3E-164, Barranquilla",
    phone: "(605) 3852200",
    email: "atlan_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro Industrial y de Aviación",
      "Centro de Comercio y Servicios",
      "Centro Colombo Alemán",
      "Centro para el Desarrollo del Hábitat y la Construcción"
    ]
  },
  {
    id: "bolivar",
    name: "Bolívar",
    capital: "Cartagena",
    x: 40,
    y: 22,
    regionalName: "Regional Bolívar",
    address: "Avenida Pedro de Heredia, Sector Ternera, Cartagena",
    phone: "(605) 6697100",
    email: "boliv_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro para la Industria Petroquímica",
      "Centro Internacional Náutico Fluvial y Portuario",
      "Centro de Comercio y Servicios",
      "Centro Agroempresarial y Minero"
    ]
  },
  {
    id: "boyaca",
    name: "Boyacá",
    capital: "Tunja",
    x: 52,
    y: 45,
    regionalName: "Regional Boyacá",
    address: "Calle 19 No. 12-29, Tunja",
    phone: "(608) 7422955",
    email: "boyac_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Gestión Administrativa y Fortalecimiento Institucional",
      "Centro Industrial de Mantenimiento y Manufactura (CIMM)",
      "Centro Minero",
      "Centro de Desarrollo Agropecuario y Tecnológico (CEDEAGRO)"
    ]
  },
  {
    id: "caldas",
    name: "Caldas",
    capital: "Manizales",
    x: 37,
    y: 47,
    regionalName: "Regional Caldas",
    address: "Kilómetro 10 Vía al Magdalena, Manizales",
    phone: "(606) 8741546",
    email: "calda_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Automatización Industrial",
      "Centro de Procesos Industriales",
      "Centro de Comercio y Servicios",
      "Centro Pecuario y Agroempresarial"
    ]
  },
  {
    id: "caqueta",
    name: "Caquetá",
    capital: "Florencia",
    x: 45,
    y: 74,
    regionalName: "Regional Caquetá",
    address: "Kilómetro 3 Vía Aeropuerto, Florencia",
    phone: "(608) 4354203",
    email: "caque_director@sena.edu.co",
    zone: "Amazonía",
    centers: ["Centro Tecnológico de la Amazonía"]
  },
  {
    id: "casanare",
    name: "Casanare",
    capital: "Yopal",
    x: 59,
    y: 48,
    regionalName: "Regional Casanare",
    address: "Carrera 19 No. 36-68, Yopal",
    phone: "(608) 6348123",
    email: "casan_director@sena.edu.co",
    zone: "Orinoquía",
    centers: ["Centro de Gestión y Desarrollo Agroindustrial de Casanare"]
  },
  {
    id: "cauca",
    name: "Cauca",
    capital: "Popayán",
    x: 28,
    y: 64,
    regionalName: "Regional Cauca",
    address: "Carrera 9 No. 71N-60, Popayán",
    phone: "(602) 8224240",
    email: "cauca_director@sena.edu.co",
    zone: "Pacífica",
    centers: [
      "Centro de Comercio y Servicios",
      "Centro de Teleinformática y Producción Industrial",
      "Centro Agropecuario"
    ]
  },
  {
    id: "cesar",
    name: "Cesar",
    capital: "Valledupar",
    x: 50,
    y: 14,
    regionalName: "Regional Cesar",
    address: "Calle 39 No. 4-100, Valledupar",
    phone: "(605) 5742220",
    email: "cesar_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro de Operación y Mantenimiento Minero (COMM)",
      "Centro Biotecnológico del Caribe"
    ]
  },
  {
    id: "choco",
    name: "Chocó",
    capital: "Quibdó",
    x: 27,
    y: 40,
    regionalName: "Regional Chocó",
    address: "Calle 24 No. 14-42, Quibdó",
    phone: "(604) 6711516",
    email: "choco_director@sena.edu.co",
    zone: "Pacífica",
    centers: ["Centro de Recursos Naturales, Industria y Biodiversidad"]
  },
  {
    id: "cordoba",
    name: "Córdoba",
    capital: "Montería",
    x: 34,
    y: 22,
    regionalName: "Regional Córdoba",
    address: "Carrera 9 No. 27-37, Montería",
    phone: "(605) 7849000",
    email: "cordo_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro de Comercio, Industria y Turismo",
      "Centro Agropecuario y de Biotecnología El Porvenir"
    ]
  },
  {
    id: "cundinamarca",
    name: "Cundinamarca",
    capital: "Bogotá",
    x: 45,
    y: 50,
    regionalName: "Regional Cundinamarca",
    address: "Calle 57 No. 8-69, Bogotá",
    phone: "(601) 5461500",
    email: "cundi_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Desarrollo Agroecológico y Empresarial (Fusagasugá)",
      "Centro Industrial y de Desarrollo Empresarial (Soacha)",
      "Centro de Desarrollo Agroindustrial y Empresarial (Villeta)",
      "Centro Agroecológico y Empresarial (Chía)",
      "Centro de Tecnología para el Desarrollo de la Construcción (Girardot)"
    ]
  },
  {
    id: "distritocapital",
    name: "Distrito Capital (Bogotá)",
    capital: "Bogotá D.C.",
    x: 46,
    y: 53,
    regionalName: "Regional Distrito Capital",
    address: "Calle 57 No. 8-69, Bogotá D.C.",
    phone: "(601) 5960100",
    email: "dcap_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)",
      "Centro de Tecnologías de Transporte",
      "Centro de Gestión Industrial",
      "Centro de Servicios Financieros",
      "Centro de Gestión de Mercados, Logística y Tecnologías de la Información",
      "Centro para la Industria de la Comunicación Gráfica (CENIGRAF)",
      "Centro de Materiales y Ensayos",
      "Centro de Formación de Actividad Física y Cultura",
      "Centro de Manufactura en Textil y Cuero"
    ]
  },
  {
    id: "guainia",
    name: "Guainía",
    capital: "Inírida",
    x: 77,
    y: 62,
    regionalName: "Regional Guainía",
    address: "Calle 16 No. 15-28, Inírida",
    phone: "(608) 5656110",
    email: "guain_director@sena.edu.co",
    zone: "Orinoquía",
    centers: ["Centro de Desarrollo Tecnológico de Guainía"]
  },
  {
    id: "guaviare",
    name: "Guaviare",
    capital: "San José del Guaviare",
    x: 56,
    y: 67,
    regionalName: "Regional Guaviare",
    address: "Transversal 20 No. 20-40, San José del Guaviare",
    phone: "(608) 5840600",
    email: "guavi_director@sena.edu.co",
    zone: "Amazonía",
    centers: ["Centro de Desarrollo Agroindustrial y Forestal del Guaviare"]
  },
  {
    id: "huila",
    name: "Huila",
    capital: "Neiva",
    x: 35,
    y: 61,
    regionalName: "Regional Huila",
    address: "Carrera 5 No. 16-16, Neiva",
    phone: "(608) 8718360",
    email: "huila_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de la Industria, la Empresa y los Servicios",
      "Centro de Formación Agroindustrial",
      "Centro de Desarrollo Tecnológico y de Innovación",
      "Centro de Gestión y Desarrollo Sostenible Surcolombiano (Pitalito)"
    ]
  },
  {
    id: "guajira",
    name: "La Guajira",
    capital: "Riohacha",
    x: 52,
    y: 4,
    regionalName: "Regional La Guajira",
    address: "Carrera 15 No. 15-23, Riohacha",
    phone: "(605) 7272101",
    email: "guaji_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro Industrial y de Energías Alternativas",
      "Centro Agroempresarial y Acuícola"
    ]
  },
  {
    id: "magdalena",
    name: "Magdalena",
    capital: "Santa Marta",
    x: 46,
    y: 10,
    regionalName: "Regional Magdalena",
    address: "Avenida Ferrocarril Calle 29, Santa Marta",
    phone: "(605) 4311020",
    email: "magda_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro de Logística y Promoción Ecoturística",
      "Centro Acuícola y Agroindustrial de Gaira"
    ]
  },
  {
    id: "meta",
    name: "Meta",
    capital: "Villavicencio",
    x: 51,
    y: 59,
    regionalName: "Regional Meta",
    address: "Carrera 12 No. 20D-12, Villavicencio",
    phone: "(608) 6818700",
    email: "meta_director@sena.edu.co",
    zone: "Orinoquía",
    centers: [
      "Centro de Industria y Servicios del Meta",
      "Centro Agroindustrial del Meta (Hachón)"
    ]
  },
  {
    id: "narino",
    name: "Nariño",
    capital: "Pasto",
    x: 21,
    y: 72,
    regionalName: "Regional Nariño",
    address: "Calle 22 No. 11E-05, Pasto",
    phone: "(602) 7291111",
    email: "narin_director@sena.edu.co",
    zone: "Pacífica",
    centers: [
      "Centro Internacional de Producción Limpia (Lope)",
      "Centro Sur Colombiano de Logística y Tecnología (Ipiales)",
      "Centro Agroindustrial y Pesquero de la Costa Pacífica (Tumaco)"
    ]
  },
  {
    id: "nortesantander",
    name: "Norte de Santander",
    capital: "Cúcuta",
    x: 53,
    y: 31,
    regionalName: "Regional Norte de Santander",
    address: "Calle 2N No. 5-55, Cúcuta",
    phone: "(607) 5829990",
    email: "nsant_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de la Industria, la Empresa y los Servicios (CIES)",
      "Centro de Formación para el Sector Minero e Industrial"
    ]
  },
  {
    id: "putumayo",
    name: "Putumayo",
    capital: "Mocoa",
    x: 28,
    y: 77,
    regionalName: "Regional Putumayo",
    address: "Calle 15 No. 12-14, Mocoa",
    phone: "(608) 4200420",
    email: "putum_director@sena.edu.co",
    zone: "Amazonía",
    centers: ["Centro Agroforestal y Acuícola Arapaima"]
  },
  {
    id: "quindio",
    name: "Quindío",
    capital: "Armenia",
    x: 35,
    y: 52,
    regionalName: "Regional Quindío",
    address: "Carrera 18 con Calle 7, Armenia",
    phone: "(606) 7498111",
    email: "quind_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Comercio, Industria y Turismo",
      "Centro para el Desarrollo Tecnológico de la Construcción y la Industria",
      "Centro Agroindustrial"
    ]
  },
  {
    id: "risaralda",
    name: "Risaralda",
    capital: "Pereira",
    x: 34,
    y: 50,
    regionalName: "Regional Risaralda",
    address: "Carrera 8a No. 26-79, Pereira",
    phone: "(606) 3135800",
    email: "risar_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Diseño e Innovación Tecnológica Industrial",
      "Centro de Comercio y Servicios",
      "Centro de Atención Sector Agropecuario"
    ]
  },
  {
    id: "sanandres",
    name: "San Andrés y Providencia",
    capital: "San Andrés",
    x: 15,
    y: 10,
    regionalName: "Regional San Andrés, Providencia y Santa Catalina",
    address: "Avenida Francisco Newball, San Andrés Isla",
    phone: "(608) 5122104",
    email: "sanan_director@sena.edu.co",
    zone: "Insular",
    centers: ["Centro de Formación Turística, Gente de Mar y de Servicios"]
  },
  {
    id: "santander",
    name: "Santander",
    capital: "Bucaramanga",
    x: 48,
    y: 36,
    regionalName: "Regional Santander",
    address: "Calle 16 No. 27-37, Bucaramanga",
    phone: "(607) 6800600",
    email: "santa_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro Industrial del Diseño y la Manufactura (Floridablanca)",
      "Centro de Servicios Empresariales y Turísticos",
      "Centro de Tecnología Agropecuaria",
      "Centro de Gestión Agroempresarial (Vélez)",
      "Centro Agroempresarial y Turístico de los Andes (San Gil)"
    ]
  },
  {
    id: "sucre",
    name: "Sucre",
    capital: "Sincelejo",
    x: 38,
    y: 18,
    regionalName: "Regional Sucre",
    address: "Carrera 25 No. 20A-45, Sincelejo",
    phone: "(605) 2800310",
    email: "sucre_director@sena.edu.co",
    zone: "Caribe",
    centers: [
      "Centro de la Innovación, la Tecnología y los Servicios",
      "Centro Agropecuario y de Biotecnología"
    ]
  },
  {
    id: "tolima",
    name: "Tolima",
    capital: "Ibagué",
    x: 37,
    y: 55,
    regionalName: "Regional Tolima",
    address: "Transversal 1a No. 44-58, Ibagué",
    phone: "(608) 2709600",
    email: "tolim_director@sena.edu.co",
    zone: "Andina",
    centers: [
      "Centro de Industria y de la Construcción",
      "Centro de Comercio y Servicios",
      "Centro Agropecuario La Granja (Espinal)"
    ]
  },
  {
    id: "valle",
    name: "Valle del Cauca",
    capital: "Cali",
    x: 27,
    y: 57,
    regionalName: "Regional Valle",
    address: "Calle 52 No. 2Bis-15, Cali",
    phone: "(602) 4315800",
    email: "valle_director@sena.edu.co",
    zone: "Pacífica",
    centers: [
      "Centro de Diseño Tecnológico Industrial (CDTI)",
      "Centro de la Construcción",
      "Centro de Electricidad y Automatización Industrial (CEAI)",
      "Centro de Tecnologías Agroindustriales (Cartago)",
      "Centro de Biotecnología Industrial (Palmira)",
      "Centro Náutico Pesquero (Buenaventura)"
    ]
  },
  {
    id: "vaupes",
    name: "Vaupés",
    capital: "Mitú",
    x: 68,
    y: 75,
    regionalName: "Regional Vaupés",
    address: "Calle 12 No. 13-40, Mitú",
    phone: "(608) 5642104",
    email: "vaupe_director@sena.edu.co",
    zone: "Amazonía",
    centers: ["Centro Agropecuario y de Servicios del Vaupés"]
  },
  {
    id: "vichada",
    name: "Vichada",
    capital: "Puerto Carreño",
    x: 75,
    y: 48,
    regionalName: "Regional Vichada",
    address: "Carrera 10 No. 14-42, Puerto Carreño",
    phone: "(608) 5654110",
    email: "vicha_director@sena.edu.co",
    zone: "Orinoquía",
    centers: ["Centro de Producción y Transformación Agroindustrial del Vichada"]
  }
];

export default function App() {
  // Navigation steps state: 1: Caracterización, 2: Quiénes Somos, 3: ¿Qué es el SENA?, 4: Derechos/Deberes, 5: Simulador/Quiz, 6: Certificación
  const [activeStep, setActiveStep] = useState<number>(1);
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([1]);

  // Quiénes Somos (Interactive Map) States
  const [selectedDeptId, setSelectedDeptId] = useState<string>("distritocapital");
  const [hoveredDeptId, setHoveredDeptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Apprentice Profile Form State
  const [profile, setProfile] = useState<ApprenticeProfile>({
    apprenticeName: "",
    documentNumber: "",
    email: "",
    phone: "",
    regional: "Distrito Capital (Bogotá)",
    trainingCenter: "",
    trainingProgram: "",
    level: "Tecnólogo",
    priorSena: false,
    priorSenaDetails: "",
    expectation: ""
  });

  const [isProfileSaved, setIsProfileSaved] = useState<boolean>(false);

  // Active Symbol in What is sena
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>("logo");

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // AI Scenario State
  const [loadingCase, setLoadingCase] = useState<boolean>(false);
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [apprenticeAnswer, setApprenticeAnswer] = useState<string>("");
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // AI Free Chat state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! Soy tu Instructor IA de Inducción SENA. Estoy aquí para aclarar tus dudas sobre el Reglamento del Aprendiz (Acuerdo 009 de 2012), la historia de la institución o sus símbolos. ¿Qué te gustaría consultar hoy?'
    }
  ]);
  const [sendingChat, setSendingChat] = useState<boolean>(false);

  // Voice Narration (Web Speech API) States
  const [speakingMilestoneIdx, setSpeakingMilestoneIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [isPlaylistMode, setIsPlaylistMode] = useState<boolean>(false);

  // Step 3 Voice Narration (Male Voice) States
  const [activeNarratorItem, setActiveNarratorItem] = useState<{ type: 'right' | 'duty', idx: number } | null>(null);
  const [isNarratorPlaying, setIsNarratorPlaying] = useState<boolean>(false);
  const [isNarratorPaused, setIsNarratorPaused] = useState<boolean>(false);
  const [narratorRate, setNarratorRate] = useState<number>(0.95);
  const [narratorPitch, setNarratorPitch] = useState<number>(0.82); // Lower pitch for masculine voice signature
  const [narratorMode, setNarratorMode] = useState<'both' | 'rights' | 'duties'>('both');

  const getNarratorPlaylist = () => {
    const playlist: { type: 'right' | 'duty', idx: number, text: string }[] = [];
    
    if (narratorMode === 'rights' || narratorMode === 'both') {
      APPRENTICE_RIGHTS.forEach((r, idx) => {
        const spokenArticle = r.article
          .replace(/Art\./gi, "Artículo")
          .replace(/Num/gi, "Numeral")
          .replace(/-/g, ",");
        playlist.push({
          type: 'right',
          idx,
          text: `Derecho número ${idx + 1}. ${spokenArticle}. Título: ${r.title}. Descripción: ${r.desc}`
        });
      });
    }
    
    if (narratorMode === 'duties' || narratorMode === 'both') {
      APPRENTICE_DUTIES.forEach((d, idx) => {
        const spokenArticle = d.article
          .replace(/Art\./gi, "Artículo")
          .replace(/Num/gi, "Numeral")
          .replace(/-/g, ",");
        playlist.push({
          type: 'duty',
          idx,
          text: `Deber número ${idx + 1}. ${spokenArticle}. Título: ${d.title}. Descripción: ${d.desc}`
        });
      });
    }
    
    return playlist;
  };

  const playNarratorItem = (playlistIndex: number) => {
    if (!('speechSynthesis' in window)) {
      alert("La síntesis de voz no está soportada en este navegador.");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const playlist = getNarratorPlaylist();
    if (playlistIndex < 0 || playlistIndex >= playlist.length) {
      setActiveNarratorItem(null);
      setIsNarratorPlaying(false);
      setIsNarratorPaused(false);
      return;
    }
    
    const item = playlist[playlistIndex];
    setActiveNarratorItem({ type: item.type, idx: item.idx });
    setIsNarratorPlaying(true);
    setIsNarratorPaused(false);
    
    const introText = playlistIndex === 0 
      ? `Iniciando lectura de los ${narratorMode === 'both' ? 'Derechos y Deberes' : narratorMode === 'rights' ? 'Derechos' : 'Deberes'} del aprendiz SENA. `
      : "";
      
    const utterance = new SpeechSynthesisUtterance(introText + item.text);
    
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    
    const maleKeywords = ['julio', 'alvaro', 'david', 'jorge', 'esteban', 'pablo', 'paul', 'antonio', 'manuel', 'male', 'hombre', 'miguel', 'enrique', 'carlos'];
    let maleVoice = null;
    for (const keyword of maleKeywords) {
      const found = esVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (found) {
        maleVoice = found;
        break;
      }
    }
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    } else if (esVoices.length > 0) {
      utterance.voice = esVoices[0];
    }
    
    utterance.rate = narratorRate;
    utterance.pitch = narratorPitch;
    
    utterance.onend = () => {
      setTimeout(() => {
        setIsNarratorPlaying(curr => {
          if (curr) {
            playNarratorItem(playlistIndex + 1);
          }
          return curr;
        });
      }, 1200);
    };
    
    utterance.onerror = () => {
      setActiveNarratorItem(null);
      setIsNarratorPlaying(false);
      setIsNarratorPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopNarrator = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveNarratorItem(null);
    setIsNarratorPlaying(false);
    setIsNarratorPaused(false);
  };

  const pauseNarrator = () => {
    if ('speechSynthesis' in window && isNarratorPlaying && !isNarratorPaused) {
      window.speechSynthesis.pause();
      setIsNarratorPaused(true);
    }
  };

  const resumeNarrator = () => {
    if ('speechSynthesis' in window && isNarratorPlaying && isNarratorPaused) {
      window.speechSynthesis.resume();
      setIsNarratorPaused(false);
    }
  };

  const playPrevNarrator = () => {
    const playlist = getNarratorPlaylist();
    if (activeNarratorItem === null) {
      playNarratorItem(0);
      return;
    }
    const currIdx = playlist.findIndex(item => item.type === activeNarratorItem.type && item.idx === activeNarratorItem.idx);
    if (currIdx > 0) {
      playNarratorItem(currIdx - 1);
    } else {
      playNarratorItem(playlist.length - 1);
    }
  };

  const playNextNarrator = () => {
    const playlist = getNarratorPlaylist();
    if (activeNarratorItem === null) {
      playNarratorItem(0);
      return;
    }
    const currIdx = playlist.findIndex(item => item.type === activeNarratorItem.type && item.idx === activeNarratorItem.idx);
    if (currIdx >= 0 && currIdx < playlist.length - 1) {
      playNarratorItem(currIdx + 1);
    } else {
      playNarratorItem(0);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMilestoneIdx(null);
    setIsPlaying(false);
    setIsPaused(false);
    setIsPlaylistMode(false);
  };

  const pauseSpeaking = () => {
    if ('speechSynthesis' in window && isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if ('speechSynthesis' in window && isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const playMilestone = (idx: number, autoAdvance: boolean = false) => {
    if (!('speechSynthesis' in window)) {
      alert("Lo sentimos, tu navegador no soporta la síntesis de voz (Web Speech API).");
      return;
    }

    // Cancel active speech
    window.speechSynthesis.cancel();

    setSpeakingMilestoneIdx(idx);
    setIsPlaying(true);
    setIsPaused(false);
    setIsPlaylistMode(autoAdvance);

    const milestone = HISTORICAL_MILESTONES[idx];
    const prefix = autoAdvance ? `Hito ${idx + 1} de ${HISTORICAL_MILESTONES.length}. ` : "";
    const textToSpeak = `${prefix}Año ${milestone.year}. ${milestone.title}. ${milestone.desc}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    
    // Buscar la mejor voz en español
    const esVoice = voices.find(v => v.lang.includes('es-CO')) || 
                    voices.find(v => v.lang.includes('es-ES')) || 
                    voices.find(v => v.lang.includes('es-MX')) ||
                    voices.find(v => v.lang.startsWith('es'));
    
    if (esVoice) {
      utterance.voice = esVoice;
    }
    
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    
    utterance.onend = () => {
      if (autoAdvance && idx < HISTORICAL_MILESTONES.length - 1) {
        // Breve pausa natural de 800ms antes del siguiente hito
        setTimeout(() => {
          playMilestone(idx + 1, true);
        }, 800);
      } else {
        setSpeakingMilestoneIdx(null);
        setIsPlaying(false);
        setIsPaused(false);
        setIsPlaylistMode(false);
      }
    };

    utterance.onerror = () => {
      setSpeakingMilestoneIdx(null);
      setIsPlaying(false);
      setIsPaused(false);
      setIsPlaylistMode(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playAllHistory = () => {
    playMilestone(0, true);
  };

  const playNext = () => {
    if (speakingMilestoneIdx !== null && speakingMilestoneIdx < HISTORICAL_MILESTONES.length - 1) {
      playMilestone(speakingMilestoneIdx + 1, isPlaylistMode);
    } else {
      playMilestone(0, isPlaylistMode);
    }
  };

  const playPrev = () => {
    if (speakingMilestoneIdx !== null && speakingMilestoneIdx > 0) {
      playMilestone(speakingMilestoneIdx - 1, isPlaylistMode);
    } else {
      playMilestone(HISTORICAL_MILESTONES.length - 1, isPlaylistMode);
    }
  };

  // Detener locuciones al cambiar de pestaña para una mejor experiencia de usuario
  useEffect(() => {
    stopSpeaking();
    stopNarrator();
  }, [activeStep]);

  // Quick select a template profile
  const handleApplyTemplate = (tpl: typeof PROFILE_TEMPLATES[0]) => {
    setProfile({ ...tpl });
    setIsProfileSaved(true);
    // Unlock steps
    const newUnlocked = Array.from(new Set([...unlockedSteps, 2, 3, 4, 5, 6]));
    setUnlockedSteps(newUnlocked);
    setActiveStep(2); // Auto advance to Step 2
    // Trigger initial scenario load in background or later
    setEvaluation(null);
    setCurrentCase(null);
    setApprenticeAnswer("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.apprenticeName || !profile.documentNumber || !profile.trainingProgram || !profile.expectation) {
      alert("Por favor completa los campos principales marcados como obligatorios.");
      return;
    }
    setIsProfileSaved(true);
    const newUnlocked = Array.from(new Set([...unlockedSteps, 2, 3, 4, 5, 6]));
    setUnlockedSteps(newUnlocked);
    setActiveStep(2); // Auto advance
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de reiniciar la inducción? Se borrarán tus datos de caracterización y tus progresos.")) {
      setProfile({
        apprenticeName: "",
        documentNumber: "",
        email: "",
        phone: "",
        regional: "Distrito Capital (Bogotá)",
        trainingCenter: "",
        trainingProgram: "",
        level: "Tecnólogo",
        priorSena: false,
        priorSenaDetails: "",
        expectation: ""
      });
      setIsProfileSaved(false);
      setUnlockedSteps([1]);
      setActiveStep(1);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setCurrentCase(null);
      setEvaluation(null);
      setApprenticeAnswer("");
      setChatMessages([
        {
          role: 'model',
          text: '¡Hola! Soy tu Instructor IA de Inducción SENA. Estoy aquí para aclarar tus dudas sobre el Reglamento del Aprendiz (Acuerdo 009 de 2012), la historia de la institución o sus símbolos. ¿Qué te gustaría consultar hoy?'
        }
      ]);
    }
  };

  // Generate Custom study case from Gemini API
  const handleFetchCase = async () => {
    setLoadingCase(true);
    setEvaluation(null);
    setApprenticeAnswer("");
    try {
      const data = await generateCase(profile);
      setCurrentCase(data);
    } catch (err: any) {
      console.error(err);
      // Fallback local mock study case if server API fails or key is missing
      setCurrentCase({
        title: `Dilema en el Taller de ${profile.trainingProgram || 'Formación'}`,
        description: `Un compañero de ficha le propone a ${profile.apprenticeName || 'ti'} comprar las respuestas del examen de certificación técnica para 'garantizar' la aprobación de la competencia de forma rápida y sin estudiar. Le dice que 'nadie se dará cuenta' porque el instructor no está auditando activamente ese módulo.`,
        question: `¿Qué deberías hacer de acuerdo con tus deberes de aprendiz SENA y el Acuerdo 009 de 2012?`,
        theme: "Honestidad Académica y Ética Profesional",
        correctPathDescription: "El aprendiz debe rechazar la propuesta, actuar éticamente amparado en el deber de honestidad del Reglamento del Aprendiz y reportar la situación de fraude."
      });
    } finally {
      setLoadingCase(false);
    }
  };

  // Submit decision on study case
  const handleSubmitDecision = async () => {
    if (!apprenticeAnswer.trim()) {
      alert("Por favor escribe tu propuesta de solución antes de enviar.");
      return;
    }
    setSubmittingAnswer(true);
    try {
      const caseData = currentCase || {
        title: `Dilema en el Taller de ${profile.trainingProgram}`,
        description: "Un compañero le propone al aprendiz comprar las respuestas del examen de certificación para aprobar rápidamente sin estudiar.",
        question: "¿Qué deberías hacer de acuerdo con tus deberes?",
        theme: "Honestidad Académica",
        correctPathDescription: "Actuar con honestidad, rechazar el fraude, y reportar la conducta para salvaguardar la ética de la institución."
      };
      const result = await evaluateAnswer(caseData, apprenticeAnswer, profile);
      setEvaluation(result);
    } catch (err) {
      console.error(err);
      // Local fallback evaluation
      setEvaluation({
        status: "CORRECTA",
        score: 95,
        feedback: "¡Excelente decisión, estimado aprendiz! Tu respuesta refleja el compromiso ético que exige el SENA. Al rechazar el fraude académico, defiendes la reputación de tu título y demuestras la integridad de un profesional integral. Citando los deberes del aprendiz, es nuestra obligación promover un entorno transparente.",
        applicableArticle: "Artículo 8, Numeral 1 - Deber de Honestidad Académica (Acuerdo 009 de 2012)"
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Chat with Induction Tutor IA
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setSendingChat(true);

    try {
      const response = await sendTutorMessage(updatedMessages, profile);
      setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      console.error(err);
      // Fallback answering locally if server API fails
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'model',
          text: `Entiendo tu inquietud, estimado aprendiz. Con base en el Reglamento del Aprendiz (Acuerdo 009 de 2012), te recuerdo que los trámites de traslado, aplazamiento y reingreso deben radicarse por escrito a través del sistema SofiaPlus o ante el Subdirector de Centro dentro de los plazos establecidos. ¿Tienes alguna otra pregunta específica sobre este proceso?`
        }]);
      }, 1000);
    } finally {
      setSendingChat(false);
    }
  };

  // Evaluate the Quiz Answers
  const handleQuizSubmit = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      const selectedIndex = quizAnswers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex].isCorrect) {
        score += 20; // 5 questions * 20 = 100 points
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // Dynamic automatic loading of study case once active step becomes 5 and no case has been generated yet
  useEffect(() => {
    if (activeStep === 5 && isProfileSaved && !currentCase && !loadingCase) {
      handleFetchCase();
    }
  }, [activeStep, isProfileSaved]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* HEADER - Top Bar Contract: 3 zones exactly */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Zone 1: Brand title, single line, single text element */}
          <div className="flex items-center gap-3">
            <img 
              src="https://df6fa55eda.cbaul-cdnwnd.com/10543249b4905aa9bfcf2f30f3ec8e23/200000015-3a77c3b71e-public/SENA.GIF?s3=1"
              alt="Logo SENA" 
              className="w-[100px] h-[100px] object-contain rounded-md"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#00324D] whitespace-nowrap">
              Inducción SENA
            </span>
          </div>

          {/* Zone 2: Navigation links, single line, 1-2 word labels */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1">
            {[
              { id: 1, label: "Caracterización" },
              { id: 2, label: "Quiénes Somos" },
              { id: 3, label: "¿Qué es el SENA?" },
              { id: 4, label: "Deberes y Derechos" },
              { id: 5, label: "Simulador e IA" },
              { id: 6, label: "Certificación" }
            ].map((step) => {
              const isUnlocked = unlockedSteps.includes(step.id);
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveStep(step.id)}
                  disabled={!isUnlocked}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-[#39A900] text-white shadow-xs"
                      : isUnlocked
                      ? "text-[#00324D] hover:bg-slate-100 hover:text-[#39A900]"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  <span className="opacity-70 mr-1.5 font-mono">{step.id}.</span>
                  {step.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2">
            {isProfileSaved && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            )}
            <div className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
              Reglamento 2012
            </div>
          </div>

        </div>
      </header>

      {/* MOBILE STEP NAVIGATION FOR BETTER VIEWPORT EXPERIENCE */}
      <div className="lg:hidden bg-[#00324D] text-white py-3 px-4 flex items-center justify-between shadow-md print:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">Paso actual</span>
          <span className="text-sm font-bold truncate">
            {activeStep === 1 && "1. Caracterización de Aprendiz"}
            {activeStep === 2 && "2. Quiénes Somos (Mapa Interactivo)"}
            {activeStep === 3 && "3. ¿Qué es el SENA? y Símbolos"}
            {activeStep === 4 && "4. Reglamento, Derechos y Deberes"}
            {activeStep === 5 && "5. Casos IA & Quiz Diagnóstico"}
            {activeStep === 6 && "6. Diploma de Certificación"}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isUnlocked = unlockedSteps.includes(num);
            const isActive = activeStep === num;
            return (
              <button
                key={num}
                onClick={() => isUnlocked && setActiveStep(num)}
                disabled={!isUnlocked}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#39A900] text-white ring-2 ring-white"
                    : isUnlocked
                    ? "bg-teal-900/40 text-teal-200 hover:bg-teal-800"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* STEP 1: CHARACTERIZATION OF APPRENTICE (CARACTERIZACIÓN) */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Editorial Header Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">
                Bienvenido Aprendiz SENA
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00324D] leading-tight text-wrap-balance">
                Portal de Inducción Institucional Interactiva
              </h1>
              <p className="text-base text-slate-500 max-w-2xl mx-auto text-wrap-balance">
                Como primer paso, caracterizaremos tu perfil formativo para adaptar los simuladores de Inteligencia Artificial y preparar tu diploma oficial.
              </p>
            </div>

            {/* Template Selector Card for Technical Instructors / Demonstration */}
            <div className="bg-[#00324D] text-white p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg text-teal-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-bold">Acceso Rápido para Instructores y Evaluadores</h3>
                  <p className="text-xs text-teal-100">
                    Aplica uno de estos perfiles reales preconfigurados para explorar la inducción y el simulador de IA instantáneamente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {PROFILE_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-[#39A900] p-4 rounded-xl text-left transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs text-teal-300 font-bold mb-1">Plantilla {idx + 1}</div>
                      <div className="font-bold text-sm text-white group-hover:text-[#39A900] truncate">
                        {tpl.apprenticeName}
                      </div>
                      <div className="text-xs text-slate-300 mt-1 line-clamp-1">
                        {tpl.trainingProgram}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {tpl.priorSena ? "• Con experiencia SENA" : "• Aprendiz Nuevo"}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-teal-300 font-bold self-end gap-1">
                      Aplicar <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Form Section */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#39A900]" />
                  <h2 className="text-lg font-bold text-[#00324D]">Formulario de Caracterización Obligatorio</h2>
                </div>
                <span className="text-xs text-slate-400">Todos los campos son procesados localmente</span>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Nombre Completo del Aprendiz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={profile.apprenticeName}
                      onChange={(e) => setProfile({ ...profile, apprenticeName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Document field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Número de Documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="C.C o T.I. Ej. 10023456"
                      value={profile.documentNumber}
                      onChange={(e) => setProfile({ ...profile, documentNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Correo Electrónico (Preferiblemente @misena.edu.co)
                    </label>
                    <input
                      type="email"
                      placeholder="ejemplo@misena.edu.co"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 3123456789"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Regional selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block font-sans">
                      Regional del SENA <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={profile.regional}
                      onChange={(e) => setProfile({ ...profile, regional: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-white"
                    >
                      {SENA_REGIONALES.map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  {/* Training Center */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Centro de Formación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Centro de Comercio y Servicios"
                      value={profile.trainingCenter}
                      onChange={(e) => setProfile({ ...profile, trainingCenter: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Training Program */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Programa de Formación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Análisis y Desarrollo de Software (ADSO)"
                      value={profile.trainingProgram}
                      onChange={(e) => setProfile({ ...profile, trainingProgram: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Level selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Nivel de Formación <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={profile.level}
                      onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-white"
                    >
                      <option value="Tecnólogo">Tecnólogo</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Operario">Operario</option>
                      <option value="Auxiliar">Auxiliar / Especialización Tecnológica</option>
                    </select>
                  </div>

                </div>

                {/* Prior SENA Background Switch */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#00324D]">¿Has tenido formación previa con el SENA?</h4>
                      <p className="text-xs text-slate-500">Activa si ya has cursado técnicos, tecnólogos o cursos cortos anteriormente.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={profile.priorSena}
                        onChange={(e) => setProfile({ ...profile, priorSena: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39A900]"></div>
                    </label>
                  </div>

                  {profile.priorSena && (
                    <div className="space-y-1.5 animate-fade-in pt-2">
                      <label className="text-xs font-bold text-slate-600 block">
                        Describe brevemente tu formación previa (Programa y Año) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={profile.priorSena}
                        placeholder="Ej. Técnico en Sistemas - Egreso en 2022"
                        value={profile.priorSenaDetails}
                        onChange={(e) => setProfile({ ...profile, priorSenaDetails: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Expectation Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    ¿Cuáles son tus expectativas en este programa de formación? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Cuéntanos brevemente qué deseas aprender, qué te motivó a inscribirte y cómo esperas aportar..."
                    value={profile.expectation}
                    onChange={(e) => setProfile({ ...profile, expectation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-sm bg-slate-50/50"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-[#39A900] hover:bg-[#2d8500] text-white text-sm font-bold rounded-lg shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Guardar Perfil e Iniciar Inducción
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* STEP 2: QUIENES SOMOS - MAPA INTERACTIVO Y DIRECTORIO */}
        {activeStep === 2 && (
          <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">Presencia Nacional</span>
              <h1 className="text-3xl font-extrabold text-[#00324D] tracking-tight text-wrap-balance">
                Paso 2. Quiénes Somos y Directorio de Regionales
              </h1>
              <p className="text-slate-500 text-sm text-wrap-balance">
                El SENA cuenta con una presencia del 100% en el territorio colombiano. Interactúa con el mapa oficial de Colombia para consultar los centros de formación y el directorio de nuestras 33 Regionales.
              </p>
            </div>

            {/* Main Interactive Map & Directory Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Map (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm w-full">
                  <div className="mb-3 text-center">
                    <span className="text-xs font-bold text-[#00324D] uppercase tracking-wider block">Mapa Oficial de Colombia</span>
                    <span className="text-[11px] text-slate-400">Pasa el puntero por los departamentos para resaltar su contorno</span>
                  </div>
                  
                  {/* The interactive map frame */}
                  <div className="relative w-full aspect-[4/5] mx-auto max-w-[380px] bg-sky-50 rounded-xl overflow-hidden border border-slate-100 group">
                    <img 
                      src="https://static.vecteezy.com/system/resources/thumbnails/034/782/440/small_2x/illustrated-map-of-colombia-with-departments-capital-region-and-administrative-divisions-and-neighbouring-countries-editable-and-clearly-labeled-layers-vector.jpg" 
                      alt="Mapa de Colombia"
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    
                    {/* Hover effects overlaying on the entire department map with high fidelity targets */}
                    {COLOMBIA_REGIONS_DATA.map((dept) => {
                      const isSelected = selectedDeptId === dept.id;
                      const isHovered = hoveredDeptId === dept.id;
                      return (
                        <div 
                          key={dept.id}
                          style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
                          onMouseEnter={() => setHoveredDeptId(dept.id)}
                          onMouseLeave={() => setHoveredDeptId(null)}
                          onClick={() => setSelectedDeptId(dept.id)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                          title={`${dept.name} - Regional SENA`}
                        >
                          {/* Pulsing ring around the department hotspot to represent soft glowing contour */}
                          <div className={`absolute -inset-4 rounded-full transition-all duration-500 ${
                            isSelected || isHovered
                              ? "bg-[#39A900]/25 scale-150 blur-xs"
                              : "bg-transparent scale-0"
                          }`} />
                          
                          {/* Inner glowing core border representing the department outline glow */}
                          <div className={`absolute -inset-2 rounded-full border-2 border-dashed transition-all duration-300 ${
                            isSelected
                              ? "border-[#39A900] scale-125 opacity-100"
                              : isHovered
                              ? "border-[#00324D] scale-110 opacity-80"
                              : "border-transparent opacity-0"
                          }`} />

                          {/* Pin dot */}
                          <div className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center transition-all duration-300 shadow-md ${
                            isSelected
                              ? "bg-[#39A900] scale-125 ring-2 ring-emerald-200"
                              : isHovered
                              ? "bg-[#00324D] scale-125 ring-2 ring-teal-100"
                              : "bg-[#39A900]/80 group-hover:bg-[#00324D] group-hover:scale-110"
                          }`} />

                          {/* Tiny label on hover or select */}
                          {(isSelected || isHovered) && (
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#00324D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none border border-teal-500/20">
                              {dept.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-[11px] text-slate-500 w-full space-y-1">
                  <div className="font-bold text-[#00324D] text-center mb-1">Guía del Mapa Interactivo</div>
                  <div className="flex justify-around">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#39A900]"></span> Seleccionado</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00324D]"></span> Sobrevuelo (Hover)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#39A900]/40"></span> Regionales Activas</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Search, Directory & Details (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Search & Quick Selector Panel */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#00324D]">Buscador de Regionales</h3>
                      <p className="text-xs text-slate-400">Filtra por nombre o zona geográfica de Colombia</p>
                    </div>
                    
                    {/* Clear selection */}
                    <button
                      onClick={() => setSelectedDeptId("distritocapital")}
                      className="text-xs text-[#39A900] hover:text-[#2d8500] font-bold self-start sm:self-center transition-colors"
                    >
                      Restablecer Vista
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="🔍 Buscar departamento o centro... Ej. Antioquia, CEET, CDTI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-xs bg-slate-50/50"
                    />
                  </div>

                  {/* Quick Pill-less scroll list of all departments */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Regionales ({COLOMBIA_REGIONS_DATA.length})</label>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                      {COLOMBIA_REGIONS_DATA
                        .filter(d => 
                          d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.regionalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.centers.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .map((dept) => (
                          <button
                            key={dept.id}
                            onClick={() => setSelectedDeptId(dept.id)}
                            onMouseEnter={() => setHoveredDeptId(dept.id)}
                            onMouseLeave={() => setHoveredDeptId(null)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                              selectedDeptId === dept.id
                                ? "bg-[#00324D] text-white shadow-xs"
                                : hoveredDeptId === dept.id
                                ? "bg-slate-200 text-slate-800"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            {dept.name}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Displaying selected department information */}
                {(() => {
                  const dept = COLOMBIA_REGIONS_DATA.find(d => d.id === selectedDeptId);
                  if (!dept) return null;
                  return (
                    <div className="bg-white border-l-4 border-[#39A900] border border-slate-100 rounded-r-2xl rounded-l-md p-6 shadow-sm space-y-6 animate-fade-in">
                      
                      {/* Regional Identification */}
                      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Región {dept.zone}</span>
                            <span aria-hidden="true">•</span>
                            <span>Sede Principal: {dept.capital}</span>
                          </div>
                          <h2 className="text-xl font-extrabold text-[#00324D] mt-1">{dept.regionalName}</h2>
                        </div>
                        
                        <div className="bg-emerald-50 text-[#39A900] px-3 py-1 rounded-full text-xs font-bold self-start whitespace-nowrap">
                          Directorio Activo
                        </div>
                      </div>

                      {/* Contact card details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1">
                          <span className="font-extrabold text-[#00324D] uppercase text-[10px] tracking-wider block">📍 Dirección Física</span>
                          <span>{dept.address}</span>
                        </div>
                        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1">
                          <span className="font-extrabold text-[#00324D] uppercase text-[10px] tracking-wider block">📞 Teléfono Nacional</span>
                          <span>{dept.phone}</span>
                        </div>
                        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1 sm:col-span-2">
                          <span className="font-extrabold text-[#00324D] uppercase text-[10px] tracking-wider block">✉️ Correo de Contacto</span>
                          <span className="font-mono text-[#39A900] hover:underline cursor-pointer">{dept.email}</span>
                        </div>
                      </div>

                      {/* Training Centers details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-extrabold text-[#00324D] uppercase tracking-wider">Centros de Formación Especializados ({dept.centers.length})</span>
                          <span className="text-[10px] text-slate-400">Puestos de matrícula presencial</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {dept.centers.map((center, cIdx) => (
                            <div 
                              key={cIdx} 
                              className="p-3 bg-gradient-to-r from-emerald-50/40 to-teal-50/30 rounded-xl border border-emerald-100/40 flex items-start gap-2.5 transition-all hover:border-[#39A900]/30 hover:shadow-xs group"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#39A900]/10 flex items-center justify-center text-[#39A900] text-[10px] font-mono font-bold mt-0.5 shrink-0 group-hover:bg-[#39A900] group-hover:text-white transition-all">
                                {cIdx + 1}
                              </div>
                              <p className="text-xs text-slate-700 leading-snug font-medium">{center}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>

            </div>

            {/* Step advance footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (!unlockedSteps.includes(3)) setUnlockedSteps([...unlockedSteps, 3]);
                  setActiveStep(3);
                }}
                className="px-6 py-3 bg-[#39A900] hover:bg-[#2d8500] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Continuar a ¿Qué es el SENA y cuál es su Historia?
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: WHAT IS SENA, HISTORY AND REGIONAL STRUCTURE (¿QUÉ ES EL SENA?) */}
        {activeStep === 3 && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">Identidad Institucional</span>
              <h1 className="text-3xl font-extrabold text-[#00324D] tracking-tight">
                Paso 2. ¿Qué es el SENA y cuál es su Historia?
              </h1>
              <p className="text-slate-500 text-sm">
                Conoce el origen, evolución, símbolos patrios de nuestra entidad, y cómo está organizada para impactar a Colombia.
              </p>
            </div>

            {/* Quick Summary Cards (Stat Row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                <div className="p-3 bg-emerald-50 text-[#39A900] rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fundación</div>
                  <div className="text-lg font-extrabold text-[#00324D]">1957 (69+ años)</div>
                  <div className="text-xs text-slate-500">Por Rodolfo Martínez Tono</div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Presencia</div>
                  <div className="text-lg font-extrabold text-[#00324D]">33 Regionales</div>
                  <div className="text-xs text-slate-500">En todo el territorio nacional</div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Centros Físicos</div>
                  <div className="text-lg font-extrabold text-[#00324D]">117 Centros</div>
                  <div className="text-xs text-slate-500">De formación especializada</div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Matrícula</div>
                  <div className="text-lg font-extrabold text-[#00324D]">100% Gratis</div>
                  <div className="text-xs text-slate-500">Sin intermediarios ni costos</div>
                </div>
              </div>
            </div>

            {/* General Description Definition & Símbolos Section (Two-Zone Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Definition Box */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#00324D] border-b border-slate-100 pb-3">
                    ¿Qué es el SENA?
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    El <strong>Servicio Nacional de Aprendizaje (SENA)</strong> es un establecimiento público del orden nacional, con personería jurídica, patrimonio propio e independiente, adscrito al Ministerio del Trabajo de Colombia.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Ofrece <strong>formación gratuita</strong> a millones de colombianos que se benefician con programas técnicos, tecnológicos y complementarios, enfocados en el desarrollo económico, científico y social del país. La formación del SENA se caracteriza por ser <strong>integral</strong>, promoviendo no solo el conocimiento técnico, sino también los valores humanos y el liderazgo comunitario.
                  </p>
                  
                  {/* Visual quote from founder */}
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#39A900] mt-4">
                    <p className="text-sm italic font-serif text-slate-700">
                      "Queremos que la formación profesional sea un instrumento de democratización y de progreso social, donde el hijo del obrero y el hijo del campesino se transformen en técnicos de alta calidad."
                    </p>
                    <div className="text-xs text-[#00324D] font-bold mt-2">— Rodolfo Martínez Tono, Fundador del SENA</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Misión del SENA · Formación Profesional Integral</span>
                  <span className="text-[#39A900] font-bold">Acuerdo 009</span>
                </div>
              </div>

              {/* Símbolos Interactive Box */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#00324D] border-b border-slate-100 pb-3">
                    Nuestros Símbolos
                  </h3>
                  <p className="text-xs text-slate-500">Haz clic en cada símbolo institucional para estudiar su significado.</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {SENA_SYMBOLS.map((sym) => {
                      const SymIcon = sym.icon;
                      const isSelected = selectedSymbolId === sym.id;
                      return (
                        <button
                          key={sym.id}
                          onClick={() => setSelectedSymbolId(sym.id)}
                          className={`p-3 text-left rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                            isSelected
                              ? "bg-[#39A900] border-[#39A900] text-white shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <SymIcon className="w-4 h-4 shrink-0" />
                          <span>{sym.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Symbol Detail with visual card */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mt-4 animate-fade-in">
                    {SENA_SYMBOLS.map((sym) => {
                      if (sym.id !== selectedSymbolId) return null;
                      const SymIcon = sym.icon;
                      return (
                        <div key={sym.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-[#00324D]">
                            <SymIcon className="w-5 h-5 text-[#39A900]" />
                            <span className="font-bold text-sm">{sym.name}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {sym.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[11px] text-center text-slate-400">
                  Identidad y Pertenencia · Inducción SENA 2026
                </div>
              </div>

            </div>

            {/* Interactive Timeline of SENA (La Historia) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#00324D]">La Línea de la Historia del SENA</h3>
                  <p className="text-xs text-slate-500">Recorre los momentos clave del SENA desde su concepción hasta hoy.</p>
                </div>

                {/* Reproductor de Audio de la Historia Completa */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row flex-wrap items-center gap-4 shrink-0 text-xs shadow-xs w-full xl:w-auto">
                  
                  {/* Zona de estado actual */}
                  <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
                    <div className="w-8 h-8 rounded-full bg-[#39A900]/10 flex items-center justify-center text-[#39A900] shrink-0">
                      {isPlaying && !isPaused ? (
                        <div className="flex items-center gap-0.5 justify-center">
                          <span className="w-0.5 h-3 bg-[#39A900] rounded-xs animate-bounce"></span>
                          <span className="w-0.5 h-4 bg-[#39A900] rounded-xs animate-bounce delay-75"></span>
                          <span className="w-0.5 h-2 bg-[#39A900] rounded-xs animate-bounce delay-150"></span>
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#00324D] uppercase text-[10px]">Reproductor de Voz</div>
                      <div className="text-[11px] text-slate-500 max-w-[180px] truncate">
                        {isPlaying 
                          ? `${speakingMilestoneIdx !== null ? `Hito ${speakingMilestoneIdx + 1}: ${HISTORICAL_MILESTONES[speakingMilestoneIdx].year}` : 'Cargando...'}` 
                          : "Detenido · Haz clic en Play"
                        }
                      </div>
                    </div>
                  </div>

                  {/* Botonera de Reproducción */}
                  <div className="flex items-center gap-1.5 py-1">
                    {/* Botón Anterior */}
                    <button
                      onClick={playPrev}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00324D] transition-all cursor-pointer"
                      title="Hito Anterior"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    {/* Botón Principal: Play/Pause/Resume */}
                    {!isPlaying ? (
                      <button
                        onClick={playAllHistory}
                        className="px-4 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Iniciar Reproducción Completa"
                      >
                        <Play className="w-4 h-4 fill-current" /> Reproducir
                      </button>
                    ) : isPaused ? (
                      <button
                        onClick={resumeSpeaking}
                        className="px-4 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="Reanudar Narración"
                      >
                        <Play className="w-4 h-4 fill-current" /> Reanudar
                      </button>
                    ) : (
                      <button
                        onClick={pauseSpeaking}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="Pausar Narración"
                      >
                        <Pause className="w-4 h-4 fill-current" /> Pausar
                      </button>
                    )}

                    {/* Botón Siguiente */}
                    <button
                      onClick={playNext}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00324D] transition-all cursor-pointer"
                      title="Siguiente Hito"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Botón Detener */}
                    {isPlaying && (
                      <button
                        onClick={stopSpeaking}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 border border-red-200 text-red-600 transition-all cursor-pointer"
                        title="Detener por Completo"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    )}
                  </div>

                  {/* Controles deslizantes de audio */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:border-l sm:border-slate-200 sm:pl-4 w-full sm:w-auto pt-2 sm:pt-0">
                    {/* Velocidad */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-[11px] shrink-0">Velocidad:</span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-16 accent-[#39A900] cursor-pointer"
                      />
                      <span className="font-mono text-[10px] bg-white border border-slate-200 px-1 rounded shrink-0">
                        {speechRate.toFixed(2)}x
                      </span>
                    </div>

                    {/* Tono */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-[11px] shrink-0">Tono:</span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={speechPitch}
                        onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-16 accent-[#39A900] cursor-pointer"
                      />
                      <span className="font-mono text-[10px] bg-white border border-slate-200 px-1 rounded shrink-0">
                        {speechPitch.toFixed(2)}x
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="relative border-l-2 border-[#39A900]/30 ml-4 pl-6 space-y-8 py-2">
                {HISTORICAL_MILESTONES.map((milestone, idx) => {
                  const isSpeakingThis = speakingMilestoneIdx === idx;
                  return (
                    <div key={idx} className={`relative group transition-all duration-300 ${isSpeakingThis ? "bg-emerald-50/50 p-4 -ml-4 rounded-xl border border-dashed border-[#39A900]/20" : ""}`}>
                      {/* Circle marker */}
                      <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transition-transform ${isSpeakingThis ? "bg-[#39A900] scale-125 ring-2 ring-emerald-200" : "bg-[#39A900] group-hover:scale-125"}`}></span>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-md font-bold text-[#39A900] font-mono">{milestone.year}</span>
                            <h4 className="text-sm font-bold text-[#00324D]">{milestone.title}</h4>
                          </div>

                          {/* Escuchar hito individual */}
                          <button
                            onClick={() => {
                              if (speakingMilestoneIdx === idx && isPlaying) {
                                if (isPaused) {
                                  resumeSpeaking();
                                } else {
                                  pauseSpeaking();
                                }
                              } else {
                                playMilestone(idx, false);
                              }
                            }}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                              isSpeakingThis
                                ? isPaused
                                  ? "bg-amber-50 border-amber-200 text-amber-600"
                                  : "bg-red-50 border-red-200 text-red-600 animate-pulse"
                                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
                            }`}
                            title="Reproducir/Pausar este evento"
                          >
                            {isSpeakingThis ? (
                              isPaused ? (
                                <>
                                  <Play className="w-3 h-3 fill-current" /> Reanudar
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3 h-3 fill-current" /> Pausar
                                </>
                              )
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" /> Escuchar Hito
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl pt-1">
                          {milestone.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Organizational Structure Tree (Organigrama) */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-[#00324D] text-center">Organigrama General del SENA</h3>
                <p className="text-xs text-slate-500 text-center">Visualiza la estructura jerárquica y operativa desde el nivel central hasta tus instructores.</p>
              </div>

              {/* Graphical representation of the Tree */}
              <div className="flex flex-col items-center space-y-4 max-w-3xl mx-auto pt-2">
                
                {/* Level 1 */}
                <div className="bg-[#00324D] text-white p-3.5 rounded-xl shadow-xs text-center min-w-[240px] border border-teal-500/20">
                  <div className="text-[10px] font-bold text-teal-300 uppercase">Máximo Órgano Colectivo</div>
                  <div className="text-sm font-extrabold">Consejo Directivo Nacional</div>
                  <div className="text-[10px] text-slate-300 mt-1">Representantes de Gobierno, Gremios y Trabajadores</div>
                </div>

                <div className="w-0.5 h-6 bg-slate-300"></div>

                {/* Level 2 */}
                <div className="bg-[#39A900] text-white p-3.5 rounded-xl shadow-xs text-center min-w-[240px] border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-200 uppercase">Representante Legal y Líder</div>
                  <div className="text-sm font-extrabold">Dirección General</div>
                  <div className="text-[10px] text-emerald-100 mt-0.5">Dir. Jorge Eduardo Londoño Ulloa</div>
                </div>

                <div className="w-0.5 h-6 bg-slate-300"></div>

                {/* Level 3: Dual columns representing Areas and Regionals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#00324D] uppercase">Nivel Central de Apoyo</div>
                      <div className="text-xs font-extrabold text-slate-800">Direcciones de Área</div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 space-y-0.5">
                      <div>• Formación Profesional</div>
                      <div>• Empleo y Trabajo</div>
                      <div>• Sistema Nacional de Formación</div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#39A900]/30 p-4 rounded-xl text-center shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#39A900] uppercase">Nivel Descentralizado</div>
                      <div className="text-xs font-extrabold text-slate-800">33 Direcciones Regionales</div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">
                      Coordinan la operación en los 32 departamentos de Colombia y el Distrito Capital.
                    </div>
                  </div>
                </div>

                {/* Connector to educational units */}
                <div className="w-0.5 h-6 bg-slate-300 hidden md:block"></div>

                {/* Level 4: Bottom operational centers */}
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-center w-full shadow-xs">
                  <div className="text-[10px] font-bold text-teal-800 uppercase">La Célula del Aprendizaje</div>
                  <div className="text-sm font-extrabold text-[#00324D]">117 Centros de Formación Profesional</div>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-xl mx-auto">
                    Liderados por un <strong>Subdirector de Centro</strong>. Aquí es donde interactúan tus <strong>Instructores</strong> y donde tú, como <strong>Aprendiz</strong>, recibes la formación técnica y tecnológica integral.
                  </p>
                </div>

              </div>
            </div>

            {/* Advance button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!unlockedSteps.includes(4)) setUnlockedSteps([...unlockedSteps, 4]);
                  setActiveStep(4);
                }}
                className="px-6 py-3 bg-[#39A900] hover:bg-[#2d8500] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Continuar al Reglamento del Aprendiz (Deberes y Derechos)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: RIGHTS AND DUTIES OF THE APPRENTICE (DERECHOS Y DEBERES) */}
        {activeStep === 4 && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">Reglamento del Aprendiz</span>
              <h1 className="text-3xl font-extrabold text-[#00324D] tracking-tight text-wrap-balance">
                Paso 4. Deberes y Derechos (Acuerdo 009 de 2012)
              </h1>
              <p className="text-slate-500 text-sm text-wrap-balance">
                La convivencia y excelencia académica en el SENA se rige por un marco de deberes y derechos. Explóralos interactivamente con nuestro sistema de narración.
              </p>
            </div>

            {/* Reproductor de Voz Masculina para Deberes y Derechos */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#00324D]/5 border border-[#00324D]/10 flex items-center justify-center text-[#00324D] shrink-0">
                    {isNarratorPlaying && !isNarratorPaused ? (
                      <div className="flex items-center gap-0.5 justify-center">
                        <span className="w-1 h-3 bg-[#00324D] rounded-xs animate-bounce"></span>
                        <span className="w-1 h-5 bg-[#39A900] rounded-xs animate-bounce delay-75"></span>
                        <span className="w-1 h-2.5 bg-[#00324D] rounded-xs animate-bounce delay-150"></span>
                      </div>
                    ) : (
                      <Volume2 className="w-6 h-6 text-[#39A900]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#00324D]">Narración por Voz Masculina IA</h3>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                        Voz de Hombre
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Escucha el Reglamento del Aprendiz narrado fluidamente por una voz masculina adaptativa.
                    </p>
                  </div>
                </div>

                {/* Playlist Mode Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start md:self-auto">
                  <button
                    onClick={() => { stopNarrator(); setNarratorMode('both'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      narratorMode === 'both' ? "bg-white text-[#00324D] shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => { stopNarrator(); setNarratorMode('rights'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      narratorMode === 'rights' ? "bg-[#39A900] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Derechos
                  </button>
                  <button
                    onClick={() => { stopNarrator(); setNarratorMode('duties'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      narratorMode === 'duties' ? "bg-orange-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Deberes
                  </button>
                </div>
              </div>

              {/* Controls bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Playback Buttons (5 cols on md) */}
                <div className="md:col-span-5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={playPrevNarrator}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00324D] transition-all cursor-pointer"
                    title="Anterior artículo"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  {!isNarratorPlaying ? (
                    <button
                      onClick={() => playNarratorItem(0)}
                      className="px-5 py-2.5 bg-[#39A900] hover:bg-[#2d8500] text-white rounded-xl font-extrabold flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer text-sm"
                      title="Iniciar Lectura"
                    >
                      <Play className="w-4 h-4 fill-current" /> Reproducir Reglamento
                    </button>
                  ) : isNarratorPaused ? (
                    <button
                      onClick={resumeNarrator}
                      className="px-5 py-2.5 bg-[#39A900] hover:bg-[#2d8500] text-white rounded-xl font-extrabold flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer text-sm"
                      title="Reanudar Lectura"
                    >
                      <Play className="w-4 h-4 fill-current" /> Reanudar
                    </button>
                  ) : (
                    <button
                      onClick={pauseNarrator}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer text-sm"
                      title="Pausar Lectura"
                    >
                      <Pause className="w-4 h-4 fill-current" /> Pausar
                    </button>
                  )}

                  <button
                    onClick={playNextNarrator}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00324D] transition-all cursor-pointer"
                    title="Siguiente artículo"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {isNarratorPlaying && (
                    <button
                      onClick={stopNarrator}
                      className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 transition-all cursor-pointer"
                      title="Detener Lectura"
                    >
                      <Square className="w-5 h-5 fill-current" />
                    </button>
                  )}
                </div>

                {/* Speech Customizers: Rate & Pitch (7 cols on md) */}
                <div className="md:col-span-7 flex flex-col sm:flex-row gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  {/* Speed */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>Velocidad de Lectura:</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {narratorRate.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={narratorRate}
                      onChange={(e) => setNarratorRate(parseFloat(e.target.value))}
                      className="w-full accent-[#39A900] cursor-pointer"
                    />
                  </div>

                  {/* Pitch */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>Tono de Voz (Varón):</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {narratorPitch.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.02"
                      value={narratorPitch}
                      onChange={(e) => setNarratorPitch(parseFloat(e.target.value))}
                      className="w-full accent-[#00324D] cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Live status feed */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5 text-[#00324D]">
                  <Activity className="w-4 h-4 text-[#39A900]" />
                  Estado:
                </span>
                <span className="font-medium text-slate-500">
                  {isNarratorPlaying
                    ? isNarratorPaused
                      ? "Pausado"
                      : `Reproduciendo: ${
                          activeNarratorItem?.type === 'right' 
                            ? `Derecho ${activeNarratorItem.idx + 1} (${APPRENTICE_RIGHTS[activeNarratorItem.idx].title})` 
                            : activeNarratorItem?.type === 'duty' 
                            ? `Deber ${activeNarratorItem.idx + 1} (${APPRENTICE_DUTIES[activeNarratorItem.idx].title})`
                            : "Cargando..."
                        }`
                    : "Detenido · Presiona Reproducir para comenzar"
                  }
                </span>
              </div>
            </div>

            {/* Interactive Grid explaining Deberes and Derechos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Rights (Derechos) Section */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2.5 bg-emerald-50 text-[#39A900] rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#00324D]">Tus Derechos Principales</h2>
                    <p className="text-xs text-slate-500">Aquello a lo que puedes acceder para potenciar tu formación.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {APPRENTICE_RIGHTS.map((right, idx) => {
                    const isBeingSpoken = activeNarratorItem?.type === 'right' && activeNarratorItem.idx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          // Allow clicking on a specific card to start reading it directly
                          const playlist = getNarratorPlaylist();
                          const targetIdx = playlist.findIndex(p => p.type === 'right' && p.idx === idx);
                          if (targetIdx !== -1) {
                            playNarratorItem(targetIdx);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 space-y-1.5 group cursor-pointer ${
                          isBeingSpoken 
                            ? "bg-emerald-50/70 border-[#39A900] ring-2 ring-emerald-300 shadow-sm" 
                            : "bg-slate-50/70 border-slate-100 hover:border-[#39A900]/40"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                            isBeingSpoken ? "text-white bg-[#39A900]" : "text-[#39A900] bg-emerald-100/50"
                          }`}>
                            {right.article}
                          </span>
                          <span className={`text-[11px] font-bold ${isBeingSpoken ? "text-[#39A900]" : "text-slate-400 group-hover:text-[#39A900]"}`}>
                            {isBeingSpoken ? "🗣️ Escuchando..." : "Haga clic para escuchar"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#00324D]">{right.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{right.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duties (Deberes) Section */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#00324D]">Tus Deberes Fundamentales</h2>
                    <p className="text-xs text-slate-500">Tus compromisos éticos, académicos y sociales como aprendiz.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {APPRENTICE_DUTIES.map((duty, idx) => {
                    const isBeingSpoken = activeNarratorItem?.type === 'duty' && activeNarratorItem.idx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          // Allow clicking on a specific card to start reading it directly
                          const playlist = getNarratorPlaylist();
                          const targetIdx = playlist.findIndex(p => p.type === 'duty' && p.idx === idx);
                          if (targetIdx !== -1) {
                            playNarratorItem(targetIdx);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 space-y-1.5 group cursor-pointer ${
                          isBeingSpoken 
                            ? "bg-orange-50/70 border-orange-500 ring-2 ring-orange-300 shadow-sm" 
                            : "bg-slate-50/70 border-slate-100 hover:border-orange-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                            isBeingSpoken ? "text-white bg-orange-600" : "text-orange-700 bg-orange-100/50"
                          }`}>
                            {duty.article}
                          </span>
                          <span className={`text-[11px] font-bold ${isBeingSpoken ? "text-orange-600" : "text-slate-400 group-hover:text-orange-600"}`}>
                            {isBeingSpoken ? "🗣️ Escuchando..." : "Haga clic para escuchar"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#00324D]">{duty.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{duty.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Prohibiciones & Disciplinary Measures Section */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-red-400" />
                  Prohibiciones, Faltas y Sanciones Formativas
                </h3>
                <p className="text-xs text-slate-300 mt-1">Conoce qué conductas son prohibidas y cómo funciona el debido proceso en el SENA.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                  <div className="text-red-400 text-xs font-bold uppercase tracking-wider">01. Prohibiciones Críticas</div>
                  <h4 className="text-sm font-bold text-white">¿Qué no se debe hacer?</h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 pt-1">
                    <li>Plagio o fraude en exámenes y guías de aprendizaje.</li>
                    <li>Ingresar o consumir licor o sustancias psicoactivas.</li>
                    <li>Portar armas dentro del centro de formación.</li>
                    <li>Utilizar indebidamente el nombre del SENA para lucro personal.</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                  <div className="text-teal-300 text-xs font-bold uppercase tracking-wider">02. Clasificación de Faltas</div>
                  <h4 className="text-sm font-bold text-white">¿Cómo se miden?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Las faltas se dividen en <strong>Académicas</strong> (incumplimiento en guías, proyectos) o <strong>Disciplinarias</strong> (convivencia, daños físicos).
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Se clasifican formalmente en: <strong>Leves</strong>, <strong>Graves</strong> o <strong>Gravísimas</strong>, según la gravedad o reincidencia.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">03. Medidas y Sanciones</div>
                  <h4 className="text-sm font-bold text-white">¿Cuáles son las medidas?</h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 pt-1">
                    <li><strong>Llamado de atención verbal</strong> o por escrito.</li>
                    <li><strong>Plan de Mejoramiento</strong>: Académico o Disciplinario concertado.</li>
                    <li><strong>Condicionamiento de Matrícula</strong>: Alerta formal de pérdida de cupo.</li>
                    <li><strong>Cancelación de Matrícula</strong>: Retiro definitivo del aprendiz.</li>
                  </ul>
                </div>

              </div>

              {/* Etapa Práctica info callout */}
              <div className="bg-teal-950/40 p-4 rounded-xl border border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-teal-300">Etapa Práctica Profesional</span>
                  <p className="text-xs text-teal-100">
                    Recuerda que para graduarte debes cumplir la etapa práctica en cualquiera de las modalidades: Contrato de Aprendizaje, Pasantía, Proyecto Productivo o Vínculo laboral directo.
                  </p>
                </div>
                <div className="text-xs font-bold text-teal-300 shrink-0">
                  Regulado por el Acuerdo 009 de 2012
                </div>
              </div>
            </div>

            {/* Advance button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!unlockedSteps.includes(5)) setUnlockedSteps([...unlockedSteps, 5]);
                  setActiveStep(5);
                }}
                className="px-6 py-3 bg-[#39A900] hover:bg-[#2d8500] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Siguiente: Simulador de Casos con IA y Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 5: AI CASE SIMULATOR & DIAGNOSTIC QUIZ (SIMULADOR E IA) */}
        {activeStep === 5 && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">Simulación y Evaluación con IA</span>
              <h1 className="text-3xl font-extrabold text-[#00324D] tracking-tight">
                Paso 5. Evaluaciones Prácticas de Inducción
              </h1>
              <p className="text-slate-500 text-sm">
                En esta etapa pondrás en práctica tus conocimientos. Resuelve un caso de estudio personalizado generado por la IA y completa el quiz rápido de 5 preguntas.
              </p>
            </div>

            {/* Layout Split: Left: AI Case Study / Right: Live Chat Tutor or Quiz */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: AI Case Study Simulator (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#39A900]" />
                      <div>
                        <h2 className="text-md font-bold text-[#00324D]">Simulador de Casos del Reglamento con IA</h2>
                        <p className="text-xs text-slate-500">Un caso personalizado según tu programa de formación</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleFetchCase}
                      disabled={loadingCase}
                      className="px-3 py-1.5 text-xs font-bold bg-[#00324D] hover:bg-[#002235] text-white rounded-lg transition-colors cursor-pointer"
                    >
                      {loadingCase ? "Generando..." : "Regenerar Caso"}
                    </button>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {loadingCase ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <div className="w-10 h-10 border-4 border-[#39A900] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-[#00324D]">Nuestra Inteligencia Artificial está analizando tu perfil...</p>
                        <p className="text-[10px] text-slate-400">Personalizando dilema ético para {profile.trainingProgram || "tu especialidad"}</p>
                      </div>
                    ) : currentCase ? (
                      <div className="space-y-6 animate-fade-in">
                        
                        {/* Case description details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-[#39A900]/10 text-[#39A900] px-2 py-0.5 rounded font-mono uppercase">
                              {currentCase.theme}
                            </span>
                            <span className="text-xs text-slate-400">• Caso Personalizado</span>
                          </div>
                          
                          <h3 className="text-lg font-extrabold text-[#00324D] leading-tight">
                            {currentCase.title}
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                            "{currentCase.description}"
                          </p>
                        </div>

                        {/* Interactive question to prompt user solution */}
                        <div className="space-y-3 border-t border-slate-100 pt-5">
                          <label className="text-xs font-bold text-[#00324D] block flex items-center gap-1">
                            <HelpCircle className="w-4 h-4 text-[#39A900]" />
                            {currentCase.question}
                          </label>
                          
                          <textarea
                            rows={4}
                            disabled={submittingAnswer}
                            placeholder="Escribe tu decisión o propuesta de solución amparada en tus deberes, derechos y ética como aprendiz SENA..."
                            value={apprenticeAnswer}
                            onChange={(e) => setApprenticeAnswer(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-xs sm:text-sm bg-white"
                          />

                          <div className="flex justify-between items-center pt-1">
                            <p className="text-[10px] text-slate-400">
                              Consejo: Haz alusión a la honestidad, respeto, o el diálogo institucional.
                            </p>
                            <button
                              onClick={handleSubmitDecision}
                              disabled={submittingAnswer || !apprenticeAnswer.trim()}
                              className="px-5 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingAnswer ? "Evaluando con IA..." : "Enviar Decisión"}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Evaluation Result Area */}
                        {evaluation && (
                          <div className="mt-6 p-5 rounded-xl border border-[#39A900]/20 bg-emerald-50/40 space-y-4 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#39A900]/10 pb-3">
                              <div className="flex items-center gap-2">
                                {evaluation.status === "CORRECTA" && (
                                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> DECISIÓN CORRECTA
                                  </span>
                                )}
                                {evaluation.status === "PARCIALMENTE_CORRECTA" && (
                                  <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                                    <Info className="w-3 h-3" /> PARCIALMENTE CORRECTA
                                  </span>
                                )}
                                {evaluation.status === "INCORRECTA" && (
                                  <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                                    <X className="w-3 h-3" /> DECISIÓN INCORRECTA
                                  </span>
                                )}
                                <span className="text-[11px] font-mono text-slate-500">
                                  {evaluation.applicableArticle}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-400">Puntaje del Caso: </span>
                                <span className="text-md font-black font-mono text-[#39A900]">
                                  {evaluation.score}/100
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#00324D] uppercase tracking-wider block">Retroalimentación del Instructor IA:</span>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
                                "{evaluation.feedback}"
                              </p>
                            </div>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        No se ha podido cargar el caso. Inténtalo de nuevo haciendo clic en "Regenerar Caso".
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Tutor Chat Q&A */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                  <div className="bg-[#00324D] text-white p-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#39A900] rounded-full flex items-center justify-center text-white">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Consultorio de Reglamento SENA (Tutor Chat IA)</h3>
                      <p className="text-[11px] text-teal-100">Hazle cualquier pregunta libre sobre el Acuerdo 009 o la historia</p>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="p-4 h-64 overflow-y-auto bg-slate-50/50 space-y-3 text-xs sm:text-sm">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#39A900] text-white'
                              : 'bg-white border border-slate-100 text-slate-700 shadow-xs'
                          }`}
                        >
                          <div className="font-bold text-[10px] opacity-70 mb-1">
                            {msg.role === 'user' ? 'Tú (Aprendiz)' : 'Instructor IA SENA'}
                          </div>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {sendingChat && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                    <input
                      type="text"
                      disabled={sendingChat}
                      placeholder="Ej: ¿Qué pasa si falto 3 días sin justificar? o ¿Quién fundó el sena?"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-xs bg-slate-50/30"
                    />
                    <button
                      type="submit"
                      disabled={sendingChat || !chatInput.trim()}
                      className="px-4 py-2 bg-[#00324D] hover:bg-[#002235] text-white rounded-lg transition-colors flex items-center justify-center text-xs font-bold disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>

              {/* Right Column: General Quiz (4 cols on lg) */}
              <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-xs h-fit space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-[#00324D] flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-[#39A900]" />
                    Quiz de Diagnóstico
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Demuestra lo aprendido en la inducción para desbloquear tu diploma.</p>
                </div>

                <div className="space-y-6">
                  {QUIZ_QUESTIONS.map((q, qIdx) => (
                    <div key={q.id} className="space-y-2.5">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {qIdx + 1}. {q.question}
                      </p>
                      
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const showCorrect = quizSubmitted && opt.isCorrect;
                          const showIncorrect = quizSubmitted && isSelected && !opt.isCorrect;
                          
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                              className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all flex items-start gap-2 ${
                                showCorrect
                                  ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                                  : showIncorrect
                                  ? "bg-red-50 border-red-400 text-red-900"
                                  : isSelected
                                  ? "bg-[#39A900]/10 border-[#39A900] text-[#00324D] font-medium"
                                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/50 text-slate-600"
                              }`}
                            >
                              <span className="w-4 h-4 shrink-0 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                {optIdx === 0 && "A"}
                                {optIdx === 1 && "B"}
                                {optIdx === 2 && "C"}
                                {optIdx === 3 && "D"}
                              </span>
                              <span className="leading-tight">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {quizSubmitted && (
                        <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded leading-relaxed border-l-2 border-slate-300">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < 5}
                      className="w-full py-2.5 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Calificar Cuestionario
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-slate-100 p-3.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tu Calificación</div>
                        <div className="text-xl font-black font-mono text-[#00324D]">
                          {quizScore} / 100
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {quizScore >= 80 ? "¡Excelente! Has aprobado el test académico." : "Buen intento, puedes repasar las lecturas y reintentar."}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizScore(0);
                        }}
                        className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                      >
                        Intentar de Nuevo
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Advance button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!unlockedSteps.includes(6)) setUnlockedSteps([...unlockedSteps, 6]);
                  setActiveStep(6);
                }}
                className="px-6 py-3 bg-[#39A900] hover:bg-[#2d8500] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Continuar al Diploma de Certificación de Inducción
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 6: INDUCTION CERTIFICATE (CERTIFICACIÓN) */}
        {activeStep === 6 && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 print:hidden">
              <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">Culminación de Inducción</span>
              <h1 className="text-3xl font-extrabold text-[#00324D] tracking-tight">
                Paso 6. Diploma de Inducción Institucional
              </h1>
              <p className="text-slate-500 text-sm">
                ¡Felicitaciones! Has completado con éxito la ruta guiada de inducción institucional del SENA. Reclama tu diploma simbólico oficial.
              </p>
            </div>

            {/* THE DIPLOMA CARD */}
            <div className="max-w-4xl mx-auto bg-white border-[12px] border-[#00324D] p-6 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50/50 via-white to-white print:border-[16px] print:rounded-none">
              
              {/* Decorative SENA green stripes in corners */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#39A900]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#39A900]/10 rounded-full blur-2xl"></div>

              {/* Inner thin golden border */}
              <div className="border border-[#39A900]/40 p-6 sm:p-10 rounded-xl space-y-8 flex flex-col justify-between h-full">
                
                {/* Diploma Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 text-center sm:text-left">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className="w-12 h-12 bg-[#39A900] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00324D]">Servicio Nacional de Aprendizaje</h4>
                      <h2 className="text-md font-bold text-slate-600">SENA - Colombia</h2>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-md">
                      REGISTRO: SENA-IND-2026-{profile.documentNumber || "123456"}
                    </span>
                  </div>
                </div>

                {/* Diploma Content */}
                <div className="text-center space-y-6 py-4">
                  <span className="text-xs font-serif italic text-slate-500 text-lg block">
                    Se otorga la presente certificación oficial de aprobación a:
                  </span>
                  
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00324D] font-serif uppercase">
                    {profile.apprenticeName || "Laura Camila Restrepo"}
                  </h1>

                  <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Identificado con documento número <strong className="font-mono text-slate-800">{profile.documentNumber || "1.002.345.678"}</strong>, por haber cursado, comprendido y aprobado satisfactoriamente todos los módulos correspondientes a la <strong>Inducción Institucional SENA 2026</strong>, acreditando competencias en:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 text-center max-w-3xl mx-auto pt-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex flex-col items-center justify-center">
                      <Clock className="w-4 h-4 text-[#39A900] mb-1" />
                      <strong>Historia SENA</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex flex-col items-center justify-center">
                      <Compass className="w-4 h-4 text-[#39A900] mb-1" />
                      <strong>Símbolos y Misión</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#39A900] mb-1" />
                      <strong>Derechos y Deberes</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex flex-col items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#39A900] mb-1" />
                      <strong>Dilemas y Casos IA</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 pt-3">
                    Programa Académico: <span className="font-bold text-[#00324D]">{profile.trainingProgram || "Tecnología en Análisis y Desarrollo de Software"}</span>
                    <br />
                    Ficha de Caracterización Regional <span className="font-bold text-slate-800">{profile.regional || "Distrito Capital"}</span> - Centro de Formación <span className="font-bold text-slate-800">{profile.trainingCenter || "Centro de Telecomunicaciones"}</span>
                  </p>
                </div>

                {/* Diploma Signatures */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-8 border-t border-slate-100">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-slate-400 font-mono">Dado en la República de Colombia</div>
                    <div className="text-xs text-slate-700 font-bold">{new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>

                  {/* Representative Signatures */}
                  <div className="flex justify-center sm:justify-end gap-12 text-center">
                    <div className="space-y-1">
                      <div className="font-serif italic text-slate-700 text-sm border-b border-slate-300 pb-1 px-4">
                        Rodolfo Martínez Tono
                      </div>
                      <div className="text-[10px] font-bold text-[#00324D] uppercase">Simbología Fundadora</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-serif italic text-emerald-800 font-semibold text-sm border-b border-slate-300 pb-1 px-4">
                        Instructor Virtual IA
                      </div>
                      <div className="text-[10px] font-bold text-[#00324D] uppercase">Evaluador de Inducción</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Print and Actions row */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 print:hidden">
              <button
                onClick={handlePrintCertificate}
                className="px-6 py-3 bg-[#00324D] hover:bg-[#002235] text-white text-sm font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Printer className="w-4 h-4" />
                Imprimir o Guardar PDF
              </button>
              
              <button
                onClick={() => setActiveStep(5)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto border border-slate-200"
              >
                Volver al Simulador de Casos
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#00324D] text-white py-8 border-t border-teal-800 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 bg-[#39A900] rounded-md flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="font-extrabold text-sm tracking-tight">SENA - Servicio Nacional de Aprendizaje</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Prototipo didáctico e interactivo de Inducción Institucional para el uso de Instructores Técnicos.
            Cumple con el Acuerdo 009 de 2012 y el Reglamento del Aprendiz SENA.
          </p>
          <div className="text-[10px] text-teal-300 font-mono">
            Servicio de Aprendizaje Integral de Alta Calidad · Colombia 2026
          </div>
        </div>
      </footer>

    </div>
  );
}
