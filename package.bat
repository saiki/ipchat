@echo off
call adt -certificate -cn SelfSigned 1024-RSA ../ipchat.p12 %1

call adt -package -storetype pkcs12 -keystore ../ipchat.p12 -storepass %1 ../ipchat.air ipchat.xml index.html js/index.js js/AIRAliases.js js/jquery-1.6.1.js css/reset.css css/index.css
