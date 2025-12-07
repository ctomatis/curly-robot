export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  navItems: [
    {
      label: "Cotizar recetas",
      href: "/",
    },
    {
      label: "Crear receta",
      href: "/crear",
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
