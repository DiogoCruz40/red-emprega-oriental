import { User } from "../../red-emprega-admin/models/User";

export class OfertaFormacao {
    _id: string;
    nome: string;
    areaFormacao: string;
    local: string;
    horario: string;
    contacto: number;
    email: string;
    dataLimite: Date | string;
    inseridoPor: User;
    observacoes: string;
    observacoesAMostrar: string;
    isCollapsed: boolean;
    emailsAEnviar: string[] = [];
    numCandidaturas: number;
    files: any[];
    anexos: any[];
    lerMais = true;
    tamanho: string;
    constructor() {
        this.files = [];
        this.anexos = [];
        this.lerMais = true;
    }
}

export class OfertaFormacaoCandidatura {
    idOferta: string;
    nome: string;
    email: string;
    telemovel: number;
    observacoes: string;
    constructor() { }
}
