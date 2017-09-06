#!/bin/bash

for i in {a..z}; do
    echo "Criando pasta $i..."
    mkdir $i
    cd $i
    echo "Extraindo adjetivos que comecam com $i..."
    for (( j=1; j<=25; j++ )); do
        curl http://dicionario.aizeta.com/verbetes/adjetivo/$i/$j --insecure -O -s -L
    done
    cd ..
done
