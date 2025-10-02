
#!/bin/bash

# @autor: Ruth FM
# @comment:
# @description: Script que valida si tenemos instalados: git, node, npm, curl
# Crear un script utilizando command -v que verifique si tengo instalado o no los paquetes git, node, npm, curl.
# Si alguno de dichos paquetes no esta en el sistema mostraremos mensaje de errores

echo "Verificar los requisitos previos"

if command -v node > /dev/null 2>&1;then
	NODE_VERSION=$(node --version)
	echo ":) Node instaladado correctamente: $NODE_VERSION"
else
	echo ":( No tienes instalado NodeJS"
	exit 1
fi



if command -v git > /dev/null 2>&1;then
        GIT_VERSION=$(git --version)
        echo ":) Git instaladado correctamente: $GIT_VERSION"
else
        echo ":( No tienes instalado Git"
        exit 1
fi



if command -v npm > /dev/null 2>&1;then
        NPM_VERSION=$(npm --version)
        echo ":) Npm instaladado correctamente: $NPM_VERSION"
else
        echo ":( No tienes instalado Npm"
        exit 1
fi



if command -v curl > /dev/null 2>&1;then
        CURL_VERSION=$(curl --version)
        echo ":) Curl instaladado correctamente"
else
        echo ":( No tienes instalado Curl"
        exit 1
fi

echo "Todos los paquetes instalados correctamente"

