#!/bin/bash

curl -X POST http:/localhost:3000/sketches?channel_id=1 \
  -H "Content-Type: application/json" \
  -d \
'{
  "user_id": 4342,
  "display_name": "heyy",
  "sketch": "oiuqwijelqkwje"
}'
