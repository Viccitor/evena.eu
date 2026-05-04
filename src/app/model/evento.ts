export interface Evento {
  id: number;          
  titulo: string;
  data: string;
  preco: number;      // Obrigatório 
  imagem: string;     // Obrigatório
  descricao?: string; 
  localNome: string;
  cidade: string; 
  uf: string;
  lat: number;        // Obrigatório para o GPS funcionar
  lng: number;        // Obrigatório para o GPS funcionar
  distancia?: number;
  categoria: string[];
  artista?: string[];
}
