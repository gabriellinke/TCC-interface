import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  url = 'https://192.168.0.177:3000/upload';

  constructor() { }

  async uploadImage(image: string) {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'filename.jpg'); // Substitua 'filename.jpg' pelo nome que desejar

      const uploadResponse = await fetch(this.url, {
        method: 'POST',
        body: formData
      });

      const responseJson = await uploadResponse.json();
      console.log(responseJson);
      if (responseJson) {
        return responseJson;
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
}



}
