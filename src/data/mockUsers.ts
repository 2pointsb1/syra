export interface MockUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export const mockUsers: MockUser[] = [
  { id: '1', first_name: 'Moche', last_name: 'Azran', email: 'azran@bienviyance.com', role: 'admin' },
  { id: '2', first_name: 'Sophie', last_name: 'Martin', email: 'sophie@bienviyance.com', role: 'gestion' },
  { id: '3', first_name: 'Thomas', last_name: 'Dubois', email: 'thomas@bienviyance.com', role: 'signataire' },
  { id: '4', first_name: 'Marie', last_name: 'Lefebvre', email: 'marie@bienviyance.com', role: 'indicateur_affaires' },
];
