/*
 * Autor: Leandro A. F. de Magalhaes
 *        (leandroafm21@gmail.com)
 * Desc: Gera um arquivo de saida "<out>.txt" contendo todas as palavras de um
 *       arquivo de entrada <in1>.txt tratadas, isto e, sem caracteres que nao
 *       representam letras.
 *
 * Utilizado na Iniciacao Cientifica "Aprimoramento do Metodo Diceware para
 * geracao de senhas seguras".
 */

#include "list.h"
#include <ctype.h>

/**
 * funcao: generateOutFile
 * desc: gera o arquivo de saida
 *
 * @param: in: ponteiro para arquivo de entrada
 *         out: ponteiro para arquivo de saida
 * @return: none
 */
void generateOutFile(FILE *in, FILE *out);

/**
 * funcao: removeTrash
 * desc: remove caracteres invalidos de umas tring
 *
 * @param: string: string a ter seus caracteres invalidos removidos
 * @return: none
 */
void removeTrash(char string[MAX_SIZE]);

/**
 * funcao: checkSize
 * desc: verifica se o tamanho da string ultrapassa o maximo permitido
 *
 * @param: string: string a ter tamanho verificado
 * @return: 0, se nao ultrapassar
 *          1, se ultrapassar
 */
int checkSize(char string[MAX_SIZE]);

int main(int argc, char *argv[]) {

    if (argc < 3) {
        printf("Uso: ./wordselector <in> <out>\n");
        printf("<in> e <out> devem ser arquivos .txt\n");
        exit(EXIT_FAILURE);
    }

    FILE *in = fopen(argv[1], "r");
    FILE *out = fopen(argv[2], "w");

    generateOutFile(in, out);

    fclose(in);
    fclose(out);

    return 0;
}

void generateOutFile(FILE *in, FILE *out) {
    Node *wordList = listCreate();
    char string[MAX_SIZE];

    while(fscanf(in, "%s", string) != EOF) {

        for (int i = 0; string[i]; i++)
            string[i] = tolower(string[i]);

        removeTrash(string);

        if (!checkSize(string)) {
            wordList = listAdd(wordList, string);
        }
    }

    listWrite(out, wordList);
    listFree(wordList);
}

void removeTrash(char string[MAX_SIZE]) {
    for (int i = 0; string[i]; i++) {
        if (string[i] == '.' || string[i] == ',' || string[i] == ':' ||
            string[i] == ';' || string[i] == '!' || string[i] == '?' ||
            string[i] == '#' || string[i] == '$' || string[i] == '%' ||
            string[i] == '&' || string[i] == '(' || string[i] == ')' ||
            string[i] == '*' || string[i] == '/' || string[i] == '\'' ||
            string[i] == '\"' || string[i] == '\n') {
            int j;
            for (j = i; string[j+1]; j++) {
                string[j] = string[j+1];
            }
            string[j] = '\0';
            i--;
        }
    }
}

int checkSize(char string[MAX_SIZE]) {
    if(strlen(string) <= WORD_SIZE)
        return 0;
    return 1;
}
