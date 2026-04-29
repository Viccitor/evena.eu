export interface Evento {
  id: number;          
  titulo?: string;
  data?: string;
  local?: string;
  preco?: number;      // Obrigatório (use 0 para gratuito)
  imagem: string;     // Obrigatório
  descricao?: string;  
  lat?: number;        // Obrigatório para o GPS funcionar
  lng?: number;        // Obrigatório para o GPS funcionar
  distancia?: number;
  categoria?: string;
}
