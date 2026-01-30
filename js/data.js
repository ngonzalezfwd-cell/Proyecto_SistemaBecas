
export const SCHOLARSHIPS = [
    {
        id: 1,
        title: "Beca de Excelencia Académica (UCR)",
        description: "Dirigida a estudiantes con un promedio sobresaliente que demuestren compromiso académico.",
        requirements: { minGPA: 9.0, maxAge: 25, minIncome: 0 },
        amount: "150.000 ₡ / mes"
    },
    {
        id: 2,
        title: "Apoyo Económico Social (UNA)",
        description: "Ayuda financiera para estudiantes provenientes de hogares con bajos ingresos.",
        requirements: { minGPA: 7.5, maxAge: 30, maxIncome: 500000 },
        amount: "120.000 ₡ / mes"
    },
    {
        id: 3,
        title: "Beca Deportiva de Alto Rendimiento (TEC)",
        description: "Para atletas destacados que representen a la institución en competencias oficiales.",
        requirements: { minGPA: 8.0, maxAge: 23, minIncome: 0 },
        amount: "100.000 ₡ / mes"
    },
    {
        id: 4,
        title: "Beca de Innovación Tecnológica (FWD)",
        description: "Apoyo para jóvenes interesados en el desarrollo de software y nuevas tecnologías.",
        requirements: { minGPA: 8.5, maxAge: 24, minIncome: 0 },
        amount: "200.000 ₡ / mes"
    },
    {
        id: 5,
        title: "Beca de Formación Profesional para el Trabajo (INA)",
        description: "Subsidio para estudiantes de carreras técnicas con alta demanda laboral.",
        requirements: { minGPA: 7.0, maxAge: 45, minIncome: 0 },
        amount: "85.000 ₡ / mes"
    },
    {
        id: 6,
        title: "Beca de Educación a Distancia (UNED)",
        description: "Facilita el acceso a materiales y conectividad para estudiantes de zonas rurales.",
        requirements: { minGPA: 8.0, maxAge: 100, minIncome: 0 },
        amount: "90.000 ₡ / mes"
    },
    {
        id: 7,
        title: "Beca de Liderazgo Comunal (UCR)",
        description: "Para estudiantes involucrados en proyectos de impacto social y comunitario.",
        requirements: { minGPA: 8.5, maxAge: 28, minIncome: 0 },
        amount: "110.000 ₡ / mes"
    },
    {
        id: 8,
        title: "Beca de Talento Digital (FWD)",
        description: "Especializada en cursos intensivos de programación y diseño web.",
        requirements: { minGPA: 8.0, maxAge: 35, minIncome: 0 },
        amount: "180.000 ₡ / mes"
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
