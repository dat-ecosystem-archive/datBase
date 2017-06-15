## API

##### ```GET /api/v1/:model```

Can pass query parameters like `?username='martha'` to filter results.

Additional options:

  * `limit`: 100 (default)
  * `offset`: 0 (default)

##### ```POST /api/v1/:model```

Success returns model with `id` field added.

##### ```PUT /api/v1/:model?id=```

`id` required

Success returns number of rows modified.
```
{updated: 1}
```

##### ```DELETE /api/v1/:model?id=```

`id` required

Success returns number of rows deleted.
```
{deleted: 1}
```

##### users model: ```/api/v1/users```

- `id` (required)
- `email` (required)
- `username`
- `description`
- `created_at`
- `updated_at`

##### dats model: ```/api/v1/dats```

- `id`
- `user_id`
- `name`
- `title`
- `hash`
- `description`
- `created_at`
- `updated_at`

#####  ```/api/v1/register```
#####  ```/api/v1/login```
