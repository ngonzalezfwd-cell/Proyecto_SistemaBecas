
export const SCHOLARSHIPS = [
    {
        id: 1,
        title: "Beca de Excelencia Académica (UCR)",
        description: "Reconocimiento a estudiantes con promedio superior a 9.5.",
        requirements: { minGPA: 9.5, maxAge: 25, minIncome: 0 },
        amount: "155.000 ₡ / mes"
    },
    {
        id: 2,
        title: "Apoyo Socioeconómico (UNA)",
        description: "Asignación mensual por condición de vulnerabilidad social.",
        requirements: { minGPA: 7.5, maxAge: 30, maxIncome: 450000 },
        amount: "125.000 ₡ / mes"
    },
    {
        id: 3,
        title: "Beca Deportiva (TEC)",
        description: "Para atletas de representación institucional.",
        requirements: { minGPA: 8.0, maxAge: 24, minIncome: 0 },
        amount: "110.000 ₡ / mes"
    },
    {
        id: 4,
        title: "Especialización Web - Full Stack (FWD)",
        description: "Programa intensivo para desarrolladores de software.",
        requirements: { minGPA: 8.5, maxAge: 26, minIncome: 0 },
        amount: "210.000 ₡ / mes"
    },
    {
        id: 5,
        title: "Técnico en Mecatrónica (INA)",
        description: "Ayuda para materiales y transporte en formación técnica.",
        requirements: { minGPA: 7.0, maxAge: 50, minIncome: 0 },
        amount: "90.000 ₡ / mes"
    },
    {
        id: 6,
        title: "Beca de Conectividad Rural (UNED)",
        description: "Subsidio para internet y equipos en zonas alejadas.",
        requirements: { minGPA: 7.5, maxAge: 100, minIncome: 0 },
        amount: "75.000 ₡ / mes"
    },
    {
        id: 7,
        title: "Beca de Residencia Universitaria (UCR)",
        description: "Cubre costos de alojamiento para estudiantes de provincias alejadas.",
        requirements: { minGPA: 8.5, maxAge: 25, minIncome: 0 },
        amount: "180.000 ₡ / mes"
    },
    {
        id: 8,
        title: "Beca de Movilidad Estudiantil (TEC)",
        description: "Apoyo para intercambios académicos internacionales.",
        requirements: { minGPA: 9.2, maxAge: 28, minIncome: 0 },
        amount: "450.000 ₡ (Única vez)"
    },
    {
        id: 9,
        title: "Beca de Ciencia y Tecnología (UNA)",
        description: "Para estudiantes de carreras STEM con alto potencial.",
        requirements: { minGPA: 8.8, maxAge: 26, minIncome: 0 },
        amount: "140.000 ₡ / mes"
    },
    {
        id: 10,
        title: "Curso: Ciberseguridad Avanzada (FWD)",
        description: "Beca total para formación en seguridad informática.",
        requirements: { minGPA: 8.0, maxAge: 35, minIncome: 0 },
        amount: "195.000 ₡ / mes"
    },
    {
        id: 11,
        title: "Beca de Artes y Cultura (UCR)",
        description: "Para talentos destacados en música, teatro o artes plásticas.",
        requirements: { minGPA: 8.0, maxAge: 30, minIncome: 0 },
        amount: "120.000 ₡ / mes"
    },
    {
        id: 12,
        title: "Beca Integral 'Sigue Adelante' (FWD)",
        description: "Apoyo total para jóvenes sin recursos en áreas de tecnología.",
        requirements: { minGPA: 7.5, maxAge: 22, maxIncome: 300000 },
        amount: "250.000 ₡ / mes"
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
