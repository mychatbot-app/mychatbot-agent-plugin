#!/bin/sh

log_file="${TMPDIR:-/tmp}/mychatbot-login.log"
: > "$log_file"
python3 -c 'import pty,sys; pty.spawn(sys.argv[1:])' \
  claude mcp login plugin:mychatbot:mychatbot > "$log_file" 2>&1 &
printf 'MyChatBot sign-in started. Follow progress in %s\n' "$log_file"
