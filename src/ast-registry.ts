import { AstItemBaseDto } from "./contracts/ast-item";

export class AstRegistry {
    protected registry: Map<string, AstItemBaseDto> = new Map();
}
