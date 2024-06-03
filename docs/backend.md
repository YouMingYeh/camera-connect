# Camera Connect Documentation - Backend

###### tags: `doc`

#### Author: @namwoam

## Supabase Introduction

We use Supabase as our backend solution. Supabase is a SaaS platform providing essential functionalities such as user authentication, database management, storage, and edge functions. Although Supabase is an open-source project, we utilize the hosted service provided by Supabase to save labor and simplify the process. 

To connect to Supabase, add your Supabase URL and credentials to the `/.env.local` file in the following format:

```
EXPO_PUBLIC_SUPABASE_URL=<your supabase url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your supabase key>
```

We use the Supabase JavaScript SDK for backend communication, instead of using HTTP methods directly.

## Authentication

Our application leverages Supabase's out-of-the-box authentication system. Users must provide an email address and password to sign up and log in to their accounts. Email verification is enabled by default to ensure web security.

## Database

Our database consists of the following custom tables with associated fields:

### Data Dictionary for Album

| Variable     | Key     | Description                           | Type      | Example                                    |
|--------------|---------|---------------------------------------|-----------|--------------------------------------------|
| id           | Primary | Unique identifier                     | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -       | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| description  | -       | Description of the album              | text      | My favorite album                          |
| cover_url    | -       | URL to the album cover                | text      | http://e.com/cover.jpg                     |
| album_name   | -       | Name of the album                     | text      | NTUIM                                      |

### Data Dictionary for User

| Variable     | Key     | Description                           | Type      | Example                                    |
|--------------|---------|---------------------------------------|-----------|--------------------------------------------|
| id           | Primary | Unique identifier                     | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -       | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| username     | -       | Username of the user                  | text      | johndoe                                    |
| avatar_url   | -       | URL to the user's avatar              | text      | http://e.com/avatar.jpg                    |
| email        | -       | Email of the user                     | text      | y@gmail.com                                |

### Data Dictionary for Media

| Variable     | Key     | Description                           | Type      | Example                                    |
|--------------|---------|---------------------------------------|-----------|--------------------------------------------|
| id           | Primary | Unique identifier                     | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| album_id     | Foreign | Reference to the album                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| uploader_id  | Foreign | Reference to the uploader             | uuid      | 123e4567-e89b-12d3-a456-426614174000       |
| created_at   | -       | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| title        | -       | Title of the media                    | text      | Summer Vacation                            |
| is_video     | -       | Indicates if the media is a video     | boolean   | true                                       |
| url          | -       | URL to the media                      | text      | http://e.com/media.mp4                     |
| hashtag      | -       | Hashtags associated with the media    | ARRAY     | {"vacation", "summer"}                     |
| heart        | -       | Number of heart reactions             | smallint  | 120                                        |
| thumb        | -       | Number of thumb reactions             | smallint  | 80                                         |
| sad          | -       | Number of sad reactions               | smallint  | 10                                         |
| smile        | -       | Number of smile reactions             | smallint  | 50                                         |
| angry        | -       | Number of angry reactions             | smallint  | 5                                          |

### Data Dictionary for Join_Album

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| user_id      | Primary Foreign| Reference to the user                 | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| album_id     | Primary Foreign| Reference to the album                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -              | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |

### Data Dictionary for React

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| user_id      | Primary Foreign| Reference to the user                 | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| media_id     | Primary Foreign| Reference to the media                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -              | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| heart        | -              | Indicates if heart reaction is given  | boolean   | true                                       |
| thumbs_up    | -              | Indicates if thumbs up reaction is given | boolean   | true                                    |
| sad          | -              | Indicates if sad reaction is given    | boolean   | false                                      |
| smile        | -              | Indicates if smile reaction is given  | boolean   | true                                       |
| angry        | -              | Indicates if angry reaction is given  | boolean   | false                                      |

### Data Dictionary for Friends_With

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| receiver_id  | Primary Foreign| Reference to the receiver             | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| sender_id    | Primary Foreign| Reference to the sender               | uuid      | 123e4567-e89b-12d3-a456-426614174000       |
| created_at   | -              | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |

### Data Dictionary for Notification

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| id           | Primary        | Unique identifier                     | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| receiver_id  | Foreign        | Reference to the receiver             | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| album_id     | Foreign        | Reference to the album                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -              | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| viewed       | -              | Indicates if the notification was viewed | boolean   | true                                    |
| type         | -              | Type of the notification              | text      | alert                                      |
| title        | -              | Title of the notification             | text      | New Message                                |
| content      | -              | Content of the notification           | text      | You have a new message.                    |

### Data Dictionary for Comment

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| id           | Primary        | Unique identifier                     | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| user_id      | Foreign        | Reference to the user                 | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| media_id     | Foreign        | Reference to the media                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -              | Timestamp when the record was created | timestamp | 2024-06-02 12:00:00+00                     |
| content      | -              | Content of the comment                | text      | This is a sample comment.                  |

### Data Dictionary for Tag_User

| Variable     | Key            | Description                           | Type      | Example                                    |
|--------------|----------------|---------------------------------------|-----------|--------------------------------------------|
| media_id     | Primary Foreign| Reference to the media                | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| user_id      | Primary Foreign| Reference to the user                 | uuid      | ce897635-9bc6-444d-a255-785736260481       |
| created_at   | -              | Timestamp when the record was

 created | timestamp | 2024-06-02 12:00:00+00                     |

## Storage Bucket

We separate our media files and avatar files into two different storage buckets. The associated CDN URLs are stored in the database for easy access from the frontend.