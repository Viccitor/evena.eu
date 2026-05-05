export interface Evento {
  id: number;          
  titulo: string;
  dataExibicao: string;     // Ex: "24 de Fevereiro"
  horario: string;
  datasOcorrencia: string[]; // Ex: ["2026-05-10", "2026-05-12"]
  intervalo?: {
    inicio: string; // Ex: "2026-06-01"
    fim: string;    // Ex: "2026-08-30"
  };
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
