const portfolioData = {
    contact: {
        whatsapp: "0324-8974268",
        email: "majidzaffar35@gmail.com",
        location: "Pakistan",
        linkedin: "https://www.linkedin.com/in/majid-iqbal-168w",
        behance: "https://www.behance.net/majidiqbal7"
    },
    socialLinks: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/majid-iqbal-168w", icon: "fab fa-linkedin" },
        { name: "Behance", url: "https://www.behance.net/majidiqbal7", icon: "fab fa-behance" },
        { name: "GitHub", url: "#", icon: "fab fa-github" }
    ],
    freelanceLinks: [
        { name: "Fiverr", url: "#", icon: "fas fa-briefcase" },
        { name: "Upwork", url: "#", icon: "fas fa-laptop-code" }
    ],
    skills: [
        {
            category: "UI/UX Design",
            icon: "🎨",
            skills: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Figma", "Adobe XD"]
        },
        {
            category: "Development",
            icon: "💻",
            skills: ["HTML5 / CSS3", "JavaScript (ES6+)", "Node.js / Express", "MySQL / MongoDB", "Python / C#", ".NET"]
        },
        {
            category: "Modern Tools",
            icon: "🔧",
            skills: ["Git / GitHub", "Jotform / Typeform", "Google Forms", "REST APIs", "Responsive Design"]
        }
    ],
    services: [
        {
            title: "UI/UX Design",
            description: "Creating intuitive, user-centered designs and interactive prototypes that solve complex problems.",
            icon: "🎨"
        },
        {
            title: "Web Development",
            description: "Building robust, scalable, and high-performance web applications using modern technologies.",
            icon: "⚙️"
        },
        {
            title: "Brand Identity",
            description: "Developing consistent and professional visual identities that resonate with your target audience.",
            icon: "✨"
        },
        {
            title: "Form Automation",
            description: "Expert form solutions with advanced logic and seamless integrations (Jotform, Google Forms).",
            icon: "📝"
        }
    ],
    projects: [
        {
            id: 1,
            title: "Retail Management System",
            category: "UI/UX Design + Development",
            description: "Complete inventory and sales management solution.",
            overview: "A comprehensive retail management platform that helps businesses manage inventory, sales, and customer relationships efficiently.",
            problem: "Manual inventory tracking was slow and prone to errors.",
            solution: "Built an integrated system with real-time tracking and sales analytics.",
            features: ["Inventory tracking", "Sales analytics", "Customer management"],
            technologies: ["C#", ".NET", "MySQL"],
            image: "assets/projects/retail.png",
            link: "https://www.behance.net/gallery/242742717/Smart-Retail-Management-System"
        },
        {
            id: 2,
            title: "Budget Management Application",
            category: "UI/UX Design + Development",
            description: "Personal finance tracking and budget planning tool.",
            overview: "A personal finance management tool that helps users track expenses and visualize financial data.",
            problem: "Lack of easy expense visualization and multi-currency tracking.",
            solution: "Created an intuitive dashboard with real-time tracking and exchange rate integration.",
            features: ["Expense tracking", "Budget planning", "Exchange Rate API"],
            technologies: ["Python", "JavaScript", "MongoDB", "Exchange Rate API"],
            image: "assets/projects/budget.png",
            link: "https://www.behance.net/gallery/242747751/Home-Budget-Management-Application"
        },
        {
            id: 3,
            title: "Food Delivery Website",
            category: "UI/UX Design + Development",
            description: "Full-featured food delivery platform with multi-vendor support.",
            overview: "A modern platform connecting restaurants with customers for seamless ordering.",
            problem: "Need for a streamlined ordering process and secure user accounts.",
            solution: "Developed a secure platform with JWT authentication and real-time order tracking.",
            features: ["Restaurant discovery", "JWT Authentication", "Order tracking"],
            technologies: ["Node.js", "Express", "JWT", "MongoDB"],
            image: "assets/projects/food.png"
        },
        {
            id: 4,
            title: "RideUp - Bike Learning",
            category: "UI/UX Case Study",
            description: "Complete UI/UX case study for a bike learning platform.",
            overview: "An in-depth UI/UX project focusing on user research, wireframing, and visual design for a motorcycle learning app.",
            problem: "Finding reliable bike training was difficult for beginners.",
            solution: "Designed a user-friendly interface to browse, book, and track learning progress.",
            features: ["User personals", "Wireframes", "Interactive prototypes"],
            technologies: ["Figma", "User Research", "UI/UX Design"],
            image: "assets/projects/rideup.png",
            link: "https://www.behance.net/gallery/220890827/RideUp-Website-Complete-Case-Study-Design"
        },
        {
            id: 5,
            title: "University Web Design",
            category: "UI/UX Case Study",
            description: "A comprehensive web design case study for a modern university.",
            overview: "Transforming the digital presence of a university with a focus on accessibility and student engagement.",
            problem: "Outdated website with poor navigation for prospective students.",
            solution: "Complete redesign with modern hierarchy and intuitive navigation.",
            features: ["Information architecture", "Visual design", "Prototyping"],
            technologies: ["Figma", "Adobe XD", "UI/UX Design"],
            image: "assets/projects/university.png",
            link: "https://www.behance.net/gallery/229149449/University-complete-project-design"
        },
        {
            id: 6,
            title: "Dark Theme Dashboard",
            category: "UI Design",
            description: "Elegant and functional dashboard UI in dark theme.",
            overview: "A creative UI design experiment focused on dark mode aesthetics and data delivery.",
            problem: "Standard dashboards can be visually tiring and cluttered.",
            solution: "Designed a sleek, high-contrast dark theme focused on readability and key metrics.",
            features: ["Dark theme", "Data visualization", "Minimalist UI"],
            technologies: ["Figma", "UI Design"],
            image: "assets/projects/dashboard.png",
            link: "https://www.behance.net/gallery/241566171/Dashboard-in-dark-theme"
        },
        {
            id: 7,
            title: "Forms Automation Suite",
            category: "Form Integration",
            description: "Custom form solutions and automated workflows.",
            overview: "Automating data collection and processing through advanced form logic.",
            problem: "Manual data entry from multiple sources was inefficient.",
            solution: "Integrated logic-heavy forms with automated notifications and data syncing.",
            features: ["Conditional logic", "Zapier integration", "Email automation"],
            technologies: ["Jotform", "Google Forms", "Typeform", "Cognito Forms"],
            image: "📋" // Mockup generation failed, using icon
        }
    ],
    testimonials: [
        {
            name: "Ahmed Hassan",
            company: "Tech Startup",
            text: "Majid delivered an exceptional website that exceeded our expectations. His attention to detail and professional approach made the process seamless.",
            rating: 5
        },
        {
            name: "Fatima Khan",
            company: "E-Commerce Business",
            text: "The dashboard he created has completely transformed how we manage our inventory. Highly recommended!",
            rating: 5
        },
        {
            name: "Sophia Williams",
            company: "Digital Agency",
            text: "A truly professional experience from start to finish. The UI/UX design is world-class and the development is rock solid.",
            rating: 5
        }
    ]
};
