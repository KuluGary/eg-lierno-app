@echo off
setlocal
:PROMPT

set /P COMMIT=Mensaje del commit: 

git add .
git commit -m "%COMMIT%"

set /P VERSION=Versión del paquete:
call npm version %VERSION%

git push --follow-tags
echo %VERSION%