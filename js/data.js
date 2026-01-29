export const SCHOLARSHIPS = [
    {
        id: 1,
        title: "Beca de Excelencia Académica",
        description: "Dirigida a estudiantes con un promedio sobresaliente que demuestren compromiso académico.",
        requirements: {
            minGPA: 9.0,
            maxAge: 25,
            minIncome: 0 // No restriction
        },
        amount: "$5,000 / semestre"
    },
    {
        id: 2,
        title: "Apoyo Económico Social",
        description: "Ayuda financiera para estudiantes provenientes de hogares con bajos ingresos.",
        requirements: {
            minGPA: 7.5,
            maxAge: 30,
            maxIncome: 15000 // Annual family income limit
        },
        amount: "$3,000 / semestre"
    },
    {
        id: 3,
        title: "Beca Deportiva",
        description: "Para atletas destacados que representen a la institución en competencias oficiales.",
        requirements: {
            minGPA: 8.0,
            maxAge: 28,
            minIncome: 0
        },
        amount: "$4,000 / semestre"
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
