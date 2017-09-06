/*
 * Autor: Leandro A. F. de Magalhaes
 *        (leandroafm21@gmail.com)
 * Desc: Gera um arquivo de saida "out.txt" contendo todas as palavras de um
 *       arquivo de entrada <in1>.txt que estao contidas em outro arquivo de
 *       entrada <in2>.txt
 *
 * Utilizado na Iniciacao Cientifica "Aprimoramento do Metodo Diceware para
 * geracao de senhas seguras".
 */

#include "list.h"
#include <ctype.h>

int main(int argc, char *argv[]) {

    if (argc < 3) {
        printf("Uso: ./filter <in1> <in2>\n");
        printf("<in1> deve ser arquivo .txt\n");
        printf("<in2> deve ser arquivo .txt que sera comparado a <in1>\n");
        exit(EXIT_FAILURE);
    }

    FILE *in1 = fopen(argv[1], "r");
    FILE *in2 = fopen(argv[2], "r");
    Node *listOut = listCreate();
    Node *listOut2 = listCreate();
    Node *list2 = listCreate();
    char palavra[WORD_SIZE];

    while(fscanf(in2, "%s", palavra) != EOF) {
        for (int i = 0; palavra[i]; i++)
            palavra[i] = tolower(palavra[i]);
        list2 = listAdd(list2, palavra);
    }
    fclose(in2);

    while(fscanf(in1, "%s", palavra) != EOF) {
        if(listSearch(list2, palavra)) {
            listOut = listAdd(listOut, palavra);
        }
        else {
            listOut2 = listAdd(listOut2, palavra);
        }
    }
    fclose(in1);

    FILE *out = fopen("out.txt", "w");
    listWrite(out, listOut);
    fclose(out);
    
    FILE *out2 = fopen("error.txt", "w");
    listWrite(out2, listOut2);
    fclose(out2);

    return 0;
}
