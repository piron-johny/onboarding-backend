export interface User {
  id: string;
  name: string;
  password: string;
}

export interface AuthContext {
  userId: string;
}
