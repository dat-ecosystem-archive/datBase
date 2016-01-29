- API that separates front and and backend code
  - e.x. /users?id=blah
         /users?username=maxogden
         /metadats?q='this is my search query'

- Frontend
  - written with Ractive now
  - dont care what its written in


- TODOS
  - [ ] what's the database schema?
    - user
    - metadat [hash, name, user_id] ... peers, readme, stars, ...
  - [ ] publish a dat (API)
    - login as user
    - copy paste my dat link into a box and hit publish
    - API call to /metadats/publish
      - assume user is logged in
      - insert the hash into the database
      - user id <-> hash id ??
      - use dat-explorer to preview that (e.g., publicbits.org/shoshana/census)
  - [ ] cli (in dat package)
    - [x] dat link
    - dat login (e.g, http://publicbits.org)
    - dat publish <link> <name>
