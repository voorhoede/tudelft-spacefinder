#!/usr/bin/env bash

curl \
  --ntlm --user "$EWS_USER:$EWS_PASS" https://ews.tudelft.nl/EWS/Exchange.asmx \
  -H 'Content-Type: text/xml' \
  -d @rooms.xml
