export default {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Blog MVP",
        version: "0.1.0",
        description:
          "Simple blog MVP backend project",
        contact: {
          name: "Axel León",
          email: "yka992@hotmail.com",
        },
      },
      servers: [
        {
          name: "Development",
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["**/*.yml"], 
  };
  
  