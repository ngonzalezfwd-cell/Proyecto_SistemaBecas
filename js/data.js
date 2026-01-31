// Base de datos - González

export const SCHOLARSHIPS = [
    // --- San José (4) ---
    {
        id: 1,
        title: "Beca Excelencia (UCR)",
        category: "Académica",
        description: "Beca completa para estudiantes destacados en San José.",
        duration: "10 semestres",
        coverage: "100%",
        requirements: { minGPA: 9.0, maxAge: 25 },
        amount: "185.000 ₡",
        province: "sanjose",
        institution: "UCR",
        educationLevel: "grado",
        image: "../imgs/beca-ucr-excelencia.png", // Imagen - González
        deadline: new Date(Date.now() + 30 * 86400000).toISOString()
    },
    {
        id: 2,
        title: "Mujeres en Ciencia (MICITT)",
        category: "Social",
        description: "Apoyo para mujeres en STEM en la capital.",
        duration: "8 semestres",
        coverage: "80%",
        requirements: { minGPA: 8.5, maxAge: 30 },
        amount: "150.000 ₡",
        province: "sanjose",
        institution: "MICITT",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 15 * 86400000).toISOString()
    },
    {
        id: 3,
        title: "Full Stack Developer (FWD)",
        category: "Académica",
        description: "Curso intensivo de programación web.",
        duration: "6 meses",
        coverage: "100% (Beca Talento)",
        requirements: { minGPA: 8.0, maxAge: 35 },
        amount: "250.000 ₡",
        province: "sanjose",
        institution: "FWD",
        educationLevel: "posgrado",
        image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 10 * 86400000).toISOString()
    },
    {
        id: 4,
        title: "Técnico en Redes (INA)",
        category: "Académica",
        description: "Especialización técnica en redes y conectividad.",
        duration: "1.5 años",
        coverage: "50%",
        requirements: { minGPA: 7.5, maxAge: 40 },
        amount: "90.000 ₡",
        province: "sanjose",
        institution: "INA",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Heredia (3) ---
    {
        id: 5,
        title: "Beca Socioeconómica (UNA)",
        category: "Económica",
        description: "Ayuda financiera para estudiantes de la UNA.",
        requirements: { minGPA: 7.5, maxAge: 28 },
        amount: "145.000 ₡",
        province: "heredia",
        institution: "UNA",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 5 * 86400000).toISOString()
    },
    {
        id: 6,
        title: "Inglés Avanzado (INA)",
        category: "Académica",
        description: "Curso de inglés conversacional para el empleo.",
        requirements: { minGPA: 7.0, maxAge: 45 },
        amount: "60.000 ₡",
        province: "heredia",
        institution: "INA",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },
    {
        id: 7,
        title: "Maestría en Educación (UNA)",
        category: "Académica",
        description: "Apoyo para estudios de posgrado en educación.",
        requirements: { minGPA: 9.0, maxAge: 50 },
        amount: "300.000 ₡",
        province: "heredia",
        institution: "UNA",
        educationLevel: "posgrado",
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Alajuela (3) ---
    {
        id: 8,
        title: "Desarrollo de Software (UTN)",
        category: "Académica",
        description: "Carrera de Ingeniería del Software en sede Alajuela.",
        requirements: { minGPA: 8.2, maxAge: 25 },
        amount: "130.000 ₡",
        province: "alajuela",
        institution: "UTN",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 20 * 86400000).toISOString()
    },
    {
        id: 9,
        title: "Mecánica Automotriz (INA)",
        category: "Académica",
        description: "Formación técnica de alta demanda.",
        requirements: { minGPA: 7.0, maxAge: 30 },
        amount: "100.000 ₡",
        province: "alajuela",
        institution: "INA",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },
    {
        id: 10,
        title: "Gestión de Proyectos (FWD)",
        category: "Económica",
        description: "Certificación profesional para alajuelenses.",
        requirements: { minGPA: 8.0, maxAge: 35 },
        amount: "180.000 ₡",
        province: "alajuela",
        institution: "FWD",
        educationLevel: "posgrado",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Cartago (3) ---
    {
        id: 11,
        title: "Ingeniería en Computación (TEC)",
        category: "Académica",
        description: "Prestigiosa carrera en el Tecnológico de Costa Rica.",
        duration: "10 semestres",
        coverage: "100%",
        requirements: { minGPA: 9.2, maxAge: 23 },
        amount: "160.000 ₡",
        province: "cartago",
        institution: "TEC",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 12 * 86400000).toISOString()
    },
    {
        id: 12,
        title: "Electrónica Industrial (INA)",
        category: "Académica",
        description: "Técnico especializado en electrónica.",
        requirements: { minGPA: 7.8, maxAge: 35 },
        amount: "95.000 ₡",
        province: "cartago",
        institution: "INA",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },
    {
        id: 13,
        title: "Investigación Biotecnológica (TEC)",
        category: "Académica",
        description: "Fondo para tesis de maestría en biotecnología.",
        requirements: { minGPA: 9.0, maxAge: 30 },
        amount: "350.000 ₡",
        province: "cartago",
        institution: "TEC",
        educationLevel: "posgrado",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Puntarenas (3) ---
    {
        id: 14,
        title: "Turismo Sostenible (UNED)",
        category: "Social",
        description: "Apoyo para estudiantes de zonas costeras.",
        duration: "8 semestres",
        coverage: "75%",
        requirements: { minGPA: 7.5, maxAge: 40 },
        amount: "80.000 ₡",
        province: "puntarenas",
        institution: "UNED",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 8 * 86400000).toISOString()
    },
    {
        id: 15,
        title: "Biología Marina (UNA)",
        category: "Académica",
        description: "Estudios en el campus Nicoya/Puntarenas.",
        requirements: { minGPA: 8.0, maxAge: 25 },
        amount: "140.000 ₡",
        province: "puntarenas",
        institution: "UNA",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },
    {
        id: 16,
        title: "Computación en la Nube (FWD)",
        category: "Académica",
        description: "Cursos remotos para residentes del pacífico.",
        requirements: { minGPA: 8.0, maxAge: 30 },
        amount: "200.000 ₡",
        province: "puntarenas",
        institution: "FWD",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Guanacaste (2) ---
    {
        id: 17,
        title: "Agronomía Tropical (UCR)",
        category: "Académica",
        description: "Beca para sede Guanacaste de la UCR.",
        duration: "10 semestres",
        coverage: "90%",
        requirements: { minGPA: 8.0, maxAge: 26 },
        amount: "190.000 ₡",
        province: "guanacaste",
        institution: "UCR",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 25 * 86400000).toISOString()
    },
    {
        id: 18,
        title: "Energías Renovables (INA)",
        category: "Académica",
        description: "Capacitación en energía solar y eólica.",
        requirements: { minGPA: 7.5, maxAge: 40 },
        amount: "105.000 ₡",
        province: "guanacaste",
        institution: "INA",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop" // Imagen - González
    },

    // --- Limón (2) ---
    {
        id: 19,
        title: "Logística Portuaria (UCR)",
        category: "Económica",
        description: "Para estudiantes de Administración Aduanera en Limón.",
        duration: "8 semestres",
        coverage: "100%",
        requirements: { minGPA: 8.0, maxAge: 28 },
        amount: "170.000 ₡",
        province: "limon",
        institution: "UCR",
        educationLevel: "grado",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop", // Imagen - González
        deadline: new Date(Date.now() + 18 * 86400000).toISOString()
    },
    {
        id: 20,
        title: "Ciberseguridad Caribe (MICITT)",
        category: "Social",
        description: "Programa especial para jóvenes limonenses.",
        requirements: { minGPA: 7.8, maxAge: 24 },
        amount: "155.000 ₡",
        province: "limon",
        institution: "MICITT",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop" // Imagen - González
    }
];

export const MOCK_APPLICATIONS = [
    {
        id: "app_1706543210123",
        scholarshipId: 1,
        applicantName: "Maria Garcia",
        age: 22,
        gpa: 9.8,
        income: 20000,
        motivation: "Siempre he buscado la excelencia...",
        status: "pending",
        date: new Date().toISOString()
    },
    {
        id: "app_1706543345678",
        scholarshipId: 2,
        applicantName: "Luis Rodriguez",
        age: 29,
        gpa: 7.8,
        income: 12000,
        motivation: "Necesito apoyo para continuar mis estudios...",
        status: "approved",
        date: new Date(Date.now() - 86400000).toISOString() // Yesterday
    }
];
