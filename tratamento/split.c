/*
 * Autor: Leandro A. F. de Magalhaes
 *        (leandroafm21@gmail.com)
 * Desc: Gera um arquivo de saida contendo somente palavras em um intervalo
 *       de tamanho pre definido.
 *
 * Utilizado na Iniciacao Cientifica "Aprimoramento do Metodo Diceware para
 * geracao de senhas seguras".
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#ifndef WORD_SIZE
#define WORD_SIZE 9
#endif

#ifndef MAX_FILE_NAME
#define MAX_FILE_NAME 9
#endif

/**
 * funcao: outFileNameGenerator
 * desc: gera o nome do arquivo de saida na forma AtoB.txt, sendo A o tamanho
 *       minimo e B o tamanho maximo das palavras na lista
 *
 * @param: name: string onde o nome sera armazenado
 *         min: tamanho minimo das palavras
 *         max: tamanho maximo das palavrass
 * @return: none
 */
void outFileNameGenerator(char name[MAX_FILE_NAME], int min, int max);

int main(int argc, char *argv[]) {

    if (argc < 2) {
        printf("Uso: ./split <in>\n");
        printf("<in> deve ser arquivo .txt\n");
        exit(EXIT_FAILURE);
    }

    FILE *in = fopen(argv[1], "r");
    int min, max;

    printf("Entre com o [min, max] de tamanho das palavras: ");
    scanf(" %d %d", &min, &max);

    if (min > max || min < 1 || max > 8) {
        printf("Erro nos valores inseridos. (1 <= min < max <= 8)\n");
        exit(EXIT_FAILURE);
    }

    char outFile[MAX_FILE_NAME];
    outFileNameGenerator(outFile, min, max);

    FILE *out = fopen(outFile, "w");
    char palavra[WORD_SIZE];
    while(fscanf(in, "%s", palavra) != EOF) {
        if (strlen(palavra) >= min && strlen(palavra) <= max)
            fprintf(out, "%s\n", palavra);
    }
    fclose(in);
    fclose(out);

    return 0;
}

void outFileNameGenerator(char name[MAX_FILE_NAME], int min, int max) {
    char minString[2]; minString[0] = (char) (min + 48); minString[1] = '\0';
    char maxString[2]; maxString[0] = (char) (max + 48); maxString[1] = '\0';
    name[0] = minString[0]; name[1] = minString[1];
    strcat(name, "to");
    strcat(name, maxString);
    strcat(name, ".txt");
    strcat(name, "\0");
}
