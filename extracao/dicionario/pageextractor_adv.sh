#!/bin/bash

for i in {a..z}; do
    echo "Criando pasta $i..."
    mkdir $i
    cd $i
    echo "Extraindo adverbios que comecam com $i..."
    for (( j=1; j<=5; j++ )); do
        curl http://dicionario.aizeta.com/verbetes/adverbio/$i/$j --insecure -O -s -L
    done
    cd ..
done
