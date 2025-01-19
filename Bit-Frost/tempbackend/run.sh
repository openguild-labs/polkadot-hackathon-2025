
#!/bin/bash
export ETH_PRIV_KEY="0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" && export BTC_PRIV_KEY="KwTAyd4mvEvGf7ETrYW2UqMLXLzXNyTgZWFoJLtchPuRkH6jhXuf"


rm -rf orders.sqlite

# Start the watcher and redirect its output to a log file
npm run start-watcher > watcher-logs.txt 2>&1 &

sleep 1

# Start the server and keep its output in the terminal (orderbook)
npm run start-server > server-logs.txt 