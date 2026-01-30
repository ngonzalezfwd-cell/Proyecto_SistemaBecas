
export const SCHOLARSHIPS = [
    {
        id: 1,
        title: "Beca de Excelencia Académica (UCR)",
        category: "Académica",
        description: "Reconocimiento a estudiantes con promedio superior a 9.5.",
        requirements: { minGPA: 9.5, maxAge: 25, minIncome: 0 },
        amount: "185.000 ₡ / mes",
        deadline: new Date(Date.now() + 30 * 86400000).toISOString() // Verde
    },
    {
        id: 2,
        title: "Apoyo Socioeconómico (UNA)",
        category: "Económica",
        description: "Asignación mensual por condición de vulnerabilidad social.",
        requirements: { minGPA: 7.5, maxAge: 30, maxIncome: 450000 },
        amount: "145.000 ₡ / mes",
        deadline: new Date(Date.now() + 7 * 86400000).toISOString() // Amarillo
    },
    {
        id: 3,
        title: "Beca Deportiva de Élite (TEC)",
        category: "Social",
        description: "Para atletas de representación nacional o institucional.",
        requirements: { minGPA: 8.0, maxAge: 24, minIncome: 0 },
        amount: "120.000 ₡ / mes",
        deadline: new Date(Date.now() + 2 * 86400000).toISOString() // Rojo
    },
    {
        id: 4,
        title: "Especialización Web Full Stack (FWD)",
        category: "Académica",
        description: "Programa intensivo de formación en desarrollo de software.",
        requirements: { minGPA: 8.5, maxAge: 28, minIncome: 0 },
        amount: "250.000 ₡ / mes",
        deadline: new Date(Date.now() + 20 * 86400000).toISOString() // Verde
    },
    {
        id: 5,
        title: "Técnico en Ciberseguridad (INA)",
        category: "Académica",
        description: "Formación técnica avanzada en protección de datos.",
        requirements: { minGPA: 8.0, maxAge: 40, minIncome: 0 },
        amount: "95.000 ₡ / mes",
        deadline: new Date(Date.now() + 12 * 86400000).toISOString() // Amarillo
    },
    {
        id: 6,
        title: "Conectividad para Zonas Rurales (UNED)",
        category: "Social",
        description: "Subsidio para equipos e internet en comunidades alejadas.",
        requirements: { minGPA: 7.0, maxAge: 100, minIncome: 0 },
        amount: "80.000 ₡ / mes",
        deadline: new Date(Date.now() + 1 * 86400000).toISOString() // Rojo
    },
    {
        id: 7,
        title: "Beca de Residencia Universitaria (UCR)",
        category: "Social",
        description: "Cubre costos de vivienda para estudiantes de provincias.",
        requirements: { minGPA: 8.5, maxAge: 24, maxIncome: 350000 },
        amount: "210.000 ₡ / mes",
        deadline: new Date(Date.now() + 18 * 86400000).toISOString() // Verde
    },
    {
        id: 8,
        title: "Empoderamiento Femenino STEM (MICITT)",
        category: "Académica",
        description: "Apoyo a mujeres en carreras de ciencia y tecnología.",
        requirements: { minGPA: 9.0, maxAge: 30, minIncome: 0 },
        amount: "160.000 ₡ / mes",
        deadline: new Date(Date.now() + 5 * 86400000).toISOString() // Amarillo
    },
    {
        id: 9,
        title: "Desarrollo de Aplicaciones (UTN)",
        category: "Académica",
        description: "Beca para formación en diseño y creación de apps.",
        requirements: { minGPA: 8.2, maxAge: 35, minIncome: 0 },
        amount: "130.000 ₡ / mes",
        deadline: new Date(Date.now() + 3 * 86400000).toISOString() // Rojo
    },
    {
        id: 10,
        title: "Inclusión Digital Avanzada (FWD)",
        category: "Social",
        description: "Acceso a formación de alto nivel para grupos vulnerables.",
        requirements: { minGPA: 8.0, maxAge: 26, maxIncome: 400000 },
        amount: "175.000 ₡ / mes",
        deadline: new Date(Date.now() + 45 * 86400000).toISOString() // Verde
    },
    {
        id: 11,
        title: "Beca de Idiomas - Inglés B2 (INA)",
        category: "Académica",
        description: "Curso intensivo de inglés para el empleo.",
        requirements: { minGPA: 7.5, maxAge: 50, minIncome: 0 },
        amount: "60.000 ₡ / mes"
    },
    {
        id: 12,
        title: "Beca 'Sigue Adelante' (FWD)",
        category: "Económica",
        description: "Apoyo total para jóvenes sin recursos económicos.",
        requirements: { minGPA: 7.5, maxAge: 22, maxIncome: 300000 },
        amount: "280.000 ₡ / mes"
    },
    {
        id: 13,
        title: "Artes Visuales y Diseño (UNA)",
        category: "Social",
        description: "Fomento al talento artístico de jóvenes costarricenses.",
        requirements: { minGPA: 8.0, maxAge: 28, minIncome: 0 },
        amount: "115.000 ₡ / mes"
    },
    {
        id: 14,
        title: "Beca de Alimentación (UTN)",
        category: "Económica",
        description: "Subsidio para comedor universitario.",
        requirements: { minGPA: 7.0, maxAge: 100, maxIncome: 500000 },
        amount: "50.000 ₡ / mes"
    },
    {
        id: 15,
        title: "Movilidad Estudiantil (TEC)",
        category: "Académica",
        description: "Apoyo para intercambios académicos en el extranjero.",
        requirements: { minGPA: 9.3, maxAge: 26, minIncome: 0 },
        amount: "400.000 ₡ (Único)"
    },
    {
        id: 16,
        title: "Técnico en Mecatrónica (INA)",
        category: "Académica",
        description: "Materiales y transporte para carreras técnicas.",
        requirements: { minGPA: 8.0, maxAge: 45, minIncome: 0 },
        amount: "100.000 ₡ / mes"
    },
    {
        id: 17,
        title: "Beca de Ciencia de Datos (UCR)",
        category: "Académica",
        description: "Especialización en análisis masivo de datos.",
        requirements: { minGPA: 9.0, maxAge: 30, minIncome: 0 },
        amount: "200.000 ₡ / mes"
    },
    {
        id: 18,
        title: "Desarrollo Cloud (FWD)",
        category: "Académica",
        description: "Certificación en arquitecturas en la nube.",
        requirements: { minGPA: 8.5, maxAge: 32, minIncome: 0 },
        amount: "220.000 ₡ / mes"
    },
    {
        id: 19,
        title: "Apoyo Post-Grado (UNA)",
        category: "Académica",
        description: "Subsidio para investigaciones de posgrado.",
        requirements: { minGPA: 9.0, maxAge: 40, minIncome: 0 },
        amount: "300.000 ₡ / mes"
    },
    {
        id: 20,
        title: "Liderazgo Juvenil (MICITT)",
        category: "Social",
        description: "Programa de formación de líderes comunitarios.",
        requirements: { minGPA: 8.0, maxAge: 25, minIncome: 0 },
        amount: "90.000 ₡ / mes"
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
