import { Injectable } from '@angular/core';
import { APIClientService } from './apiclient.service';
import { saveAs } from 'file-saver';

const FILE_API = 'api/file';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private apiClient: APIClientService) { }

    getFile(id: string, returnFile = false): Promise<any> {

        return this.apiClient.get(FILE_API, { id }, true).then(
            data => {
                if (!returnFile)
                    saveAs(data.file, data.fileName);
                return data;
            }
        );

    }
}
