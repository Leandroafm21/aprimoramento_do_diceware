#include "list.h"

Node * listCreate() {
    return NULL;
}

Node * listAdd(Node *head, char string[MAX_SIZE]) {
    Node *p;

    if (string[0] == '\0')
        return head;

    if (head == NULL) {
        head = malloc(sizeof(Node));
        strcpy(head->word, string);
        head->next = NULL;
        return head;
    }

    for (p = head; p->next != NULL; p = p->next) {
        if (strcmp(string, p->word) == 0)
            return head;
    }

    if (strcmp(string, p->word) == 0)
        return head;

    Node *temp = malloc(sizeof(Node));
    strcpy(temp->word, string);
    temp->next = p->next;
    p->next = temp;

    return head;
}

int listSearch(Node *head, char string[WORD_SIZE]) {
    for (Node *p = head; p->next; p = p->next)
        if(strcmp(p->word, string) == 0)
            return 1;
    return 0;
}

void listWrite(FILE *out, Node *head) {
    if (head == NULL) {
        return;
    }
    for (Node *p = head; p != NULL; p = p->next) {
        fprintf(out, "%s\n", p->word);
    }
}


void listFree(Node *head) {
    Node *p, *h;
    h = head;

    while (h != NULL) {
        p = h;
        h = h->next;
        free(p);
    }
}
