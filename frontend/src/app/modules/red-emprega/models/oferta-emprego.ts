import { User } from '../../red-emprega-admin/models/User';

export class OfertaEmprego {
    _id: string;
    nome: string;
    funcao: string;
    local: string;
    horario: string;
    remuneracao: string;
    beneficios: string;
    outrasRegalias: string;
    contacto: number;
    email: string;
    dataLimite: Date | string;
    inseridoPor: User;
    observacoes: string;
    observacoesAMostrar: string;

    perfilExperienciaProfissional: string;
    curriculo: boolean;
    isCollapsed: boolean;
    files: any[];
    anexos: any[];
    numCandidaturas: number;
    lerMais = true;
    tamanho: string;
    constructor() { 
        this.files = [];
        this.anexos = [];
        this.lerMais = true;
    }
}

export class OfertaEmpregoCandidatura {
    idOferta: string;
    nome: string;
    email: string;
    telemovel: number;
    observacoes: string;
    cv: File;
    constructor() { }
}