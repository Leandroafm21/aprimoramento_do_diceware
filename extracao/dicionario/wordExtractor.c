#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
    
    FILE *in = fopen(argv[1], "r");
    FILE *out = fopen(argv[2], "w");
    char c;
    int end = 0;
    char line[50000];
    int l = 1;
    
    while(fscanf(in, "%c", &c) != EOF && !end) {
        if (c == '\n') {
            l++;
        }
        if (l == 54) {
            fgets(line, 50000, in);
            end = 1;
        }
    }
    
    char palavra[50];
    char div[24];
    int i, j, k;
    for (i = 0; line[i+22] != '\n'; i++) {
        if (line[i] == '<') {
            for (k = 0; k <= 22; k++) {
                div[k] = line[i+k];
            }
            if (strcmp(div, "<div class=\"info-feat\">") == 0) {
                i += 29;
                for (j = 0; line[i] != '<'; j++, i++) {
                    palavra[j] = line[i];
                }
                palavra[j] = '\0';
                fprintf(out, "%s\n", palavra);
            }
        }
    }
    
    return 0;
}
