#!/bin/bash
echo '['
for f in output/*
do
	cat $f
	echo ','
done 

echo ']'
