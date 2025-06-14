export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
