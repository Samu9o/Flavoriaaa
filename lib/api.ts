const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('flavoria_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Error de servidor');
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: 'consumer' | 'restaurant' | 'admin';
    createdAt: string;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  register: (nombre: string, email: string, password: string, rol?: string) =>
    api.post<AuthResponse>('/auth/register', { nombre, email, password, rol }),
  me: () => api.get<AuthResponse['usuario']>('/auth/me'),
  updateProfile: (data: { nombre?: string; email?: string; password?: string }) =>
    api.patch<AuthResponse>('/auth/profile', data),
};

export interface ProductoMenu {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
}

export interface Restaurante {
  id: string;
  nombre: string;
  localidad: string;
  descripcion: string;
  imagen: string;
  calificacion: number;
  tiempoEntrega: string;
  categorias: string[];
  menu: ProductoMenu[];
  direccion: string;
  telefono: string;
}

export const restaurantesApi = {
  getAll: (localidad?: string) => {
    const qs = localidad ? `?localidad=${encodeURIComponent(localidad)}` : '';
    return api.get<Restaurante[]>(`/restaurantes${qs}`);
  },
  getOne: (id: string) => api.get<Restaurante>(`/restaurantes/${id}`),
  getLocalidades: () => api.get<string[]>('/restaurantes/localidades'),
};
