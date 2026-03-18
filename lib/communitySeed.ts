import { forumPosts, recipes } from "./data"
import { createCommunityUser, type CommunityFeedItem, type CommunityUser } from "./communityLogic"

export const SPECIALTY_CATALOG = [
  "Panadería",
  "Repostería",
  "Cocina italiana",
  "Cocina mexicana",
  "Cocina asiática",
  "Saludable",
  "Meal prep",
  "Sushi",
  "Postres",
  "Técnicas de horno",
  "Vegetariana",
  "Parrilla",
  "Brunch",
  "Restaurantes",
  "Delivery",
]

export const COMMUNITY_SEED_USERS: CommunityUser[] = [
  createCommunityUser(
    {
      name: "Admin Flavoria",
      email: "admin@flavoria.demo",
      bio: "Administra la comunidad y coordina la moderación, el soporte y la operación del marketplace.",
      expertiseRole: "chef",
      specialtyTags: ["Moderación", "Soporte", "Gestión de comunidad"],
      avatar: "https://i.pravatar.cc/150?img=12",
      accountType: "admin",
    },
    {
      id: "admin-flavoria",
      platformRole: "admin",
      accountType: "admin",
      following: ["maria-gonzalez", "ana-martinez"],
      puntos: 320,
      hilos: 5,
      comentarios: 6,
      likesRecibidos: 15,
    },
  ),
  createCommunityUser(
    {
      name: "María González",
      email: "maria@flavoria.demo",
      bio: "Chef y dueña de Trattoria Roma Norte, enfocada en cocina italiana y panadería artesanal.",
      expertiseRole: "chef",
      specialtyTags: ["Cocina italiana", "Panadería", "Técnicas de horno"],
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      accountType: "restaurant",
    },
    {
      id: "maria-gonzalez",
      accountType: "restaurant",
      puntos: 145,
      hilos: 2,
      comentarios: 7,
      likesRecibidos: 11,
      following: ["ana-martinez"],
    },
  ),
  createCommunityUser(
    {
      name: "Carlos Ruiz",
      email: "carlos@flavoria.demo",
      bio: "Consumidor foodie que compra, comenta y sigue nuevas propuestas gastronómicas.",
      expertiseRole: "pro_curious",
      specialtyTags: ["Repostería", "Cocina mexicana", "Postres"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      accountType: "consumer",
    },
    {
      id: "carlos-ruiz",
      accountType: "consumer",
      puntos: 60,
      hilos: 1,
      comentarios: 3,
      likesRecibidos: 4,
      following: ["maria-gonzalez"],
    },
  ),
  createCommunityUser(
    {
      name: "Ana Martínez",
      email: "ana@flavoria.demo",
      bio: "Especialista en cocina saludable y fundadora de Verde Vital Market en Bogotá.",
      expertiseRole: "chef",
      specialtyTags: ["Saludable", "Meal prep", "Vegetariana"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      accountType: "restaurant",
    },
    {
      id: "ana-martinez",
      accountType: "restaurant",
      puntos: 305,
      hilos: 6,
      comentarios: 8,
      likesRecibidos: 16,
      following: ["maria-gonzalez", "carlos-ruiz"],
    },
  ),
  createCommunityUser(
    {
      name: "Laura Méndez",
      email: "laura@flavoria.demo",
      bio: "Pastelera y creadora de Bistró del Parque con foco en brunch y postres.",
      expertiseRole: "chef",
      specialtyTags: ["Brunch", "Postres", "Café"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      accountType: "restaurant",
    },
    {
      id: "laura-mendez",
      accountType: "restaurant",
      puntos: 120,
      hilos: 2,
      comentarios: 4,
      likesRecibidos: 7,
      following: ["maria-gonzalez"],
    },
  ),
  createCommunityUser(
    {
      name: "Andrés Pérez",
      email: "andres@flavoria.demo",
      bio: "Consumidor frecuente de brunch y almuerzos ejecutivos en Bogotá.",
      expertiseRole: "foodie",
      specialtyTags: ["Brunch", "Delivery", "Oficina"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      accountType: "consumer",
    },
    {
      id: "andres-perez",
      accountType: "consumer",
      puntos: 35,
      hilos: 0,
      comentarios: 2,
      likesRecibidos: 1,
      following: ["ana-martinez", "laura-mendez"],
    },
  ),
]

const AUTHOR_TO_ID: Record<string, string> = {
  "María González": "maria-gonzalez",
  "Carlos Ruiz": "carlos-ruiz",
  "Ana Martínez": "ana-martinez",
}

const AUTHOR_TO_AVATAR: Record<string, string> = {
  "María González": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "Carlos Ruiz": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "Ana Martínez": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
}

export const COMMUNITY_FEED_ITEMS: CommunityFeedItem[] = [
  ...recipes.map((recipe, index) => ({
    id: `recipe-${recipe.id}`,
    authorId: AUTHOR_TO_ID[recipe.author] ?? "",
    authorName: recipe.author,
    authorAvatar: AUTHOR_TO_AVATAR[recipe.author] ?? "https://i.pravatar.cc/150?img=5",
    category: recipe.category,
    createdAt: `2026-03-${String(10 + index).padStart(2, "0")}T09:00:00.000Z`,
    href: `/receta/${recipe.id}`,
    kind: "receta" as const,
    title: recipe.title,
    summary: recipe.description,
  })),
  ...forumPosts.map((post, index) => ({
    id: `forum-${post.id}`,
    authorId: AUTHOR_TO_ID[post.author] ?? "",
    authorName: post.author,
    authorAvatar: AUTHOR_TO_AVATAR[post.author] ?? "https://i.pravatar.cc/150?img=5",
    category: post.category,
    createdAt: `2026-03-${String(20 + index).padStart(2, "0")}T13:30:00.000Z`,
    href: "/foros",
    kind: "foro" as const,
    title: post.title,
    summary: post.content,
  })),
]
  .filter((item) => item.authorId)
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
