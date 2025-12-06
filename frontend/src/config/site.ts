export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  navItems: [
    {
      label: "Crear receta",
      href: "/",
    },
    {
      label: "Cargá los ingredientes",
      href: "/upload",
    },
  ],
  links: {
    github: "https://github.com/ctomatis/curly-robot.git",
  },
}
