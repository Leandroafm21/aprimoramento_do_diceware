#!/bin/bash

for i in {a..z}; do
    cp wordExtractor $i
    
    cd $i
    echo "Extraindo substantivos com a letra $i..."
    for (( j=1; j<=50; j++ )); do
        arq="$i-$j.txt"
        ./substantiveExtractor $j $arq
        cp $arq /home/leandro/IC/new/wordSelector/extracao/substantivo/compilado
    done
    cd ..
done

cd compilado
echo "Juntando arquivos..."
for i in {a..z}; do
    arq="intermed$i.txt"
    cat $i-* > $arq
done

cat intermed* > final.txt
cd ..
