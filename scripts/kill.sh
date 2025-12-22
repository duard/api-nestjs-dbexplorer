#!/bin/sh
# Mata todos os processos que estão usando a porta 3027 (API)
fuser -k 3027/tcp
