#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifndef MAX_SIZE
#define MAX_SIZE 50
#endif

#ifndef WORD_SIZE
#define WORD_SIZE 9
#endif

typedef struct node {
    char word[WORD_SIZE];
    struct node *next;
} Node;

Node * listCreate();

Node * listAdd(Node *head, char string[MAX_SIZE]);

int listSearch(Node *head, char string[WORD_SIZE]);

void listWrite(FILE *out, Node *head);

void listFree(Node *head);
