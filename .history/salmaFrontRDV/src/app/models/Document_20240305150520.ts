export interface Document {
  id: number;
  fileName: string; 
  fileType: string; 
  
  content: ArrayBuffer;
}
