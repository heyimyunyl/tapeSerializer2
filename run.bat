@shift /0
SetLocal EnableDelayedExpansion
$global:ProgressPreference = 'SilentlyContinue'

@echo off
SET version=1.2.0
TITLE tapeSerializer2
mode con: cols=100 lines=32
goto :startScreen


:startScreen
echo.
echo Welcome to tapeSerializer2 by Yunyl.
echo.
SET /p mapName="Please enter the codename of the song in the input folder: "
echo.
node main.js %mapName%
pause