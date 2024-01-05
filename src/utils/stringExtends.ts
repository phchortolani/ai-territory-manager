export function removeSC(texto: string) {
    return texto.normalize('NFD') // Normaliza a string para separar os acentos
        .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, '') // Remove acentos
}