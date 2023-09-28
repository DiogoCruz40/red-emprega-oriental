import { User } from "../../red-emprega-admin/models/User";

export class Noticia {
    _id: string;
    titulo: string;
    descricao: string;
    inseridoPor: User;
    dataInsercao: Date;
    isCollapsed: boolean;
    files: any[];
    anexos: any[];
    preVisualizar: any;
    filePreVisualizar: any
    lerMais = true;
    imgPrevisualizar: any;
    constructor() { 
        this.files = [];
        this.anexos = [];
        this.lerMais = true;
    }
}
