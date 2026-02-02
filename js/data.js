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
        image: "../imgs/beca-ucr-excelencia.png",
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        extraDetails: "Esta beca premia la excelencia académica en la Universidad de Costa Rica. Los beneficiarios tendrán acceso preferencial a los laboratorios de investigación avanzada y prioridad en programas de intercambio internacional. Además, se incluye tutoría personalizada por parte de profesores catedráticos. <br><br><strong>Apoyo Económico:</strong> Recibirá depositado mensualmente un monto de <strong>185.000 ₡</strong> para cubrir gastos de manutención y materiales."
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
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
        extraDetails: "Iniciativa del MICITT para cerrar la brecha de género en carreras STEM. Incluye acceso a redes de mentoría con científicas destacadas y participación en congresos nacionales. <br><br><strong>Apoyo Económico:</strong> Se otorgará una asistencia financiera mensual de <strong>150.000 ₡</strong> para facilitar la dedicación exclusiva al estudio."
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
        image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
        extraDetails: "Bootcamp intensivo diseñado para la inserción laboral rápida en el sector tecnológico. Incluye certificación oficial, portafolio de proyectos reales y simulacros de entrevistas técnicas. <br><br><strong>Apoyo Económico:</strong> Durante el curso, el estudiante recibirá <strong>250.000 ₡</strong> mensuales para asegurar su conectividad y manutención."
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
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Formación práctica en infraestructura de redes Cisco y seguridad informática. Los estudiantes realizarán prácticas profesionales en empresas líderes del sector telecomunicaciones. <br><br><strong>Apoyo Económico:</strong> El INA subsidia sus estudios y aporta <strong>90.000 ₡</strong> mensuales para transporte y alimentación."
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
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        extraDetails: "Destinada a estudiantes con potencial académico que requieren soporte financiero. Incluye acceso gratuito al comedor estudiantil y préstamo de libros de texto. <br><br><strong>Apoyo Económico:</strong> Se brinda un subsidio mensual de <strong>145.000 ₡</strong> para gastos de alojamiento y necesidades básicas."
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
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Programa inmersivo enfocado en el dominio del idioma inglés para el sector servicios y corporativo. Incluye certificación TOEIC al finalizar el programa. <br><br><strong>Apoyo Económico:</strong> Recibirá <strong>60.000 ₡</strong> mensuales como ayuda para materiales didácticos y transporte."
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
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Beca de posgrado para educadores que buscan transformar el sistema educativo. Permite dedicación exclusiva a la investigación y desarrollo de tesis, con acceso a bibliotecas digitales internacionales. <br><br><strong>Apoyo Económico:</strong> Beca robusta de <strong>300.000 ₡</strong> mensuales para sostener al investigador durante su maestría."
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
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        extraDetails: "Carrera enfocada en las últimas tecnologías de desarrollo ágil y cloud computing. La UTN ofrece laboratorios equipados con hardware de última generación y licencias de software profesional. <br><br><strong>Apoyo Económico:</strong> El estudiante recibirá <strong>130.000 ₡</strong> por mes para apoyar sus estudios."
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
        image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Aprenda diagnóstico y reparación de vehículos modernos, incluyendo híbridos y eléctricos. El programa incluye prácticas supervisadas en talleres certificados. <br><br><strong>Apoyo Económico:</strong> Se otorga un monto de <strong>100.000 ₡</strong> mensuales para herramientas básicas y transporte."
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
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Certificación PMP orientada a líderes de equipos ágiles. Incluye acceso a herramientas de gestión como Jira y Asana, además de talleres de liderazgo. <br><br><strong>Apoyo Económico:</strong> Ayuda financiera de <strong>180.000 ₡</strong> mensuales para facilitar la participación en el curso."
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
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
        extraDetails: "Estudie en la universidad tecnológica líder de la región. Acceso a clusters de computación de alto rendimiento y grupos de investigación en IA. <br><br><strong>Apoyo Económico:</strong> El TEC otorga <strong>160.000 ₡</strong> mensuales para residencias y alimentación dentro del campus."
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
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Especialización en automatización y control industrial. Incluye manejo de PLCs y robótica básica, con alta demanda en zonas francas de Cartago. <br><br><strong>Apoyo Económico:</strong> Beca de <strong>95.000 ₡</strong> mensuales para apoyar al estudiante durante su formación técnica."
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
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Fondo exclusivo para investigación avanzada en biotecnología vegetal y médica. Cubre reactivos de laboratorio y publicaciones en revistas indexadas. <br><br><strong>Apoyo Económico:</strong> Asignación mensual de <strong>350.000 ₡</strong> para que el investigador se dedique a tiempo completo a su tesis."
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
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 8 * 86400000).toISOString(),
        extraDetails: "Carrera enfocada en el desarrollo turístico responsable. Incluye giras de campo y proyectos de vinculación con comunidades costeras. <br><br><strong>Apoyo Económico:</strong> La UNED aporta <strong>80.000 ₡</strong> mensuales para facilitar el transporte a centros universitarios y giras."
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
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Estudie la biodiversidad marina en el sitio. Acceso a la estación de biología marina de la UNA y participación en censos de especies. <br><br><strong>Apoyo Económico:</strong> Beca de <strong>140.000 ₡</strong> mensuales para gastos de residencia cerca de la estación biológica."
    },
    {
        id: 16,
        title: "Computación en la Nube (FWD)",
        category: "Académica",
        description: "Cursos remotos para residents del pacífico.",
        requirements: { minGPA: 8.0, maxAge: 30 },
        amount: "200.000 ₡",
        province: "puntarenas",
        institution: "FWD",
        educationLevel: "pregrado",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Certificación en AWS y Azure para fomentar el teletrabajo desde zonas costeras. Incluye voucher para examenes de certificación internacionales. <br><br><strong>Apoyo Económico:</strong> Subsidio de <strong>200.000 ₡</strong> mensuales para asegurar buena conectividad a internet y equipo adecuado."
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
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
        extraDetails: "Investigación aplicada en cultivos resilientes al cambio climático. Prácticas en fincas experimentales de la región Chorotega. <br><br><strong>Apoyo Económico:</strong> Se brinda <strong>190.000 ₡</strong> mensuales para manutención y traslados a las fincas."
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
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Técnico enfocado en la instalación y mantenimiento de paneles solares y turbinas eólicas, aprovechando el potencial de la zona. <br><br><strong>Apoyo Económico:</strong> El INA aporta <strong>105.000 ₡</strong> al mes para apoyar al estudiante durante su capacitación."
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
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop",
        deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
        extraDetails: "Formación especializada en la gestión de logística internacional y operaciones portuarias en la Sede del Caribe. Incluye pasantías en APM Terminals o JAPDEVA. <br><br><strong>Apoyo Económico:</strong> Beca mensual de <strong>170.000 ₡</strong> para cubrir gastos de estudio y transporte."
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
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop",
        extraDetails: "Programa intensivo para formar expertos en seguridad digital en la zona caribeña. Fomenta el talento local para empresas tecnológicas remotas. <br><br><strong>Apoyo Económico:</strong> Subsidio de <strong>155.000 ₡</strong> mensuales para que los jóvenes puedan dedicarse a su formación técnica."
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
