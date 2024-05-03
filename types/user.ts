export interface User {
  id: number;
  name?: string | null;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER' | 'ROOT';
}
