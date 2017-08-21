# Schema Information

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
name            | string    | not null, indexed, unique
email           | string    | not null, indexed, unique
password_digest | string    | not null
session_token   | string    | not null, indexed, unique


## friendships
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user1       | integer   | not null, foreign key (references users)
user2       | integer   | not null, foreign key again

## posts
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
author_id   | integer   | not null, foreign key (references users), indexed
title       | string    | can be null
body        | text      | not null


## comments
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
author_id   | integer   | not null, foreign key (references users), indexed
post_id     | string    | not null, foreign key again
body        | text      | not null
