#!/bin/bash

for i in {a..z}; do
    echo "Criando pasta $i..."
    mkdir $i
    cd $i
    echo "Extraindo substantivos que comecam com $i..."
    for (( j=1; j<=50; j++ )); do
        curl http://dicionario.aizeta.com/verbetes/substantivo/$i/$j --insecure -O -s -L
    done
    cd ..
done
