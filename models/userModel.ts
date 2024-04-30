export interface User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    role: "ADMIN" | 'USER' | 'ROOT' ;
  }
