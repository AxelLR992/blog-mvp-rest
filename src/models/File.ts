class File {
    fileId: number;
    originalName: string;
    fileName: string;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data?: RowData){
        if (data) {
            this.fileId = data.FILE_ID;
            this.originalName = data.ORIGINAL_NAME;
            this.fileName = data.FILE_NAME;
            this.mimeType = data.MIME_TYPE;
            this.createdAt = new Date(data.CREATED_AT);
            this.updatedAt = new Date(data.UPDATED_AT);
        }
    }
}

export default File;

interface RowData {
    FILE_ID: number;
    ORIGINAL_NAME: string;
    FILE_NAME: string;
    MIME_TYPE: string;
    CREATED_AT: Date;
    UPDATED_AT: Date;
}