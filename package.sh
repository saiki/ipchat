#!/usr/bin/env sh

adt -certificate -cn SelfSigned 1024-RSA ../ipchat.p12 $1
adt -package -storetype pkcs12 -keystore ../ipchat.p12 -storepass $1 ../ipchat.air ipchat.xml index.html js/index.js \
js/AIRAliases.js js/AIRIntrospector.js js/jquery-1.6.1.js js/comment.js js/login.js css/reset.css css/index.css
